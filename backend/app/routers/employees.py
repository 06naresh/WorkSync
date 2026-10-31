from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate, EmployeeResponse


router = APIRouter(
    prefix="/employees",
    tags=["Employees"],
)


@router.post(
    "",
    response_model=EmployeeResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_employee(
    employee_data: EmployeeCreate,
    db: Session = Depends(get_db),
):
    existing_employee = db.scalar(
        select(Employee).where(
            Employee.email == employee_data.email
        )
    )

    if existing_employee:
        raise HTTPException(
            status_code=409,
            detail="An employee with this email already exists.",
        )

    employee = Employee(
        name=employee_data.name,
        email=str(employee_data.email).lower(),
        department=employee_data.department,
    )

    db.add(employee)

    try:
        db.commit()
        db.refresh(employee)
    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=409,
            detail="Employee email already exists.",
        )

    return employee


@router.get("", response_model=list[EmployeeResponse])
def get_employees(
    search: str | None = Query(default=None),
    department: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    query = select(Employee)

    if search:
        search_term = f"%{search.strip()}%"

        query = query.where(
            or_(
                Employee.name.ilike(search_term),
                Employee.email.ilike(search_term),
            )
        )

    if department:
        query = query.where(
            Employee.department.ilike(department.strip())
        )

    query = query.order_by(Employee.id.desc())

    return db.scalars(query).all()


@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee(
    employee_id: int,
    db: Session = Depends(get_db),
):
    employee = db.get(Employee, employee_id)

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found.",
        )

    return employee


@router.delete("/{employee_id}")
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
):
    employee = db.get(Employee, employee_id)

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found.",
        )

    db.delete(employee)
    db.commit()

    return {
        "message": "Employee deleted successfully.",
        "employee_id": employee_id,
    }