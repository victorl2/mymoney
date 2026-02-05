from datetime import datetime
from decimal import Decimal

from sqlalchemy.orm import Session, joinedload

from app.models.asset import Asset
from app.models.portfolio import Portfolio


class InvestmentService:
    def __init__(self, db: Session):
        self.db = db

    # ── Portfolios ──

    def list_portfolios(self) -> list[Portfolio]:
        return (
            self.db.query(Portfolio)
            .options(joinedload(Portfolio.assets))
            .order_by(Portfolio.name)
            .all()
        )

    def get_portfolio(self, portfolio_id: int) -> Portfolio | None:
        return (
            self.db.query(Portfolio)
            .options(joinedload(Portfolio.assets))
            .filter(Portfolio.id == portfolio_id)
            .first()
        )

    def create_portfolio(self, name: str, description: str | None = None) -> Portfolio:
        portfolio = Portfolio(name=name, description=description)
        self.db.add(portfolio)
        self.db.commit()
        self.db.refresh(portfolio)
        return portfolio

    def update_portfolio(self, portfolio_id: int, **kwargs) -> Portfolio | None:
        portfolio = self.db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
        if not portfolio:
            return None
        for key, value in kwargs.items():
            if value is not None:
                setattr(portfolio, key, value)
        portfolio.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(portfolio)
        return portfolio

    def delete_portfolio(self, portfolio_id: int) -> bool:
        portfolio = self.db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
        if not portfolio:
            return False
        self.db.delete(portfolio)
        self.db.commit()
        return True

    # ── Assets ──

    def get_asset(self, asset_id: int) -> Asset | None:
        return self.db.query(Asset).filter(Asset.id == asset_id).first()

    def create_asset(self, **kwargs) -> Asset:
        asset = Asset(**kwargs)
        self.db.add(asset)
        self.db.commit()
        self.db.refresh(asset)
        return asset

    def update_asset(self, asset_id: int, **kwargs) -> Asset | None:
        asset = self.db.query(Asset).filter(Asset.id == asset_id).first()
        if not asset:
            return None
        for key, value in kwargs.items():
            if value is not None:
                setattr(asset, key, value)
        asset.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(asset)
        return asset

    def delete_asset(self, asset_id: int) -> bool:
        asset = self.db.query(Asset).filter(Asset.id == asset_id).first()
        if not asset:
            return False
        self.db.delete(asset)
        self.db.commit()
        return True

    # ── Computed Fields ──

    @staticmethod
    def compute_asset_total_cost(asset: Asset) -> Decimal:
        return asset.quantity * asset.purchase_price

    @staticmethod
    def compute_asset_current_value(asset: Asset) -> Decimal | None:
        if asset.current_price is None:
            return None
        return asset.quantity * asset.current_price

    @staticmethod
    def compute_asset_gain_loss(asset: Asset) -> Decimal | None:
        current_value = InvestmentService.compute_asset_current_value(asset)
        if current_value is None:
            return None
        return current_value - InvestmentService.compute_asset_total_cost(asset)

    @staticmethod
    def compute_asset_gain_loss_percent(asset: Asset) -> Decimal | None:
        total_cost = InvestmentService.compute_asset_total_cost(asset)
        gain_loss = InvestmentService.compute_asset_gain_loss(asset)
        if gain_loss is None or total_cost == 0:
            return None
        return (gain_loss / total_cost) * 100

    @staticmethod
    def compute_portfolio_totals(portfolio: Portfolio) -> dict:
        total_cost = Decimal("0")
        total_value = Decimal("0")
        has_value = False

        for asset in portfolio.assets:
            cost = InvestmentService.compute_asset_total_cost(asset)
            total_cost += cost
            current_value = InvestmentService.compute_asset_current_value(asset)
            if current_value is not None:
                total_value += current_value
                has_value = True
            else:
                total_value += cost  # Use cost as fallback

        total_gain_loss = total_value - total_cost if has_value else Decimal("0")
        total_gain_loss_percent = (
            (total_gain_loss / total_cost * 100) if total_cost > 0 and has_value else Decimal("0")
        )

        return {
            "total_cost": total_cost,
            "total_value": total_value,
            "total_gain_loss": total_gain_loss,
            "total_gain_loss_percent": total_gain_loss_percent,
        }
