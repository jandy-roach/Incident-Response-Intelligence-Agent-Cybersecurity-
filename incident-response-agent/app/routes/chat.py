from fastapi import APIRouter
from app.ai.mistral import ask_mistral
from app.models.incident import IncidentRequest

router = APIRouter()

@router.post("/chat")
def chat_incident(data: IncidentRequest):

    system_message = """
You are an Incident Response Intelligence Agent.

How you should behave:
- First, ask investigation questions to understand the issue.
- Use the user's answers to assess severity and recommend actions.
- After recommending actions, ALWAYS ask the user if the issue is resolved.
- If the user says the issue is resolved, give a short summary and stop.
- If the issue is NOT resolved, continue helping with further guidance.
- Do NOT assume the issue is fixed unless the user confirms it.
- Use advisory language only.
"""

    messages = [{"role": "system", "content": system_message}]

    # Add full conversation history
    for msg in data.messages:
        messages.append({
            "role": msg.role,
            "content": msg.content
        })

    reply = ask_mistral(messages)

    return {"response": reply}
