import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import DashboardLayout from "../layouts/DashboardLayout";
import ProfileCompletionCard from "../components/ProfileCompletionCard";
import { useProfile, ProfileProvider } from "../context/ProfileContext";
import { api, updateStudentProfile } from "../services/api";
import {
  Linkedin,
  Github,
  Mail,
  Phone,
  MapPin,
  Award,
  FileText,
  Globe,
  Twitter,
  Briefcase,
  GraduationCap,
  BookOpen,
  DollarSign,
  RefreshCw,
  Edit2,
  X,
  Loader2,
  Upload,
  CheckCircle2,
  Trash2,
  Code2,
} from "lucide-react";
import toast from "react-hot-toast";

// ─── Shared style helpers ─────────────────────────────────────────────────────

function inputCls(err) {
  return `mt-0.5 w-full h-9 px-2.5 rounded-lg bg-card border text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 ${
    err ? "border-destructive" : "border-border"
  }`;
}

function FL({ label, children }) {
  return (
    <label className="block">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

// ─── Generic file upload helper ───────────────────────────────────────────────

async function uploadFile(file, { onUrl, setUploading, setUploaded, label = "File" }) {
  if (!file) return;
  const formData = new FormData();
  formData.append("file", file);
  setUploading(true);
  try {
    const res = await api.post("/upload-file", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (!res.data?.success) throw new Error(res.data?.message || "Upload failed");
    onUrl(res.data.data);
    setUploaded(true);
    toast.success(`${label} uploaded!`);
  } catch (err) {
    toast.error(err.response?.data?.message || err.message || "Upload failed");
  } finally {
    setUploading(false);
  }
}

// ─── UPDATE PROFILE MODAL ─────────────────────────────────────────────────────

function UpdateProfileModal({ profile, onClose, onSuccess }) {
  const [submitting, setSubmitting] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  // photo upload state
  const [imgFileName, setImgFileName] = useState("");
  const [imgFileRef, setImgFileRef] = useState(null);
  const [imgUploading, setImgUploading] = useState(false);
  const [imgUploaded, setImgUploaded] = useState(!!profile.profileImage);
  const [imgPreview, setImgPreview] = useState(profile.profileImage ?? "");
  const [imgUrl, setImgUrl] = useState(profile.profileImage ?? "");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: profile.phone ?? "",
      dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.slice(0, 10) : "",
      gender: profile.gender ?? "MALE",
      headline: profile.headline ?? "",
      bio: profile.bio ?? "",
      profileImage: profile.profileImage ?? "",
      resumeUrl: profile.resumeUrl ?? "",
      preferredRole: profile.preferredRole ?? "",
      preferredLocation: profile.preferredLocation ?? [],
      expectedSalary: profile.expectedSalary ?? "",
      willingToRelocate: profile.willingToRelocate ?? false,
      openToRemote: profile.openToRemote ?? false,
      skills: profile.skills ?? [],
    },
  });

  const skills = watch("skills");
  const preferredLocation = watch("preferredLocation");

  // skill helpers
  const addSkill = () => {
    const s = skillInput.trim().toLowerCase();
    if (s && !skills.includes(s)) setValue("skills", [...skills, s]);
    setSkillInput("");
  };
  const removeSkill = (s) =>
    setValue(
      "skills",
      skills.filter((x) => x !== s),
    );

  // location helpers
  const [locInput, setLocInput] = useState("");
  const addLoc = () => {
    const l = locInput.trim();
    if (l && !preferredLocation.includes(l))
      setValue("preferredLocation", [...preferredLocation, l]);
    setLocInput("");
  };
  const removeLoc = (l) =>
    setValue(
      "preferredLocation",
      preferredLocation.filter((x) => x !== l),
    );

  // photo upload handlers
  const handleImgChange = (e) => {
    const f = e.target.files?.[0] || null;
    if (!f) return;
    setImgFileRef(f);
    setImgFileName(f.name);
    setImgUploaded(false);
    setImgUrl("");
    setValue("profileImage", "");
    setImgPreview(URL.createObjectURL(f));
  };
  const handleImgUpload = () =>
    uploadFile(imgFileRef, {
      label: "Photo",
      onUrl: (url) => {
        setValue("profileImage", url);
        setImgUrl(url);
        setImgPreview(url);
      },
      setUploading: setImgUploading,
      setUploaded: setImgUploaded,
    });

  const onSubmit = async (data) => {
    const payload = {
      phone: data.phone || undefined,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString() : undefined,
      gender: data.gender || undefined,
      headline: data.headline || undefined,
      bio: data.bio || undefined,
      profileImage: data.profileImage || undefined,
      resumeUrl: data.resumeUrl || undefined,
      preferredRole: data.preferredRole || undefined,
      preferredLocation: data.preferredLocation?.length ? data.preferredLocation : undefined,
      expectedSalary: data.expectedSalary ? parseInt(data.expectedSalary, 10) : undefined,
      willingToRelocate: data.willingToRelocate,
      openToRemote: data.openToRemote,
      skills: data.skills?.length ? data.skills : undefined,
    };
    // strip undefined top-level keys
    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

    setSubmitting(true);
    try {
      await updateStudentProfile(payload);
      toast.success("Profile updated!");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

        <motion.div
          className="relative w-full max-w-3xl my-8 card-soft p-5 z-10"
          initial={{ scale: 0.96, y: 16 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.96, y: 16 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-display font-bold">Update Profile</h2>
              <p className="text-xs text-muted-foreground">Edit any fields, then save.</p>
            </div>
            <button
              onClick={onClose}
              className="h-7 w-7 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid sm:grid-cols-3 gap-3">
              {/* ── Profile Photo ── */}
              <div className="sm:col-span-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                  Profile Photo
                </span>
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-xl border border-border bg-muted/40 overflow-hidden shrink-0 flex items-center justify-center">
                    {imgPreview ? (
                      <img
                        src={imgPreview}
                        alt="preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <Upload className="h-5 w-5 text-muted-foreground/50" />
                    )}
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <label className="flex-1 cursor-pointer">
                      <div
                        className={`h-9 px-2.5 rounded-lg bg-card border text-xs flex items-center gap-1.5 overflow-hidden ${
                          imgUploaded ? "border-green-500/60" : "border-border"
                        }`}
                      >
                        {imgUploaded ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                        ) : (
                          <Upload className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        )}
                        <span className="truncate text-muted-foreground">
                          {imgFileName || "Choose image…"}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImgChange}
                      />
                    </label>
                    <button
                      type="button"
                      disabled={!imgFileRef || imgUploading || imgUploaded}
                      onClick={handleImgUpload}
                      className="btn-primary text-xs px-3 h-9 shrink-0 disabled:opacity-40 flex items-center gap-1"
                    >
                      {imgUploading ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading…
                        </>
                      ) : imgUploaded ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" /> Uploaded
                        </>
                      ) : (
                        <>
                          <Upload className="h-3.5 w-3.5" /> Upload
                        </>
                      )}
                    </button>
                  </div>
                </div>
                {imgUrl && (
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-green-600">
                    <CheckCircle2 className="h-3 w-3 shrink-0" />
                    <a
                      href={imgUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate hover:underline"
                    >
                      {imgUrl}
                    </a>
                  </div>
                )}
                <input type="hidden" {...register("profileImage")} />
              </div>

              {/* ── Basic Info ── */}
              <FL label="Phone">
                <input {...register("phone")} placeholder="9876543210" className={inputCls()} />
              </FL>
              <FL label="Date of Birth">
                <input type="date" {...register("dateOfBirth")} className={inputCls()} />
              </FL>
              <FL label="Gender">
                <select {...register("gender")} className={inputCls()}>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </FL>

              <div className="sm:col-span-3">
                <FL label="Headline">
                  <input
                    {...register("headline")}
                    placeholder="Full Stack Developer | MERN"
                    className={inputCls()}
                  />
                </FL>
              </div>

              <div className="sm:col-span-3">
                <FL label="Bio">
                  <textarea
                    {...register("bio")}
                    rows={2}
                    placeholder="A short bio…"
                    className="mt-0.5 w-full px-2.5 py-2 rounded-lg bg-card border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                  />
                </FL>
              </div>

              <div className="sm:col-span-2">
                <FL label="Resume URL">
                  <input
                    {...register("resumeUrl")}
                    placeholder="https://…/resume.pdf"
                    className={inputCls()}
                  />
                </FL>
              </div>
              <FL label="Expected Salary (₹)">
                <input
                  type="number"
                  {...register("expectedSalary")}
                  placeholder="1200000"
                  className={inputCls()}
                />
              </FL>

              <FL label="Preferred Role">
                <input
                  {...register("preferredRole")}
                  placeholder="Backend Developer"
                  className={inputCls()}
                />
              </FL>

              {/* Checkboxes */}
              <div className="flex items-center gap-4 pt-4">
                <Controller
                  name="willingToRelocate"
                  control={control}
                  render={({ field }) => (
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-3.5 w-3.5 rounded border-border accent-primary"
                      />
                      Willing to Relocate
                    </label>
                  )}
                />
                <Controller
                  name="openToRemote"
                  control={control}
                  render={({ field }) => (
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-3.5 w-3.5 rounded border-border accent-primary"
                      />
                      Open to Remote
                    </label>
                  )}
                />
              </div>

              {/* ── Preferred Locations ── */}
              <div className="sm:col-span-3">
                <FL label="Preferred Locations">
                  <div className="flex gap-2">
                    <input
                      value={locInput}
                      onChange={(e) => setLocInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLoc())}
                      placeholder="e.g. Bengaluru"
                      className="flex-1 h-9 px-2.5 rounded-lg bg-card border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                    <button type="button" onClick={addLoc} className="btn-primary text-xs px-3 h-9">
                      Add
                    </button>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {preferredLocation.map((l) => (
                      <span key={l} className="chip text-xs inline-flex items-center gap-1">
                        {l}
                        <button
                          type="button"
                          onClick={() => removeLoc(l)}
                          className="hover:text-destructive"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </FL>
              </div>

              {/* ── Skills ── */}
              <div className="sm:col-span-3">
                <FL label="Skills">
                  <div className="flex gap-2">
                    <input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                      placeholder="e.g. React, Node.js…"
                      className="flex-1 h-9 px-2.5 rounded-lg bg-card border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="btn-primary text-xs px-3 h-9"
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {skills.map((s) => (
                      <span key={s} className="chip text-xs inline-flex items-center gap-1">
                        {s}
                        <button
                          type="button"
                          onClick={() => removeSkill(s)}
                          className="hover:text-destructive"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </FL>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex items-center justify-end gap-2">
              <button type="button" onClick={onClose} className="btn-outline text-xs h-8 px-4">
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary text-xs h-8 px-5 inline-flex items-center gap-1.5"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…
                  </>
                ) : (
                  <>
                    <Edit2 className="h-3.5 w-3.5" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Inner profile component ──────────────────────────────────────────────────

function ProfileInner() {
  const { profile, profileLoading, profileError, fetchProfile } = useProfile();
  const navigate = useNavigate();
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    fetchProfile().catch(() => {});
  }, [fetchProfile]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (profileLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
        <p className="text-muted-foreground text-sm">Loading your profile…</p>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (profileError && !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <p className="text-destructive font-semibold">Could not load profile</p>
        <p className="text-muted-foreground text-sm">{profileError}</p>
        <button
          onClick={() => fetchProfile().catch(() => {})}
          className="btn-outline text-sm inline-flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" /> Retry
        </button>
      </div>
    );
  }

  // ── Profile not complete ───────────────────────────────────────────────────
  if (!profile || !profile.profileCompleted) {
    navigate("/profile-complete");
    return null;
  }

  const p = profile;
  const currentAddress = p.addresses?.find((a) => a.type === "CURRENT");
  const socialMap = Object.fromEntries((p.socialLinks || []).map((s) => [s.platform, s.url]));
  const filled = [
    p.phone,
    p.headline,
    p.bio,
    p.resumeUrl,
    p.preferredRole,
    p.educations?.length,
    p.addresses?.length,
    p.socialLinks?.length,
  ].filter(Boolean).length;
  const completionPct = Math.round((filled / 8) * 100);

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Main column ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header card */}
          <div className="card-soft p-6 sm:p-8">
            <div className="flex items-start gap-5 flex-wrap">
              {p.profileImage ? (
                <img
                  src={p.profileImage}
                  alt="Avatar"
                  className="h-24 w-24 rounded-2xl ring-2 ring-border object-cover bg-muted"
                />
              ) : (
                <div className="h-24 w-24 rounded-2xl ring-2 ring-border bg-muted grid place-items-center text-3xl font-bold text-muted-foreground">
                  {p.fullName?.[0]?.toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-display font-extrabold">{p.fullName}</h1>
                    {p.headline && <p className="text-muted-foreground mt-0.5">{p.headline}</p>}
                  </div>
                  {/* ── Update button ── */}
                  <button
                    onClick={() => setShowUpdate(true)}
                    className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-xl border border-border hover:bg-muted transition-colors"
                  >
                    <Edit2 className="h-4 w-4" /> Edit Profile
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  {p.email && (
                    <span className="inline-flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {p.email}
                    </span>
                  )}
                  {p.phone && (
                    <span className="inline-flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {p.phone}
                    </span>
                  )}
                  {currentAddress && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {currentAddress.city}, {currentAddress.state}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {p.bio && <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{p.bio}</p>}
          </div>

          {/* Skills */}
          {p.skills?.length > 0 && (
            <Section title="Skills" icon={<Code2 className="h-4 w-4 text-primary" />}>
              <div className="flex flex-wrap gap-2">
                {p.skills.map((s) => (
                  <span key={s} className="chip capitalize">
                    {s}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Job preferences */}
          {(p.preferredRole || p.preferredLocation?.length) && (
            <Section title="Job Preferences">
              <dl className="grid sm:grid-cols-2 gap-3 text-sm">
                {p.preferredRole && (
                  <Row
                    k="Preferred Role"
                    v={
                      <span className="inline-flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {p.preferredRole}
                      </span>
                    }
                  />
                )}
                {p.expectedSalary && (
                  <Row
                    k="Expected Salary"
                    v={
                      <span className="inline-flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />₹{p.expectedSalary.toLocaleString()}
                      </span>
                    }
                  />
                )}
                {p.willingToRelocate !== undefined && (
                  <Row k="Willing to Relocate" v={p.willingToRelocate ? "Yes" : "No"} />
                )}
                {p.openToRemote !== undefined && (
                  <Row k="Open to Remote" v={p.openToRemote ? "Yes" : "No"} />
                )}
              </dl>
              {p.preferredLocation?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.preferredLocation.map((loc) => (
                    <span key={loc} className="chip">
                      {loc}
                    </span>
                  ))}
                </div>
              )}
            </Section>
          )}

          {/* Education */}
          {p.educations?.length > 0 && (
            <Section title="Education">
              <ul className="space-y-4">
                {p.educations.map((edu, i) => (
                  <li key={i} className="rounded-xl bg-muted/60 p-4">
                    <div className="flex items-start gap-3">
                      <GraduationCap className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                      <div>
                        <p className="font-semibold">{edu.institutionName}</p>
                        <p className="text-sm text-muted-foreground">
                          {edu.degree} · {edu.fieldOfStudy}
                        </p>
                        <p className="text-sm text-muted-foreground">{edu.boardOrUniversity}</p>
                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                          {edu.startDate && (
                            <span>
                              {new Date(edu.startDate).getFullYear()} –{" "}
                              {edu.endDate ? new Date(edu.endDate).getFullYear() : "Present"}
                            </span>
                          )}
                          {edu.cgpa && <span>CGPA: {edu.cgpa}</span>}
                          {edu.percentage && <span>Percentage: {edu.percentage}%</span>}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Addresses */}
          {p.addresses?.length > 0 && (
            <Section title="Addresses">
              <div className="grid sm:grid-cols-2 gap-4">
                {p.addresses.map((addr, i) => (
                  <div key={i} className="rounded-xl bg-muted/60 p-4 text-sm">
                    <p className="font-semibold mb-1">
                      {addr.type === "CURRENT" ? "Current" : "Permanent"} Address
                    </p>
                    <p className="text-muted-foreground">
                      {[addr.building, addr.street, addr.landMark].filter(Boolean).join(", ")}
                    </p>
                    <p className="text-muted-foreground">
                      {addr.city}, {addr.district}
                    </p>
                    <p className="text-muted-foreground">
                      {addr.state}, {addr.country} – {addr.pinCode}
                    </p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Resume & Links */}
          <Section title="Resume & Links">
            <div className="flex flex-wrap gap-3 text-sm">
              {p.resumeUrl && (
                <a
                  href={p.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline inline-flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Resume
                </a>
              )}
              {socialMap.LinkedIn && (
                <a
                  href={socialMap.LinkedIn}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline inline-flex items-center gap-2"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              )}
              {socialMap.GitHub && (
                <a
                  href={socialMap.GitHub}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline inline-flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              )}
              {socialMap.Portfolio && (
                <a
                  href={socialMap.Portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline inline-flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  Portfolio
                </a>
              )}
              {socialMap.Twitter && (
                <a
                  href={socialMap.Twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline inline-flex items-center gap-2"
                >
                  <Twitter className="h-4 w-4" />
                  Twitter
                </a>
              )}
            </div>
          </Section>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-6">
          <ProfileCompletionCard percent={completionPct} />

          {currentAddress && (
            <div className="card-soft p-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[color:var(--ncc-maroon)]" />
                <h3 className="font-semibold">Based in</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {currentAddress.city}, {currentAddress.state}
              </p>
            </div>
          )}

          <div className="card-soft p-6">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-[color:var(--ncc-gold)]" />
              <h3 className="font-semibold">NCC Information</h3>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                NCC details are managed separately in your settings.
              </p>
            </div>
          </div>

          <div className="card-soft p-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Profile Stats</h3>
            </div>
            <dl className="mt-4 space-y-2">
              <Row k="Education entries" v={p.educations?.length ?? 0} />
              <Row k="Addresses" v={p.addresses?.length ?? 0} />
              <Row k="Social links" v={p.socialLinks?.length ?? 0} />
              <Row k="Skills" v={p.skills?.length ?? 0} />
            </dl>
          </div>
        </div>
      </div>

      {/* Update modal */}
      {showUpdate && (
        <UpdateProfileModal
          profile={p}
          onClose={() => setShowUpdate(false)}
          onSuccess={() => fetchProfile().catch(() => {})}
        />
      )}
    </>
  );
}

// ─── Page wrapper ─────────────────────────────────────────────────────────────

export default function Profile() {
  return (
    <DashboardLayout>
      <ProfileInner />
    </DashboardLayout>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Section({ title, icon, children }) {
  return (
    <div className="card-soft p-6">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h2 className="font-display font-bold text-lg">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 last:border-0 pb-1.5 last:pb-0">
      <dt className="text-muted-foreground text-sm">{k}</dt>
      <dd className="font-semibold text-sm">{v}</dd>
    </div>
  );
}
