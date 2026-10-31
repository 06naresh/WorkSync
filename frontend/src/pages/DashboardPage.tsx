import { useEffect, useState } from "react";

import {
  Users,
  ClipboardList,
  CheckCircle2,
  Clock3,
  Activity,
} from "lucide-react";

import { getDashboardSummary } from "../api/dashboardApi";

import type { DashboardSummary } from "../types/dashboard";

import StatCard from "../components/ui/StatCard";
import Loading from "../components/ui/Loading";


export default function DashboardPage() {
  const [summary, setSummary] =
    useState<DashboardSummary | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getDashboardSummary();
        setSummary(data);
      } catch {
        setError("Unable to load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) return <Loading />;

  if (error) {
    return (
      <p className="rounded-xl bg-red-50 p-4 text-red-600">
        {error}
      </p>
    );
  }

  if (!summary) return null;

  const cards = [
    {
      title: "Total Employees",
      value: summary.total_employees,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
      description: "Employees registered in WorkSync",
    },
    {
      title: "Total Tasks",
      value: summary.total_tasks,
      icon: ClipboardList,
      color: "bg-violet-50 text-violet-600",
      description: "Tasks created by your team",
    },
    {
      title: "Completed Tasks",
      value: summary.completed_tasks,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
      description: "Successfully completed tasks",
    },
    {
      title: "Pending Tasks",
      value: summary.pending_tasks,
      icon: Clock3,
      color: "bg-amber-50 text-amber-600",
      description: "Tasks waiting to be started",
    },
  ];

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-medium text-blue-600">
          OVERVIEW
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Monitor your employees and task progress.
        </p>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <Activity className="text-blue-600" />

            <h2 className="font-bold text-slate-900">
              Task Progress
            </h2>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-500">Completed</span>
                <strong>{summary.completed_tasks}</strong>
              </div>

              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-emerald-500"
                  style={{
                    width: `${
                      summary.total_tasks
                        ? (summary.completed_tasks /
                            summary.total_tasks) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-500">In Progress</span>
                <strong>{summary.in_progress_tasks}</strong>
              </div>

              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{
                    width: `${
                      summary.total_tasks
                        ? (summary.in_progress_tasks /
                            summary.total_tasks) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-500">Pending</span>
                <strong>{summary.pending_tasks}</strong>
              </div>

              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-amber-500"
                  style={{
                    width: `${
                      summary.total_tasks
                        ? (summary.pending_tasks /
                            summary.total_tasks) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900 p-6 text-white">
          <p className="text-sm font-medium text-blue-400">
            WORKSPACE STATUS
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            Keep your team moving.
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Create employees, assign tasks, and track progress
            from one centralized workspace.
          </p>

          <div className="mt-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <Users size={20} />
            </div>

            <div>
              <p className="text-sm font-semibold">
                {summary.total_employees} employees
              </p>

              <p className="text-xs text-slate-400">
                Currently registered
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}