import { api } from "./api";

/** GET /public/hiring-calender — Fetch hiring calendars (paginated) */
export async function getHiringCalendar({ page = 1, limit = 10, search = "" } = {}) {
  const query = new URLSearchParams({ page, limit, search }).toString();
  const res = await api.get(`/public/hiring-calender?${query}`);
  if (!res.data?.success) throw new Error(res.data?.message || "Failed to fetch hiring calendar");
  return res.data.data; // returns { hiringCalenders, pagination }
}

/** GET /public/ncc-benifit — Fetch NCC benefits (paginated) */
export async function getNccBenefits({ page = 1, limit = 10 } = {}) {
  const query = new URLSearchParams({ page, limit }).toString();
  const res = await api.get(`/public/ncc-benifit?${query}`);
  if (!res.data?.success) throw new Error(res.data?.message || "Failed to fetch NCC benefits");
  return res.data.data; // returns { nccBenifits, pagination }
}

/** GET /public/scholarship — Fetch scholarships (paginated) */
export async function getScholarships({ page = 1, limit = 10 } = {}) {
  const query = new URLSearchParams({ page, limit }).toString();
  const res = await api.get(`/public/scholarship?${query}`);
  if (!res.data?.success) throw new Error(res.data?.message || "Failed to fetch scholarships");
  return res.data.data; // returns { scholarships, pagination }
}

/** GET /public/notification — Fetch general notifications (paginated) */
export async function getNotifications({ page = 1, limit = 10 } = {}) {
  const query = new URLSearchParams({ page, limit }).toString();
  const res = await api.get(`/public/notification?${query}`);
  if (!res.data?.success) throw new Error(res.data?.message || "Failed to fetch notifications");
  return res.data.data; // returns { notifications, pagination }
}
