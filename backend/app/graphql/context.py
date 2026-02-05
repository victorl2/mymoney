from app.database import SessionLocal


async def get_context():
    db = SessionLocal()
    try:
        yield {"db": db}
    finally:
        db.close()
