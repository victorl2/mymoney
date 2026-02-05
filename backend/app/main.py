from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter

from app.config import settings
from app.graphql.context import get_context
from app.graphql.schema import schema
from app.models import Base
from app.database import engine

app = FastAPI(title="MyMoney API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

graphql_router = GraphQLRouter(schema, context_getter=get_context)
app.include_router(graphql_router, prefix="/graphql")


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
