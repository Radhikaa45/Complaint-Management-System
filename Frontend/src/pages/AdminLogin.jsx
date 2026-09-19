import { useState } from "react";
import { Navigate, useLocation, useNavigate, useSearchParams, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Loader2, ShieldCheck } from "lucide-react";
import { adminLogin, saveSession, isLoggedIn, errorMessage } from "../api";

function AdminLogin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [params] = useSearchParams();
  const [error, setError] = useState(params.get("expired") ? "Your session expired. Please sign in again." : "");
  const navigate = useNavigate();
  const location = useLocation();

  if (isLoggedIn()) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password");
      return;
    }

    setLoading(true);

    try {
      const res = await adminLogin(email.trim(), password);
      saveSession(res.token, res.admin || { email });
      navigate(location.state?.from || "/admin", { replace: true });
    } catch (err) {
      setError(errorMessage(err, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white to-blue-200" />
      <div className="absolute w-96 h-96 bg-blue-300 rounded-full blur-3xl opacity-20 top-10 left-10" />
      <div className="absolute w-96 h-96 bg-indigo-300 rounded-full blur-3xl opacity-20 bottom-10 right-10" />

      <div className="relative bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl flex overflow-hidden w-full max-w-4xl">

        {/* LEFT PANEL */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10 flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xl font-bold mb-10">
              <ShieldCheck /> SmartOffice
            </div>
            <h1 className="text-3xl font-bold leading-snug">Elevate your workspace management.</h1>
            <p className="mt-4 text-blue-100">
              Triage, track and resolve every complaint from one dashboard - with AI doing the sorting for you.
            </p>
          </div>
          <div className="text-sm text-blue-200 mt-10">Authorised personnel only</div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full md:w-1/2 p-8 sm:p-10">

          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 text-sm mb-8">Please enter your admin credentials to continue.</p>

          {error && (
            <div className="mb-5 text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-lg px-4 py-3" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">

            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                placeholder="admin@smartoffice.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input mt-1.5"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative mt-1.5">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button disabled={loading} className="btn-primary w-full py-3">
              {loading ? <><Loader2 size={18} className="animate-spin" /> Signing in...</> : "Sign In to Dashboard →"}
            </button>

          </form>

          <div className="text-center text-sm text-gray-500 mt-6">
            <Link to="/" className="hover:text-blue-600">← Back to Homepage</Link>
          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;
