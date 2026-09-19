import { Link } from "react-router-dom";

function Footer() {

  return (
    <footer className="bg-white border-t border-gray-100">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">

        <div className="col-span-2">
          <h3 className="font-bold text-lg text-blue-600">SmartOffice</h3>
          <p className="text-gray-500 text-sm mt-3 max-w-xs">
            Digital-first workplace management. Report, track and resolve office issues in one place.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-gray-900">Complaints</h4>
          <ul className="space-y-2 text-gray-500 text-sm">
            <li><Link to="/submit" className="hover:text-blue-600">Submit a complaint</Link></li>
            <li><Link to="/track" className="hover:text-blue-600">Track a complaint</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-gray-900">Team</h4>
          <ul className="space-y-2 text-gray-500 text-sm">
            <li><Link to="/admin/login" className="hover:text-blue-600">Admin login</Link></li>
            <li><Link to="/admin" className="hover:text-blue-600">Dashboard</Link></li>
          </ul>
        </div>

      </div>

      <div className="border-t border-gray-100 py-5 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} SmartOffice. All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;
