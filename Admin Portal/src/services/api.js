import axios from "axios";

// Axios instance (backend to be wired later).
export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("ncc_admin_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** @returns {Promise<{ data: any }>} */
export const mock = (data, delay = 350) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), delay));
