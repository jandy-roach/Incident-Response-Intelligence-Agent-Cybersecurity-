from pydantic import BaseModel
from typing import List, Dict
from datetime import datetime


class IncidentLog(BaseModel):
    messages: List[Dict]
    severity: str
    status: str
    created_at: datetime
