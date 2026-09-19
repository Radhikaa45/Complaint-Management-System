import { NavLink } from "react-router-dom";
import { LayoutDashboard, ListChecks, BarChart3, LogOut, ShieldCheck, X, ExternalLink } from "lucide-react";
import { getUser } from "../api";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/complaints", label: "Complaints", icon: ListChecks },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 }
];

function Sidebar({ open, onClose, onLogout }) {

  const user = getUser();

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >

        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-800 leading-tight">ResolvePro</h1>
              <p className="text-xs text-gray-400">SmartOffice Admin</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-600" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="p-3 space-y-1 flex-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition
                ${isActive ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            <ExternalLink size={18} />
            View Public Site
          </a>
        </nav>

        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold shrink-0">
              {user?.email?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-700 truncate">{user?.email || "Admin"}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
            <button
              onClick={onLogout}
              className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50"
              title="Log out"
              aria-label="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

      </aside>
    </>
  );
}

export default Sidebar;
