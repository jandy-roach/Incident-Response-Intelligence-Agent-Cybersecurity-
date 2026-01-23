import json
import logging
from datetime import datetime
from pymongo import MongoClient, errors

# Use a small serverSelectionTimeoutMS so failed connections fail fast
client = MongoClient("mongodb://localhost:27017", serverSelectionTimeoutMS=2000)

db = client["incident_response_db"]
incidents_collection = db["incidents"]


def _write_fallback(incident):
    try:
        with open("app/db/incidents_fallback.log", "a", encoding="utf-8") as fh:
            fh.write(json.dumps(incident, default=str) + "\n")
    except Exception:
        logging.exception("Failed to write fallback incident log")


def log_incident(conversation, severity=None):
    incident = {
        "timestamp": datetime.utcnow(),
        "conversation": conversation,
        "severity": severity
    }
    try:
        incidents_collection.insert_one(incident)
    except errors.ServerSelectionTimeoutError:
        logging.exception("MongoDB not available, writing incident to fallback file")
        _write_fallback(incident)
    except Exception:
        logging.exception("Failed to log incident to MongoDB; writing to fallback file")
        _write_fallback(incident)
