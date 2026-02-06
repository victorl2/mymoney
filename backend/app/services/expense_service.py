from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import extract, func, or_
from sqlalchemy.orm import Session, joinedload

from app.models.category import Category
from app.models.expense import Expense


class ExpenseService:
    def __init__(self, db: Session):
        self.db = db

    def list_expenses(
        self,
        *,
        category_id: int | None = None,
        start_date=None,
        end_date=None,
        min_amount=None,
        max_amount=None,
        is_recurring: bool | None = None,
        is_paid: bool | None = None,
        search: str | None = None,
        sort_by: str = "date",
        sort_direction: str = "desc",
        limit: int = 20,
        offset: int = 0,
    ):
        query = self.db.query(Expense).options(joinedload(Expense.category))

        if category_id is not None:
            query = query.filter(Expense.category_id == category_id)
        if start_date is not None:
            query = query.filter(Expense.date >= start_date)
        if end_date is not None:
            query = query.filter(Expense.date <= end_date)
        if min_amount is not None:
            query = query.filter(Expense.amount >= min_amount)
        if max_amount is not None:
            query = query.filter(Expense.amount <= max_amount)
        if is_recurring is not None:
            query = query.filter(Expense.is_recurring == is_recurring)
        if is_paid is not None:
            query = query.filter(Expense.is_paid == is_paid)
        if search:
            pattern = f"%{search}%"
            query = query.filter(
                or_(
                    Expense.description.ilike(pattern),
                    Expense.notes.ilike(pattern),
                )
            )

        total_count = query.count()

        sort_column = Expense.date if sort_by == "date" else Expense.amount
        if sort_direction == "desc":
            sort_column = sort_column.desc()
        else:
            sort_column = sort_column.asc()

        items = query.order_by(sort_column).offset(offset).limit(limit).all()
        has_more = (offset + limit) < total_count

        return items, total_count, has_more

    def get_expense(self, expense_id: int) -> Expense | None:
        return (
            self.db.query(Expense)
            .options(joinedload(Expense.category))
            .filter(Expense.id == expense_id)
            .first()
        )

    def create_expense(self, **kwargs) -> Expense:
        expense = Expense(**kwargs)
        self.db.add(expense)
        self.db.commit()
        self.db.refresh(expense)
        # Eager load category
        self.db.refresh(expense, attribute_names=["category"])
        return expense

    def update_expense(self, expense_id: int, **kwargs) -> Expense | None:
        expense = self.db.query(Expense).filter(Expense.id == expense_id).first()
        if not expense:
            return None

        for key, value in kwargs.items():
            if value is not None:
                setattr(expense, key, value)

        expense.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(expense)
        self.db.refresh(expense, attribute_names=["category"])
        return expense

    def delete_expense(self, expense_id: int) -> bool:
        expense = self.db.query(Expense).filter(Expense.id == expense_id).first()
        if not expense:
            return False
        self.db.delete(expense)
        self.db.commit()
        return True

    def mark_expense_paid(self, expense_id: int, paid: bool) -> Expense | None:
        expense = self.db.query(Expense).filter(Expense.id == expense_id).first()
        if not expense:
            return None

        expense.is_paid = paid
        expense.paid_at = datetime.utcnow() if paid else None
        expense.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(expense)
        self.db.refresh(expense, attribute_names=["category"])
        return expense

    def get_expense_summary(self, month: int | None = None, year: int | None = None):
        """Get expense summary for a given month/year. Defaults to current month."""
        today = date.today()
        target_month = month if month is not None else today.month
        target_year = year if year is not None else today.year

        query = self.db.query(Expense).filter(
            extract("month", Expense.date) == target_month,
            extract("year", Expense.date) == target_year,
        )

        expenses = query.all()

        total_amount = sum((e.amount for e in expenses), Decimal("0"))
        paid_amount = sum((e.amount for e in expenses if e.is_paid), Decimal("0"))
        unpaid_amount = total_amount - paid_amount

        total_count = len(expenses)
        paid_count = sum(1 for e in expenses if e.is_paid)
        unpaid_count = total_count - paid_count

        return {
            "total_amount": total_amount,
            "paid_amount": paid_amount,
            "unpaid_amount": unpaid_amount,
            "total_count": total_count,
            "paid_count": paid_count,
            "unpaid_count": unpaid_count,
        }


class CategoryService:
    def __init__(self, db: Session):
        self.db = db

    def list_categories(self) -> list[Category]:
        return self.db.query(Category).order_by(Category.name).all()

    def get_category(self, category_id: int) -> Category | None:
        return self.db.query(Category).filter(Category.id == category_id).first()

    def create_category(self, name: str, color: str = "#6B7280", icon: str | None = None) -> Category:
        category = Category(name=name, color=color, icon=icon)
        self.db.add(category)
        self.db.commit()
        self.db.refresh(category)
        return category

    def update_category(self, category_id: int, **kwargs) -> Category | None:
        category = self.db.query(Category).filter(Category.id == category_id).first()
        if not category:
            return None
        for key, value in kwargs.items():
            if value is not None:
                setattr(category, key, value)
        self.db.commit()
        self.db.refresh(category)
        return category

    def delete_category(self, category_id: int) -> bool:
        category = self.db.query(Category).filter(Category.id == category_id).first()
        if not category:
            return False
        self.db.delete(category)
        self.db.commit()
        return True
