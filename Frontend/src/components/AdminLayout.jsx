import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import Logout from "./Logout";

function AdminLayout() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">

      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onLogout={() => setShowLogout(true)}
      />

      <div className="flex-1 min-w-0">

        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setMenuOpen(true)} className="text-gray-600" aria-label="Open menu">
            <Menu size={22} />
          </button>
          <span className="font-bold text-gray-800">ResolvePro</span>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </main>

      </div>

      {showLogout && <Logout onClose={() => setShowLogout(false)} />}

    </div>
  );
}

export default AdminLayout;
