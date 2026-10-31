from datetime import date, datetime
from typing import Literal

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    PositiveInt,
    field_validator,
    model_validator,
)


TaskPriority = Literal["Low", "Medium", "High"]

TaskStatus = Literal[
    "Pending",
    "In Progress",
    "Completed",
]


class TaskCreate(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    description: str | None = None
    priority: TaskPriority = "Medium"
    due_date: date
    employee_id: PositiveInt

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Task title cannot be empty.")

        return value

    @field_validator("description")
    @classmethod
    def clean_description(cls, value: str | None) -> str | None:
        if value is None:
            return None

        value = value.strip()
        return value or None


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=200)
    description: str | None = None
    priority: TaskPriority | None = None
    due_date: date | None = None
    employee_id: PositiveInt | None = None

    @model_validator(mode="after")
    def validate_update(self):
        if not self.model_fields_set:
            raise ValueError("Provide at least one field to update.")

        return self

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str | None) -> str | None:
        if value is None:
            return None

        value = value.strip()

        if not value:
            raise ValueError("Task title cannot be empty.")

        return value


class TaskStatusUpdate(BaseModel):
    status: TaskStatus


class TaskResponse(BaseModel):
    id: int
    title: str
    description: str | None
    priority: TaskPriority
    due_date: date
    status: TaskStatus
    employee_id: int | None
    employee_name: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)