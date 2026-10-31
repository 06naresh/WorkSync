
from datetime import datetime

from sqlalchemy import String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Employee(Base):

    __tablename__ = "employees"

    # Primary Key
    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    # Employee Name
    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    # Employee Email
    email: Mapped[str] = mapped_column(
        String(150),
        unique=True,
        index=True,
        nullable=False,
    )

    # Employee Department
    department: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    # Record Creation Timestamp
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # Relationship with Task Model
    tasks: Mapped[list["Task"]] = relationship(
        back_populates="employee",
        passive_deletes=True,
    )

    def __repr__(self):
        return (
            f"Employee(id={self.id}, "
            f"name='{self.name}', "
            f"email='{self.email}')"
        )
