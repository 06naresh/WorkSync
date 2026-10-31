
from datetime import date, datetime

from sqlalchemy import (
    CheckConstraint,
    Date,
    DateTime,
    ForeignKey,
    String,
    Text,
    func,
    text,
)

from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class Task(Base):

    __tablename__ = "tasks"

    __table_args__ = (
        CheckConstraint(
            "priority IN ('Low', 'Medium', 'High')",
            name="ck_tasks_priority",
        ),
        CheckConstraint(
            "status IN ('Pending', 'In Progress', 'Completed')",
            name="ck_tasks_status",
        ),
    )

    # Primary Key
    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    # Task Title
    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    # Task Description
    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # Task Priority
    priority: Mapped[str] = mapped_column(
        String(20),
        default="Medium",
        server_default=text("'Medium'"),
        nullable=False,
    )

    # Task Due Date
    due_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    # Task Status
    status: Mapped[str] = mapped_column(
        String(20),
        default="Pending",
        server_default=text("'Pending'"),
        nullable=False,
    )

    # Foreign Key
    employee_id: Mapped[int | None] = mapped_column(
        ForeignKey(
            "employees.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )

    # Record Creation Timestamp
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    # Relationship with Employee Model
    employee: Mapped["Employee | None"] = relationship(
        back_populates="tasks",
    )

    def __repr__(self):
        return (
            f"Task(id={self.id}, "
            f"title='{self.title}', "
            f"status='{self.status}')"
        )
