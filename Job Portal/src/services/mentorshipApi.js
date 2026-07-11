import { api } from "./api";

/** 
 * GET /student/all-mentor — Fetch all available mentors 
 * Note: Sends query data in GET body to match backend requirements.
 */
export async function getAllMentors(jobId = null) {
  const payload = {};
  if (jobId) payload.jobId = jobId;
  
  const res = await api.request({
    method: "GET",
    url: "/student/all-mentor",
    data: payload,
  });
  
  if (!res.data?.success) {
    throw new Error(res.data?.message || "Failed to fetch mentors");
  }
  return res.data.data;
}

/** POST /student/mentorship — Request mentorship with a specific teacher */
export async function requestMentorship({ teacherId, note }) {
  const res = await api.post("/student/mentorship", { teacherId, note });
  if (!res.data?.success) {
    throw new Error(res.data?.message || "Failed to request mentorship");
  }
  return res.data;
}
