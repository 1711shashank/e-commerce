"""JWT helpers for validating tokens issued by the Auth Service."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

import jwt


class TokenValidationError(Exception):
    """Raised when a JWT cannot be validated."""


def decode_token(
    token: str,
    *,
    secret: str,
    algorithms: list[str] | None = None,
    audience: str | None = None,
    issuer: str | None = None,
) -> dict[str, Any]:
    """Decode and verify a JWT, returning its claims.

    Args:
        token: Encoded JWT string (without Bearer prefix).
        secret: Shared signing secret (or public key for RS256).
        algorithms: Allowed algorithms. Defaults to ["HS256"].
        audience: Optional expected audience claim.
        issuer: Optional expected issuer claim.

    Returns:
        Decoded claims dict.

    Raises:
        TokenValidationError: If the token is invalid, expired, or malformed.
    """
    algorithms = algorithms or ["HS256"]
    options: dict[str, Any] = {"require": ["exp", "iat"]}
    decode_kwargs: dict[str, Any] = {
        "algorithms": algorithms,
        "options": options,
    }
    if audience is not None:
        decode_kwargs["audience"] = audience
    if issuer is not None:
        decode_kwargs["issuer"] = issuer

    try:
        return jwt.decode(token, secret, **decode_kwargs)
    except jwt.ExpiredSignatureError as exc:
        raise TokenValidationError("Token has expired") from exc
    except jwt.InvalidTokenError as exc:
        raise TokenValidationError(f"Invalid token: {exc}") from exc


def validate_token(
    token: str,
    *,
    secret: str,
    algorithms: list[str] | None = None,
    required_roles: list[str] | None = None,
) -> dict[str, Any]:
    """Validate a JWT and optionally enforce role claims.

    Expects claims shaped like those issued by Auth Service:
    ``sub`` (user id), ``email``, ``role``, ``exp``, ``iat``.

    Returns the claims on success; raises TokenValidationError otherwise.
    """
    claims = decode_token(token, secret=secret, algorithms=algorithms)

    if required_roles:
        role = claims.get("role")
        if role not in required_roles:
            raise TokenValidationError(
                f"Role '{role}' not in required roles: {required_roles}"
            )

    exp = claims.get("exp")
    if exp is not None:
        exp_dt = datetime.fromtimestamp(exp, tz=timezone.utc)
        if exp_dt < datetime.now(tz=timezone.utc):
            raise TokenValidationError("Token has expired")

    return claims
