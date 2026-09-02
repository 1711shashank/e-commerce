"""IST timezone helpers for e-commerce backend services."""

from __future__ import annotations

from datetime import datetime
from zoneinfo import ZoneInfo

APP_TIMEZONE = ZoneInfo("Asia/Kolkata")


def now() -> datetime:
    """Return the current time as an IST-aware datetime."""
    return datetime.now(tz=APP_TIMEZONE)


def to_local(dt: datetime) -> datetime:
    """Convert an aware datetime to IST."""
    if dt.tzinfo is None:
        raise ValueError("Naive datetimes are not supported")
    return dt.astimezone(APP_TIMEZONE)


def format_iso(dt: datetime) -> str:
    """Format a datetime as ISO 8601 in IST (+05:30)."""
    return to_local(dt).isoformat(timespec="seconds")
