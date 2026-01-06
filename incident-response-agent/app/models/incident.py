from pydantic import BaseModel

class IncidentRequest(BaseModel):
    message: str
