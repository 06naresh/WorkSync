export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  created_at: string;
}

export interface EmployeeCreate {
  name: string;
  email: string;
  department: string;
}