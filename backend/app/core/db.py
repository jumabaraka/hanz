# backend/app/core/db.py
from collections.abc import AsyncIterator

from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import NullPool

from app.core.config import get_settings
from app.core.dburl import to_async_url


def make_engine(url: str | None = None, *, null_pool: bool | None = None) -> AsyncEngine:
    settings = get_settings()
    use_null_pool = settings.db_null_pool if null_pool is None else null_pool
    if use_null_pool:
        kwargs: dict = {"poolclass": NullPool}
    else:
        # Neon suspends idle compute after a few minutes and drops its connections,
        # so check connections before use and recycle them before that happens.
        kwargs = {"pool_pre_ping": True, "pool_recycle": 240, "pool_size": 5, "max_overflow": 5}
    return create_async_engine(to_async_url(url) if url else settings.async_database_url, **kwargs)


engine = make_engine()
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)


async def get_session() -> AsyncIterator[AsyncSession]:
    """FastAPI dependency: one session per request. Callers own the transaction."""
    async with SessionLocal() as session:
        yield session