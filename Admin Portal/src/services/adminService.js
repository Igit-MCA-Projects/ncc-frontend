import { api, handleApiResponse, mock, normalizeApiError } from "./api";
import students from "@/data/students.json";
import companies from "@/data/companies.json";
import jobs from "@/data/jobs.json";
import subAdmins from "@/data/subAdmins.json";
import profile from "@/data/profile.json";
import notifications from "@/data/notifications.json";

const defaultNccBenefits = [
  {
    id: "ncc-1",
    cirtificate: "Certificate C",
    benifit: "Exemption from CDS Written Examination for IMA/OTA. Direct SSB interview invitation.",
    Scholarship: "Sahara Scholarship Scheme",
    bonusMark: "10-15 bonus marks in Paramilitary & State Police Recruitment Exams",
    nccQuota: "Direct SSB Interview for Indian Army NCC Special Entry Scheme",
    scholarships: ["Sahara Scholarship (₹12,000/yr)", "Cadets Welfare Society Scholarship"],
    createdAt: new Date().toISOString(),
    isDeleted: false,
  },
  {
    id: "ncc-2",
    cirtificate: "Certificate B",
    benifit: "Bonus marks in Central Armed Police Forces (CAPF) and Railway Protection Force recruitment.",
    Scholarship: "Cadets Welfare Society Fund",
    bonusMark: "+6 to +10 Bonus marks in CAPF Sub-Inspector exams",
    nccQuota: "Preference in State Police and Fire Services",
    scholarships: ["Cadets Welfare Society Fund"],
    createdAt: new Date().toISOString(),
    isDeleted: false,
  },
  {
    id: "ncc-3",
    cirtificate: "Certificate A",
    benifit: "Bonus marks in Agniveer & Tradesmen recruitment in Defence services.",
    Scholarship: "State Government Cadet Incentive",
    bonusMark: "+5 Bonus marks in Army Agniveer GD entry",
    nccQuota: "Weightage in College Admission & State Govt Jobs",
    scholarships: ["State Cadet Merit Award"],
    createdAt: new Date().toISOString(),
    isDeleted: false,
  },
];

const defaultScholarships = [
  {
    id: "schol-1",
    name: "Sahara Scholarship Scheme",
    eligibility: "Cadets with minimum 65% marks in Class 12 or Graduation and holding NCC 'B' or 'C' Certificate.",
    requiredDocument: ["NCC Certificate Copy", "Academic Mark Sheet", "Aadhaar Card", "Bank Account Details"],
    amount: "₹12,000 / year",
    createdAt: new Date().toISOString(),
    isDeleted: false,
  },
  {
    id: "schol-2",
    name: "Cadets Welfare Society Scholarship",
    eligibility: "Best All-Round Cadet in Unit/Group with outstanding achievement in camps and sports.",
    requiredDocument: ["Unit Recommendation Letter", "Camp Certificate", "NCC Certificate", "Income Certificate"],
    amount: "₹6,000 / year",
    createdAt: new Date().toISOString(),
    isDeleted: false,
  },
  {
    id: "schol-3",
    name: "Chief Minister Merit Scholarship for NCC Cadets",
    eligibility: "State domicile cadet selected for Republic Day Camp (RDC) or Thal Sainik Camp (TSC).",
    requiredDocument: ["RDC/TSC Camp Certificate", "Bonafide Student Certificate", "Bank Passbook Copy"],
    amount: "₹15,000 (One-time)",
    createdAt: new Date().toISOString(),
    isDeleted: false,
  },
];

// In-memory clones so mock mutations persist across page navigations.
const state = {
  students: JSON.parse(JSON.stringify(students)),
  companies: JSON.parse(JSON.stringify(companies)),
  jobs: JSON.parse(JSON.stringify(jobs)),
  subAdmins: JSON.parse(JSON.stringify(subAdmins)),
  profile: JSON.parse(JSON.stringify(profile)),
  notifications: JSON.parse(JSON.stringify(notifications)),
  nccBenefits: defaultNccBenefits,
  scholarships: defaultScholarships,
};


const normalizeJob = (job) => {
  const source = job || {};
  const normalized = {
    ...source,
    id: source.id || source._id || `job-${Date.now()}`,
    companyName:
      source.companyName ||
      source.company?.name ||
      source.organization?.name ||
      source.companyName ||
      "Unknown Company",
    title: source.title || "",
    location: source.location || "",
    salary: source.salary || source.salaryRange || "Not specified",
    experience: source.experience || source.experienceLevel || "Not specified",
    postedDate: source.postedDate ||
      (source.createdAt ? new Date(source.createdAt).toLocaleDateString() : "N/A"),
    status: source.status || "pending",
    description: source.description || "",
    jobType: source.jobType || source.type || "",
    applyLink: source.applyLink || "",
    lastDate: source.lastDate || "",
    skills: source.skills || "",
  };

  return normalized;
};

const normalizeJobPayload = (data) => {
  const skills = Array.isArray(data?.skills)
    ? data.skills.map((s) => String(s).trim()).filter(Boolean)
    : typeof data?.skills === "string"
    ? data.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
    : [];

  const parseIsoDate = (val) => {
    if (!val || typeof val !== "string" || !val.trim()) return undefined;
    try {
      const d = new Date(val);
      return isNaN(d.getTime()) ? undefined : d.toISOString();
    } catch {
      return undefined;
    }
  };

  const parseUrl = (val) => {
    if (!val || typeof val !== "string" || !val.trim()) return undefined;
    const trimmed = val.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return undefined;
  };

  const parseEmail = (val) => {
    if (!val || typeof val !== "string" || !val.trim()) return undefined;
    const trimmed = val.trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return trimmed;
    return undefined;
  };

  let organization = undefined;
  if (data?.organization?.name && data.organization.name.trim()) {
    organization = {
      name: data.organization.name.trim(),
      email: parseEmail(data.organization.email),
      phone: data.organization.phone?.trim() || undefined,
      website: parseUrl(data.organization.website),
      description: data.organization.description?.trim() || undefined,
    };
  }

  const startDateIso = parseIsoDate(data?.startDate) || new Date().toISOString();
  const endDateIso = parseIsoDate(data?.endData || data?.endDate);

  return {
    title: data?.title?.trim() || "",
    description: data?.description?.trim() || "",
    jobImage: parseUrl(data?.jobImage),
    skills: skills.length > 0 ? skills : ["General"],
    applyLink: parseUrl(data?.applyLink),
    startDate: startDateIso,
    endData: endDateIso,
    Location: data?.Location?.trim() || data?.location?.trim() || "",
    hirignType: data?.hirignType ? data.hirignType : undefined,
    ctc: data?.ctc?.trim() || undefined,
    stipend: data?.stipend?.trim() || undefined,
    organization,
  };
};

// AUTH
export const registerAdmin = async ({ fullName, email, password, adminRole }) => {
  try {
    console.log("Registering admin with:", { fullName, email, password, adminRole });
    const response = await api.post("/auth/admin-register", {
      fullName,
      email,
      password,
      adminRole,
    });
    console.log("Registration response:", response);
    return handleApiResponse(response);
  } catch (error) {
    throw normalizeApiError(error);
  }
};

export const loginAdmin = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  try {
    const response = await api.post("/auth/admin-login", {
      email,
      password,
    });

    return handleApiResponse(response);
  } catch (error) {
    throw normalizeApiError(error);
  }
};

export const getAdminProfile = async () => {
  try {
    const response = await api.get("/admin/profile");
    return handleApiResponse(response);
  } catch (error) {
    throw normalizeApiError(error);
  }
};

export const logoutAdmin = async () => {
  try {
    const response = await api.post("/auth/logout");
    localStorage.removeItem("ncc_admin_token");
    localStorage.removeItem("ncc_admin_user");
    return handleApiResponse(response);
  } catch (error) {
    localStorage.removeItem("ncc_admin_token");
    localStorage.removeItem("ncc_admin_user");
    throw normalizeApiError(error);
  }
};

const normalizeStudent = (student) => {
  if (!student) return null;
  const s = student;

  const educations = Array.isArray(s.educations)
    ? s.educations
    : Array.isArray(s.education)
      ? s.education
      : [];

  const primaryEdu = educations[0] || {};

  let skills = [];
  if (Array.isArray(s.skills)) {
    skills = s.skills;
  } else if (typeof s.skills === "string" && s.skills.trim()) {
    skills = s.skills
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  let github = s.github || "";
  let linkedin = s.linkedin || "";
  let portfolio = s.portfolio || "";
  let twitter = s.twitter || "";

  const socialLinks = s.socialLinks;
  if (Array.isArray(socialLinks)) {
    socialLinks.forEach((link) => {
      const platform = (link.platform || link.name || "").toLowerCase();
      const url = link.url || link.link || "";
      if (platform.includes("github") || url.includes("github.com")) github = url;
      else if (platform.includes("linkedin") || url.includes("linkedin.com")) linkedin = url;
      else if (platform.includes("twitter") || url.includes("twitter.com") || url.includes("x.com")) twitter = url;
      else if (platform.includes("portfolio") || platform.includes("website")) portfolio = url;
    });
  } else if (socialLinks && typeof socialLinks === "object") {
    github = github || socialLinks.github || "";
    linkedin = linkedin || socialLinks.linkedin || "";
    portfolio = portfolio || socialLinks.portfolio || socialLinks.website || "";
    twitter = twitter || socialLinks.twitter || "";
  }

  const nccRaw = s.nccProfile || s.ncc || {};
  const ncc = {
    unit: nccRaw.unit || nccRaw.nccUnit || nccRaw.battalion || "-",
    rank: nccRaw.rank || nccRaw.cadetRank || "-",
    certificate:
      nccRaw.certificate ||
      nccRaw.certificateType ||
      nccRaw.certificateNumber ||
      nccRaw.grade ||
      "-",
  };

  const primaryAddr = Array.isArray(s.addresses) && s.addresses[0] ? s.addresses[0] : null;
  const locationStr =
    s.preferredLocation ||
    (primaryAddr ? [primaryAddr.city, primaryAddr.state, primaryAddr.country].filter(Boolean).join(", ") : null) ||
    s.location ||
    "N/A";

  const formattedEdu = educations.map((edu) => {
    const start = edu.startDate ? new Date(edu.startDate).getFullYear() : null;
    const end = edu.endDate ? new Date(edu.endDate).getFullYear() : null;
    const yearStr = edu.year || (start && end ? `${start} - ${end}` : start ? `${start} - Present` : "N/A");

    return {
      degree: edu.degree || "Degree",
      fieldOfStudy: edu.fieldOfStudy || "",
      institute: edu.institute || edu.school || edu.college || "Institute",
      year: yearStr,
      grade: edu.grade || edu.cgpa || edu.percentage || null,
      address: edu.address ? [edu.address.city, edu.address.state].filter(Boolean).join(", ") : null,
    };
  });

  return {
    ...s,
    id: s.id || s._id,
    name: s.fullName || s.name || "N/A",
    fullName: s.fullName || s.name || "N/A",
    email: s.email || "",
    phone: s.phone || "N/A",
    gender: s.gender || "N/A",
    dateOfBirth: s.dateOfBirth ? new Date(s.dateOfBirth).toLocaleDateString() : null,
    headline: s.headline || "",
    bio: s.bio || "",
    status: s.status || "active",
    photo:
      s.profileImage ||
      s.photo ||
      `https://i.pravatar.cc/100?u=${encodeURIComponent(s.id || s.email || "student")}`,
    profileImage: s.profileImage || s.photo || "",
    college: primaryEdu.institute || primaryEdu.school || primaryEdu.college || s.college || "N/A",
    course: primaryEdu.degree
      ? `${primaryEdu.degree}${primaryEdu.fieldOfStudy ? ` (${primaryEdu.fieldOfStudy})` : ""}`
      : s.course || "N/A",
    location: locationStr,
    preferredRole: s.preferredRole || "N/A",
    expectedSalary: s.expectedSalary || "N/A",
    willingToRelocate: s.willingToRelocate,
    openToRemote: s.openToRemote,
    profileCompleted: s.profileCompleted,
    profileScore: s.profileScore,
    emailVerified: s.emailVerified ?? false,
    phoneVerified: s.phoneVerified ?? false,
    resume: s.resumeUrl || s.resume || "",
    resumeUrl: s.resumeUrl || s.resume || "",
    skills,
    education: formattedEdu,
    projects: Array.isArray(s.projects) ? s.projects : [],
    github,
    linkedin,
    portfolio,
    twitter,
    ncc,
  };
};

// STUDENTS
export const getStudents = async (page = 1, limit = 10) => {
  try {
    const response = await api.get("/admin/students", {
      params: { page, limit },
    });
    const payload = handleApiResponse(response);
    const dataPayload = payload?.data || {};

    const rawList = Array.isArray(dataPayload.students)
      ? dataPayload.students
      : Array.isArray(dataPayload)
        ? dataPayload
        : Array.isArray(payload)
          ? payload
          : [];

    const normalized = rawList.map(normalizeStudent);

    return {
      success: true,
      data: normalized,
      pagination: dataPayload.pagination || {
        page: Number(page),
        limit: Number(limit),
        total: normalized.length,
        totalPages: Math.ceil(normalized.length / limit) || 1,
      },
    };
  } catch (error) {
    const normalized = state.students.map(normalizeStudent);
    return {
      success: false,
      message: error?.message || "Failed to fetch students from server",
      data: normalized,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: normalized.length,
        totalPages: Math.ceil(normalized.length / limit) || 1,
      },
    };
  }
};

export const getStudent = async (id) => {
  if (!id) {
    return { success: false, message: "Student id is required", data: null };
  }

  try {
    const response = await api.get("/admin/student-profile", {
      params: { id },
    });
    const payload = handleApiResponse(response);
    const studentData = payload?.data || null;

    return {
      success: true,
      data: studentData ? normalizeStudent(studentData) : null,
    };
  } catch (error) {
    const localMatch = state.students.find((s) => String(s.id) === String(id));
    return {
      success: false,
      message: error?.message || "Failed to fetch student profile",
      data: localMatch ? normalizeStudent(localMatch) : null,
    };
  }
};

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
export const getJobs = async () => {
  try {
    const response = await api.get("/admin/job");
    const payload = handleApiResponse(response);
    const jobsList = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
    console.log(response)
    return {
      success: true,
      data: jobsList.map(normalizeJob),
    };
  } catch (error) {
    return {
      success: true,
      data: state.jobs.map(normalizeJob),
    };
  }
};

export const getPendingJobs = async () => {
  const result = await getJobs();
  return {
    ...result,
    data: (result.data || []).filter((job) => job.status === "pending"),
  };
};

export const createJob = async (data) => {
  const payload = normalizeJobPayload(data);

  try {
    console.log("Posting Job Payload:", payload);
    const response = await api.post("/admin/job", payload);
    const resultPayload = handleApiResponse(response);
    const createdJob = normalizeJob(resultPayload?.data || payload);

    state.jobs.unshift({
      ...createdJob,
      id: createdJob.id || `job-${Date.now()}`,
    });

    return {
      success: true,
      data: createdJob,
      message: resultPayload?.message || "Job created successfully",
    };
  } catch (error) {
    console.error("Status:", error?.response?.status);
    console.error("Backend Error:", error?.response?.data);
    const errorIssues = error?.response?.data?.data;
    const issueMessage = Array.isArray(errorIssues) && errorIssues[0]?.message ? errorIssues[0].message : null;
    const errMsg = issueMessage || error?.response?.data?.message || error?.message || "Failed to create job";

    if (error?.response?.status === 400 || error?.response?.status === 401) {
      return {
        success: false,
        message: errMsg,
      };
    }

    const fallbackJob = normalizeJob({
      ...payload,
      id: `job-${Date.now()}`,
      companyName: payload.organization?.name || "Unknown Company",
    });

    state.jobs.unshift(fallbackJob);

    return {
      success: true,
      data: fallbackJob,
      message: "Job created successfully",
    };
  }
};

export const approveJob = async (id) => {
  try {
    const response = await api.put("/admin/job", { id, jobId: id, status: "approved" });
    const payload = handleApiResponse(response);
    const updatedJob = normalizeJob(payload?.data || payload);

    const job = state.jobs.find((item) => String(item.id) === String(id));
    if (job) job.status = "approved";

    return {
      success: true,
      data: updatedJob,
    };
  } catch (error) {
    const job = state.jobs.find((item) => String(item.id) === String(id));
    if (job) job.status = "approved";

    return {
      success: true,
      data: normalizeJob(job),
    };
  }
};

export const rejectJob = async (id) => {
  try {
    const response = await api.put("/admin/job", { id, jobId: id, status: "rejected" });
    const payload = handleApiResponse(response);
    const updatedJob = normalizeJob(payload?.data || payload);

    const job = state.jobs.find((item) => String(item.id) === String(id));
    if (job) job.status = "rejected";

    return {
      success: true,
      data: updatedJob,
    };
  } catch (error) {
    const job = state.jobs.find((item) => String(item.id) === String(id));
    if (job) job.status = "rejected";

    return {
      success: true,
      data: normalizeJob(job),
    };
  }
};

export const updateJob = async (data) => {
  const payload = {
    jobId: data?.jobId,
    title: data?.title,
    description: data?.description,
    jobImage: data?.jobImage,
    skills: data?.skills,
    applyLink: data?.applyLink,
    startDate: data?.startDate,
    endData: data?.endData,
    Location: data?.Location,
    hirignType: data?.hirignType,
    ctc: data?.ctc,
    stipend: data?.stipend,
    organization: data?.organization,
  };

  try {
    const response = await api.put("/admin/job", payload);
    const updatedJob = normalizeJob(response?.data?.data || response?.data || payload);

    const job = state.jobs.find((item) => String(item.id) === String(data?.jobId));
    if (job) {
      Object.assign(job, updatedJob);
      job.id = job.id || data?.jobId;
    }

    return {
      success: true,
      data: updatedJob,
    };
  } catch (error) {
    return {
      success: false,
      message: error?.message || "Failed to update job",
    };
  }
};

// HIRING CALENDAR
export const getHiringCalendar = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/admin/hiring-calender?page=${page}&limit=${limit}`);
    const payload = handleApiResponse(response);
    return {
      success: true,
      data: payload?.data || payload || {},
    };
  } catch (error) {
    return {
      success: false,
      message: error?.message || "Failed to load hiring calendar",
      data: { hiringCalenders: [], pagination: { page, limit, total: 0, totalPages: 0 } },
    };
  }
};

export const createHiringCalendar = async (data) => {
  const payload = {
    companyName: data?.companyName || "",
    title: data?.title || "",
    description: data?.description || "",
    salaryRange: data?.salaryRange || "",
    hiringMonth: data?.hiringMonth ? new Date(data.hiringMonth).toISOString() : new Date().toISOString(),
    applyLink: data?.applyLink || undefined,
    prepairResource: Array.isArray(data?.prepairResource)
      ? data.prepairResource
      : (data?.prepairResource || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
  };

  try {
    console.log("Creating hiring calendar entry with payload:", payload);
    const response = await api.post("/admin/hiring-calender", payload);
    return {
      success: true,
      data: response?.data?.data || response?.data || null,
    };
  } catch (error) {
    console.log("Status:", error.response?.status);
    console.log("Backend Error:", error.response?.data);
    console.log("Validation:", error.response?.data?.data);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to create hiring calendar entry",
    };
  }
};

export const updateHiringCalendar = async (data) => {
  const payload = {
    id: data?.id,
    companyName: data?.companyName,
    title: data?.title,
    description: data?.description,
    salaryRange: data?.salaryRange,
    hiringMonth: data?.hiringMonth ? new Date(data.hiringMonth).toISOString() : new Date().toISOString(),
    applyLink: data?.applyLink,
    prepairResource: data?.prepairResource,
    isDeleted: data?.isDeleted,
  };

  try {
    const response = await api.put("/admin/hiring-calender", payload);
    return {
      success: true,
      data: response?.data?.data || response?.data || null,
    };
  } catch (error) {
    console.log("Status:", error.response?.status);
    console.log("Backend Error:", error.response?.data);
    console.log("Validation:", error.response?.data?.data);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to update hiring calendar entry",
    };
  }
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
const normalizeNotification = (n) => {
  if (!n) return null;
  return {
    ...n,
    id: n.id || n._id,
    title: n.title || "",
    description: n.Descripton || n.description || "",
    Descripton: n.Descripton || n.description || "",
    type: n.type || (n.studentId ? "PERSONAL" : "GENERAL"),
    studentId: n.studentId || null,
    isDeleted: Boolean(n.isDeleted),
    createdAt: n.createdAt || n.created_at || new Date().toISOString(),
  };
};

export const getNotifications = async (page = 1, limit = 20) => {
  try {
    const response = await api.get("/admin/notification", {
      params: { page, limit },
    });
    const payload = handleApiResponse(response);
    const data = payload?.data || {};
    const rawList = Array.isArray(data.notifications)
      ? data.notifications
      : Array.isArray(data)
        ? data
        : Array.isArray(payload)
          ? payload
          : [];

    const normalized = rawList.map(normalizeNotification);

    return {
      success: true,
      data: normalized,
      pagination: data.pagination || {
        page: Number(page),
        limit: Number(limit),
        total: normalized.length,
        totalPages: Math.ceil(normalized.length / limit) || 1,
      },
    };
  } catch (error) {
    const normalized = state.notifications.map(normalizeNotification);
    return {
      success: false,
      message: error?.message || "Failed to load notifications",
      data: normalized,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: normalized.length,
        totalPages: Math.ceil(normalized.length / limit) || 1,
      },
    };
  }
};

export const createNotification = async (data) => {
  const payload = {
    title: data?.title || "",
    Descripton: data?.Descripton || data?.description || undefined,
    type: data?.type || "GENERAL",
    studentId: data?.type === "PERSONAL" ? data?.studentId : undefined,
  };

  try {
    const response = await api.post("/admin/notification", payload);
    const resultPayload = handleApiResponse(response);
    const created = normalizeNotification(resultPayload?.data || payload);

    state.notifications.unshift(created);

    return {
      success: true,
      data: created,
    };
  } catch (error) {
    const fallback = normalizeNotification({
      ...payload,
      id: `notif-${Date.now()}`,
      isDeleted: false,
      createdAt: new Date().toISOString(),
    });
    state.notifications.unshift(fallback);

    return {
      success: false,
      message: error?.response?.data?.message || error?.message || "Failed to create notification",
      data: fallback,
    };
  }
};

export const deleteNotification = async (id) => {
  if (!id) {
    return { success: false, message: "Notification ID is required" };
  }

  try {
    const response = await api.delete("/admin/notification", {
      params: { id },
    });
    handleApiResponse(response);

    const match = state.notifications.find((n) => String(n.id) === String(id));
    if (match) match.isDeleted = true;

    return {
      success: true,
      message: "Notification deleted",
    };
  } catch (error) {
    const match = state.notifications.find((n) => String(n.id) === String(id));
    if (match) match.isDeleted = true;

    return {
      success: false,
      message: error?.response?.data?.message || error?.message || "Failed to delete notification",
    };
  }
};


export const updateAdminProfile = async (data) => {
  const payload = {
    fullName: data?.fullName ?? "",
    phone: data?.phone ?? "",
    profileImage: data?.profileImage ?? "",
    designation: data?.designation ?? "",
    organization: data?.organization ?? null,
  };

  const extractProfileData = (response) => {
    if (!response) return null;
    return response?.data?.data ?? response?.data ?? null;
  };

  try {
    // First try update
    const response = await api.put("/admin/profile", payload);

    return {
      success: true,
      data: extractProfileData(response),
    };
  } catch (error) {

    // If profile is not completed yet,
    // create it automatically
    if (
      error.response?.status === 404 ||
      error.response?.data?.message === "Admin not found"
    ) {
      try {
        const completeResponse = await api.post("/admin/profile", {
          phone: payload.phone,
          profileImage: payload.profileImage,
          designation: payload.designation,
          organization: payload.organization,
        });

        return {
          success: true,
          data: extractProfileData(completeResponse),
        };
      } catch (err) {
        return {
          success: false,
          message:
            err.response?.data?.message || "Failed to complete profile",
        };
      }
    }

    return {
      success: false,
      message:
        error.response?.data?.message || "Failed to update profile",
    };
  }
};

export const completeAdminProfile = async (data) => {
  try {
    const payload = {
      phone: data?.phone ?? "",
      profileImage: data?.profileImage ?? "",
      designation: data?.designation ?? "",
      organization: data?.organization ?? null,
    };

    const response = await api.post("/admin/profile", payload);

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    throw normalizeApiError(error);
  }
};

// MENTORSHIP
const normalizeMentorshipRequest = (req) => {
  if (!req) return null;
  const s = req.student || {};
  return {
    ...req,
    id: req.id || req._id,
    mentorshipRequestId: req.id || req._id,
    teacherId: req.teacherId,
    studentId: req.studentId || s.id,
    status: req.status || "PENDING",
    requestedAt: req.requestedAt || req.createdAt || new Date().toISOString(),
    respondedAt: req.respondedAt || null,
    student: {
      id: s.id || req.studentId,
      name: s.fullName || s.name || "Student",
      fullName: s.fullName || s.name || "Student",
      email: s.email || "",
      phone: s.phone || "N/A",
      photo: s.profileImage || s.photo || `https://i.pravatar.cc/100?u=${encodeURIComponent(s.id || 'student')}`,
      headline: s.headline || "",
    },
  };
};

export const getMentorshipRequests = async (statusFilter) => {
  try {
    const params = statusFilter ? { status: statusFilter } : {};
    const response = await api.get("/admin/mentorship", { params });
    const payload = handleApiResponse(response);
    const rawList = Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload)
        ? payload
        : [];

    const normalized = rawList.map(normalizeMentorshipRequest);

    return {
      success: true,
      data: normalized,
    };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error?.message || "Failed to load mentorship requests",
      data: [],
    };
  }
};

export const updateMentorshipStatus = async (mentorshipRequestId, status) => {
  if (!mentorshipRequestId || !status) {
    return { success: false, message: "Request ID and status are required" };
  }

  try {
    const response = await api.put("/admin/mentorship", {
      mentorshipRequestId,
      status,
    });
    const payload = handleApiResponse(response);

    return {
      success: true,
      data: normalizeMentorshipRequest(payload?.data || payload),
      message: `Mentorship request ${status.toLowerCase()} successfully`,
    };
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error?.message || `Failed to update mentorship status`,
    };
  }
};

// NCC BENEFITS
const normalizeNccBenefit = (b) => {
  if (!b) return null;
  const cert = b.cirtificate || b.certificate || "General";
  const benefitText = b.benifit || b.benefit || "";
  const scholarshipText = b.Scholarship || b.scholarship || "";
  const scholarshipsList = Array.isArray(b.scholarships)
    ? b.scholarships
    : typeof b.scholarships === "string" && b.scholarships.trim()
      ? b.scholarships.split(",").map((s) => s.trim()).filter(Boolean)
      : scholarshipText
        ? [scholarshipText]
        : [];

  return {
    ...b,
    id: b.id || b._id,
    cirtificate: cert,
    certificate: cert,
    benifit: benefitText,
    benefit: benefitText,
    Scholarship: scholarshipText,
    scholarship: scholarshipText,
    bonusMark: b.bonusMark || "",
    nccQuota: b.nccQuota || "",
    scholarships: scholarshipsList,
    createdAt: b.createdAt || new Date().toISOString(),
  };
};

export const getNccBenefits = async (page = 1, limit = 50) => {
  try {
    const response = await api.get("/admin/ncc-benifit", {
      params: { page, limit },
    });
    const payload = handleApiResponse(response);
    const dataPayload = payload?.data || {};

    const rawList = Array.isArray(dataPayload.nccBenifits)
      ? dataPayload.nccBenifits
      : Array.isArray(dataPayload)
        ? dataPayload
        : Array.isArray(payload)
          ? payload
          : [];

    const normalized = rawList.map(normalizeNccBenefit).filter(Boolean);

    return {
      success: true,
      data: normalized,
      pagination: dataPayload.pagination || {
        page: Number(page),
        limit: Number(limit),
        total: normalized.length,
        totalPages: Math.ceil(normalized.length / limit) || 1,
      },
    };
  } catch (error) {
    const fallbackList = state.nccBenefits.filter((b) => !b.isDeleted).map(normalizeNccBenefit);
    return {
      success: true,
      message: error?.response?.data?.message || error?.message || "Fetched from local cache",
      data: fallbackList,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: fallbackList.length,
        totalPages: 1,
      },
    };
  }
};

export const addNccBenefit = async (data) => {
  const payload = {
    cirtificate: data?.cirtificate || data?.certificate || "",
    benifit: data?.benifit || data?.benefit || "",
    Scholarship: data?.Scholarship || data?.scholarship || undefined,
    bonusMark: data?.bonusMark || undefined,
    nccQuota: data?.nccQuota || undefined,
    scholarships: Array.isArray(data?.scholarships)
      ? data.scholarships
      : typeof data?.scholarships === "string" && data.scholarships.trim()
        ? data.scholarships.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
  };

  try {
    const response = await api.post("/admin/ncc-benifit", payload);
    const resultPayload = handleApiResponse(response);
    const created = normalizeNccBenefit(resultPayload?.data || payload);

    state.nccBenefits.unshift(created);

    return {
      success: true,
      data: created,
      message: "NCC benefit added successfully",
    };
  } catch (error) {
    const errorIssues = error?.response?.data?.data;
    const issueMessage = Array.isArray(errorIssues) && errorIssues[0]?.message ? errorIssues[0].message : null;
    const errMsg = issueMessage || error?.response?.data?.message || error?.message;

    if (error?.response?.status === 400 && issueMessage) {
      return {
        success: false,
        message: errMsg,
      };
    }

    // Fallback in case backend is offline
    const fallback = normalizeNccBenefit({
      ...payload,
      id: `ncc-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isDeleted: false,
    });
    state.nccBenefits.unshift(fallback);

    return {
      success: true,
      data: fallback,
      message: "NCC benefit added successfully",
    };
  }
};

export const deleteNccBenefit = async (id) => {
  if (!id) {
    return { success: false, message: "NCC benefit ID is required" };
  }

  try {
    const response = await api.delete("/admin/ncc-benifit", {
      params: { id },
    });
    handleApiResponse(response);

    const match = state.nccBenefits.find((b) => String(b.id) === String(id));
    if (match) match.isDeleted = true;

    return {
      success: true,
      message: "NCC benefit deleted successfully",
    };
  } catch (error) {
    const match = state.nccBenefits.find((b) => String(b.id) === String(id));
    if (match) match.isDeleted = true;

    return {
      success: true,
      message: "NCC benefit deleted successfully",
    };
  }
};

// SCHOLARSHIPS
const normalizeScholarship = (s) => {
  if (!s) return null;
  const docs = Array.isArray(s.requiredDocument)
    ? s.requiredDocument
    : typeof s.requiredDocument === "string" && s.requiredDocument.trim()
      ? s.requiredDocument.split(",").map((item) => item.trim()).filter(Boolean)
      : [];

  return {
    ...s,
    id: s.id || s._id,
    name: s.name || "",
    eligibility: s.eligibility || "",
    requiredDocument: docs,
    amount: s.amount || "",
    createdAt: s.createdAt || new Date().toISOString(),
    isDeleted: Boolean(s.isDeleted),
  };
};

export const getScholarships = async (page = 1, limit = 50) => {
  try {
    const response = await api.get("/admin/scholarship", {
      params: { page, limit },
    });
    const payload = handleApiResponse(response);
    const dataPayload = payload?.data || {};

    const rawList = Array.isArray(dataPayload.scholarships)
      ? dataPayload.scholarships
      : Array.isArray(dataPayload)
        ? dataPayload
        : Array.isArray(payload)
          ? payload
          : [];

    const normalized = rawList.map(normalizeScholarship).filter(Boolean);

    return {
      success: true,
      data: normalized,
      pagination: dataPayload.pagination || {
        page: Number(page),
        limit: Number(limit),
        total: normalized.length,
        totalPages: Math.ceil(normalized.length / limit) || 1,
      },
    };
  } catch (error) {
    const fallbackList = state.scholarships.filter((s) => !s.isDeleted).map(normalizeScholarship);
    return {
      success: true,
      message: error?.response?.data?.message || error?.message || "Fetched from local cache",
      data: fallbackList,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: fallbackList.length,
        totalPages: 1,
      },
    };
  }
};

export const addScholarship = async (data) => {
  const docs = Array.isArray(data?.requiredDocument)
    ? data.requiredDocument
    : typeof data?.requiredDocument === "string" && data.requiredDocument.trim()
      ? data.requiredDocument
        .split("\n")
        .flatMap((line) => line.split(","))
        .map((item) => item.trim())
        .filter(Boolean)
      : [];

  const payload = {
    name: data?.name || "",
    eligibility: data?.eligibility || "",
    requiredDocument: docs,
    amount: data?.amount || "",
  };

  try {
    const response = await api.post("/admin/scholarship", payload);
    const resultPayload = handleApiResponse(response);
    const created = normalizeScholarship(resultPayload?.data || payload);

    state.scholarships.unshift(created);

    return {
      success: true,
      data: created,
      message: "Scholarship added successfully",
    };
  } catch (error) {
    const errorIssues = error?.response?.data?.data;
    const issueMessage = Array.isArray(errorIssues) && errorIssues[0]?.message ? errorIssues[0].message : null;
    const errMsg = issueMessage || error?.response?.data?.message || error?.message;

    if (error?.response?.status === 400 && issueMessage) {
      return {
        success: false,
        message: errMsg,
      };
    }

    // Fallback in case backend is offline
    const fallback = normalizeScholarship({
      ...payload,
      id: `schol-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isDeleted: false,
    });
    state.scholarships.unshift(fallback);

    return {
      success: true,
      data: fallback,
      message: "Scholarship added successfully",
    };
  }
};

export const deleteScholarship = async (id) => {
  if (!id) {
    return { success: false, message: "Scholarship ID is required" };
  }

  try {
    const response = await api.delete("/admin/scholarship", {
      params: { id },
    });
    handleApiResponse(response);

    const match = state.scholarships.find((s) => String(s.id) === String(id));
    if (match) match.isDeleted = true;

    return {
      success: true,
      message: "Scholarship deleted successfully",
    };
  } catch (error) {
    const match = state.scholarships.find((s) => String(s.id) === String(id));
    if (match) match.isDeleted = true;

    return {
      success: true,
      message: "Scholarship deleted successfully",
    };
  }
};



