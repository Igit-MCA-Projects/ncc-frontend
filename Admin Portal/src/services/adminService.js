import { mock } from "./api";
import students from "@/data/students.json";
import companies from "@/data/companies.json";
import jobs from "@/data/jobs.json";
import subAdmins from "@/data/subAdmins.json";
import profile from "@/data/profile.json";
import notifications from "@/data/notifications.json";

// In-memory clones so mock mutations persist across page navigations.
const state = {
  students: JSON.parse(JSON.stringify(students)),
  companies: JSON.parse(JSON.stringify(companies)),
  jobs: JSON.parse(JSON.stringify(jobs)),
  subAdmins: JSON.parse(JSON.stringify(subAdmins)),
  profile: JSON.parse(JSON.stringify(profile)),
  notifications: JSON.parse(JSON.stringify(notifications)),
};

// AUTH
export const loginAdmin = async ({ email, password }) => {
  if (!email || !password) throw new Error("Email and password are required");
  return mock({ token: "mock-jwt-token", user: state.profile });
};

// STUDENTS
export const getStudents = () => mock(state.students);
export const getStudent = (id) =>
  mock(state.students.find((s) => s.id === id) || null);
export const blockStudent = (id) => {
  const s = state.students.find((x) => x.id === id);
  if (s) s.status = "blocked";
  return mock(s);
};
export const unblockStudent = (id) => {
  const s = state.students.find((x) => x.id === id);
  if (s) s.status = "active";
  return mock(s);
};

// COMPANIES
export const getCompanies = () => mock(state.companies);
export const getCompany = (id) => {
  const company = state.companies.find((c) => c.id === id) || null;
  const companyJobs = state.jobs.filter((j) => j.companyId === id);
  return mock(company ? { ...company, jobs: companyJobs } : null);
};
export const blockCompany = (id) => {
  const c = state.companies.find((x) => x.id === id);
  if (c) c.status = "blocked";
  return mock(c);
};
export const unblockCompany = (id) => {
  const c = state.companies.find((x) => x.id === id);
  if (c) c.status = "active";
  return mock(c);
};

// JOBS
export const getJobs = () => mock(state.jobs);
export const getPendingJobs = () =>
  mock(state.jobs.filter((j) => j.status === "pending"));
export const approveJob = (id) => {
  const j = state.jobs.find((x) => x.id === id);
  if (j) j.status = "approved";
  return mock(j);
};
export const rejectJob = (id) => {
  const j = state.jobs.find((x) => x.id === id);
  if (j) j.status = "rejected";
  return mock(j);
};

// SUB ADMINS
export const getSubAdmins = () => mock(state.subAdmins);
export const createSubAdmin = (payload) => {
  const newAdmin = {
    id: `sa${Date.now()}`,
    status: "active",
    photo: `https://i.pravatar.cc/100?u=${encodeURIComponent(payload.email)}`,
    ...payload,
  };
  state.subAdmins.unshift(newAdmin);
  return mock(newAdmin);
};
export const deleteSubAdmin = (id) => {
  state.subAdmins = state.subAdmins.filter((s) => s.id !== id);
  return mock({ success: true });
};

// PROFILE
export const getProfile = () => mock(state.profile);
export const updateProfile = (payload) => {
  state.profile = { ...state.profile, ...payload };
  return mock(state.profile);
};

// NOTIFICATIONS
export const getNotifications = () => mock(state.notifications);
