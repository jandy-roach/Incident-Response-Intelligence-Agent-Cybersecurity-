from pydantic import BaseModel
from typing import List


class AIResponse(BaseModel):
    identification: str
    reasoning: str
    questions: List[str]
    actions: List[str]
    severity: str
    resolved: bool
