from fastapi import APIRouter
from fastapi.responses import FileResponse, JSONResponse
from app.db.incident_store import get_all_incidents, get_incident
from app.utils.report_generator import generate_incident_report
from app.db.audit_store import get_audit_logs
from app.services.report import generate_report as generate_report_json

router = APIRouter()


@router.get("/incidents/{incident_id}/report")
def generate_report(incident_id: str):
    incidents = get_all_incidents()

    incident = get_incident(incident_id)

    if not incident:
        return {"error": "Incident not found"}

    pdf_path = generate_incident_report(incident)
    return FileResponse(pdf_path, media_type="application/pdf", filename=pdf_path)


@router.get("/incidents/{incident_id}/report/json")
def generate_report_json(incident_id: str):
    incident = get_incident(incident_id)
    if not incident:
        return JSONResponse(status_code=404, content={"error": "Incident not found"})

    audits = get_audit_logs(incident_id)
    report = generate_report_json(incident, audits)
    return JSONResponse(content=report)

