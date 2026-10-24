# backend/tests/test_dburl.py
from sqlalchemy.engine import make_url

from app.core.dburl import to_async_url, to_sync_url

NEON_POOLED = (
    "postgresql://hanz_owner:s3cr%40t@ep-cool-river-a1b2c3-pooler.eu-central-1.aws.neon.tech/hanz"
    "?sslmode=require&channel_binding=require"
)


def test_neon_url_for_asyncpg():
    url = make_url(to_async_url(NEON_POOLED))
    assert url.drivername == "postgresql+asyncpg"
    assert url.host == "ep-cool-river-a1b2c3.eu-central-1.aws.neon.tech"  # direct host, not the pooler
    assert url.password == "s3cr@t"
    assert url.database == "hanz"
    assert dict(url.query) == {"ssl": "require"}


def test_neon_url_for_psycopg():
    url = make_url(to_sync_url(NEON_POOLED))
    assert url.drivername == "postgresql+psycopg"
    assert url.host == "ep-cool-river-a1b2c3.eu-central-1.aws.neon.tech"
    assert dict(url.query) == {"sslmode": "require", "channel_binding": "require"}


def test_local_url_without_ssl_passes_through():
    assert to_async_url("postgresql://hanz:hanz@localhost:5432/hanz") == "postgresql+asyncpg://hanz:hanz@localhost:5432/hanz"
    assert to_sync_url("postgresql+asyncpg://hanz:hanz@localhost:5432/hanz") == "postgresql+psycopg://hanz:hanz@localhost:5432/hanz"