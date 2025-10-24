"""Application configuration."""
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    """Application settings."""

    # App
    PROJECT_NAME: str = "DealFlow"
    VERSION: str = "0.1.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # AI
    GEMINI_API_KEY: str
    GEMINI_MODEL: str = "gemini-2.0-flash-exp"

    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:5174,http://localhost:3000"

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

    @property
    def cors_origins_list(self) -> List[str]:
        """Get CORS origins as list."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]


settings = Settings()
