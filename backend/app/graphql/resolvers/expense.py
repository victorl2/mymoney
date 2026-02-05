import strawberry
from strawberry.types import Info

from app.graphql.types.category import CategoryType
from app.graphql.types.expense import ExpenseType, ExpenseConnection
from app.graphql.inputs.expense import (
    CreateExpenseInput,
    UpdateExpenseInput,
    ExpenseFilter,
    ExpenseSortField,
    SortDirection,
)
from app.services.expense_service import ExpenseService, CategoryService


def _to_category_type(cat) -> CategoryType:
    return CategoryType(
        id=strawberry.ID(str(cat.id)),
        name=cat.name,
        color=cat.color,
        icon=cat.icon,
        created_at=cat.created_at,
    )


def _to_expense_type(expense) -> ExpenseType:
    return ExpenseType(
        id=strawberry.ID(str(expense.id)),
        amount=expense.amount,
        description=expense.description,
        notes=expense.notes,
        date=expense.date,
        category=_to_category_type(expense.category),
        is_recurring=expense.is_recurring,
        recurrence_rule=expense.recurrence_rule,
        created_at=expense.created_at,
        updated_at=expense.updated_at,
    )


@strawberry.type
class ExpenseQuery:
    @strawberry.field
    def expenses(
        self,
        info: Info,
        filter: ExpenseFilter | None = None,
        sort_by: ExpenseSortField = ExpenseSortField.DATE,
        sort_direction: SortDirection = SortDirection.DESC,
        limit: int = 20,
        offset: int = 0,
    ) -> ExpenseConnection:
        db = info.context["db"]
        service = ExpenseService(db)

        kwargs = {}
        if filter:
            if filter.category_id is not None:
                kwargs["category_id"] = int(filter.category_id)
            if filter.start_date is not None:
                kwargs["start_date"] = filter.start_date
            if filter.end_date is not None:
                kwargs["end_date"] = filter.end_date
            if filter.min_amount is not None:
                kwargs["min_amount"] = filter.min_amount
            if filter.max_amount is not None:
                kwargs["max_amount"] = filter.max_amount
            if filter.is_recurring is not None:
                kwargs["is_recurring"] = filter.is_recurring
            if filter.search is not None:
                kwargs["search"] = filter.search

        items, total_count, has_more = service.list_expenses(
            **kwargs,
            sort_by=sort_by.value,
            sort_direction=sort_direction.value,
            limit=limit,
            offset=offset,
        )

        return ExpenseConnection(
            items=[_to_expense_type(e) for e in items],
            total_count=total_count,
            has_more=has_more,
        )

    @strawberry.field
    def expense(self, info: Info, id: strawberry.ID) -> ExpenseType | None:
        db = info.context["db"]
        service = ExpenseService(db)
        expense = service.get_expense(int(id))
        return _to_expense_type(expense) if expense else None


@strawberry.type
class ExpenseMutation:
    @strawberry.mutation
    def create_expense(self, info: Info, input: CreateExpenseInput) -> ExpenseType:
        db = info.context["db"]
        service = ExpenseService(db)
        expense = service.create_expense(
            amount=input.amount,
            description=input.description,
            notes=input.notes,
            date=input.date,
            category_id=int(input.category_id),
            is_recurring=input.is_recurring,
            recurrence_rule=input.recurrence_rule.value if input.recurrence_rule else None,
        )
        return _to_expense_type(expense)

    @strawberry.mutation
    def update_expense(
        self, info: Info, id: strawberry.ID, input: UpdateExpenseInput
    ) -> ExpenseType:
        db = info.context["db"]
        service = ExpenseService(db)

        kwargs = {}
        if input.amount is not None:
            kwargs["amount"] = input.amount
        if input.description is not None:
            kwargs["description"] = input.description
        if input.notes is not None:
            kwargs["notes"] = input.notes
        if input.date is not None:
            kwargs["date"] = input.date
        if input.category_id is not None:
            kwargs["category_id"] = int(input.category_id)
        if input.is_recurring is not None:
            kwargs["is_recurring"] = input.is_recurring
        if input.recurrence_rule is not None:
            kwargs["recurrence_rule"] = input.recurrence_rule.value

        expense = service.update_expense(int(id), **kwargs)
        if not expense:
            raise ValueError(f"Expense with id {id} not found")
        return _to_expense_type(expense)

    @strawberry.mutation
    def delete_expense(self, info: Info, id: strawberry.ID) -> bool:
        db = info.context["db"]
        service = ExpenseService(db)
        return service.delete_expense(int(id))


@strawberry.type
class CategoryQuery:
    @strawberry.field
    def categories(self, info: Info) -> list[CategoryType]:
        db = info.context["db"]
        service = CategoryService(db)
        return [_to_category_type(c) for c in service.list_categories()]

    @strawberry.field
    def category(self, info: Info, id: strawberry.ID) -> CategoryType | None:
        db = info.context["db"]
        service = CategoryService(db)
        cat = service.get_category(int(id))
        return _to_category_type(cat) if cat else None


@strawberry.type
class CategoryMutation:
    @strawberry.mutation
    def create_category(
        self, info: Info, name: str, color: str | None = None, icon: str | None = None
    ) -> CategoryType:
        db = info.context["db"]
        service = CategoryService(db)
        kwargs = {"name": name}
        if color is not None:
            kwargs["color"] = color
        if icon is not None:
            kwargs["icon"] = icon
        return _to_category_type(service.create_category(**kwargs))

    @strawberry.mutation
    def update_category(
        self,
        info: Info,
        id: strawberry.ID,
        name: str | None = None,
        color: str | None = None,
        icon: str | None = None,
    ) -> CategoryType:
        db = info.context["db"]
        service = CategoryService(db)
        kwargs = {}
        if name is not None:
            kwargs["name"] = name
        if color is not None:
            kwargs["color"] = color
        if icon is not None:
            kwargs["icon"] = icon
        cat = service.update_category(int(id), **kwargs)
        if not cat:
            raise ValueError(f"Category with id {id} not found")
        return _to_category_type(cat)

    @strawberry.mutation
    def delete_category(self, info: Info, id: strawberry.ID) -> bool:
        db = info.context["db"]
        service = CategoryService(db)
        return service.delete_category(int(id))
