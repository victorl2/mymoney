from __future__ import annotations

from datetime import date
from decimal import Decimal

import strawberry

from app.graphql.types.income import IncomeTypeEnum


@strawberry.input
class CreateIncomeInput:
    name: str
    amount: Decimal
    income_type: IncomeTypeEnum
    is_active: bool = True
    start_date: date | None = None
    notes: str | None = None


@strawberry.input
class UpdateIncomeInput:
    name: str | None = None
    amount: Decimal | None = None
    income_type: IncomeTypeEnum | None = None
    is_active: bool | None = None
    start_date: date | None = None
    notes: str | None = None
