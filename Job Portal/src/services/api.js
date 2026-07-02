/**
 * api.js
 * General-purpose axios instance for non-auth API calls (jobs, profile, etc.)
 * Auth calls are handled by services/authApi.js
 */
import axios from "axios";
import { BASE_URL } from "../context/baseapi";
import jobs from "../data/jobs";
import profile from "../data/profile";
import savedJobs from "../data/savedJobs";

export const api = axios.create({
  baseURL: "/api/v1",
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

// ─── Profile (mock until backend is ready) ───────────────────────────────────

export async function getProfile() {
  await delay(200);
  return profile;
}

export async function updateProfile(patch) {
  await delay(300);
  return { ...profile, ...patch };
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
