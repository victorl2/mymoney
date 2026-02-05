from __future__ import annotations

from decimal import Decimal

import strawberry

from app.graphql.types.category import CategoryType
from app.graphql.types.expense import ExpenseType
from app.graphql.types.investment import AssetType


@strawberry.type
class CategorySummary:
    category: CategoryType
    total_amount: Decimal
    percentage: Decimal
    transaction_count: int


@strawberry.type
class AllocationSlice:
    asset_type: AssetType
    total_value: Decimal
    percentage: Decimal


@strawberry.type
class MonthlyExpense:
    month: str
    total_amount: Decimal


@strawberry.type
class DashboardSummary:
    total_expenses_this_month: Decimal
    total_expenses_last_month: Decimal
    expense_change_percent: Decimal | None
    total_portfolio_value: Decimal
    total_portfolio_cost: Decimal
    net_worth: Decimal
    top_categories: list[CategorySummary]
    recent_expenses: list[ExpenseType]
    portfolio_allocation: list[AllocationSlice]
    monthly_expense_trend: list[MonthlyExpense]
