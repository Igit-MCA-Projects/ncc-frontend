/**
 * nccProfileApi.js
 * API functions for the NCC Profile resource.
 * Endpoint base: GET/POST/PUT /api/v1/student/ncc-profile
 */
import { api } from "./api";

/** Extract a human-readable error from the API response envelope. */
function extractError(error) {
  const data = error?.response?.data;
  if (data?.message) return data.message;
  return error?.message || "Something went wrong. Please try again.";
}

/**
 * GET /student/ncc-profile
 * Returns the NCC profile object if it exists, or null if not yet created.
 */
export async function getNccProfile() {
  try {
    const res = await api.get("/student/ncc-profile");
    if (!res.data?.success) throw new Error(res.data?.message || "Failed to load NCC profile");
    return res.data.data ?? null;
  } catch (err) {
    // 404 means profile hasn't been created yet — return null instead of throwing
    if (err?.response?.status === 404) return null;
    throw new Error(extractError(err));
  }
}

/**
 * POST /student/ncc-profile
 * Creates a new NCC profile with the given payload.
 * @param {Object} payload - Matches the backend nccProfileSchema
 */
export async function createNccProfile(payload) {
  try {
    const res = await api.post("/student/ncc-profile", payload);
    if (!res.data?.success) throw new Error(res.data?.message || "Failed to create NCC profile");
    return res.data.data;
  } catch (err) {
    throw new Error(extractError(err));
  }
}

/**
 * PUT /student/ncc-profile
 * Updates the existing NCC profile. All fields are optional (partial update).
 * @param {Object} payload - Partial NCC profile fields to update
 */
export async function updateNccProfile(payload) {
  try {
    const res = await api.put("/student/ncc-profile", payload);
    if (!res.data?.success) throw new Error(res.data?.message || "Failed to update NCC profile");
    return res.data.data;
  } catch (err) {
    throw new Error(extractError(err));
  }
}
