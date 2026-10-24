# backend/app/core/config.py
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict

from app.core.dburl import to_async_url, to_sync_url


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    env: str = "dev"
    # Paste Neon's connection string as-is (Dashboard → Connect). Any postgresql:// URL works.
    database_url: str = "postgresql://localhost:5432/hanz"
    # Tests run each case on its own event loop, so pooled connections can't be reused.
    db_null_pool: bool = False

    @property
    def async_database_url(self) -> str:
        """Same database through asyncpg, for the app."""
        return to_async_url(self.database_url)

    @property
    def sync_database_url(self) -> str:
        """Same database through psycopg, for Alembic."""
        return to_sync_url(self.database_url)


@lru_cache
def get_settings() -> Settings:
    return Settings()