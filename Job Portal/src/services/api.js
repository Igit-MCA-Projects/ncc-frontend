/**
 * api.js
 * General-purpose axios instance for non-auth API calls (jobs, profile, etc.)
 * Auth calls are handled by services/authApi.js
 */
import axios from "axios";
import jobs from "../data/jobs";
import savedJobs from "../data/savedJobs";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 10000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

// ─── Jobs (mock until backend is ready) ─────────────────────────────────────

export async function getJobs() {
  await delay();
  return jobs;
}

export async function getJob(id) {
  await delay(250);
  return jobs.find((j) => j.id === String(id));
}

// ─── Profile (real backend) ──────────────────────────────────────────────────

/** GET /student/profile — returns the full profile envelope */
export async function getStudentProfile() {
  const res = await api.get("/student/profile");
  if (!res.data?.success) throw new Error(res.data?.message || "Failed to load profile");
  return res.data.data; // the profile object (or null when not complete)
}

/** POST /student/profile — submit / complete the profile */
export async function completeStudentProfile(payload) {
  const res = await api.post("/student/profile", payload);
  if (!res.data?.success) throw new Error(res.data?.message || "Failed to save profile");
  return res.data;
}

/** PUT /student/profile — partial update of the profile */
export async function updateStudentProfile(payload) {
  const res = await api.put("/student/profile", payload);
  if (!res.data?.success) throw new Error(res.data?.message || "Failed to update profile");
  return res.data;
}

// ─── Saved Jobs ──────────────────────────────────────────────────────────────

export async function getSavedJobs() {
  await delay(200);
  const ids = JSON.parse(localStorage.getItem("ncc.savedJobs") || JSON.stringify(savedJobs));
  return jobs.filter((j) => ids.includes(j.id));
}

export function toggleSavedJob(id) {
  const ids = JSON.parse(localStorage.getItem("ncc.savedJobs") || JSON.stringify(savedJobs));
  const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
  localStorage.setItem("ncc.savedJobs", JSON.stringify(next));
  return next;
}

export function isSaved(id) {
  const ids = JSON.parse(localStorage.getItem("ncc.savedJobs") || JSON.stringify(savedJobs));
  return ids.includes(id);
}
