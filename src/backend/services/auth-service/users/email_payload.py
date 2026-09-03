from django.core import signing

SEND_PAYLOAD_SALT = "auth-email-job-send-payload"
SEND_PAYLOAD_MAX_AGE_SECONDS = 60 * 60 * 24


def dump_send_payload(data: dict) -> str:
    return signing.dumps(data, salt=SEND_PAYLOAD_SALT, compress=True)


def load_send_payload(payload: str) -> dict:
    return signing.loads(
        payload,
        salt=SEND_PAYLOAD_SALT,
        max_age=SEND_PAYLOAD_MAX_AGE_SECONDS,
    )
