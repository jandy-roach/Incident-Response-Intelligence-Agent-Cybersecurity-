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
    - Explain the severity in one simple line.

    RECOMMENDED ACTIONS:
    - List 3–5 safe, high-level steps the team should take.
    - Do NOT perform actions.
    - Do NOT give technical commands.
    - Focus on guidance and safety.
"""



    messages = [
        {"role": "system", "content": system_message},
        {"role": "user", "content": incident.message}
    ]

    reply = ask_mistral(messages)

    return {
        "response": reply
    }
