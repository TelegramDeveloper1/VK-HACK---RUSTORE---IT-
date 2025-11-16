from os.path import join, dirname
from pathlib import Path
from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

from fastapi import FastAPI
from typing import AsyncGenerator   

ROOT_DIR = Path(__file__).parent.parent

class Config(BaseSettings):
    API_KEY: SecretStr

    WEBAPP_URL: str = "http://localhost:3000" #  https://frontend_url
    WEBHOOK_URL: str = "http://localhost:8000" # https://backend_url

    APP_HOST: str = "localhost"
    APP_PORT: int = 8000 #8080

    # user: SecretStr
    # password: SecretStr
    # db_name: str
    # host: str = "localhost"
    # port: int = 5432

    # DATABASE_URL: str = f"postgresql+asyncpg://{user}:{password}@{host}:{port}/{db_name}"

    model_config = SettingsConfigDict(
        env_file=ROOT_DIR / "server" / ".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

config = Config()