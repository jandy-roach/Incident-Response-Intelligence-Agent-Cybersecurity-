from pydantic import BaseModel
from typing import List

class Message(BaseModel):
    role: str   # "user" or "assistant"
    content: str

class IncidentRequest(BaseModel):
    incident_id: str
    messages: List[Message]
