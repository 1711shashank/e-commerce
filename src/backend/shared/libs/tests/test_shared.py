"""Tests for ecommerce_shared."""

from datetime import datetime, timedelta, timezone

import jwt
import pytest

from ecommerce_shared.events import BaseEvent
from ecommerce_shared.jwt_utils import TokenValidationError, decode_token, validate_token

SECRET = "test-secret-key-at-least-32-bytes!!"


def _make_token(**extra):
    payload = {
        "sub": "user-1",
        "email": "a@b.com",
        "role": "customer",
        "iat": datetime.now(tz=timezone.utc),
        "exp": datetime.now(tz=timezone.utc) + timedelta(minutes=15),
        **extra,
    }
    return jwt.encode(payload, SECRET, algorithm="HS256")


def test_decode_token_ok():
    token = _make_token()
    claims = decode_token(token, secret=SECRET)
    assert claims["sub"] == "user-1"
    assert claims["role"] == "customer"


def test_decode_token_expired():
    token = _make_token(exp=datetime.now(tz=timezone.utc) - timedelta(minutes=1))
    with pytest.raises(TokenValidationError, match="expired"):
        decode_token(token, secret=SECRET)


def test_validate_token_role_gate():
    token = _make_token()
    with pytest.raises(TokenValidationError, match="Role"):
        validate_token(token, secret=SECRET, required_roles=["admin"])


def test_base_event_roundtrip():
    event = BaseEvent(
        event_type="OrderPlaced",
        payload={"order_id": "ord_1"},
        source_service="order-service",
    )
    restored = BaseEvent.from_message(event.to_message())
    assert restored.event_type == "OrderPlaced"
    assert restored.payload["order_id"] == "ord_1"
    assert restored.source_service == "order-service"
    assert restored.event_id == event.event_id
