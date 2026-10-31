
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Application configuration
from app.core.config import settings

# Database configuration
from app.database.base import Base
from app.database.session import engine

# Import models to register them with SQLAlchemy
from app import models


@asynccontextmanager
async def lifespan(app: FastAPI):

    # Create database tables if they do not exist.
    Base.metadata.create_all(bind=engine)

    print("WorkSync database tables initialized.")

    yield

    # Application shutdown logic can go here.
    print("WorkSync API shutting down.")


app = FastAPI(
    title=settings.APP_NAME,
    description="Employee and Task Management API",
    version=settings.APP_VERSION,
    lifespan=lifespan,
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():

    return {
        "message": "Welcome to WorkSync API",
        "status": "running",
        "version": app.version,
    }


@app.get("/health")
def health_check():

    return {
        "status": "healthy",
        "application": "WorkSync",
        "database": "configured",
    }
