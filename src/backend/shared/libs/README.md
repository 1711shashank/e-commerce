# Shared library for e-commerce microservices

Install into each service's virtualenv:

```bash
pip install -e ../../shared/libs
# from repo root: pip install -e ./src/backend/shared/libs
```

## Contents

- `ecommerce_shared.jwt_utils` — `decode_token`, `validate_token`
- `ecommerce_shared.events` — `BaseEvent` (event_type, payload, timestamp, source_service)
