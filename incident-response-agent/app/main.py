from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.chat import router as chat_router

app = FastAPI(title="Incident Response Intelligence Agent")

# ✅ Enable CORS for frontend (Vite / React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow frontend requests
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Include chat routes
app.include_router(chat_router)

# (Optional but helpful)
@app.get("/")
def root():
    return {"status": "Incident Response Intelligence Agent is running"}
