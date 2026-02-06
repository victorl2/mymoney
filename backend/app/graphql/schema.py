from decimal import Decimal

import strawberry
from strawberry.types import Info

from app.graphql.resolvers.expense import (
    CategoryMutation,
    CategoryQuery,
    ExpenseConnection,
    ExpenseMutation,
    ExpenseQuery,
)
from app.graphql.resolvers.investment import (
    InvestmentMutation,
    InvestmentQuery,
)
from app.graphql.resolvers.income import (
    IncomeConnection,
    IncomeMutation,
    IncomeQuery,
)
from app.graphql.resolvers.settings import (
    SettingsQuery,
    SettingsMutation,
)
from app.graphql.resolvers.exchange_rate import ExchangeRateQuery
from app.graphql.resolvers.dashboard import DashboardQuery
from app.graphql.types.dashboard import DashboardSummary
from app.graphql.types.category import CategoryType
from app.graphql.types.expense import ExpenseType, ExpenseSummaryType
from app.graphql.types.investment import AssetGQL
from app.graphql.types.portfolio import PortfolioType
from app.graphql.inputs.expense import (
    CreateExpenseInput,
    UpdateExpenseInput,
    ExpenseFilter,
    ExpenseSortField,
    SortDirection,
)
from app.graphql.inputs.investment import (
    CreateAssetInput,
    CreatePortfolioInput,
    UpdateAssetInput,
    UpdatePortfolioInput,
)
from app.graphql.inputs.income import CreateIncomeInput, UpdateIncomeInput
from app.graphql.types.income import IncomeType
from app.graphql.types.settings import UserSettingsType, CurrencyType, LanguageType, UpdateSettingsInput
from app.graphql.types.exchange_rate import ExchangeRatesResponse


@strawberry.type
class Query:
    @strawberry.field
    def health(self) -> str:
        return "ok"

    # ── Categories ──

    @strawberry.field
    def categories(self, info: Info) -> list[CategoryType]:
        return CategoryQuery().categories(info)

    @strawberry.field
    def category(self, info: Info, id: strawberry.ID) -> CategoryType | None:
        return CategoryQuery().category(info, id)

    # ── Expenses ──

    @strawberry.field
    def expenses(
        self,
        info: Info,
        filter: ExpenseFilter | None = None,
        sort_by: ExpenseSortField = ExpenseSortField.DATE,
        sort_direction: SortDirection = SortDirection.DESC,
        limit: int = 20,
        offset: int = 0,
    ) -> ExpenseConnection:
        return ExpenseQuery().expenses(info, filter, sort_by, sort_direction, limit, offset)

    @strawberry.field
    def expense(self, info: Info, id: strawberry.ID) -> ExpenseType | None:
        return ExpenseQuery().expense(info, id)

    @strawberry.field
    def expense_summary(
        self, info: Info, month: int | None = None, year: int | None = None
    ) -> ExpenseSummaryType:
        return ExpenseQuery().expense_summary(info, month, year)

    # ── Investments ──

    @strawberry.field
    def portfolios(self, info: Info) -> list[PortfolioType]:
        return InvestmentQuery().portfolios(info)

    @strawberry.field
    def portfolio(self, info: Info, id: strawberry.ID) -> PortfolioType | None:
        return InvestmentQuery().portfolio(info, id)

    @strawberry.field
    def asset(self, info: Info, id: strawberry.ID) -> AssetGQL | None:
        return InvestmentQuery().asset(info, id)

    # ── Income ──

    @strawberry.field
    def incomes(
        self,
        info: Info,
        is_active: bool | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> IncomeConnection:
        return IncomeQuery().incomes(info, is_active, limit, offset)

    @strawberry.field
    def income(self, info: Info, id: strawberry.ID) -> IncomeType | None:
        return IncomeQuery().income(info, id)

    # ── Settings ──

    @strawberry.field
    def settings(self, info: Info) -> UserSettingsType:
        return SettingsQuery().settings(info)

    @strawberry.field
    def supported_currencies(self) -> list[CurrencyType]:
        return SettingsQuery().supported_currencies()

    @strawberry.field
    def supported_languages(self) -> list[LanguageType]:
        return SettingsQuery().supported_languages()

    # ── Exchange Rates ──

    @strawberry.field
    async def exchange_rates(self, base: str = "USD") -> ExchangeRatesResponse:
        return await ExchangeRateQuery().exchange_rates(base)

    # ── Dashboard ──

    @strawberry.field
    def dashboard(self, info: Info, month: str | None = None) -> DashboardSummary:
        return DashboardQuery().dashboard(info, month)


@strawberry.type
class Mutation:
    # ── Categories ──

    @strawberry.mutation
    def create_category(
        self, info: Info, name: str, color: str | None = None, icon: str | None = None
    ) -> CategoryType:
        return CategoryMutation().create_category(info, name, color, icon)

    @strawberry.mutation
    def update_category(
        self,
        info: Info,
        id: strawberry.ID,
        name: str | None = None,
        color: str | None = None,
        icon: str | None = None,
    ) -> CategoryType:
        return CategoryMutation().update_category(info, id, name, color, icon)

    @strawberry.mutation
    def delete_category(self, info: Info, id: strawberry.ID) -> bool:
        return CategoryMutation().delete_category(info, id)

    # ── Expenses ──

    @strawberry.mutation
    def create_expense(self, info: Info, input: CreateExpenseInput) -> ExpenseType:
        return ExpenseMutation().create_expense(info, input)

    @strawberry.mutation
    def update_expense(
        self, info: Info, id: strawberry.ID, input: UpdateExpenseInput
    ) -> ExpenseType:
        return ExpenseMutation().update_expense(info, id, input)

    @strawberry.mutation
    def delete_expense(self, info: Info, id: strawberry.ID) -> bool:
        return ExpenseMutation().delete_expense(info, id)

    @strawberry.mutation
    def mark_expense_paid(self, info: Info, id: strawberry.ID, paid: bool) -> ExpenseType:
        return ExpenseMutation().mark_expense_paid(info, id, paid)

    # ── Portfolios ──

    @strawberry.mutation
    def create_portfolio(self, info: Info, input: CreatePortfolioInput) -> PortfolioType:
        return InvestmentMutation().create_portfolio(info, input)

    @strawberry.mutation
    def update_portfolio(
        self, info: Info, id: strawberry.ID, input: UpdatePortfolioInput
    ) -> PortfolioType:
        return InvestmentMutation().update_portfolio(info, id, input)

    @strawberry.mutation
    def delete_portfolio(self, info: Info, id: strawberry.ID) -> bool:
        return InvestmentMutation().delete_portfolio(info, id)

    # ── Assets ──

    @strawberry.mutation
    def create_asset(self, info: Info, input: CreateAssetInput) -> AssetGQL:
        return InvestmentMutation().create_asset(info, input)

    @strawberry.mutation
    def update_asset(self, info: Info, id: strawberry.ID, input: UpdateAssetInput) -> AssetGQL:
        return InvestmentMutation().update_asset(info, id, input)

    @strawberry.mutation
    def delete_asset(self, info: Info, id: strawberry.ID) -> bool:
        return InvestmentMutation().delete_asset(info, id)

    @strawberry.mutation
    def update_asset_price(self, info: Info, id: strawberry.ID, current_price: Decimal) -> AssetGQL:
        return InvestmentMutation().update_asset_price(info, id, current_price)

    # ── Income ──

    @strawberry.mutation
    def create_income(self, info: Info, input: CreateIncomeInput) -> IncomeType:
        return IncomeMutation().create_income(info, input)

    @strawberry.mutation
    def update_income(
        self, info: Info, id: strawberry.ID, input: UpdateIncomeInput
    ) -> IncomeType:
        return IncomeMutation().update_income(info, id, input)

    @strawberry.mutation
    def delete_income(self, info: Info, id: strawberry.ID) -> bool:
        return IncomeMutation().delete_income(info, id)

    # ── Settings ──

    @strawberry.mutation
    def update_settings(self, info: Info, input: UpdateSettingsInput) -> UserSettingsType:
        return SettingsMutation().update_settings(info, input)


schema = strawberry.Schema(query=Query, mutation=Mutation)
