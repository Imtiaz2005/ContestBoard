
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const navItems = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: "▦",
  },
  {
    name: "Contest Management",
    path: "/admin/contests",
    icon: "🏆",
  },
  {
    name: "User Management",
    path: "/admin/users",
    icon: "♙",
  },
  {
    name: "Organizations",
    path: "/admin/organizations",
    icon: "▤",
  },
  {
    name: "Announcements",
    path: "/admin/announcements",
    icon: "⚑",
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      {/* Sidebar */}
      <aside className="w-full shrink-0 border-b border-slate-200 bg-white md:min-h-screen md:w-64 md:border-b-0 md:border-r">
        <div className="border-b border-slate-100 px-6 py-6">
          <p className="text-xl font-bold text-indigo-700">
            ContestBoard
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Administration
          </p>
        </div>

        <nav className="flex gap-1 overflow-x-auto p-3 md:flex-col md:gap-2 md:p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin/dashboard"}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-indigo-700"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-indigo-700"
          >
            ← Back to Website
          </button>
        </div>
      </aside>

      {/* Page content */}
      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Admin Panel
            </p>
            <h1 className="mt-1 text-lg font-bold text-slate-800">
              Platform Management
            </h1>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
            A
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
