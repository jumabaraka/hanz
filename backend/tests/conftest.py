# backend/tests/conftest.py
"""Tests run against a real Postgres: the ledger rules live in the database too.

Uses TEST_DATABASE_URL from the environment or backend/.env (your Neon hanz_test database).
The schemas are dropped and migrated fresh once per test run, so the database name must
contain "test": the suite refuses to run against anything else.
"""
import os
from pathlib import Path

from sqlalchemy.engine import make_url


def _from_dotenv(key: str) -> str | None:
    env_file = Path(__file__).resolve().parents[1] / ".env"
    if not env_file.exists():
        return None
    for line in env_file.read_text().splitlines():
        name, sep, value = line.partition("=")
        if sep and name.strip() == key:
            return value.strip().strip('"').strip("'")
    return None


TEST_DATABASE_URL = os.environ.get("TEST_DATABASE_URL") or _from_dotenv("TEST_DATABASE_URL")
if not TEST_DATABASE_URL:
    raise SystemExit("Set TEST_DATABASE_URL in backend/.env (a separate Neon database such as hanz_test).")
if "test" not in (make_url(TEST_DATABASE_URL).database or ""):
    raise SystemExit("TEST_DATABASE_URL must point at a database whose name contains 'test'; the tests drop schemas.")

# Must be set before anything imports app.core.config / app.core.db.
os.environ["DATABASE_URL"] = TEST_DATABASE_URL
os.environ["DB_NULL_POOL"] = "true"

import pytest  # noqa: E402
from alembic import command  # noqa: E402
from alembic.config import Config  # noqa: E402
from sqlalchemy import create_engine, text  # noqa: E402
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker  # noqa: E402

from app.core.config import get_settings  # noqa: E402
from app.core.db import make_engine  # noqa: E402

BACKEND_DIR = Path(__file__).resolve().parents[1]


def migrate_fresh() -> None:
    get_settings.cache_clear()
    sync_url = get_settings().sync_database_url
    engine = create_engine(sync_url)
    with engine.begin() as conn:
        for schema in ("ivie", "jobs", "hanz"):
            conn.execute(text(f'DROP SCHEMA IF EXISTS "{schema}" CASCADE'))
        conn.execute(text("DROP TABLE IF EXISTS public.alembic_version"))
    engine.dispose()

    cwd = os.getcwd()
    os.chdir(BACKEND_DIR)  # alembic.ini paths are relative to backend/
    try:
        for stream in ("core", "ivie"):
            command.upgrade(Config(str(BACKEND_DIR / "alembic.ini"), ini_section=stream), "head")
    finally:
        os.chdir(cwd)


@pytest.fixture(scope="session", autouse=True)
def _database() -> None:
    migrate_fresh()


@pytest.fixture
async def engine():
    eng = make_engine(TEST_DATABASE_URL, null_pool=True)
    yield eng
    await eng.dispose()


@pytest.fixture
async def session(engine) -> AsyncSession:
    async with async_sessionmaker(engine, expire_on_commit=False)() as s:
        yield s