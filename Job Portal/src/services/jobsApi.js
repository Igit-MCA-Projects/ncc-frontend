import { api } from "./api";

/** GET /public/jobs — Fetch all public job listings */
export async function getPublicJobs() {
  const res = await api.get("/public/jobs");
  if (!res.data?.success) throw new Error(res.data?.message || "Failed to fetch jobs");
  return res.data.data;
}

/** GET /student/save-job — Retrieve saved jobs for current student */
export async function getSavedJobs() {
  const res = await api.get("/student/save-job");
  if (!res.data?.success) throw new Error(res.data?.message || "Failed to fetch saved jobs");
  return res.data.data; // Note: returns { savedJobs, pagination }
}

/** POST /student/save-job — Bookmark a job */
export async function saveJob(jobId) {
  const res = await api.post("/student/save-job", { jobId });
  if (!res.data?.success) throw new Error(res.data?.message || "Failed to save job");
  return res.data.data; // returns the created savedJob record (containing its id)
}

/** DELETE /student/save-job — Remove bookmark by savedJobId (id query param) and jobId (body) */
export async function deleteSavedJob(savedJobId, jobId) {
  const res = await api.delete(`/student/save-job?id=${savedJobId}`, {
    data: { jobId },
  });
  if (!res.data?.success) throw new Error(res.data?.message || "Failed to remove saved job");
  return res.data;
}
