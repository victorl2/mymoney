from datetime import date
from decimal import Decimal

from app.models.category import Category
from app.models.expense import Expense
from app.models.portfolio import Portfolio
from app.models.asset import Asset
from app.services.dashboard_service import DashboardService


def _seed_data(db):
    """Seed test data for dashboard tests."""
    cat_food = Category(name="Food", color="#EF4444")
    cat_transport = Category(name="Transport", color="#F59E0B")
    db.add_all([cat_food, cat_transport])
    db.flush()

    # January 2026 expenses
    db.add(Expense(amount=Decimal("50"), description="Lunch", date=date(2026, 1, 10), category_id=cat_food.id))
    db.add(Expense(amount=Decimal("30"), description="Dinner", date=date(2026, 1, 15), category_id=cat_food.id))
    db.add(Expense(amount=Decimal("20"), description="Bus", date=date(2026, 1, 12), category_id=cat_transport.id))

    # February 2026 expenses
    db.add(Expense(amount=Decimal("40"), description="Groceries", date=date(2026, 2, 5), category_id=cat_food.id))

    # Portfolio with assets
    portfolio = Portfolio(name="My Portfolio")
    db.add(portfolio)
    db.flush()

    db.add(Asset(
        portfolio_id=portfolio.id, symbol="AAPL", name="Apple", asset_type="stock",
        quantity=Decimal("10"), purchase_price=Decimal("100"), purchase_date=date(2025, 1, 1),
        current_price=Decimal("120"),
    ))
    db.add(Asset(
        portfolio_id=portfolio.id, symbol="BTC", name="Bitcoin", asset_type="crypto",
        quantity=Decimal("0.5"), purchase_price=Decimal("40000"), purchase_date=date(2025, 6, 1),
        current_price=Decimal("50000"),
    ))

    db.commit()


class TestDashboardService:
    def test_expenses_this_month(self, db_session):
        _seed_data(db_session)
        service = DashboardService(db_session)
        summary = service.get_summary(month="2026-01")
        assert summary["total_expenses_this_month"] == Decimal("100")  # 50 + 30 + 20

    def test_expenses_last_month(self, db_session):
        _seed_data(db_session)
        service = DashboardService(db_session)
        # When viewing Feb, last month is Jan
        summary = service.get_summary(month="2026-02")
        assert summary["total_expenses_this_month"] == Decimal("40")
        assert summary["total_expenses_last_month"] == Decimal("100")

    def test_expense_change_percent(self, db_session):
        _seed_data(db_session)
        service = DashboardService(db_session)
        summary = service.get_summary(month="2026-02")
        # (40 - 100) / 100 * 100 = -60%
        assert summary["expense_change_percent"] == Decimal("-60")

    def test_expense_change_percent_zero_last_month(self, db_session):
        _seed_data(db_session)
        service = DashboardService(db_session)
        # March has no expenses, Feb was last month with 40
        summary = service.get_summary(month="2026-03")
        assert summary["total_expenses_this_month"] == Decimal("0")
        # Change from 40 to 0: -100%
        assert summary["expense_change_percent"] == Decimal("-100")

    def test_portfolio_totals(self, db_session):
        _seed_data(db_session)
        service = DashboardService(db_session)
        summary = service.get_summary(month="2026-01")
        # AAPL: 10 * 100 = 1000 cost, 10 * 120 = 1200 value
        # BTC: 0.5 * 40000 = 20000 cost, 0.5 * 50000 = 25000 value
        assert summary["total_portfolio_cost"] == Decimal("21000")
        assert summary["total_portfolio_value"] == Decimal("26200")

    def test_top_categories(self, db_session):
        _seed_data(db_session)
        service = DashboardService(db_session)
        summary = service.get_summary(month="2026-01")
        top = summary["top_categories"]
        assert len(top) == 2
        assert top[0]["category"].name == "Food"  # 80 total
        assert top[0]["total_amount"] == Decimal("80")
        assert top[0]["transaction_count"] == 2

    def test_recent_expenses(self, db_session):
        _seed_data(db_session)
        service = DashboardService(db_session)
        summary = service.get_summary(month="2026-02")
        recent = summary["recent_expenses"]
        assert len(recent) <= 5
        # Most recent first
        assert recent[0].date >= recent[1].date

    def test_portfolio_allocation(self, db_session):
        _seed_data(db_session)
        service = DashboardService(db_session)
        summary = service.get_summary(month="2026-01")
        allocation = summary["portfolio_allocation"]
        assert len(allocation) == 2
        types = {a["asset_type"] for a in allocation}
        assert "stock" in types
        assert "crypto" in types

    def test_monthly_trend(self, db_session):
        _seed_data(db_session)
        service = DashboardService(db_session)
        summary = service.get_summary(month="2026-02")
        trend = summary["monthly_expense_trend"]
        assert len(trend) == 6
        # Should include Feb 2026 and go back 6 months
        assert trend[-1]["month"] == "2026-02"
        # Jan should have 100
        jan = next(t for t in trend if t["month"] == "2026-01")
        assert jan["total_amount"] == Decimal("100")

    def test_empty_dashboard(self, db_session):
        service = DashboardService(db_session)
        summary = service.get_summary(month="2026-01")
        assert summary["total_expenses_this_month"] == Decimal("0")
        assert summary["total_portfolio_value"] == Decimal("0")
        assert summary["net_worth"] == Decimal("0")
        assert summary["top_categories"] == []
        assert summary["recent_expenses"] == []
        assert summary["portfolio_allocation"] == []
