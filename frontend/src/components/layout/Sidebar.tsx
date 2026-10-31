import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  ClipboardList,
  BriefcaseBusiness,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Employees",
    path: "/employees",
    icon: Users,
  },
  {
    name: "Tasks",
    path: "/tasks",
    icon: ClipboardList,
  },
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white md:flex">
      <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
          W
        </div>

        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Work<span className="text-blue-600">Sync</span>
          </h1>

          <p className="text-xs text-slate-400">
            Management Platform
          </p>
        </div>
      </div>

      <div className="px-4 py-7">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Workspace
        </p>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                <Icon size={19} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4">
        <div className="rounded-2xl bg-slate-900 p-4 text-white">
          <BriefcaseBusiness size={22} className="mb-3 text-blue-400" />

          <p className="text-sm font-semibold">
            Work smarter
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            Manage your team and keep projects moving.
          </p>
        </div>
      </div>
    </aside>
  );
}