import { Link } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="bg-white shadow-md px-12 py-4 flex justify-between items-center">

      {/* Logo */}
      <Link
        to="/"
        className="text-2xl font-bold text-blue-600 tracking-wide"
      >
        SmartOffice
      </Link>

      {/* Menu */}
      <div className="flex items-center gap-10 text-lg font-medium text-gray-700">

        <Link
          to="/"
          className="hover:text-blue-600 transition duration-200"
        >
          Home
        </Link>

        <Link
          to="/submit"
          className="hover:text-blue-600 transition duration-200"
        >
          Submit Complaint
        </Link>

        <Link
          to="/track"
          className="hover:text-blue-600 transition duration-200"
        >
          Track Complaint
        </Link>

        {/* Admin Icon */}
        <Link
          to="/admin/login"
          className="text-gray-700 hover:text-blue-600 text-xl transition"
          title="Admin Login"
        >
          <FaUserShield />
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;