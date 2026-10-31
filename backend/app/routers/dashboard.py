from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.employee import Employee
from app.models.task import Task
from app.schemas.dashboard import DashboardSummary


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(
    db: Session = Depends(get_db),
):
    total_employees = db.scalar(
        select(func.count(Employee.id))
    ) or 0

    total_tasks = db.scalar(
        select(func.count(Task.id))
    ) or 0

    completed_tasks = db.scalar(
        select(func.count(Task.id)).where(
            Task.status == "Completed"
        )
    ) or 0

    pending_tasks = db.scalar(
        select(func.count(Task.id)).where(
            Task.status == "Pending"
        )
    ) or 0

    in_progress_tasks = db.scalar(
        select(func.count(Task.id)).where(
            Task.status == "In Progress"
        )
    ) or 0

    return DashboardSummary(
        total_employees=total_employees,
        total_tasks=total_tasks,
        completed_tasks=completed_tasks,
        pending_tasks=pending_tasks,
        in_progress_tasks=in_progress_tasks,
    )