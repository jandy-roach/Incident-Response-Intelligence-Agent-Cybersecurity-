from fastapi import APIRouter
from app.ai.mistral import ask_mistral
from app.models.incident import IncidentRequest

router = APIRouter()

@router.post("/chat")
def chat_incident(incident: IncidentRequest):

    system_message = """
    You are an Incident Response Intelligence Agent.

    Always respond in this exact format:

    QUESTIONS:
    - Ask 2–3 simple follow-up questions.

    SEVERITY:
    - Choose one: Low / Medium / High.

    REASON:
    - Explain the severity in one simple line based on the current information.
    - If information is missing, assume worst-case but say it is preliminary.

    Rules:
    - Do NOT give solutions.
    - Be clear and concise.
    """


    messages = [
        {"role": "system", "content": system_message},
        {"role": "user", "content": incident.message}
    ]

    reply = ask_mistral(messages)

    return {
        "response": reply
    }
