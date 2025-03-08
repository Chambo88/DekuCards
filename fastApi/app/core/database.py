from sqlmodel import create_engine, Session
from sqlalchemy.pool import NullPool
from core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    echo=True,             
    poolclass=NullPool      # Disabled due to Supabase having its own pooling system
)

def get_session():
    with Session(engine) as session:
        yield session