from __future__ import annotations

import enum
from datetime import date
from decimal import Decimal

import strawberry

from app.graphql.types.expense import RecurrenceRule


@strawberry.input
class CreateExpenseInput:
    amount: Decimal
    description: str
    date: date
    category_id: strawberry.ID
    notes: str | None = None
    is_recurring: bool = False
    recurrence_rule: RecurrenceRule | None = None


@strawberry.input
class UpdateExpenseInput:
    amount: Decimal | None = None
    description: str | None = None
    notes: str | None = None
    date: date | None = None
    category_id: strawberry.ID | None = None
    is_recurring: bool | None = None
    recurrence_rule: RecurrenceRule | None = None


@strawberry.input
class ExpenseFilter:
    category_id: strawberry.ID | None = None
    start_date: date | None = None
    end_date: date | None = None
    min_amount: Decimal | None = None
    max_amount: Decimal | None = None
    is_recurring: bool | None = None
    search: str | None = None


@strawberry.enum
class ExpenseSortField(enum.Enum):
    DATE = "date"
    AMOUNT = "amount"


@strawberry.enum
class SortDirection(enum.Enum):
    ASC = "asc"
    DESC = "desc"
