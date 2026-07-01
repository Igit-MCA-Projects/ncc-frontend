// Mock API service. Swap baseURL + uncomment axios calls when backend is ready.
import axios from "axios";
import jobs from "../data/jobs";
import profile from "../data/profile";
import savedJobs from "../data/savedJobs";

export const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export async function login({ email, password }) {
  await delay();
  if (!email || !password) throw new Error("Email and password required");
  return { token: "mock-jwt-token", user: { ...profile, email } };
}

export async function register(payload) {
  await delay(600);
  return { token: "mock-jwt-token", user: { ...profile, ...payload } };
}

export async function getJobs() {
  await delay();
  return jobs;
}

export async function getJob(id) {
  await delay(250);
  return jobs.find((j) => j.id === String(id));
}

export async function getProfile() {
  await delay(200);
  return profile;
}

export async function updateProfile(patch) {
  await delay(300);
  return { ...profile, ...patch };
}

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
