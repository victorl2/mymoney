import strawberry
from strawberry.types import Info

from app.graphql.resolvers.expense import (
    CategoryMutation,
    CategoryQuery,
    ExpenseConnection,
    ExpenseMutation,
    ExpenseQuery,
)
from app.graphql.types.category import CategoryType
from app.graphql.types.expense import ExpenseType
from app.graphql.inputs.expense import ExpenseFilter, ExpenseSortField, SortDirection


@strawberry.type
class Query:
    @strawberry.field
    def health(self) -> str:
        return "ok"

    @strawberry.field
    def categories(self, info: Info) -> list[CategoryType]:
        return CategoryQuery().categories(info)

    @strawberry.field
    def category(self, info: Info, id: strawberry.ID) -> CategoryType | None:
        return CategoryQuery().category(info, id)

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
        return ExpenseQuery().expenses(info, filter, sort_by, sort_direction, limit, offset)

    @strawberry.field
    def expense(self, info: Info, id: strawberry.ID) -> ExpenseType | None:
        return ExpenseQuery().expense(info, id)


@strawberry.type
class Mutation:
    @strawberry.mutation
    def create_category(
        self, info: Info, name: str, color: str | None = None, icon: str | None = None
    ) -> CategoryType:
        return CategoryMutation().create_category(info, name, color, icon)

    @strawberry.mutation
    def update_category(
        self,
        info: Info,
        id: strawberry.ID,
        name: str | None = None,
        color: str | None = None,
        icon: str | None = None,
    ) -> CategoryType:
        return CategoryMutation().update_category(info, id, name, color, icon)

    @strawberry.mutation
    def delete_category(self, info: Info, id: strawberry.ID) -> bool:
        return CategoryMutation().delete_category(info, id)

    @strawberry.mutation
    def create_expense(self, info: Info, input: "CreateExpenseInput") -> ExpenseType:
        return ExpenseMutation().create_expense(info, input)

    @strawberry.mutation
    def update_expense(
        self, info: Info, id: strawberry.ID, input: "UpdateExpenseInput"
    ) -> ExpenseType:
        return ExpenseMutation().update_expense(info, id, input)

    @strawberry.mutation
    def delete_expense(self, info: Info, id: strawberry.ID) -> bool:
        return ExpenseMutation().delete_expense(info, id)


from app.graphql.inputs.expense import CreateExpenseInput, UpdateExpenseInput  # noqa: E402

schema = strawberry.Schema(query=Query, mutation=Mutation)
