from pydantic import BaseModel


class AuditLog(BaseModel):
    incident_id: str
    actor: str  # user | ai | system
    action: str
    timestamp: str
