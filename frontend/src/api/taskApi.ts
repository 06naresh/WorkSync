import api from "./axios";

import type {
  Task,
  TaskCreate,
  TaskStatus,
  TaskUpdate,
} from "../types/task";

interface TaskFilters {
  search?: string;
  status?: TaskStatus | "";
  priority?: string;
}

export const getTasks = async (
  filters: TaskFilters = {},
): Promise<Task[]> => {
  const response = await api.get<Task[]>("/tasks", {
    params: {
      search: filters.search || undefined,
      status: filters.status || undefined,
      priority: filters.priority || undefined,
    },
  });

  return response.data;
};

export const createTask = async (
  task: TaskCreate,
): Promise<Task> => {
  const response = await api.post<Task>("/tasks", task);

  return response.data;
};

export const updateTask = async (
  id: number,
  task: TaskUpdate,
): Promise<Task> => {
  const response = await api.put<Task>(
    `/tasks/${id}`,
    task,
  );

  return response.data;
};

export const updateTaskStatus = async (
  id: number,
  status: TaskStatus,
): Promise<Task> => {
  const response = await api.patch<Task>(
    `/tasks/${id}/status`,
    { status },
  );

  return response.data;
};

export const deleteTask = async (
  id: number,
): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};