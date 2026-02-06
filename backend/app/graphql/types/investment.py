from __future__ import annotations

import enum
from datetime import date, datetime
from decimal import Decimal

import strawberry


@strawberry.enum
class AssetType(enum.Enum):
    STOCK = "stock"
    CRYPTO = "crypto"
    FUND = "fund"
    ETF = "etf"
    BOND = "bond"
    FII = "fii"
    OTHER = "other"


@strawberry.type
class AssetGQL:
    id: strawberry.ID
    symbol: str
    name: str
    asset_type: AssetType
    quantity: Decimal
    purchase_price: Decimal
    purchase_date: date
    current_price: Decimal | None
    currency: str
    notes: str | None
    total_cost: Decimal
    current_value: Decimal | None
    gain_loss: Decimal | None
    gain_loss_percent: Decimal | None
    created_at: datetime
    updated_at: datetime
