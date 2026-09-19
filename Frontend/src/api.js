import axios from "axios";

// 🔗 Base API URL from environment (falls back to the local backend in dev)
export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

export const uploadUrl = (file) => `${API_URL}/uploads/${encodeURIComponent(file)}`;

const api = axios.create({ baseURL: API_URL });

/* ---------- auth helpers ---------- */

export const getToken = () => localStorage.getItem("token");

export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export const saveSession = (token, user) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Token is a JWT; treat it as invalid once its exp has passed
export const isLoggedIn = () => {
  const token = getToken();
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return !payload.exp || payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

// 🟢 Attach the admin token to every request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 🔒 Session expired → back to login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const url = error.config?.url || "";
    if (error.response?.status === 401 && !url.includes("/admin/login")) {
      clearSession();
      if (!window.location.pathname.startsWith("/admin/login")) {
        window.location.assign("/admin/login?expired=1");
      }
    }
    return Promise.reject(error);
  }
);

export const errorMessage = (error, fallback = "Something went wrong") => {
  if (!error.response) return "Cannot reach the server. Please check your connection.";
  return error.response.data?.message || error.response.data?.error || fallback;
};

/* ---------- public ---------- */

export const submitComplaint = (formData) =>
  api.post("/api/complaints/submit", formData).then((r) => r.data);

export const trackComplaint = (id) =>
  api.get(`/api/complaints/track/${encodeURIComponent(id.trim())}`).then((r) => r.data);

export const sendFeedback = (id, rating, comment) =>
  api.post(`/api/complaints/feedback/${encodeURIComponent(id)}`, { rating, comment }).then((r) => r.data);

export const getPublicStats = () =>
  api.get("/api/complaints/public-stats").then((r) => r.data);

export const analyzeComplaint = (description) =>
  api.post("/api/ai/analyze", { description }).then((r) => r.data);

/* ---------- admin ---------- */

export const adminLogin = (email, password) =>
  api.post("/api/admin/login", { email, password }).then((r) => r.data);

export const getComplaints = (params) =>
  api.get("/api/complaints", { params }).then((r) => r.data);

export const updateComplaintStatus = (id, body) =>
  api.put(`/api/complaints/status/${id}`, body).then((r) => r.data);

export const deleteComplaint = (id) =>
  api.delete(`/api/complaints/${id}`).then((r) => r.data);

export default api;
