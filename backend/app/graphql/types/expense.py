from __future__ import annotations

import enum

import strawberry
from datetime import date, datetime
from decimal import Decimal

from app.graphql.types.category import CategoryType


@strawberry.enum
class RecurrenceRule(enum.Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    BIWEEKLY = "biweekly"
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    YEARLY = "yearly"


@strawberry.type
class ExpenseType:
    id: strawberry.ID
    amount: Decimal
    description: str
    notes: str | None
    date: date
    category: CategoryType
    is_recurring: bool
    recurrence_rule: str | None
    created_at: datetime
    updated_at: datetime


@strawberry.type
class ExpenseConnection:
    items: list[ExpenseType]
    total_count: int
    has_more: bool
