from fastapi import FastAPI
from sqlmodel import SQLModel
from app.api import cardset
from app.core.config import settings
from app.core.database import engine
from contextlib import asynccontextmanager

# Create database tables on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)

app = FastAPI(lifespan=lifespan, title=settings.PROJECT_NAME)

app.include_router(cardset.router, prefix="/api")
