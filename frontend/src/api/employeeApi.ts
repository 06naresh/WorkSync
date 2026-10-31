import api from "./axios";

import type {
  Employee,
  EmployeeCreate,
} from "../types/employee";

export const getEmployees = async (
  search = "",
): Promise<Employee[]> => {
  const response = await api.get<Employee[]>("/employees", {
    params: search ? { search } : {},
  });

  return response.data;
};

export const createEmployee = async (
  employee: EmployeeCreate,
): Promise<Employee> => {
  const response = await api.post<Employee>(
    "/employees",
    employee,
  );

  return response.data;
};

export const deleteEmployee = async (
  id: number,
): Promise<void> => {
  await api.delete(`/employees/${id}`);
};