import os
from datetime import timedelta
from pathlib import Path

from django.core.exceptions import ImproperlyConfigured

BASE_DIR = Path(__file__).resolve().parent.parent

DEBUG = os.environ.get("AUTH_DEBUG", "False").lower() in ("1", "true", "yes")
SECRET_KEY = os.environ.get("AUTH_SECRET_KEY", "").strip()
if not SECRET_KEY:
    if DEBUG:
        SECRET_KEY = "dev-auth-secret"
    else:
        raise ImproperlyConfigured("AUTH_SECRET_KEY must be set when AUTH_DEBUG is False.")
elif SECRET_KEY == "dev-auth-secret" and not DEBUG:
    raise ImproperlyConfigured(
        "AUTH_SECRET_KEY must not use the insecure development default when AUTH_DEBUG is False."
    )

ALLOWED_HOSTS = [
    h.strip()
    for h in os.environ.get("AUTH_ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")
    if h.strip()
]

INSTALLED_APPS = [
    "jazzmin",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework_simplejwt.token_blacklist",
    "users",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "auth_service.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "auth_service.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("AUTH_DB_NAME", "auth_db"),
        "USER": os.environ.get("AUTH_DB_USER", "auth_user"),
        "PASSWORD": os.environ.get("AUTH_DB_PASSWORD", "auth_password"),
        "HOST": os.environ.get("AUTH_DB_HOST", "localhost"),
        "PORT": os.environ.get("AUTH_DB_PORT", "5432"),
    }
}

AUTH_USER_MODEL = "users.User"

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kolkata"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [BASE_DIR / "static"]
STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedStaticFilesStorage",
    },
}
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", SECRET_KEY)
JWT_ALGORITHM = os.environ.get("JWT_ALGORITHM", "HS256")

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(
        minutes=int(os.environ.get("JWT_ACCESS_TOKEN_LIFETIME_MINUTES", "15"))
    ),
    "REFRESH_TOKEN_LIFETIME": timedelta(
        days=int(os.environ.get("JWT_REFRESH_TOKEN_LIFETIME_DAYS", "7"))
    ),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "ALGORITHM": JWT_ALGORITHM,
    "SIGNING_KEY": JWT_SECRET_KEY,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
}

def _requests_per_minute(env_name: str, default: int) -> str:
    """Env value is max requests per minute (integer). Empty falls back to default."""
    raw = os.environ.get(env_name, "").strip()
    if not raw:
        return f"{default}/minute"
    return f"{int(raw)}/minute"


REDIS_URL = os.environ.get("REDIS_URL", "redis://localhost:6379/0")

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": REDIS_URL,
    }
}

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "users.authentication.VersionedJWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
    "DEFAULT_THROTTLE_RATES": {
        "login": _requests_per_minute("AUTH_LOGIN_RATE_PER_MINUTE", 10),
        "register": _requests_per_minute("AUTH_REGISTER_RATE_PER_MINUTE", 5),
        "password_reset_request": _requests_per_minute(
            "PASSWORD_RESET_REQUEST_RATE_PER_MINUTE", 5
        ),
        "password_reset_confirm": _requests_per_minute(
            "PASSWORD_RESET_CONFIRM_RATE_PER_MINUTE", 20
        ),
        "email_verification_verify": _requests_per_minute(
            "EMAIL_VERIFICATION_VERIFY_RATE_PER_MINUTE", 20
        ),
        "email_verification_resend": _requests_per_minute(
            "EMAIL_VERIFICATION_RESEND_RATE_PER_MINUTE", 5
        ),
        "token_refresh": _requests_per_minute("AUTH_TOKEN_REFRESH_RATE_PER_MINUTE", 30),
    },
}

CELERY_BROKER_URL = REDIS_URL
CELERY_RESULT_BACKEND = REDIS_URL
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TASK_TRACK_STARTED = True
CELERY_TASK_TIME_LIMIT = 30 * 60
CELERY_TASK_ACKS_LATE = True
CELERY_WORKER_PREFETCH_MULTIPLIER = 1
CELERY_TIMEZONE = TIME_ZONE


def _resolve_email_backend() -> str:
    backend = os.environ.get(
        "AUTH_EMAIL_BACKEND",
        "django.core.mail.backends.console.EmailBackend",
    )
    if "SESBackend" not in backend:
        return backend

    access_key = os.environ.get("AWS_ACCESS_KEY_ID", "").strip()
    secret_key = os.environ.get("AWS_SECRET_ACCESS_KEY", "").strip()
    if DEBUG and not access_key and not secret_key:
        return "django.core.mail.backends.console.EmailBackend"

    return "django_ses.SESBackend"


EMAIL_BACKEND = _resolve_email_backend()
EMAIL_HOST = os.environ.get("AUTH_EMAIL_HOST", "")
EMAIL_PORT = int(os.environ.get("AUTH_EMAIL_PORT", "587"))
EMAIL_USE_TLS = os.environ.get("AUTH_EMAIL_USE_TLS", "True").lower() in (
    "1",
    "true",
    "yes",
)
EMAIL_HOST_USER = os.environ.get("AUTH_EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = os.environ.get("AUTH_EMAIL_HOST_PASSWORD", "")
DEFAULT_FROM_EMAIL = os.environ.get("AUTH_DEFAULT_FROM_EMAIL", "noreply@aurelia.example")
SERVER_EMAIL = DEFAULT_FROM_EMAIL

AWS_SES_REGION_NAME = os.environ.get("AWS_SES_REGION_NAME", "ap-south-1")
AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID", "")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY", "")
AWS_SES_CONFIGURATION_SET = os.environ.get("AWS_SES_CONFIGURATION_SET", "")
AUTH_PASSWORD_RESET_URL = os.environ.get(
    "AUTH_PASSWORD_RESET_URL",
    "http://localhost:3000/reset-password",
)
AUTH_PASSWORD_RESET_TOKEN_LIFETIME_MINUTES = int(
    os.environ.get("AUTH_PASSWORD_RESET_TOKEN_LIFETIME_MINUTES", "30")
)
AUTH_EMAIL_VERIFICATION_OTP_LIFETIME_MINUTES = int(
    os.environ.get("AUTH_EMAIL_VERIFICATION_OTP_LIFETIME_MINUTES", "10")
)
AUTH_EMAIL_VERIFICATION_OTP_LENGTH = int(
    os.environ.get("AUTH_EMAIL_VERIFICATION_OTP_LENGTH", "6")
)

if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    # Keep False by default: gunicorn usually sees plain HTTP behind TLS-terminating nginx.
    SECURE_SSL_REDIRECT = os.environ.get("AUTH_SECURE_SSL_REDIRECT", "False").lower() in (
        "1",
        "true",
        "yes",
    )
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = int(os.environ.get("AUTH_SECURE_HSTS_SECONDS", "31536000"))
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_REFERRER_POLICY = "same-origin"
    if AUTH_PASSWORD_RESET_URL.startswith("http://"):
        raise ImproperlyConfigured(
            "AUTH_PASSWORD_RESET_URL must use https when AUTH_DEBUG is False."
        )

# Jazzmin 3.0.1 — classic AdminLTE look (dark sidebar, white navbar)
JAZZMIN_SETTINGS = {
    "site_title": "Django administration",
    "site_header": "Django administration",
    "site_brand": "Django administration",
    "site_logo": "img/admin-logo.svg",
    "login_logo": "img/admin-logo.svg",
    "site_logo_classes": "img-circle",
    "site_icon": "img/admin-logo.svg",
    "welcome_sign": "Welcome — Aurelia auth admin",
    "copyright": "Aurelia",
    "user_avatar": None,
    "search_model": ["users.User"],
    "topmenu_links": [
        {"name": "Home", "url": "admin:index", "permissions": ["auth.view_user"]},
    ],
    "show_sidebar": True,
    "navigation_expanded": True,
    "icons": {
        "users.User": "fas fa-circle",
        "auth.Group": "fas fa-circle",
    },
    "default_icon_parents": "fas fa-circle",
    "default_icon_children": "fas fa-circle",
    "related_modal_active": False,
    "use_google_fonts_cdn": True,
    "show_ui_builder": False,
    "changeform_format": "horizontal_tabs",
}

JAZZMIN_UI_TWEAKS = {
    "navbar_small_text": False,
    "footer_small_text": False,
    "body_small_text": False,
    "brand_small_text": False,
    "brand_colour": False,
    "accent": "accent-primary",
    "navbar": "navbar-white navbar-light",
    "no_navbar_border": False,
    "navbar_fixed": False,
    "layout_boxed": False,
    "footer_fixed": False,
    "sidebar_fixed": True,
    "sidebar": "sidebar-dark-primary",
    "sidebar_nav_small_text": False,
    "sidebar_disable_expand": False,
    "sidebar_nav_child_indent": False,
    "sidebar_nav_compact_style": False,
    "sidebar_nav_legacy_style": False,
    "sidebar_nav_flat_style": False,
    "theme": "default",
    "dark_mode_theme": None,
    "button_classes": {
        "primary": "btn-outline-primary",
        "secondary": "btn-outline-secondary",
        "info": "btn-info",
        "warning": "btn-warning",
        "danger": "btn-danger",
        "success": "btn-success",
    },
    "actions_sticky_top": False,
}
