
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


# Resolve the backend directory.
BASE_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):

    APP_NAME: str = "WorkSync API"

    APP_VERSION: str = "1.0.0"

    FRONTEND_URL: str = "http://localhost:5173"

    FRONTEND_URL_PRO: str = "http://localhost:4173/"

    DATABASE_URL: str

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
