import strawberry
from strawberry.types import Info

from app.graphql.types.income import IncomeType, IncomeConnection
from app.graphql.inputs.income import CreateIncomeInput, UpdateIncomeInput
from app.services.income_service import IncomeService
from app.services.settings_service import SettingsService


def _to_income_type(income) -> IncomeType:
    return IncomeType(
        id=strawberry.ID(str(income.id)),
        name=income.name,
        amount=income.amount,
        income_type=income.income_type,
        is_active=income.is_active,
        start_date=income.start_date,
        notes=income.notes,
        currency=income.currency,
        is_gross=income.is_gross,
        tax_rate=income.tax_rate,
        other_fees=income.other_fees,
        net_amount=income.net_amount,
        created_at=income.created_at,
        updated_at=income.updated_at,
    )


@strawberry.type
class IncomeQuery:
    @strawberry.field
    def incomes(
        self,
        info: Info,
        is_active: bool | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> IncomeConnection:
        db = info.context["db"]
        service = IncomeService(db)

        items, total_count, has_more = service.list_incomes(
            is_active=is_active,
            limit=limit,
            offset=offset,
        )

        return IncomeConnection(
            items=[_to_income_type(i) for i in items],
            total_count=total_count,
            has_more=has_more,
        )

    @strawberry.field
    def income(self, info: Info, id: strawberry.ID) -> IncomeType | None:
        db = info.context["db"]
        service = IncomeService(db)
        income = service.get_income(int(id))
        return _to_income_type(income) if income else None


@strawberry.type
class IncomeMutation:
    @strawberry.mutation
    def create_income(self, info: Info, input: CreateIncomeInput) -> IncomeType:
        db = info.context["db"]
        service = IncomeService(db)

        # Get default currency from settings if not provided
        currency = input.currency
        if currency is None:
            settings_service = SettingsService(db)
            currency = settings_service.get_default_currency()

        income = service.create_income(
            name=input.name,
            amount=input.amount,
            income_type=input.income_type.value,
            is_active=input.is_active,
            start_date=input.start_date,
            notes=input.notes,
            currency=currency,
            is_gross=input.is_gross,
            tax_rate=input.tax_rate,
            other_fees=input.other_fees,
        )
        return _to_income_type(income)

    @strawberry.mutation
    def update_income(
        self, info: Info, id: strawberry.ID, input: UpdateIncomeInput
    ) -> IncomeType:
        db = info.context["db"]
        service = IncomeService(db)

        kwargs = {}
        if input.name is not None:
            kwargs["name"] = input.name
        if input.amount is not None:
            kwargs["amount"] = input.amount
        if input.income_type is not None:
            kwargs["income_type"] = input.income_type.value
        if input.is_active is not None:
            kwargs["is_active"] = input.is_active
        if input.start_date is not None:
            kwargs["start_date"] = input.start_date
        if input.notes is not None:
            kwargs["notes"] = input.notes
        if input.currency is not None:
            kwargs["currency"] = input.currency
        if input.is_gross is not None:
            kwargs["is_gross"] = input.is_gross
        if input.tax_rate is not None:
            kwargs["tax_rate"] = input.tax_rate
        if input.other_fees is not None:
            kwargs["other_fees"] = input.other_fees

        income = service.update_income(int(id), **kwargs)
        if not income:
            raise ValueError(f"Income with id {id} not found")
        return _to_income_type(income)

    @strawberry.mutation
    def delete_income(self, info: Info, id: strawberry.ID) -> bool:
        db = info.context["db"]
        service = IncomeService(db)
        return service.delete_income(int(id))
