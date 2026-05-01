import axios from "axios";

// 🔗 Base API URL from environment
const API = import.meta.env.VITE_API_URL;

// 🛑 Debug (remove later if not needed)
console.log("API URL:", API);

// 🟢 CREATE AXIOS INSTANCE
const api = axios.create({
  baseURL: API,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🟢 ANALYZE COMPLAINT (AI)
export const analyzeComplaint = async (description: string) => {
  try {
    const res = await api.post("/api/ai/analyze", { description });
    return res.data;
  } catch (error: any) {
    console.error(
      "AI Analyze Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 🟢 GET ALL COMPLAINTS
export const getComplaints = async () => {
  try {
    const res = await api.get("/api/complaints");
    return res.data;
  } catch (error: any) {
    console.error(
      "Fetch Complaints Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 🟢 UPDATE COMPLAINT STATUS
export const updateComplaintStatus = async (
  id: string,
  status: string
) => {
  try {
    const res = await api.put(
      `/api/complaints/status/${id}`,
      { status }
    );
    return res.data;
  } catch (error: any) {
    console.error(
      "Update Status Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// 🟢 ADMIN LOGIN
export const adminLogin = async (email: string, password: string) => {
  try {
    const res = await api.post("/api/admin/login", {
      email,
      password,
    });
    return res.data;
  } catch (error: any) {
    console.error(
      "Login Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};