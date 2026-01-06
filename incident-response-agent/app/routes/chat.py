from fastapi import APIRouter
from app.ai.mistral import ask_mistral
from app.models.incident import IncidentRequest

router = APIRouter()

@router.post("/chat")
def chat_incident(incident: IncidentRequest):

    system_message = """
    You are a cybersecurity assistant.
    Your job is to:
    1. First ask 2–3 simple follow-up questions.
    2. Do NOT give solutions yet.
    3. Only ask questions clearly.
    """

    messages = [
        {"role": "system", "content": system_message},
        {"role": "user", "content": incident.message}
    ]

    reply = ask_mistral(messages)

    return {
        "response": reply
    }
