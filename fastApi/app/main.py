from fastapi import FastAPI
from sqlmodel import SQLModel
from api import cardset
from core.config import settings
from core.database import engine
from contextlib import asynccontextmanager
from core.middleware import setup_cors
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s"
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield

app = FastAPI(lifespan=lifespan, title=settings.PROJECT_NAME)

setup_cors(app)

app.include_router(cardset.router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        ssl_keyfile="../../certs/dev/key.pem",
        ssl_certfile="../../certs/dev/cert.pem"
    )
