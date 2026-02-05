from datetime import date
from decimal import Decimal

from app.models.portfolio import Portfolio
from app.services.investment_service import InvestmentService


def _create_portfolio(db, name="My Portfolio"):
    p = Portfolio(name=name)
    db.add(p)
    db.commit()
    db.refresh(p)
    return p


class TestPortfolioService:
    def test_create_portfolio(self, db_session):
        service = InvestmentService(db_session)
        p = service.create_portfolio("Retirement", "Long-term investments")
        assert p.id is not None
        assert p.name == "Retirement"
        assert p.description == "Long-term investments"

    def test_list_portfolios(self, db_session):
        service = InvestmentService(db_session)
        service.create_portfolio("Zebra")
        service.create_portfolio("Alpha")
        portfolios = service.list_portfolios()
        assert len(portfolios) == 2
        assert portfolios[0].name == "Alpha"

    def test_update_portfolio(self, db_session):
        service = InvestmentService(db_session)
        p = service.create_portfolio("Old")
        updated = service.update_portfolio(p.id, name="New")
        assert updated.name == "New"

    def test_delete_portfolio(self, db_session):
        service = InvestmentService(db_session)
        p = service.create_portfolio("ToDelete")
        assert service.delete_portfolio(p.id) is True
        assert service.get_portfolio(p.id) is None


class TestAssetService:
    def test_create_asset(self, db_session):
        portfolio = _create_portfolio(db_session)
        service = InvestmentService(db_session)
        asset = service.create_asset(
            portfolio_id=portfolio.id,
            symbol="AAPL",
            name="Apple Inc.",
            asset_type="stock",
            quantity=Decimal("10"),
            purchase_price=Decimal("150.00"),
            purchase_date=date(2025, 6, 1),
            current_price=Decimal("175.00"),
            currency="USD",
        )
        assert asset.id is not None
        assert asset.symbol == "AAPL"

    def test_update_asset(self, db_session):
        portfolio = _create_portfolio(db_session)
        service = InvestmentService(db_session)
        asset = service.create_asset(
            portfolio_id=portfolio.id,
            symbol="AAPL",
            name="Apple Inc.",
            asset_type="stock",
            quantity=Decimal("10"),
            purchase_price=Decimal("150.00"),
            purchase_date=date(2025, 6, 1),
        )
        updated = service.update_asset(asset.id, current_price=Decimal("180.00"))
        assert updated.current_price == Decimal("180.00")

    def test_delete_asset(self, db_session):
        portfolio = _create_portfolio(db_session)
        service = InvestmentService(db_session)
        asset = service.create_asset(
            portfolio_id=portfolio.id,
            symbol="BTC",
            name="Bitcoin",
            asset_type="crypto",
            quantity=Decimal("0.5"),
            purchase_price=Decimal("40000.00"),
            purchase_date=date(2025, 1, 1),
        )
        assert service.delete_asset(asset.id) is True
        assert service.get_asset(asset.id) is None


class TestComputedFields:
    def test_asset_total_cost(self, db_session):
        portfolio = _create_portfolio(db_session)
        service = InvestmentService(db_session)
        asset = service.create_asset(
            portfolio_id=portfolio.id,
            symbol="AAPL",
            name="Apple",
            asset_type="stock",
            quantity=Decimal("10"),
            purchase_price=Decimal("150.00"),
            purchase_date=date(2025, 6, 1),
        )
        assert service.compute_asset_total_cost(asset) == Decimal("1500.00")

    def test_asset_gain_loss(self, db_session):
        portfolio = _create_portfolio(db_session)
        service = InvestmentService(db_session)
        asset = service.create_asset(
            portfolio_id=portfolio.id,
            symbol="AAPL",
            name="Apple",
            asset_type="stock",
            quantity=Decimal("10"),
            purchase_price=Decimal("150.00"),
            purchase_date=date(2025, 6, 1),
            current_price=Decimal("175.00"),
        )
        assert service.compute_asset_current_value(asset) == Decimal("1750.00")
        assert service.compute_asset_gain_loss(asset) == Decimal("250.00")

    def test_asset_gain_loss_percent(self, db_session):
        portfolio = _create_portfolio(db_session)
        service = InvestmentService(db_session)
        asset = service.create_asset(
            portfolio_id=portfolio.id,
            symbol="AAPL",
            name="Apple",
            asset_type="stock",
            quantity=Decimal("10"),
            purchase_price=Decimal("100.00"),
            purchase_date=date(2025, 6, 1),
            current_price=Decimal("120.00"),
        )
        # (1200 - 1000) / 1000 * 100 = 20%
        percent = service.compute_asset_gain_loss_percent(asset)
        assert percent == Decimal("20")

    def test_asset_no_current_price(self, db_session):
        portfolio = _create_portfolio(db_session)
        service = InvestmentService(db_session)
        asset = service.create_asset(
            portfolio_id=portfolio.id,
            symbol="XYZ",
            name="Unknown",
            asset_type="other",
            quantity=Decimal("5"),
            purchase_price=Decimal("50.00"),
            purchase_date=date(2025, 6, 1),
        )
        assert service.compute_asset_current_value(asset) is None
        assert service.compute_asset_gain_loss(asset) is None
        assert service.compute_asset_gain_loss_percent(asset) is None

    def test_portfolio_totals(self, db_session):
        portfolio = _create_portfolio(db_session)
        service = InvestmentService(db_session)
        service.create_asset(
            portfolio_id=portfolio.id,
            symbol="AAPL",
            name="Apple",
            asset_type="stock",
            quantity=Decimal("10"),
            purchase_price=Decimal("100.00"),
            purchase_date=date(2025, 6, 1),
            current_price=Decimal("120.00"),
        )
        service.create_asset(
            portfolio_id=portfolio.id,
            symbol="GOOG",
            name="Google",
            asset_type="stock",
            quantity=Decimal("5"),
            purchase_price=Decimal("200.00"),
            purchase_date=date(2025, 6, 1),
            current_price=Decimal("220.00"),
        )
        # Reload portfolio with assets
        portfolio = service.get_portfolio(portfolio.id)
        totals = service.compute_portfolio_totals(portfolio)

        assert totals["total_cost"] == Decimal("2000.00")  # 1000 + 1000
        assert totals["total_value"] == Decimal("2300.00")  # 1200 + 1100
        assert totals["total_gain_loss"] == Decimal("300.00")
        assert totals["total_gain_loss_percent"] == Decimal("15")  # 300/2000 * 100

    def test_portfolio_totals_mixed_prices(self, db_session):
        """Assets without current price fall back to cost for total value."""
        portfolio = _create_portfolio(db_session)
        service = InvestmentService(db_session)
        service.create_asset(
            portfolio_id=portfolio.id,
            symbol="AAPL",
            name="Apple",
            asset_type="stock",
            quantity=Decimal("10"),
            purchase_price=Decimal("100.00"),
            purchase_date=date(2025, 6, 1),
            current_price=Decimal("120.00"),
        )
        service.create_asset(
            portfolio_id=portfolio.id,
            symbol="XYZ",
            name="Unknown",
            asset_type="other",
            quantity=Decimal("5"),
            purchase_price=Decimal("50.00"),
            purchase_date=date(2025, 6, 1),
            # No current price
        )
        portfolio = service.get_portfolio(portfolio.id)
        totals = service.compute_portfolio_totals(portfolio)

        assert totals["total_cost"] == Decimal("1250.00")  # 1000 + 250
        assert totals["total_value"] == Decimal("1450.00")  # 1200 + 250 (fallback)
