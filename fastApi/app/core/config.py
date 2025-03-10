import os
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "DekuCards"
    DATABASE_PASSWORD: str
    ECHO_SQL: bool = False
    ALLOWED_ORIGINS: List[str]

    @property
    def DATABASE_URL(self) -> str:
        return (
            f"postgresql://postgres.epygdolkqugietwkwjjl:{self.DATABASE_PASSWORD}"
            "@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres"
        )

    model_config = {
        "env_file": str(
            BASE_DIR / (
                ".env.production" if os.getenv("ENVIRONMENT") == "production"
                else ".env.development"
            )
        )
    }


settings = Settings()