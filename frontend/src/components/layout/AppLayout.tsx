
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50">
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={closeMobileMenu}
      />

      {/* Main Application */}
      <div className="min-h-screen min-w-0 md:pl-64">

        {/* Mobile Navigation Bar */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 md:hidden">

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-100"
          >
            <Menu size={22} />
          </button>

          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Work<span className="text-blue-600">Sync</span>
            </h1>

            <p className="text-[10px] text-slate-400">
              Management Platform
            </p>
          </div>
        </div>

        {/* Existing Header */}
        <Header />

        {/* Page Content */}
        <main className="w-full min-w-0 p-4 sm:p-5 md:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
