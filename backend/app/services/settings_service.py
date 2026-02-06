from datetime import datetime

from sqlalchemy.orm import Session

from app.models.settings import UserSettings


SUPPORTED_CURRENCIES = [
    {"code": "USD", "name": "US Dollar", "symbol": "$"},
    {"code": "EUR", "name": "Euro", "symbol": "€"},
    {"code": "GBP", "name": "British Pound", "symbol": "£"},
    {"code": "BRL", "name": "Brazilian Real", "symbol": "R$"},
    {"code": "JPY", "name": "Japanese Yen", "symbol": "¥"},
    {"code": "CNY", "name": "Chinese Yuan", "symbol": "¥"},
    {"code": "CAD", "name": "Canadian Dollar", "symbol": "$"},
    {"code": "AUD", "name": "Australian Dollar", "symbol": "$"},
    {"code": "CHF", "name": "Swiss Franc", "symbol": "CHF"},
    {"code": "INR", "name": "Indian Rupee", "symbol": "₹"},
]

SUPPORTED_LANGUAGES = [
    {"code": "en", "name": "English", "nativeName": "English"},
    {"code": "pt-BR", "name": "Portuguese (Brazil)", "nativeName": "Português (Brasil)"},
]


class SettingsService:
    def __init__(self, db: Session):
        self.db = db

    def get_settings(self) -> UserSettings:
        """Get or create singleton settings row."""
        settings = self.db.query(UserSettings).filter(UserSettings.id == 1).first()
        if not settings:
            settings = UserSettings(id=1, main_currency="USD", language="en")
            self.db.add(settings)
            self.db.commit()
            self.db.refresh(settings)
        return settings

    def update_settings(
        self, main_currency: str | None = None, language: str | None = None
    ) -> UserSettings:
        """Update settings."""
        settings = self.get_settings()

        if main_currency is not None:
            valid_codes = [c["code"] for c in SUPPORTED_CURRENCIES]
            if main_currency not in valid_codes:
                raise ValueError(f"Invalid currency code: {main_currency}")
            settings.main_currency = main_currency

        if language is not None:
            valid_langs = [lang["code"] for lang in SUPPORTED_LANGUAGES]
            if language not in valid_langs:
                raise ValueError(f"Invalid language code: {language}")
            settings.language = language

        settings.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(settings)
        return settings

    def get_default_currency(self) -> str:
        """Get the default currency from settings."""
        return self.get_settings().main_currency
