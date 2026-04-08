import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Clock, BarChart3, LogOut } from "lucide-react";
import { useState } from "react";
import Logout from "./Logout";

function Sidebar() {

const location = useLocation();
const [showLogout, setShowLogout] = useState(false);

const user = JSON.parse(localStorage.getItem("user"));

return (

<div className="w-64 bg-white border-r flex flex-col">

<div>

<div className="p-6 border-b">

<h1 className="text-lg font-bold text-gray-800">
ResolvePro
</h1>

<p className="text-xs text-gray-400">
SmartOffice Admin
</p>

</div>

<nav className="p-4 space-y-2">

<Link
to="/admin"
className={`flex items-center gap-3 px-4 py-2 rounded-lg
${location.pathname === "/admin"
? "bg-blue-500 text-white"
: "text-gray-600 hover:bg-gray-100"}
`}
>
<LayoutDashboard size={18} />
Dashboard
</Link>

<Link
to="/history"
className={`flex items-center gap-3 px-4 py-2 rounded-lg
${location.pathname === "/history"
? "bg-blue-500 text-white"
: "text-gray-600 hover:bg-gray-100"}
`}
>
<Clock size={18} />
Complaint History
</Link>

<Link
to="/performance"
className={`flex items-center gap-3 px-4 py-2 rounded-lg
${location.pathname === "/performance"
? "bg-blue-500 text-white"
: "text-gray-600 hover:bg-gray-100"}
`}
>
<BarChart3 size={18} />
Performance
</Link>

<button
onClick={() => setShowLogout(true)}
className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 w-full text-left"
>
<LogOut size={18} />
Logout
</button>

</nav>

</div>

<div className="border-t p-4 mt-auto">

<div className="flex items-center gap-3">

<div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
{user?.email?.charAt(0).toUpperCase() || "U"}
</div>

<div>
<p className="text-sm font-medium text-gray-700">
{user?.email || "User"}
</p>
</div>

</div>

</div>

{showLogout && (
<Logout onClose={() => setShowLogout(false)} />
)}

</div>

);

}

export default Sidebar;