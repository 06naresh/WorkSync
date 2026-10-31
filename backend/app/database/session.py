
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings


# Create the PostgreSQL database engine.
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    echo=False,
)


# Create a reusable session factory.
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)


def get_db():
    """
    Provide a database session to FastAPI endpoints.

    The session is automatically closed
    after the request is completed.
    """

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()
