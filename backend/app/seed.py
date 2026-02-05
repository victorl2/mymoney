"""Seed the database with default categories."""

from app.database import SessionLocal
from app.models import Base, Category
from app.database import engine


DEFAULT_CATEGORIES = [
    {"name": "Food", "color": "#EF4444", "icon": "utensils"},
    {"name": "Transport", "color": "#F59E0B", "icon": "car"},
    {"name": "Housing", "color": "#3B82F6", "icon": "home"},
    {"name": "Utilities", "color": "#8B5CF6", "icon": "zap"},
    {"name": "Entertainment", "color": "#EC4899", "icon": "film"},
    {"name": "Health", "color": "#10B981", "icon": "heart"},
    {"name": "Education", "color": "#06B6D4", "icon": "book"},
    {"name": "Shopping", "color": "#F97316", "icon": "shopping-bag"},
    {"name": "Other", "color": "#6B7280", "icon": "more-horizontal"},
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing = db.query(Category).count()
        if existing > 0:
            print(f"Categories already seeded ({existing} found). Skipping.")
            return

        for cat_data in DEFAULT_CATEGORIES:
            db.add(Category(**cat_data))
        db.commit()
        print(f"Seeded {len(DEFAULT_CATEGORIES)} categories.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
