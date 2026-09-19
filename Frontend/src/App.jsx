import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ToastProvider from "./context/ToastProvider";
import Home from "./pages/Home";
import SubmitComplaint from "./pages/SubmitComplaint";
import TrackComplaint from "./pages/TrackComplaint";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";

/* Admin pages are loaded on demand (they pull in the chart library) */
const AdminLayout = lazy(() => import("./components/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ComplaintHistory = lazy(() => import("./pages/ComplaintHistory"));
const Analytics = lazy(() => import("./pages/Analytics"));

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent" />
    </div>
  );
}

function App() {

  return (
    <ToastProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>

            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/submit" element={<SubmitComplaint />} />
              <Route path="/track" element={<TrackComplaint />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="/admin/login" element={<AdminLogin />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="complaints" element={<ComplaintHistory />} />
              <Route path="analytics" element={<Analytics />} />
            </Route>

            {/* Old URLs */}
            <Route path="/history" element={<Navigate to="/admin/complaints" replace />} />
            <Route path="/performance" element={<Navigate to="/admin/analytics" replace />} />

          </Routes>
        </Suspense>
      </Router>
    </ToastProvider>
  );
}

export default App;
