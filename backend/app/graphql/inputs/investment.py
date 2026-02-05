from __future__ import annotations

from datetime import date
from decimal import Decimal

import strawberry

from app.graphql.types.investment import AssetType


@strawberry.input
class CreatePortfolioInput:
    name: str
    description: str | None = None


@strawberry.input
class UpdatePortfolioInput:
    name: str | None = None
    description: str | None = None


@strawberry.input
class CreateAssetInput:
    portfolio_id: strawberry.ID
    symbol: str
    name: str
    asset_type: AssetType
    quantity: Decimal
    purchase_price: Decimal
    purchase_date: date
    current_price: Decimal | None = None
    currency: str = "USD"
    notes: str | None = None


@strawberry.input
class UpdateAssetInput:
    symbol: str | None = None
    name: str | None = None
    asset_type: AssetType | None = None
    quantity: Decimal | None = None
    purchase_price: Decimal | None = None
    purchase_date: date | None = None
    current_price: Decimal | None = None
    currency: str | None = None
    notes: str | None = None
