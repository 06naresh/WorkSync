from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class EmployeeCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    department: str = Field(min_length=2, max_length=100)

    @field_validator("name", "department")
    @classmethod
    def trim_text(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("This field cannot be empty.")

        return value


class EmployeeResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    department: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)