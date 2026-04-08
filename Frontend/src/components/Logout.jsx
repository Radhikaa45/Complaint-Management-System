import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Logout({ onClose }) {

const navigate = useNavigate();
const [loggingOut, setLoggingOut] = useState(false);

const handleLogout = () => {

setLoggingOut(true);

setTimeout(() => {
localStorage.clear();
sessionStorage.clear();
navigate("/admin/login", { replace: true });
}, 3000);

};

if (loggingOut) {
return (

<div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">

<div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-400 border-t-transparent mb-6"></div>

<h2 className="text-xl font-semibold mb-2">
Logging you out...
</h2>

<p className="text-gray-500 mb-6 text-center max-w-sm">
Please wait while we securely terminate your session.
</p>

<div className="w-72 bg-gray-200 rounded-full h-3 overflow-hidden">
<div className="bg-blue-500 h-3 animate-pulse w-3/4"></div>
</div>

</div>

);
}

return (

<div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">

<div className="bg-white rounded-xl p-6 w-80 shadow-xl text-center">

<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
⏻
</div>

<h2 className="text-lg font-semibold mb-2">
Log Out?
</h2>

<p className="text-sm text-gray-500 mb-6">
Are you sure you want to log out? You will need to enter your credentials to access your dashboard again.
</p>

<div className="flex gap-3">

<button
onClick={onClose}
className="flex-1 border rounded-lg py-2 text-gray-600 hover:bg-gray-100"
>
Cancel
</button>

<button
onClick={handleLogout}
className="flex-1 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
>
Log Out
</button>

</div>

</div>

</div>

);

}

export default Logout;