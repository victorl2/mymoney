import strawberry
from strawberry.types import Info

from app.graphql.resolvers.expense import _to_category_type, _to_expense_type
from app.graphql.types.dashboard import (
    AllocationSlice,
    CategorySummary,
    DashboardSummary,
    MonthlyExpense,
)
from app.graphql.types.investment import AssetType
from app.services.dashboard_service import DashboardService


@strawberry.type
class DashboardQuery:
    @strawberry.field
    def dashboard(self, info: Info, month: str | None = None) -> DashboardSummary:
        db = info.context["db"]
        service = DashboardService(db)
        data = service.get_summary(month=month)

        return DashboardSummary(
            total_expenses_this_month=data["total_expenses_this_month"],
            total_expenses_last_month=data["total_expenses_last_month"],
            expense_change_percent=data["expense_change_percent"],
            total_portfolio_value=data["total_portfolio_value"],
            total_portfolio_cost=data["total_portfolio_cost"],
            net_worth=data["net_worth"],
            total_monthly_income=data["total_monthly_income"],
            income_streams_count=data["income_streams_count"],
            top_categories=[
                CategorySummary(
                    category=_to_category_type(c["category"]),
                    total_amount=c["total_amount"],
                    percentage=c["percentage"],
                    transaction_count=c["transaction_count"],
                )
                for c in data["top_categories"]
            ],
            recent_expenses=[_to_expense_type(e) for e in data["recent_expenses"]],
            portfolio_allocation=[
                AllocationSlice(
                    asset_type=AssetType(a["asset_type"]),
                    total_value=a["total_value"],
                    percentage=a["percentage"],
                )
                for a in data["portfolio_allocation"]
            ],
            monthly_expense_trend=[
                MonthlyExpense(month=m["month"], total_amount=m["total_amount"])
                for m in data["monthly_expense_trend"]
            ],
        )
