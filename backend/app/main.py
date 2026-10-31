from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.database.base import Base
from app.database.session import engine

from app import models
from app.routers import (
    employees_router,
    tasks_router,
    dashboard_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)

    print("WorkSync database tables initialized.")

    yield

    print("WorkSync API shutting down.")


app = FastAPI(
    title=settings.APP_NAME,
    description="Employee and Task Management API",
    version=settings.APP_VERSION,
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://worksync-frontend-hhxylhlap-naresh-dev1.vercel.app",
        "https://worksync-frontend.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    employees_router,
    prefix="/api",
)

app.include_router(
    tasks_router,
    prefix="/api",
)

app.include_router(
    dashboard_router,
    prefix="/api",
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
    }