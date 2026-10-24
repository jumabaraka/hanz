# backend/app/core/dburl.py
"""Turn whatever Postgres URL you paste (e.g. Neon's) into the forms our two drivers need.

Neon gives:  postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require&channel_binding=require

- The app uses asyncpg, which takes `ssl=` instead of `sslmode=` and has no `channel_binding` option.
- Alembic uses psycopg (libpq), which takes `sslmode=` and `channel_binding=` as given.
- Neon's pooled host ("-pooler") runs PgBouncer in transaction mode, which breaks asyncpg's prepared
  statements and session-level locking, so we always connect to the direct host instead.
"""
from sqlalchemy.engine import URL, make_url

ASYNC_DRIVER = "postgresql+asyncpg"
SYNC_DRIVER = "postgresql+psycopg"


def _direct_host(url: URL) -> URL:
    if url.host and "-pooler." in url.host:
        return url.set(host=url.host.replace("-pooler.", ".", 1))
    return url


def to_async_url(raw: str) -> str:
    url = _direct_host(make_url(raw)).set(drivername=ASYNC_DRIVER)
    query = dict(url.query)
    sslmode = query.pop("sslmode", None)
    query.pop("channel_binding", None)
    if sslmode and "ssl" not in query:
        query["ssl"] = sslmode
    return url.set(query=query).render_as_string(hide_password=False)


def to_sync_url(raw: str) -> str:
    url = _direct_host(make_url(raw)).set(drivername=SYNC_DRIVER)
    query = dict(url.query)
    ssl = query.pop("ssl", None)
    if ssl and "sslmode" not in query:
        query["sslmode"] = ssl
    return url.set(query=query).render_as_string(hide_password=False)