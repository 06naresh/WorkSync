export type TaskPriority = "Low" | "Medium" | "High";

export type TaskStatus =
  | "Pending"
  | "In Progress"
  | "Completed";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: TaskPriority;
  due_date: string;
  status: TaskStatus;
  employee_id: number | null;
  employee_name: string | null;
  created_at: string;
}

export interface TaskCreate {
  title: string;
  description: string;
  priority: TaskPriority;
  due_date: string;
  employee_id: number;
}

export interface TaskUpdate {
  title?: string;
  description?: string | null;
  priority?: TaskPriority;
  due_date?: string;
  employee_id?: number | null;
}