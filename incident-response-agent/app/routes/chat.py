from fastapi import APIRouter
from app.ai.mistral import ask_mistral
from app.rag.rag_engine import retrieve_playbook
from app.db.mongo import log_incident
from app.models.incident import IncidentRequest
from app.db.incident_store import save_incident, get_incident, update_incident
from app.services.state_machine import can_transition, decide_next_state
from app.services.severity import calculate_severity
from app.db.audit_store import log_event

router = APIRouter()

@router.post("/chat")
def chat_incident(data: IncidentRequest):

    # Load or create incident
    incident = get_incident(data.incident_id)
    if not incident:
        # Create a new incident in IDENTIFICATION state
        incident = save_incident(
            messages=[],
            severity="UNKNOWN",
            status="Draft",
            incident_id=data.incident_id,
            state="IDENTIFICATION"
        )
        # Audit: incident created
        log_event(incident_id=incident.get("id"), actor="system", action="Incident created in IDENTIFICATION")

    # If incident already resolved, disallow further actions
    if incident.get("state") == "RESOLVED":
        return {"response": "This incident is already resolved. Start a new incident to continue."}

    # Tell the model the current state and provide rules
    system_message = f"""
You are an Incident Response Intelligence Agent.

CURRENT INCIDENT STATE: {incident.get('state')}

Rules:
- You MUST respect the current state.
- You MUST NOT skip steps.
- If state is IDENTIFICATION → ask questions only.
- If state is ANALYSIS → reason and assess severity.
- If state is CONTAINMENT → suggest containment actions.
- If state is RECOVERY → confirm resolution steps.
- If state is RESOLVED → stop.

IMPORTANT:
- You MUST respond in valid JSON with the following fields exactly:
  identification (string), reasoning (string), questions (array of strings),
  actions (array of strings), severity (string), resolved (boolean)
- Do NOT include any extra top-level keys.
- If you cannot answer a field, return an empty string or empty array, and set resolved to false.
"""

    messages = [{"role": "system", "content": system_message}]

    # Add full conversation history and audit the last user message
    for msg in data.messages:
        messages.append({
            "role": msg.role,
            "content": msg.content
        })

    # Audit: log the last user message (if any)
    last_user = None
    for msg in reversed(data.messages):
        if msg.role == "user":
            last_user = msg
            break
    if last_user:
        log_event(incident_id=incident.get("id"), actor="user", action=last_user.content)

    # RAG: retrieve relevant playbook
    playbook_context = retrieve_playbook(data.messages[-1].content)

    if playbook_context:
        messages.insert(1, {
            "role": "system",
            "content": f"""
You have access to the following security playbook information.
Use it to ground your reasoning and recommendations.

{playbook_context}
"""
        })

    reply = ask_mistral(messages)

    # Try to parse AI's JSON response into a structured model
    from app.models.ai_response import AIResponse
    import re

    parsed_ai = None
    parse_error = None

    try:
        parsed_ai = AIResponse.model_validate_json(reply)
    except Exception:
        # attempt to extract first JSON object from the reply
        m = re.search(r"(\{.*\})", reply, re.S)
        if m:
            try:
                parsed_ai = AIResponse.model_validate_json(m.group(1))
            except Exception as e:
                parse_error = str(e)
        else:
            parse_error = "No JSON found in AI reply"

    if parsed_ai is None:
        # If parsing failed, log and return the raw reply plus parse hint
        log_incident(
            conversation=data.messages + [{"role": "assistant", "content": reply}],
            severity=None
        )
        # Audit: AI responded but JSON parse failed
        log_event(incident_id=incident.get("id"), actor="ai", action=f"PARSE_ERROR: {parse_error}")
        return {"response": reply, "parse_error": parse_error}

    # Audit: log AI reasoning
    log_event(incident_id=incident.get("id"), actor="ai", action=parsed_ai.reasoning)

    # Use structured fields for decision making (resolved takes precedence)
    next_state = incident.get("state")
    if parsed_ai.resolved:
        next_state = "RESOLVED"
    else:
        # Fall back to heuristic if AI didn't mark resolved
        candidate = decide_next_state(incident.get("state"), reply)
        if candidate != incident.get("state") and can_transition(incident.get("state"), candidate):
            next_state = candidate

    if next_state != incident.get("state") and can_transition(incident.get("state"), next_state):
        # Compute severity according to lifecycle rules
        new_severity = calculate_severity(parsed_ai.severity, next_state)
        incident = update_incident(incident.get("id"), {"state": next_state, "severity": new_severity})
        # Audit: state transition
        log_event(incident_id=incident.get("id"), actor="system", action=f"State moved to {next_state}")

        # When incident resolves, add to vector DB for future similarity searches
        from app.services.vector_db import add_incident_texts
        if next_state == "RESOLVED":
            add_incident_texts(incident)
    # Save incident for audit to Mongo (if configured) including structured AI output
    log_incident(
        conversation=data.messages + [{"role": "assistant", "content": reply}],
        severity=parsed_ai.severity
    )

    # Also save to the in-memory incident store for demo/hackathon purposes
    save_incident(
        messages=messages,
        severity=parsed_ai.severity,
        status=incident.get("status"),
        incident_id=incident.get("id"),
        state=incident.get("state")
    )

    return {"response": parsed_ai.dict() }
