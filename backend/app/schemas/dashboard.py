from pydantic import BaseModel


class DashboardSummary(BaseModel):
    total_employees: int
    total_tasks: int
    completed_tasks: int
    pending_tasks: int
    in_progress_tasks: int