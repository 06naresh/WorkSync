import { useEffect, useState } from "react";

import {
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";

import {
  createEmployee,
  deleteEmployee,
  getEmployees,
} from "../api/employeeApi";

import type {
  Employee,
  EmployeeCreate,
} from "../types/employee";

import Loading from "../components/ui/Loading";


const initialForm: EmployeeCreate = {
  name: "",
  email: "",
  department: "",
};


export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<EmployeeCreate>(initialForm);
  const [saving, setSaving] = useState(false);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getEmployees(search);
      setEmployees(data);
    } catch {
      setError("Unable to load employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadEmployees();
    }, 300);

    return () => window.clearTimeout(timer);
  }, [search]);

  const handleCreate = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      await createEmployee(form);

      setForm(initialForm);
      setShowForm(false);

      await loadEmployees();
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Unable to create employee.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?",
    );

    if (!confirmed) return;

    try {
      await deleteEmployee(id);
      await loadEmployees();
    } catch {
      setError("Unable to delete employee.");
    }
  };

  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-blue-600">
            WORKSPACE
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Employees
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your organization and team members.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Employee
        </button>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4">
          <Search size={19} className="text-slate-400" />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by employee name or email..."
            className="h-12 w-full bg-transparent text-sm outline-none"
          />
        </div>
      </section>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <Loading />
      ) : employees.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Users className="mx-auto text-slate-300" size={36} />

          <h3 className="mt-4 font-semibold text-slate-800">
            No employees found
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Add an employee to get started.
          </p>
        </div>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {employees.map((employee) => (
            <article
              key={employee.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-700">
                  {employee.name.charAt(0).toUpperCase()}
                </div>

                <button
                  onClick={() => handleDelete(employee.id)}
                  aria-label={`Delete ${employee.name}`}
                  className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <h3 className="mt-5 font-bold text-slate-900">
                {employee.name}
              </h3>

              <p className="mt-1 break-all text-sm text-slate-500">
                {employee.email}
              </p>

              <div className="mt-5 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {employee.department}
              </div>
            </article>
          ))}
        </section>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Add Employee
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter the employee details below.
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                aria-label="Close employee form"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Full Name
                </label>

                <input
                  required
                  minLength={2}
                  value={form.name}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      name: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email
                </label>

                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      email: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Department
                </label>

                <input
                  required
                  value={form.department}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      department: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="Engineering"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Create Employee"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}