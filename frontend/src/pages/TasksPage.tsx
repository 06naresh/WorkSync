import { useEffect, useState } from "react";

import {
  Plus,
  Search,
  Trash2,
  X,
  ClipboardList,
} from "lucide-react";

import {
  createTask,
  deleteTask,
  getTasks,
  updateTaskStatus,
} from "../api/taskApi";

import { getEmployees } from "../api/employeeApi";

import type { Employee } from "../types/employee";

import type {
  Task,
  TaskCreate,
  TaskPriority,
  TaskStatus,
} from "../types/task";

import Loading from "../components/ui/Loading";


const initialForm: TaskCreate = {
  title: "",
  description: "",
  priority: "Medium",
  due_date: "",
  employee_id: 0,
};


function priorityClass(priority: TaskPriority) {
  switch (priority) {
    case "High":
      return "bg-red-50 text-red-700";

    case "Medium":
      return "bg-amber-50 text-amber-700";

    default:
      return "bg-emerald-50 text-emerald-700";
  }
}


function statusClass(status: TaskStatus) {
  switch (status) {
    case "Completed":
      return "bg-emerald-50 text-emerald-700";

    case "In Progress":
      return "bg-blue-50 text-blue-700";

    default:
      return "bg-amber-50 text-amber-700";
  }
}


export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    TaskStatus | ""
  >("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<TaskCreate>(initialForm);
  const [saving, setSaving] = useState(false);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTasks({
        search,
        status: statusFilter,
      });

      setTasks(data);
    } catch {
      setError("Unable to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadTasks();
    }, 300);

    return () => window.clearTimeout(timer);
  }, [search, statusFilter]);

  useEffect(() => {
    getEmployees()
      .then(setEmployees)
      .catch(() => setError("Unable to load employees."));
  }, []);

  const handleCreate = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!form.employee_id) {
      setError("Please select an employee.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await createTask(form);

      setForm(initialForm);
      setShowForm(false);

      await loadTasks();
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Unable to create task.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (
    task: Task,
    nextStatus: TaskStatus,
  ) => {
    try {
      await updateTaskStatus(task.id, nextStatus);
      await loadTasks();
    } catch {
      setError("Unable to update task status.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await deleteTask(id);
      await loadTasks();
    } catch {
      setError("Unable to delete task.");
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
            Tasks
          </h1>

          <p className="mt-2 text-slate-500">
            Assign work and monitor task progress.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Create Task
        </button>
      </section>

      <section className="grid gap-3 md:grid-cols-[1fr_220px]">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4">
          <Search size={18} className="text-slate-400" />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search tasks..."
            className="h-12 w-full outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as TaskStatus | "")
          }
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
        >
          <option value="">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </section>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <Loading />
      ) : tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <ClipboardList
            className="mx-auto text-slate-300"
            size={36}
          />

          <h3 className="mt-4 font-semibold text-slate-800">
            No tasks found
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Create a task and assign it to an employee.
          </p>
        </div>
      ) : (
        <section className="space-y-4">
          {tasks.map((task) => (
            <article
              key={task.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-slate-900">
                      {task.title}
                    </h3>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityClass(task.priority)}`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    {task.description || "No description provided."}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                    <span>
                      Assigned to:{" "}
                      <strong className="text-slate-700">
                        {task.employee_name || "Unassigned"}
                      </strong>
                    </span>

                    <span>
                      Due:{" "}
                      <strong className="text-slate-700">
                        {task.due_date}
                      </strong>
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-2 text-xs font-semibold ${statusClass(task.status)}`}
                  >
                    {task.status}
                  </span>

                  <select
                    aria-label={`Update status for ${task.title}`}
                    value={task.status}
                    onChange={(event) =>
                      handleStatusChange(
                        task,
                        event.target.value as TaskStatus,
                      )
                    }
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <button
                    onClick={() => handleDelete(task.id)}
                    aria-label={`Delete ${task.title}`}
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Create Task
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add a task and assign it to an employee.
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                aria-label="Close task form"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Task Title
                </label>

                <input
                  required
                  minLength={2}
                  value={form.title}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      title: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="Build dashboard"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      description: event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="Describe the task..."
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Priority
                  </label>

                  <select
                    value={form.priority}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        priority: event.target.value as TaskPriority,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Due Date
                  </label>

                  <input
                    required
                    type="date"
                    value={form.due_date}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        due_date: event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Assign Employee
                </label>

                <select
                  required
                  value={form.employee_id || ""}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      employee_id: Number(event.target.value),
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
                >
                  <option value="">Select employee</option>

                  {employees.map((employee) => (
                    <option
                      key={employee.id}
                      value={employee.id}
                    >
                      {employee.name} — {employee.department}
                    </option>
                  ))}
                </select>

                {employees.length === 0 && (
                  <p className="mt-2 text-xs text-amber-600">
                    Create an employee before assigning a task.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={saving || employees.length === 0}
                className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "Creating..." : "Create Task"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}