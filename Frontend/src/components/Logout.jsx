import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { clearSession } from "../api";

function Logout({ onClose }) {

  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      clearSession();
      navigate("/admin/login", { replace: true });
    }, 700);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-4" onClick={onClose}>

      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center" onClick={(e) => e.stopPropagation()}>

        {loggingOut ? (
          <div className="py-4">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mx-auto mb-4" />
            <h2 className="text-lg font-semibold">Logging you out...</h2>
            <p className="text-sm text-gray-500 mt-1">Securely ending your session.</p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <LogOut size={22} />
            </div>

            <h2 className="text-lg font-semibold mb-2">Log Out?</h2>

            <p className="text-sm text-gray-500 mb-6">
              You will need to enter your credentials to access the dashboard again.
            </p>

            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 border border-gray-200 rounded-lg py-2 text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleLogout} className="flex-1 bg-rose-600 text-white rounded-lg py-2 hover:bg-rose-700">
                Log Out
              </button>
            </div>
          </>
        )}

      </div>

    </div>
  );
}

export default Logout;
