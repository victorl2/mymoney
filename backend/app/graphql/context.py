from starlette.requests import Request

from app.database import SessionLocal


def get_context(request: Request) -> dict:
    db = SessionLocal()
    return {"db": db, "request": request}
