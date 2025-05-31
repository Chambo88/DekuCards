from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from sqlmodel import SQLModel
from api import cardApi
from api import treeApi
from api import dekuNodeApi
from api import dekuSetApi
from core.config import settings
from core.database import engine
from contextlib import asynccontextmanager
from core.middleware import setup_cors
import logging

# TODO Disable for prod, handle proper log leveling from .env
logging.basicConfig(level=logging.DEBUG)
uvicorn_logger = logging.getLogger("uvicorn")
uvicorn_logger.setLevel(logging.DEBUG)

@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield

app = FastAPI(lifespan=lifespan, title=settings.PROJECT_NAME)

setup_cors(app)

app.include_router(cardApi.router, prefix="/api")
app.include_router(treeApi.router, prefix="/api")
app.include_router(dekuNodeApi.router, prefix="/api")
app.include_router(dekuSetApi.router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=False,
        ssl_keyfile="../../certs/dev/localhost-key.pem",
        ssl_certfile="../../certs/dev/localhost.pem"
    )
