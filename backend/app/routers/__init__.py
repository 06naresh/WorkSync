from app.routers.employees import router as employees_router
from app.routers.tasks import router as tasks_router
from app.routers.dashboard import router as dashboard_router

__all__ = [
    "employees_router",
    "tasks_router",
    "dashboard_router",
]