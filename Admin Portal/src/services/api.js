import axios from "axios";

const apiVersion = import.meta.env.VITE_API_VERSION || "1";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

export const api = axios.create({
  baseURL: `${apiBaseUrl}`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("ncc_admin_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const normalizeApiError = (error) => {
  const message = error?.response?.data?.message || error?.message || "Request failed";
  const err = new Error(message);
  err.status = error?.response?.status;
  err.responseData = error?.response?.data;
  return err;
};

export const handleApiResponse = (response) => {
  const payload = response?.data;
  if (payload && payload.success === false) {
    throw new Error(payload.message || "Request failed");
  }
  return payload;
};

/** @returns {Promise<{ data: any }>} */
export const mock = (data, delay = 350) =>
  new Promise((resolve) => setTimeout(() => resolve({ data }), delay));
