from fastapi import FastAPI
from app.routes.chat import router as chat_router

app = FastAPI(title="Incident Response Intelligence Agent")

app.include_router(chat_router)
