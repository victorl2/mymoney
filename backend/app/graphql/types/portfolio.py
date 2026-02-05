from __future__ import annotations

from datetime import datetime
from decimal import Decimal

import strawberry

from app.graphql.types.investment import AssetGQL


@strawberry.type
class PortfolioType:
    id: strawberry.ID
    name: str
    description: str | None
    assets: list[AssetGQL]
    total_value: Decimal
    total_cost: Decimal
    total_gain_loss: Decimal
    total_gain_loss_percent: Decimal
    created_at: datetime
    updated_at: datetime
