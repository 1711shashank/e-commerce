"""Base schemas for inter-service domain events."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from pydantic import BaseModel, Field


def _utc_now() -> datetime:
    return datetime.now(tz=timezone.utc)


class BaseEvent(BaseModel):
    """Canonical envelope for async events on the event bus.

    Services publish subclasses or use this directly with a typed payload.
    """

    event_id: str = Field(default_factory=lambda: str(uuid4()))
    event_type: str
    payload: dict[str, Any] = Field(default_factory=dict)
    timestamp: datetime = Field(default_factory=_utc_now)
    source_service: str

    model_config = {"extra": "forbid"}

    def to_message(self) -> dict[str, Any]:
        """Serialize for Redis Streams / Celery / broker publish."""
        return self.model_dump(mode="json")

    @classmethod
    def from_message(cls, data: dict[str, Any]) -> BaseEvent:
        """Deserialize a broker message into a BaseEvent."""
        return cls.model_validate(data)
