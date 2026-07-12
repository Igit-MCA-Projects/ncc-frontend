import { api } from "./api";

// Use a relative baseURL so requests go through the Vite dev proxy
// (avoids CORS entirely in development). In production, update this to the real domain.

/** Extract a human-readable error from the API response envelope. */
function extractError(error) {
  const data = error?.response?.data;
  if (data?.message) return data.message;
  return error?.message || "Something went wrong. Please try again.";
}

/** Assert the envelope is successful, otherwise throw. */
function assertSuccess(res) {
  if (!res.data?.success) {
    throw new Error(res.data?.message || "Request failed");
  }
  return res.data;
}

// ─── Student Register ────────────────────────────────────────────────────────

/**
 * POST /auth/register
 * @param {{ fullName: string, email: string, password: string }} payload
 */
export async function registerStudent(payload) {
  try {
    const res = await api.post("/auth/register", payload);
    console.log(res);
    return assertSuccess(res);
  } catch (err) {
    throw new Error(extractError(err));
  }
}

// ─── Student Email Verification ──────────────────────────────────────────────

/**
 * POST /auth/verify-email
 * @param {{ email: string, otp: string }} payload  otp is a 4-char string
 */
export async function verifyEmail(payload) {
  try {
    const res = await api.post("/auth/verify-email", payload);
    return assertSuccess(res);
  } catch (err) {
    throw new Error(extractError(err));
  }
}

// ─── Student Login ───────────────────────────────────────────────────────────

/**
 * POST /auth/login
 * Sets the httpOnly `accesstoken` cookie on success — no token in the response body.
 * @param {{ email: string, password: string }} credentials
 */
export async function loginStudent(credentials) {
  try {
    const res = await api.post("/auth/login", credentials);
    return assertSuccess(res);
  } catch (err) {
    throw new Error(extractError(err));
  }
}

// ─── Student Logout ──────────────────────────────────────────────────────────

/**
 * POST /auth/logout
 * Requires the `accesstoken` cookie to be present (sent automatically).
 */
export async function logoutStudent() {
  try {
    const res = await api.post("/auth/logout");
    return assertSuccess(res);
  } catch (err) {
    throw new Error(extractError(err));
  }
}

// ─── Get current user (session restore) ─────────────────────────────────────

/**
 * GET /auth/me
 * Used on app boot to rehydrate the user from the httpOnly cookie.
 * Throws if the session is expired or the user is not logged in.
 */
export async function getMe() {
  try {
    const res = await api.get("/auth/me");
    return assertSuccess(res);
  } catch (err) {
    throw new Error(extractError(err));
  }
}
