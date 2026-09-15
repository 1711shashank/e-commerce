import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get("CATALOG_SECRET_KEY", "dev-catalog-secret")
DEBUG = os.environ.get("CATALOG_DEBUG", "True").lower() in ("1", "true", "yes")
ALLOWED_HOSTS = [
    h.strip()
    for h in os.environ.get(
        "CATALOG_ALLOWED_HOSTS", "localhost,127.0.0.1"
    ).split(",")
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
    "django_filters",
    "products",
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

ROOT_URLCONF = "catalog_service.urls"

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

WSGI_APPLICATION = "catalog_service.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("CATALOG_DB_NAME", "catalog_db"),
        "USER": os.environ.get("CATALOG_DB_USER", "catalog_user"),
        "PASSWORD": os.environ.get("CATALOG_DB_PASSWORD", "catalog_password"),
        "HOST": os.environ.get("CATALOG_DB_HOST", "localhost"),
        "PORT": os.environ.get("CATALOG_DB_PORT", "5433"),
    }
}

AUTH_PASSWORD_VALIDATORS = []

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kolkata"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [BASE_DIR / "static"]

AWS_STORAGE_BUCKET_NAME = os.environ.get("AWS_STORAGE_BUCKET_NAME", "")
AWS_S3_REGION_NAME = os.environ.get("AWS_S3_REGION_NAME", "ap-south-1")
AWS_S3_CUSTOM_DOMAIN = os.environ.get("AWS_S3_CUSTOM_DOMAIN", "").strip()
AWS_S3_FILE_OVERWRITE = True
AWS_DEFAULT_ACL = None
AWS_QUERYSTRING_AUTH = False
AWS_S3_OBJECT_PARAMETERS = {"CacheControl": "max-age=86400"}
AWS_S3_ADDRESSING_STYLE = "virtual"

AWS_S3_ACCESS_KEY_ID = os.environ.get(
    "AWS_S3_ACCESS_KEY_ID", os.environ.get("AWS_ACCESS_KEY_ID", "")
).strip()
AWS_S3_SECRET_ACCESS_KEY = os.environ.get(
    "AWS_S3_SECRET_ACCESS_KEY", os.environ.get("AWS_SECRET_ACCESS_KEY", "")
).strip()

s3_options = {
    "bucket_name": AWS_STORAGE_BUCKET_NAME,
    "region_name": AWS_S3_REGION_NAME,
    "file_overwrite": True,
    "default_acl": None,
    "querystring_auth": False,
    "object_parameters": AWS_S3_OBJECT_PARAMETERS,
    "addressing_style": "virtual",
    "access_key": AWS_S3_ACCESS_KEY_ID,
    "secret_key": AWS_S3_SECRET_ACCESS_KEY,
}
if AWS_S3_CUSTOM_DOMAIN:
    s3_options["custom_domain"] = AWS_S3_CUSTOM_DOMAIN

STORAGES = {
    "default": {
        "BACKEND": "storages.backends.s3boto3.S3Boto3Storage",
        "OPTIONS": s3_options,
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedStaticFilesStorage",
    },
}
MEDIA_URL = (
    f"https://{AWS_S3_CUSTOM_DOMAIN}/"
    if AWS_S3_CUSTOM_DOMAIN
    else f"https://{AWS_STORAGE_BUCKET_NAME}.s3.{AWS_S3_REGION_NAME}.amazonaws.com/"
)
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "change-me-to-a-long-random-secret")
JWT_ALGORITHM = os.environ.get("JWT_ALGORITHM", "HS256")

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "products.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.AllowAny",
    ),
    "DEFAULT_FILTER_BACKENDS": (
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ),
    "DEFAULT_PAGINATION_CLASS": "products.pagination.StandardPagination",
    "PAGE_SIZE": 24,
}

# Jazzmin 3.0.1 — classic AdminLTE look (dark sidebar, white navbar)
JAZZMIN_SETTINGS = {
    "site_title": "Django administration",
    "site_header": "Django administration",
    "site_brand": "Django administration",
    "site_logo": "img/admin-logo.svg",
    "login_logo": "img/admin-logo.svg",
    "site_logo_classes": "img-circle",
    "site_icon": "img/admin-logo.svg",
    "welcome_sign": "Welcome — Aurelia catalog admin",
    "copyright": "Aurelia",
    "user_avatar": None,
    "search_model": ["products.Product", "products.Category"],
    "topmenu_links": [
        {"name": "Home", "url": "admin:index", "permissions": ["auth.view_user"]},
    ],
    "show_sidebar": True,
    "navigation_expanded": True,
    "hide_apps": [],
    "hide_models": [],
    "order_with_respect_to": ["products", "auth"],
    "icons": {
        "auth": "fas fa-users-cog",
        "auth.user": "fas fa-circle",
        "auth.Group": "fas fa-circle",
        "products.Product": "fas fa-circle",
        "products.Category": "fas fa-circle",
    },
    "default_icon_parents": "fas fa-circle",
    "default_icon_children": "fas fa-circle",
    "related_modal_active": False,
    "custom_css": None,
    "custom_js": None,
    "use_google_fonts_cdn": True,
    "show_ui_builder": False,
    "changeform_format": "horizontal_tabs",
    "changeform_format_overrides": {
        "auth.user": "collapsible",
        "auth.group": "vertical_tabs",
    },
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
