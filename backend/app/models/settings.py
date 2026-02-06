from datetime import datetime

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class UserSettings(Base):
    """Singleton settings table - always has exactly one row with id=1."""

    __tablename__ = "user_settings"

    id: Mapped[int] = mapped_column(primary_key=True)
    main_currency: Mapped[str] = mapped_column(String(3), nullable=False, default="USD")
    language: Mapped[str] = mapped_column(String(5), nullable=False, default="en")
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, onupdate=datetime.utcnow)
