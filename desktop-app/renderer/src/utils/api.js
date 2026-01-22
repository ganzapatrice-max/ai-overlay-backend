import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-overlay-backend-j5m7.onrender.com/api",
  timeout: 20000, // increased to 20 seconds for slow wake-ups
});

// ============================
// Attach JWT automatically
// ============================
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
      console.log("🔐 Token attached to request");
    } else {
      console.warn("⚠️ No token found in localStorage");
    }

    return req;
  },
  (error) => Promise.reject(error)
);

// ============================
// Global response error handler
// ============================
API.interceptors.response.use(
  (res) => res,
  (err) => {
    // Server not reachable
    if (!err.response) {
      console.error("❌ Backend not responding:", err.message);
      throw new Error("Server not responding. Backend may be asleep.");
    }

    // Auth problems
    if (err.response.status === 401) {
      console.error("🔒 Unauthorized: Token missing or invalid");
      throw new Error("Unauthorized. Please login again.");
    }

    if (err.response.status === 403) {
      console.error("⛔ Forbidden: Admin access only");
      throw new Error("Access denied. Admin only.");
    }

    console.error("❌ API Error:", err.response.data);
    throw err;
  }
);

// ============================
// AUTH
// ============================
export const signup = (data) => API.post("/auth/signup", data);
export const login = (data) => API.post("/auth/login", data);

// ============================
// AI
// ============================
export const askAI = (prompt) => API.post("/ai/ask", { prompt });

// ============================
// ADMIN
// ============================
export const getUsers = () => API.get("/admin/users");
export const approveUser = (id) => API.put(`/admin/approve/${id}`);
export const deactivateUser = (id) => API.put(`/admin/deactivate/${id}`);
export const deleteUser = (id) => API.delete(`/admin/delete/${id}`);

export default API;