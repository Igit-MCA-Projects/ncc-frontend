import axios from "axios";

// Use a relative baseURL so requests go through the Vite dev proxy
// (avoids CORS entirely in development). In production, update this to the real domain.
const authAxios = axios.create({
  baseURL: "/api/v1/auth",
  timeout: 15000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

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
    const res = await authAxios.post("/register", payload);
    console.log(res)
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
    const res = await authAxios.post("/verify-email", payload);
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
    const res = await authAxios.post("/login", credentials);
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
    const res = await authAxios.post("/logout");
    return assertSuccess(res);
  } catch (err) {
    throw new Error(extractError(err));
  }
}
