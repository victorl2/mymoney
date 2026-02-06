import strawberry
from strawberry.types import Info

from app.graphql.types.settings import (
    UserSettingsType,
    CurrencyType,
    LanguageType,
    UpdateSettingsInput,
)
from app.services.settings_service import (
    SettingsService,
    SUPPORTED_CURRENCIES,
    SUPPORTED_LANGUAGES,
)


def _to_settings_type(settings) -> UserSettingsType:
    return UserSettingsType(
        id=strawberry.ID(str(settings.id)),
        main_currency=settings.main_currency,
        language=settings.language,
        created_at=settings.created_at,
        updated_at=settings.updated_at,
    )


@strawberry.type
class SettingsQuery:
    @strawberry.field
    def settings(self, info: Info) -> UserSettingsType:
        db = info.context["db"]
        service = SettingsService(db)
        return _to_settings_type(service.get_settings())

    @strawberry.field
    def supported_currencies(self) -> list[CurrencyType]:
        return [
            CurrencyType(code=c["code"], name=c["name"], symbol=c["symbol"])
            for c in SUPPORTED_CURRENCIES
        ]

    @strawberry.field
    def supported_languages(self) -> list[LanguageType]:
        return [
            LanguageType(
                code=lang["code"], name=lang["name"], native_name=lang["nativeName"]
            )
            for lang in SUPPORTED_LANGUAGES
        ]


@strawberry.type
class SettingsMutation:
    @strawberry.mutation
    def update_settings(self, info: Info, input: UpdateSettingsInput) -> UserSettingsType:
        db = info.context["db"]
        service = SettingsService(db)
        settings = service.update_settings(
            main_currency=input.main_currency, language=input.language
        )
        return _to_settings_type(settings)
