from __future__ import annotations

import enum

import strawberry
from datetime import date, datetime
from decimal import Decimal


@strawberry.enum
class IncomeTypeEnum(enum.Enum):
    SALARY = "salary"
    FREELANCE = "freelance"
    INVESTMENTS = "investments"
    RENTAL = "rental"
    BUSINESS = "business"
    OTHER = "other"


@strawberry.type
class IncomeType:
    id: strawberry.ID
    name: str
    amount: Decimal
    income_type: str
    is_active: bool
    start_date: date | None
    notes: str | None
    currency: str
    is_gross: bool
    tax_rate: Decimal | None
    other_fees: Decimal | None
    net_amount: Decimal
    created_at: datetime
    updated_at: datetime


@strawberry.type
class IncomeConnection:
    items: list[IncomeType]
    total_count: int
    has_more: bool
