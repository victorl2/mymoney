from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import Boolean, Date, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class Income(Base):
    __tablename__ = "incomes"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    income_type: Mapped[str] = mapped_column(String(20), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    start_date: Mapped[date | None] = mapped_column(Date)
    notes: Mapped[str | None] = mapped_column(Text)

    # Currency and gross/net fields
    currency: Mapped[str] = mapped_column(String(3), nullable=False, default="USD")
    is_gross: Mapped[bool] = mapped_column(Boolean, default=True)
    tax_rate: Mapped[Decimal | None] = mapped_column(Numeric(5, 2))  # Percentage
    other_fees: Mapped[Decimal | None] = mapped_column(Numeric(12, 2))  # Fixed amount

    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, onupdate=datetime.utcnow)

    @property
    def net_amount(self) -> Decimal:
        """Calculate net amount after tax and fees deductions."""
        if not self.is_gross:
            return self.amount

        net = self.amount

        if self.tax_rate:
            tax_deduction = self.amount * (self.tax_rate / Decimal("100"))
            net -= tax_deduction

        if self.other_fees:
            net -= self.other_fees

        return max(net, Decimal("0"))
