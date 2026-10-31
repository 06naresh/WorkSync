from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.database.session import get_db
from app.models.employee import Employee
from app.models.task import Task
from app.schemas.task import (
    TaskCreate,
    TaskUpdate,
    TaskStatusUpdate,
    TaskResponse,
)


router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"],
)


def serialize_task(task: Task) -> TaskResponse:
    response = TaskResponse.model_validate(task)

    return response.model_copy(
        update={
            "employee_name": (
                task.employee.name if task.employee else None
            )
        }
    )


@router.post(
    "",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_task(
    task_data: TaskCreate,
    db: Session = Depends(get_db),
):
    employee = db.get(Employee, task_data.employee_id)

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Assigned employee not found.",
        )

    task = Task(
        title=task_data.title,
        description=task_data.description,
        priority=task_data.priority,
        due_date=task_data.due_date,
        employee_id=task_data.employee_id,
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return serialize_task(task)


@router.get("", response_model=list[TaskResponse])
def get_tasks(
    search: str | None = Query(default=None),
    task_status: str | None = Query(default=None, alias="status"),
    priority: str | None = Query(default=None),
    employee_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
):
    query = (
        select(Task)
        .options(joinedload(Task.employee))
    )

    if search:
        query = query.where(
            Task.title.ilike(f"%{search.strip()}%")
        )

    if task_status:
        allowed_statuses = {
            "Pending",
            "In Progress",
            "Completed",
        }

        if task_status not in allowed_statuses:
            raise HTTPException(
                status_code=422,
                detail="Invalid task status.",
            )

        query = query.where(Task.status == task_status)

    if priority:
        allowed_priorities = {"Low", "Medium", "High"}

        if priority not in allowed_priorities:
            raise HTTPException(
                status_code=422,
                detail="Invalid task priority.",
            )

        query = query.where(Task.priority == priority)

    if employee_id is not None:
        query = query.where(Task.employee_id == employee_id)

    query = query.order_by(Task.id.desc())

    tasks = db.scalars(query).unique().all()

    return [serialize_task(task) for task in tasks]


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: int,
    db: Session = Depends(get_db),
):
    task = db.scalar(
        select(Task)
        .options(joinedload(Task.employee))
        .where(Task.id == task_id)
    )

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found.",
        )

    return serialize_task(task)


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    db: Session = Depends(get_db),
):
    task = db.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found.",
        )

    update_data = task_data.model_dump(exclude_unset=True)

    if "employee_id" in update_data:
        employee_id = update_data["employee_id"]

        if employee_id is not None and not db.get(Employee, employee_id):
            raise HTTPException(
                status_code=404,
                detail="Assigned employee not found.",
            )

    for field, value in update_data.items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)

    # Load the employee relationship for the response.
    task = db.scalar(
        select(Task)
        .options(joinedload(Task.employee))
        .where(Task.id == task_id)
    )

    return serialize_task(task)


@router.patch("/{task_id}/status", response_model=TaskResponse)
def update_task_status(
    task_id: int,
    status_data: TaskStatusUpdate,
    db: Session = Depends(get_db),
):
    task = db.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found.",
        )

    task.status = status_data.status

    db.commit()
    db.refresh(task)

    task = db.scalar(
        select(Task)
        .options(joinedload(Task.employee))
        .where(Task.id == task_id)
    )

    return serialize_task(task)


@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
):
    task = db.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found.",
        )

    db.delete(task)
    db.commit()

    return {
        "message": "Task deleted successfully.",
        "task_id": task_id,
    }