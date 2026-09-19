import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/submit", label: "Submit Complaint" },
  { to: "/track", label: "Track Complaint" }
];

const linkClass = ({ isActive }) =>
  `transition duration-200 ${isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`;

function Navbar() {

  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600 tracking-wide" onClick={() => setOpen(false)}>
          SmartOffice
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}

          <Link
            to="/admin/login"
            className="flex items-center gap-2 text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 hover:border-blue-500 hover:text-blue-600 transition"
            title="Admin Login"
          >
            <FaUserShield /> Admin
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-gray-700" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 px-4 py-3 space-y-1 bg-white">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg font-medium ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-700"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/admin/login"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-gray-700"
          >
            <FaUserShield /> Admin Login
          </Link>
        </div>
      )}

    </nav>
  );
}

export default Navbar;
