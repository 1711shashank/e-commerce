from django.db import transaction

from .models import Address


def validate_mobile(value: str) -> str:
    value = value.strip()
    digits = "".join(ch for ch in value if ch.isdigit())
    if len(digits) < 10 or len(digits) > 15:
        raise ValueError("Enter a valid mobile number (10–15 digits).")
    return value


@transaction.atomic
def set_default_address(user, address: Address) -> None:
    user.addresses.exclude(pk=address.pk).update(is_default=False)
    if not address.is_default:
        address.is_default = True
        address.save(update_fields=["is_default", "updated_at"])


@transaction.atomic
def promote_next_default(user, exclude_pk=None) -> None:
    qs = user.addresses.order_by("-updated_at")
    if exclude_pk is not None:
        qs = qs.exclude(pk=exclude_pk)
    next_address = qs.first()
    if next_address:
        set_default_address(user, next_address)
