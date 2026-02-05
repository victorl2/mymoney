from datetime import datetime
from decimal import Decimal

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.income import Income


class IncomeService:
    def __init__(self, db: Session):
        self.db = db

    def list_incomes(
        self,
        *,
        is_active: bool | None = None,
        limit: int = 50,
        offset: int = 0,
    ):
        query = self.db.query(Income)

        if is_active is not None:
            query = query.filter(Income.is_active == is_active)

        total_count = query.count()

        items = query.order_by(Income.created_at.desc()).offset(offset).limit(limit).all()
        has_more = (offset + limit) < total_count

        return items, total_count, has_more

    def get_income(self, income_id: int) -> Income | None:
        return self.db.query(Income).filter(Income.id == income_id).first()

    def create_income(self, **kwargs) -> Income:
        income = Income(**kwargs)
        self.db.add(income)
        self.db.commit()
        self.db.refresh(income)
        return income

    def update_income(self, income_id: int, **kwargs) -> Income | None:
        income = self.db.query(Income).filter(Income.id == income_id).first()
        if not income:
            return None

        for key, value in kwargs.items():
            if value is not None:
                setattr(income, key, value)

        income.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(income)
        return income

    def delete_income(self, income_id: int) -> bool:
        income = self.db.query(Income).filter(Income.id == income_id).first()
        if not income:
            return False
        self.db.delete(income)
        self.db.commit()
        return True

    def get_total_monthly_income(self) -> Decimal:
        """Sum of all active income streams."""
        result = (
            self.db.query(func.sum(Income.amount))
            .filter(Income.is_active == True)
            .scalar()
        )
        return result or Decimal("0")

    def get_active_income_count(self) -> int:
        """Count of active income streams."""
        return self.db.query(Income).filter(Income.is_active == True).count()
