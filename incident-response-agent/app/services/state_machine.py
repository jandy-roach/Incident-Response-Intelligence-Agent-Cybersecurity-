# app/services/state_machine.py

VALID_TRANSITIONS = {
    "IDENTIFICATION": ["ANALYSIS"],
    "ANALYSIS": ["CONTAINMENT"],
    "CONTAINMENT": ["RECOVERY"],
    "RECOVERY": ["RESOLVED"],
}


def can_transition(current_state: str, next_state: str) -> bool:
    return next_state in VALID_TRANSITIONS.get(current_state, [])


# Basic heuristic to decide next state based on AI reply
def decide_next_state(current_state: str, ai_response: str) -> str:
    text = (ai_response or "").lower()

    # Resolution keywords
    if any(k in text for k in ["resolved", "issue is resolved", "closing the incident", "incident is resolved"]):
        return "RESOLVED"

    # Containment keywords
    if any(k in text for k in ["contain", "isolate", "quarantine", "block", "stop the traffic", "kill" ]):
        return "CONTAINMENT"

    # Recovery keywords
    if any(k in text for k in ["restore", "recovery", "reinstall", "rebuild", "recover"]):
        return "RECOVERY"

    # Analysis keywords
    if any(k in text for k in ["analysis", "assess", "severity", "likely", "probable", "suspected"]):
        return "ANALYSIS"

    # Default: do not change
    return current_state
