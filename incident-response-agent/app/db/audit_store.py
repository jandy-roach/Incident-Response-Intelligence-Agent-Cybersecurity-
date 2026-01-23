from datetime import datetime
from app.models.audit import AuditLog

AUDIT_LOGS = []


def log_event(incident_id: str, actor: str, action: str, timestamp: str = None):
    ts = timestamp or datetime.utcnow().isoformat()
    entry = AuditLog(
        incident_id=str(incident_id),
        actor=actor,
        action=action,
        timestamp=ts,
    )
    AUDIT_LOGS.append(entry.dict())
    return entry.dict()


def get_audit_logs(incident_id: str = None):
    if incident_id is None:
        return AUDIT_LOGS
    return [a for a in AUDIT_LOGS if a["incident_id"] == str(incident_id)]
