from fastapi import APIRouter
from app.db.incident_store import get_all_incidents

router = APIRouter()


@router.get("/incidents")
def fetch_incidents():
    incidents = get_all_incidents()
    # Return a compact view for the UI
    return [
        {
            "incident_id": inc.get("id"),
            "severity": inc.get("severity"),
            "state": inc.get("state"),
        }
        for inc in incidents
    ]
