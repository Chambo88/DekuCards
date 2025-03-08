from fastapi import FastAPI
from sqlmodel import SQLModel
from api import cardset
from core.config import settings
from core.database import engine
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield

app = FastAPI(lifespan=lifespan, title=settings.PROJECT_NAME)

app.include_router(cardset.router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app", host="0.0.0.0", port=8000, reload=True)
