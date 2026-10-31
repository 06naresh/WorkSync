import { Bell, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur md:px-8">
      <div>
        <p className="text-sm font-medium text-slate-400">
          Workspace
        </p>

        <h2 className="text-lg font-bold text-slate-900">
          Employee Management
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-400 sm:flex">
          <Search size={16} />
          <span>WorkSync</span>
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50"
        >
          <Bell size={19} />
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
          WS
        </div>
      </div>
    </header>
  );
}