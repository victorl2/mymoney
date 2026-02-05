from pathlib import Path

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    db_path: str = str(Path(__file__).resolve().parent.parent / "mymoney.db")
    debug: bool = False
    cors_origins: list[str] = ["http://localhost:5173"]

    model_config = {"env_prefix": "MYMONEY_"}


settings = Settings()
