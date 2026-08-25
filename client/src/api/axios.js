import axios from "axios";

// Set VITE_API_URL in your Vercel frontend project's env vars, e.g.
// https://your-backend.vercel.app  (no trailing slash)
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({ baseURL: `${baseURL}/api` });

// Attach the admin token (if present) to every request. Public/user requests
// simply won't have a token and the backend won't require one for those routes.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the admin token is invalid/expired, clear it so the UI drops back to the login screen.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401 && localStorage.getItem("adminToken")) {
      localStorage.removeItem("adminToken");
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
