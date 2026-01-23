def generate_report(incident, audit_logs):
    return {
        "incident_id": incident["id"],
        "severity": incident.get("severity"),
        "timeline": audit_logs,
        "final_state": incident.get("state"),
    }
