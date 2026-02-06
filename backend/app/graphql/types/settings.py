from __future__ import annotations

from datetime import datetime

import strawberry


@strawberry.type
class CurrencyType:
    code: str
    name: str
    symbol: str


@strawberry.type
class LanguageType:
    code: str
    name: str
    native_name: str


@strawberry.type
class UserSettingsType:
    id: strawberry.ID
    main_currency: str
    language: str
    created_at: datetime
    updated_at: datetime


@strawberry.input
class UpdateSettingsInput:
    main_currency: str | None = None
    language: str | None = None
