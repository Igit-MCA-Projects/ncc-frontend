import { api } from "./api";

/** GET /student/notification — Fetch personal notifications for current student */
export async function getPersonalNotifications() {
  const res = await api.get("/student/notification");
  if (!res.data?.success) {
    throw new Error(res.data?.message || "Failed to fetch personal notifications");
  }
  return res.data.data; // Standard envelope
}
