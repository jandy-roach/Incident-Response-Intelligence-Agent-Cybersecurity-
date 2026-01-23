# Very small in-memory vector DB placeholder using token overlap
VECTORS = []  # each item: { 'text': str, 'meta': dict }


def add_texts(texts):
    for t in texts:
        VECTORS.append({"text": t})


def similarity_search(query: str, k: int = 2):
    q_tokens = set(query.lower().split())
    scores = []
    for item in VECTORS:
        tokens = set(item["text"].lower().split())
        overlap = len(q_tokens & tokens)
        scores.append((overlap, item["text"]))
    scores.sort(reverse=True)
    results = [s for score, s in scores if score > 0]
    return results[:k]


def add_incident_texts(incident):
    summary = incident.get("summary") or ""
    resolution = incident.get("resolution") or ""
    if summary or resolution:
        add_texts([summary + " " + resolution])


def find_similar(summary, k=2):
    return similarity_search(summary, k)