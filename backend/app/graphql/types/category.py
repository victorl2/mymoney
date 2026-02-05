import strawberry
from datetime import datetime


@strawberry.type
class CategoryType:
    id: strawberry.ID
    name: str
    color: str
    icon: str | None
    created_at: datetime
