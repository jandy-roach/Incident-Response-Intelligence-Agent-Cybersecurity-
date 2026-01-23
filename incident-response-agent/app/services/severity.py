def calculate_severity(ai_severity: str, state: str) -> str:
    if state == "IDENTIFICATION":
        return "UNKNOWN"
    if state in ["ANALYSIS", "CONTAINMENT"]:
        return ai_severity or "UNKNOWN"
    if state == "RESOLVED":
        return "FINAL"
    return ai_severity or "UNKNOWN"
