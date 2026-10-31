
function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <section className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center shadow-2xl">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-3xl font-bold text-white">
          W
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-white">
          Work<span className="text-blue-400">Sync</span>
        </h1>

        <p className="mt-4 text-slate-400">
          Employee and Task Management Platform
        </p>

        <div className="mt-8 rounded-xl border border-slate-700 bg-slate-800/70 p-4">
          <p className="text-sm font-medium text-emerald-400">
            Frontend initialized successfully!
          </p>

          <p className="mt-2 text-xs text-slate-400">
            React + TypeScript + Tailwind CSS v4
          </p>
        </div>
      </section>
    </main>
  );
}

export default App;
