import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn, clearSession } from "../api";

function ProtectedRoute({ children }) {

  const location = useLocation();

  if (!isLoggedIn()) {
    clearSession();
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute;
