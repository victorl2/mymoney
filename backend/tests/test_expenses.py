from datetime import date
from decimal import Decimal

from app.models.category import Category
from app.models.expense import Expense
from app.services.expense_service import ExpenseService, CategoryService


def _seed_category(db, name="Food", color="#EF4444"):
    cat = Category(name=name, color=color)
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


class TestCategoryService:
    def test_create_category(self, db_session):
        service = CategoryService(db_session)
        cat = service.create_category("Food", "#EF4444", "utensils")
        assert cat.id is not None
        assert cat.name == "Food"
        assert cat.color == "#EF4444"
        assert cat.icon == "utensils"

    def test_list_categories(self, db_session):
        service = CategoryService(db_session)
        service.create_category("Zebra")
        service.create_category("Alpha")
        cats = service.list_categories()
        assert len(cats) == 2
        assert cats[0].name == "Alpha"  # sorted by name

    def test_update_category(self, db_session):
        service = CategoryService(db_session)
        cat = service.create_category("Old Name")
        updated = service.update_category(cat.id, name="New Name")
        assert updated.name == "New Name"

    def test_delete_category(self, db_session):
        service = CategoryService(db_session)
        cat = service.create_category("ToDelete")
        assert service.delete_category(cat.id) is True
        assert service.get_category(cat.id) is None

    def test_delete_nonexistent(self, db_session):
        service = CategoryService(db_session)
        assert service.delete_category(999) is False


class TestExpenseService:
    def test_create_expense(self, db_session):
        cat = _seed_category(db_session)
        service = ExpenseService(db_session)
        expense = service.create_expense(
            amount=Decimal("42.50"),
            description="Lunch",
            date=date(2026, 1, 15),
            category_id=cat.id,
        )
        assert expense.id is not None
        assert expense.amount == Decimal("42.50")
        assert expense.description == "Lunch"
        assert expense.category.name == "Food"

    def test_list_expenses_with_pagination(self, db_session):
        cat = _seed_category(db_session)
        service = ExpenseService(db_session)
        for i in range(5):
            service.create_expense(
                amount=Decimal(str(10 + i)),
                description=f"Expense {i}",
                date=date(2026, 1, i + 1),
                category_id=cat.id,
            )

        items, total, has_more = service.list_expenses(limit=3, offset=0)
        assert total == 5
        assert len(items) == 3
        assert has_more is True

        items, total, has_more = service.list_expenses(limit=3, offset=3)
        assert len(items) == 2
        assert has_more is False

    def test_list_expenses_filter_by_category(self, db_session):
        cat1 = _seed_category(db_session, "Food")
        cat2 = _seed_category(db_session, "Transport")
        service = ExpenseService(db_session)
        service.create_expense(
            amount=Decimal("10"), description="A", date=date(2026, 1, 1), category_id=cat1.id
        )
        service.create_expense(
            amount=Decimal("20"), description="B", date=date(2026, 1, 2), category_id=cat2.id
        )

        items, total, _ = service.list_expenses(category_id=cat1.id)
        assert total == 1
        assert items[0].category.name == "Food"

    def test_list_expenses_filter_by_date_range(self, db_session):
        cat = _seed_category(db_session)
        service = ExpenseService(db_session)
        service.create_expense(
            amount=Decimal("10"), description="Jan", date=date(2026, 1, 15), category_id=cat.id
        )
        service.create_expense(
            amount=Decimal("20"), description="Feb", date=date(2026, 2, 15), category_id=cat.id
        )

        items, total, _ = service.list_expenses(
            start_date=date(2026, 2, 1), end_date=date(2026, 2, 28)
        )
        assert total == 1
        assert items[0].description == "Feb"

    def test_list_expenses_filter_by_amount(self, db_session):
        cat = _seed_category(db_session)
        service = ExpenseService(db_session)
        service.create_expense(
            amount=Decimal("5"), description="Cheap", date=date(2026, 1, 1), category_id=cat.id
        )
        service.create_expense(
            amount=Decimal("50"), description="Pricey", date=date(2026, 1, 2), category_id=cat.id
        )

        items, total, _ = service.list_expenses(min_amount=Decimal("10"))
        assert total == 1
        assert items[0].description == "Pricey"

    def test_list_expenses_search(self, db_session):
        cat = _seed_category(db_session)
        service = ExpenseService(db_session)
        service.create_expense(
            amount=Decimal("10"), description="Coffee shop", date=date(2026, 1, 1), category_id=cat.id
        )
        service.create_expense(
            amount=Decimal("20"), description="Groceries", date=date(2026, 1, 2), category_id=cat.id
        )

        items, total, _ = service.list_expenses(search="coffee")
        assert total == 1
        assert items[0].description == "Coffee shop"

    def test_list_expenses_sort_by_amount(self, db_session):
        cat = _seed_category(db_session)
        service = ExpenseService(db_session)
        service.create_expense(
            amount=Decimal("30"), description="A", date=date(2026, 1, 1), category_id=cat.id
        )
        service.create_expense(
            amount=Decimal("10"), description="B", date=date(2026, 1, 2), category_id=cat.id
        )

        items, _, _ = service.list_expenses(sort_by="amount", sort_direction="asc")
        assert items[0].amount == Decimal("10")
        assert items[1].amount == Decimal("30")

    def test_update_expense(self, db_session):
        cat = _seed_category(db_session)
        service = ExpenseService(db_session)
        expense = service.create_expense(
            amount=Decimal("10"), description="Old", date=date(2026, 1, 1), category_id=cat.id
        )
        updated = service.update_expense(expense.id, description="New", amount=Decimal("25"))
        assert updated.description == "New"
        assert updated.amount == Decimal("25")

    def test_update_nonexistent(self, db_session):
        service = ExpenseService(db_session)
        assert service.update_expense(999, description="test") is None

    def test_delete_expense(self, db_session):
        cat = _seed_category(db_session)
        service = ExpenseService(db_session)
        expense = service.create_expense(
            amount=Decimal("10"), description="ToDelete", date=date(2026, 1, 1), category_id=cat.id
        )
        assert service.delete_expense(expense.id) is True
        assert service.get_expense(expense.id) is None

    def test_delete_nonexistent(self, db_session):
        service = ExpenseService(db_session)
        assert service.delete_expense(999) is False
