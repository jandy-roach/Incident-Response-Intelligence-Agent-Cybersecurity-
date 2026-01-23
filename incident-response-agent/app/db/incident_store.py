from datetime import datetime

# Simple in-memory incident store for hackathon / demo use
INCIDENTS = []


def save_incident(messages, severity="Unknown", status="Under Investigation", incident_id=None, state=None):
    # If incident_id provided and exists, update it
    if incident_id:
        existing = get_incident(incident_id)
        if existing:
            existing["messages"] = messages
            existing["severity"] = severity
            existing["status"] = status
            if state:
                existing["state"] = state
            return existing

    new_incident = {
        "id": incident_id or f"INC-{len(INCIDENTS) + 1:03d}",
        "messages": messages,
        "severity": severity,
        "status": status,
        "state": state or "IDENTIFICATION",
        "created_at": datetime.utcnow(),
    }
    INCIDENTS.append(new_incident)
    return new_incident


def get_all_incidents():
    return INCIDENTS


def get_incident(incident_id: str):
    for inc in INCIDENTS:
        if str(inc.get("id")) == str(incident_id) or str(inc.get("id")) == str(incident_id).upper():
            return inc
    return None


def update_incident(incident_id: str, updates: dict):
    inc = get_incident(incident_id)
    if not inc:
        return None
    inc.update(updates)
    return inc
