import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      {/* Ambient gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-[0.03]"
          style={{
            background: "radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/2 -left-40 w-80 h-80 rounded-full opacity-[0.02]"
          style={{
            background: "radial-gradient(circle, var(--accent-gain) 0%, transparent 70%)",
          }}
        />
      </div>

      <Sidebar />

      <main className="flex-1 min-h-screen overflow-y-auto">
        <div className="p-8 lg:p-10 max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
