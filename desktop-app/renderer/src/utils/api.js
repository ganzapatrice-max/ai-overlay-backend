import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-overlay-backend-j5m7.onrender.com/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// AUTH
export const signup = (data) => API.post("/auth/signup", data);
export const login = (data) => API.post("/auth/login", data);

// AI
export const askAI = (prompt) => API.post("/ai/ask", { prompt });

// ADMIN
export const getUsers = () => API.get("/admin/users");
export const approveUser = (id) => API.put(`/admin/approve/${id}`);
export const deactivateUser = (id) => API.put(`/admin/deactivate/${id}`);
export const deleteUser = (id) => API.delete(`/admin/delete/${id}`);

export default API;
