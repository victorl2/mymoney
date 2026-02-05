from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import func, extract
from sqlalchemy.orm import Session, joinedload

from app.models.asset import Asset
from app.models.category import Category
from app.models.expense import Expense
from app.models.portfolio import Portfolio
from app.services.investment_service import InvestmentService
from app.services.income_service import IncomeService


class DashboardService:
    def __init__(self, db: Session):
        self.db = db

    def get_summary(self, month: str | None = None) -> dict:
        if month:
            year, mon = map(int, month.split("-"))
        else:
            today = date.today()
            year, mon = today.year, today.month

        # Calculate previous month
        if mon == 1:
            prev_year, prev_mon = year - 1, 12
        else:
            prev_year, prev_mon = year, mon - 1

        total_this_month = self._total_expenses_for_month(year, mon)
        total_last_month = self._total_expenses_for_month(prev_year, prev_mon)

        expense_change_percent = None
        if total_last_month > 0:
            expense_change_percent = (
                (total_this_month - total_last_month) / total_last_month * 100
            )

        # Portfolio totals
        portfolio_value, portfolio_cost = self._portfolio_totals()

        # Net worth = portfolio value - total expenses (lifetime) ... or just portfolio value
        # More meaningful: net worth = portfolio value
        net_worth = portfolio_value

        top_categories = self._top_categories(year, mon)
        recent_expenses = self._recent_expenses()
        portfolio_allocation = self._portfolio_allocation()
        monthly_trend = self._monthly_expense_trend(year, mon)

        # Income totals
        income_service = IncomeService(self.db)
        total_monthly_income = income_service.get_total_monthly_income()
        income_streams_count = income_service.get_active_income_count()

        return {
            "total_expenses_this_month": total_this_month,
            "total_expenses_last_month": total_last_month,
            "expense_change_percent": expense_change_percent,
            "total_portfolio_value": portfolio_value,
            "total_portfolio_cost": portfolio_cost,
            "net_worth": net_worth,
            "total_monthly_income": total_monthly_income,
            "income_streams_count": income_streams_count,
            "top_categories": top_categories,
            "recent_expenses": recent_expenses,
            "portfolio_allocation": portfolio_allocation,
            "monthly_expense_trend": monthly_trend,
        }

    def _total_expenses_for_month(self, year: int, month: int) -> Decimal:
        result = (
            self.db.query(func.coalesce(func.sum(Expense.amount), 0))
            .filter(extract("year", Expense.date) == year)
            .filter(extract("month", Expense.date) == month)
            .scalar()
        )
        return Decimal(str(result))

    def _portfolio_totals(self) -> tuple[Decimal, Decimal]:
        portfolios = (
            self.db.query(Portfolio).options(joinedload(Portfolio.assets)).all()
        )
        total_value = Decimal("0")
        total_cost = Decimal("0")
        for p in portfolios:
            totals = InvestmentService.compute_portfolio_totals(p)
            total_value += totals["total_value"]
            total_cost += totals["total_cost"]
        return total_value, total_cost

    def _top_categories(self, year: int, month: int, limit: int = 5) -> list[dict]:
        results = (
            self.db.query(
                Category,
                func.sum(Expense.amount).label("total"),
                func.count(Expense.id).label("count"),
            )
            .join(Expense, Expense.category_id == Category.id)
            .filter(extract("year", Expense.date) == year)
            .filter(extract("month", Expense.date) == month)
            .group_by(Category.id)
            .order_by(func.sum(Expense.amount).desc())
            .limit(limit)
            .all()
        )

        grand_total = sum(Decimal(str(r.total)) for r in results) or Decimal("1")

        return [
            {
                "category": r[0],
                "total_amount": Decimal(str(r.total)),
                "percentage": Decimal(str(r.total)) / grand_total * 100,
                "transaction_count": r.count,
            }
            for r in results
        ]

    def _recent_expenses(self, limit: int = 5) -> list[Expense]:
        return (
            self.db.query(Expense)
            .options(joinedload(Expense.category))
            .order_by(Expense.date.desc(), Expense.created_at.desc())
            .limit(limit)
            .all()
        )

    def _portfolio_allocation(self) -> list[dict]:
        assets = self.db.query(Asset).all()
        allocation: dict[str, Decimal] = {}

        for asset in assets:
            value = InvestmentService.compute_asset_current_value(asset)
            if value is None:
                value = InvestmentService.compute_asset_total_cost(asset)
            asset_type = asset.asset_type
            allocation[asset_type] = allocation.get(asset_type, Decimal("0")) + value

        total = sum(allocation.values()) or Decimal("1")

        return [
            {
                "asset_type": atype,
                "total_value": aval,
                "percentage": aval / total * 100,
            }
            for atype, aval in sorted(allocation.items(), key=lambda x: x[1], reverse=True)
        ]

    def _monthly_expense_trend(self, year: int, month: int, months_back: int = 6) -> list[dict]:
        trend = []
        y, m = year, month
        for _ in range(months_back):
            total = self._total_expenses_for_month(y, m)
            trend.append({"month": f"{y:04d}-{m:02d}", "total_amount": total})
            if m == 1:
                y -= 1
                m = 12
            else:
                m -= 1

        trend.reverse()
        return trend
