import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Plus,
  Trash2,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Upload,
  CheckCircle2,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import { ProfileProvider, useProfile } from "../context/ProfileContext";
import { api } from "../services/api";

// ─── Constants (aligned with backend Zod schema) ──────────────────────────────

const GENDERS = ["MALE", "FEMALE", "OTHER"];
const EDU_LEVELS = [
  "HIGH_SCHOOL",
  "DIPLOMA",
  "BACHELORS",
  "MASTERS",
  "PHD",
  "CERTIFICATION",
  "OTHER",
];
const ADDR_TYPES = ["CURRENT", "PERMANENT", "HOSTEL", "OFFICE", "OTHER"];
const SOCIAL_PLATFORMS = ["GitHub", "LinkedIn", "Portfolio", "Twitter", "LeetCode", "Other"];

const STEPS = [
  {
    label: "Personal Info",
    fields: ["phone", "dateOfBirth", "gender", "headline", "bio", "profileImage", "resumeUrl"],
  },
  {
    label: "Preferences",
    fields: [
      "preferredRole",
      "expectedSalary",
      "preferredLocation",
      "willingToRelocate",
      "openToRemote",
      "skills",
    ],
  },
  { label: "Addresses", fields: ["addresses"] },
  { label: "Education", fields: ["educations"] },
  { label: "Social Links", fields: ["socialLinks"] },
];

// ─── Default values ───────────────────────────────────────────────────────────

const defaultValues = {
  phone: "",
  dateOfBirth: "",
  gender: "MALE",
  headline: "",
  bio: "",
  profileImage: "",
  resumeUrl: "",
  preferredRole: "",
  preferredLocation: [],
  skills: [],
  expectedSalary: "",
  willingToRelocate: false,
  openToRemote: false,
  addresses: [
    {
      type: "CURRENT",
      city: "",
      district: "",
      state: "",
      country: "India",
      pinCode: "",
      landMark: "",
      building: "",
      street: "",
    },
    {
      type: "PERMANENT",
      city: "",
      district: "",
      state: "",
      country: "India",
      pinCode: "",
      landMark: "",
      building: "",
      street: "",
    },
  ],
  educations: [
    {
      level: "BACHELORS",
      institutionName: "",
      boardOrUniversity: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      cgpa: "",
      percentage: "",
    },
  ],
  socialLinks: [
    { platform: "GitHub", url: "" },
    { platform: "LinkedIn", url: "" },
  ],
};

// ─── Inner form component ─────────────────────────────────────────────────────

function ProfileCompletionFormInner() {
  const { submitProfile } = useProfile();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false); // local — NOT from context
  const [locationInput, setLocationInput] = useState("");
  const [skillInput, setSkillInput] = useState("");

  // ── File upload state ──────────────────────────────────────────────────────
  const [imageFile, setImageFile] = useState(null); // selected File object
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false); // true after successful upload

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);

  const uploadFile = async (file, onUrl, setUploading, setUploaded) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    try {
      const res = await api.post("/upload-file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!res.data?.success) throw new Error(res.data?.message || "Upload failed");
      const url = res.data.data; // backend returns the URL string directly in data
      onUrl(url);
      setUploaded(true);
      toast.success("File uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.response?.data?.message || err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const {
    register,
    control,
    handleSubmit,
    trigger,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({ defaultValues, mode: "onTouched" });

  // Field arrays
  const addressArray = useFieldArray({ control, name: "addresses" });
  const educationArray = useFieldArray({ control, name: "educations" });
  const socialArray = useFieldArray({ control, name: "socialLinks" });

  const preferredLocation = watch("preferredLocation");
  const skills = watch("skills");

  // ── Location chip helpers ──────────────────────────────────────────────────
  const addLocation = () => {
    const loc = locationInput.trim();
    if (loc && !preferredLocation.includes(loc)) {
      setValue("preferredLocation", [...preferredLocation, loc]);
    }
    setLocationInput("");
  };
  const removeLocation = (loc) =>
    setValue(
      "preferredLocation",
      preferredLocation.filter((l) => l !== loc),
    );

  // ── Skill chip helpers ─────────────────────────────────────────────────────
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

  // ── Step navigation ────────────────────────────────────────────────────────
  const goNext = async () => {
    const valid = await trigger(STEPS[step - 1].fields);
    if (valid) setStep((s) => Math.min(STEPS.length, s + 1));
  };
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  // ── Submit ─────────────────────────────────────────────────────────────────
  const onSubmit = async (formData) => {
    // Build clean payload matching backend schema exactly
    const payload = {
      phone: formData.phone || undefined,
      dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : undefined,
      gender: formData.gender || undefined,
      headline: formData.headline || undefined,
      bio: formData.bio || undefined,
      profileImage: formData.profileImage || undefined,
      resumeUrl: formData.resumeUrl || undefined,
      preferredRole: formData.preferredRole || undefined,
      preferredLocation: formData.preferredLocation?.length
        ? formData.preferredLocation
        : undefined,
      expectedSalary: formData.expectedSalary ? parseInt(formData.expectedSalary, 10) : undefined,
      willingToRelocate: formData.willingToRelocate,
      openToRemote: formData.openToRemote,
      addresses: formData.addresses
        .filter((a) => a.city.trim())
        .map(({ cgpa, percentage, ...a }) => a), // strip edu-only fields if any
      educations: formData.educations
        .filter((e) => e.institutionName.trim())
        .map((e) => ({
          level: e.level,
          institutionName: e.institutionName,
          boardOrUniversity: e.boardOrUniversity || undefined,
          degree: e.degree || undefined,
          fieldOfStudy: e.fieldOfStudy || undefined,
          startDate: e.startDate ? new Date(e.startDate).toISOString() : new Date().toISOString(),
          endDate: e.endDate ? new Date(e.endDate).toISOString() : undefined,
          cgpa: e.cgpa ? parseFloat(e.cgpa) : undefined,
          percentage: e.percentage ? parseFloat(e.percentage) : undefined,
        })),
      socialLinks: formData.socialLinks
        .filter((s) => s.url.trim())
        .map((s) => ({ platform: s.platform, url: s.url })),
      skills: formData.skills?.length ? formData.skills : undefined,
    };

    console.log("📤 Submitting profile payload:", JSON.stringify(payload, null, 2));

    setSubmitting(true);
    try {
      await submitProfile(payload);
      toast.success("Profile completed successfully!");
      navigate("/profile");
    } catch (err) {
      console.error("❌ Profile submission error:", err);
      toast.error(err.message || "Failed to save profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Error helper ───────────────────────────────────────────────────────────
  const Err = ({ name }) => {
    const msg = name.split(".").reduce((o, k) => o?.[k], errors)?.message;
    return msg ? <p className="mt-1 text-xs text-destructive">{msg}</p> : null;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-6">
          <div className="h-9 w-9 rounded-xl hero-gradient grid place-items-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="font-display font-extrabold">NCC Career AI</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-soft p-8"
        >
          {/* Header + progress */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-display font-extrabold">Complete your profile</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Step {step} of {STEPS.length} — {STEPS[step - 1].label}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: i + 1 === step ? "32px" : "10px",
                    background: i + 1 <= step ? "var(--primary)" : "var(--muted)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Step tabs */}
          <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
            {STEPS.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setStep(i + 1)}
                className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  i + 1 === step
                    ? "bg-primary text-primary-foreground font-semibold"
                    : i + 1 < step
                      ? "bg-primary/15 text-primary font-medium"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}. {s.label}
              </button>
            ))}
          </div>

          {/* ── Form ── */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            onKeyDown={(e) => {
              // Prevent Enter from auto-submitting the multi-step form.
              // Only allow it in textareas (where Enter = new line).
              if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
                e.preventDefault();
              }
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* ── STEP 1: Personal Info ── */}
                {step === 1 && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <F label="Phone">
                        <input
                          {...register("phone")}
                          placeholder="9876543210"
                          className={inputCls(errors.phone)}
                        />
                      </F>
                      <Err name="phone" />
                    </div>

                    <div>
                      <F label="Gender">
                        <select {...register("gender")} className={inputCls()}>
                          {GENDERS.map((g) => (
                            <option key={g} value={g}>
                              {g}
                            </option>
                          ))}
                        </select>
                      </F>
                    </div>

                    <div>
                      <F label="Date of Birth">
                        <input
                          type="date"
                          {...register("dateOfBirth")}
                          className={inputCls(errors.dateOfBirth)}
                        />
                      </F>
                      <Err name="dateOfBirth" />
                    </div>

                    {/* Profile Image Upload */}
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                        Profile Image
                      </span>
                      <div className="flex items-center gap-2">
                        <label className="flex-1 cursor-pointer">
                          <div
                            className={`mt-1 h-11 px-3 rounded-xl bg-card border text-sm flex items-center gap-2 overflow-hidden ${
                              imageUploaded ? "border-green-500/60" : "border-border"
                            }`}
                          >
                            {imageUploaded ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                            ) : (
                              <Upload className="h-4 w-4 text-muted-foreground shrink-0" />
                            )}
                            <span className="truncate text-muted-foreground">
                              {imageFile ? imageFile.name : "Choose image file…"}
                            </span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0] || null;
                              setImageFile(f);
                              setImageUploaded(false); // allow re-upload
                              setValue("profileImage", ""); // clear old URL
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          disabled={!imageFile || imageUploading || imageUploaded}
                          onClick={() =>
                            uploadFile(
                              imageFile,
                              (url) => setValue("profileImage", url),
                              setImageUploading,
                              setImageUploaded,
                            )
                          }
                          className="btn-primary text-sm px-3 h-11 shrink-0 disabled:opacity-40 flex items-center gap-1.5"
                        >
                          {imageUploading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : imageUploaded ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                          {imageUploading ? "Uploading…" : imageUploaded ? "Uploaded" : "Upload"}
                        </button>
                      </div>
                      {/* Hidden registered field to hold the URL */}
                      <input
                        type="hidden"
                        {...register("profileImage", {
                          validate: (v) => !v || /^https?:\/\/.+/.test(v) || "Must be a valid URL",
                        })}
                      />
                      <Err name="profileImage" />
                    </div>

                    <div className="sm:col-span-2">
                      <F label="Professional Headline">
                        <input
                          {...register("headline")}
                          placeholder="Full Stack Developer | React | Node.js"
                          className={inputCls(errors.headline)}
                        />
                      </F>
                      <Err name="headline" />
                    </div>

                    <div className="sm:col-span-2">
                      <F label="Bio">
                        <textarea
                          rows={3}
                          {...register("bio")}
                          placeholder="Tell recruiters about yourself…"
                          className={`${inputCls()} h-auto px-3 py-2 resize-none`}
                        />
                      </F>
                    </div>

                    {/* Resume Upload */}
                    <div className="sm:col-span-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                        Resume / CV
                      </span>
                      <div className="flex items-center gap-2">
                        <label className="flex-1 cursor-pointer">
                          <div
                            className={`mt-1 h-11 px-3 rounded-xl bg-card border text-sm flex items-center gap-2 overflow-hidden ${
                              resumeUploaded ? "border-green-500/60" : "border-border"
                            }`}
                          >
                            {resumeUploaded ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                            ) : (
                              <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                            )}
                            <span className="truncate text-muted-foreground">
                              {resumeFile ? resumeFile.name : "Choose PDF / DOCX file…"}
                            </span>
                          </div>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,application/pdf"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0] || null;
                              setResumeFile(f);
                              setResumeUploaded(false);
                              setValue("resumeUrl", "");
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          disabled={!resumeFile || resumeUploading || resumeUploaded}
                          onClick={() =>
                            uploadFile(
                              resumeFile,
                              (url) => setValue("resumeUrl", url),
                              setResumeUploading,
                              setResumeUploaded,
                            )
                          }
                          className="btn-primary text-sm px-3 h-11 shrink-0 disabled:opacity-40 flex items-center gap-1.5"
                        >
                          {resumeUploading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : resumeUploaded ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                          {resumeUploading ? "Uploading…" : resumeUploaded ? "Uploaded" : "Upload"}
                        </button>
                      </div>
                      <input
                        type="hidden"
                        {...register("resumeUrl", {
                          validate: (v) => !v || /^https?:\/\/.+/.test(v) || "Must be a valid URL",
                        })}
                      />
                      <Err name="resumeUrl" />
                    </div>
                  </div>
                )}

                {/* ── STEP 2: Preferences ── */}
                {step === 2 && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <F label="Preferred Role">
                        <input
                          {...register("preferredRole")}
                          placeholder="Backend Developer"
                          className={inputCls()}
                        />
                      </F>
                    </div>

                    <div>
                      <F label="Expected Salary (₹)">
                        <input
                          type="number"
                          {...register("expectedSalary", {
                            min: { value: 1, message: "Must be positive" },
                          })}
                          placeholder="1200000"
                          className={inputCls(errors.expectedSalary)}
                        />
                      </F>
                      <Err name="expectedSalary" />
                    </div>

                    <div className="sm:col-span-2">
                      <F label="Preferred Locations">
                        <div className="flex gap-2">
                          <input
                            value={locationInput}
                            onChange={(e) => setLocationInput(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && (e.preventDefault(), addLocation())
                            }
                            placeholder="e.g. Bengaluru"
                            className="flex-1 h-11 px-3 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
                          />
                          <button
                            type="button"
                            onClick={addLocation}
                            className="btn-primary text-sm px-4"
                          >
                            Add
                          </button>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {preferredLocation.map((loc) => (
                            <span key={loc} className="chip inline-flex items-center gap-1">
                              {loc}
                              <button
                                type="button"
                                onClick={() => removeLocation(loc)}
                                className="hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </F>
                    </div>

                    <Controller
                      name="willingToRelocate"
                      control={control}
                      render={({ field }) => (
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 rounded border-border accent-primary"
                          />
                          <span className="text-sm font-medium">Willing to Relocate</span>
                        </label>
                      )}
                    />

                    <Controller
                      name="openToRemote"
                      control={control}
                      render={({ field }) => (
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 rounded border-border accent-primary"
                          />
                          <span className="text-sm font-medium">Open to Remote</span>
                        </label>
                      )}
                    />

                    {/* Skills chips */}
                    <div className="sm:col-span-2">
                      <F label="Skills">
                        <div className="flex gap-2">
                          <input
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                            placeholder="e.g. React, Node.js…"
                            className="flex-1 h-11 px-3 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
                          />
                          <button
                            type="button"
                            onClick={addSkill}
                            className="btn-primary text-sm px-4"
                          >
                            Add
                          </button>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {skills.map((s) => (
                            <span key={s} className="chip inline-flex items-center gap-1">
                              {s}
                              <button
                                type="button"
                                onClick={() => removeSkill(s)}
                                className="hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </F>
                    </div>
                  </div>
                )}

                {/* ── STEP 3: Addresses ── */}
                {step === 3 && (
                  <div className="space-y-6">
                    {addressArray.fields.map((field, idx) => (
                      <div key={field.id}>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-muted-foreground">
                            Address #{idx + 1}
                          </h3>
                          {addressArray.fields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => addressArray.remove(idx)}
                              className="text-destructive hover:text-destructive/80"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="sm:col-span-2">
                            <F label="Address Type *">
                              <select
                                {...register(`addresses.${idx}.type`, { required: "Required" })}
                                className={inputCls(errors.addresses?.[idx]?.type)}
                              >
                                {ADDR_TYPES.map((t) => (
                                  <option key={t} value={t}>
                                    {t}
                                  </option>
                                ))}
                              </select>
                            </F>
                            <Err name={`addresses.${idx}.type`} />
                          </div>
                          {[
                            { name: "building", label: "Building / Flat No.", required: false },
                            { name: "street", label: "Street", required: false },
                            { name: "landMark", label: "Landmark", required: false },
                            { name: "city", label: "City *", required: true },
                            { name: "district", label: "District *", required: true },
                            { name: "state", label: "State *", required: true },
                            { name: "country", label: "Country *", required: true },
                            { name: "pinCode", label: "Pin Code *", required: true },
                          ].map(({ name, label, required }) => (
                            <div key={name}>
                              <F label={label}>
                                <input
                                  {...register(`addresses.${idx}.${name}`, {
                                    required: required ? "Required" : false,
                                  })}
                                  className={inputCls(errors.addresses?.[idx]?.[name])}
                                />
                              </F>
                              <Err name={`addresses.${idx}.${name}`} />
                            </div>
                          ))}
                        </div>
                        {idx < addressArray.fields.length - 1 && (
                          <hr className="border-border/60 mt-6" />
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        addressArray.append({
                          type: "CURRENT",
                          city: "",
                          district: "",
                          state: "",
                          country: "India",
                          pinCode: "",
                          landMark: "",
                          building: "",
                          street: "",
                        })
                      }
                      className="btn-outline text-sm inline-flex items-center gap-2 w-full justify-center"
                    >
                      <Plus className="h-4 w-4" /> Add Address
                    </button>
                  </div>
                )}

                {/* ── STEP 4: Education ── */}
                {step === 4 && (
                  <div className="space-y-6">
                    {educationArray.fields.map((field, idx) => (
                      <div key={field.id} className="rounded-xl bg-muted/40 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-semibold text-muted-foreground">
                            Education #{idx + 1}
                          </p>
                          {educationArray.fields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => educationArray.remove(idx)}
                              className="text-destructive hover:text-destructive/80"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <F label="Level *">
                              <select
                                {...register(`educations.${idx}.level`, { required: "Required" })}
                                className={inputCls(errors.educations?.[idx]?.level)}
                              >
                                {EDU_LEVELS.map((l) => (
                                  <option key={l} value={l}>
                                    {l.replace(/_/g, " ")}
                                  </option>
                                ))}
                              </select>
                            </F>
                            <Err name={`educations.${idx}.level`} />
                          </div>
                          <div>
                            <F label="Institution Name *">
                              <input
                                {...register(`educations.${idx}.institutionName`, {
                                  required: "Institution name is required",
                                })}
                                className={inputCls(errors.educations?.[idx]?.institutionName)}
                              />
                            </F>
                            <Err name={`educations.${idx}.institutionName`} />
                          </div>
                          <div>
                            <F label="Board / University">
                              <input
                                {...register(`educations.${idx}.boardOrUniversity`)}
                                className={inputCls()}
                              />
                            </F>
                          </div>
                          <div>
                            <F label="Degree">
                              <input
                                {...register(`educations.${idx}.degree`)}
                                placeholder="B.Tech"
                                className={inputCls()}
                              />
                            </F>
                          </div>
                          <div>
                            <F label="Field of Study">
                              <input
                                {...register(`educations.${idx}.fieldOfStudy`)}
                                placeholder="Computer Science"
                                className={inputCls()}
                              />
                            </F>
                          </div>
                          <div />
                          <div>
                            <F label="Start Date *">
                              <input
                                type="date"
                                {...register(`educations.${idx}.startDate`, {
                                  required: "Required",
                                })}
                                className={inputCls(errors.educations?.[idx]?.startDate)}
                              />
                            </F>
                            <Err name={`educations.${idx}.startDate`} />
                          </div>
                          <div>
                            <F label="End Date">
                              <input
                                type="date"
                                {...register(`educations.${idx}.endDate`)}
                                className={inputCls()}
                              />
                            </F>
                          </div>
                          <div>
                            <F label="CGPA">
                              <input
                                type="number"
                                step="0.01"
                                {...register(`educations.${idx}.cgpa`, {
                                  min: { value: 0, message: "Must be ≥ 0" },
                                  max: { value: 10, message: "Must be ≤ 10" },
                                })}
                                placeholder="8.72"
                                className={inputCls(errors.educations?.[idx]?.cgpa)}
                              />
                            </F>
                            <Err name={`educations.${idx}.cgpa`} />
                          </div>
                          <div>
                            <F label="Percentage (%)">
                              <input
                                type="number"
                                step="0.01"
                                {...register(`educations.${idx}.percentage`, {
                                  min: { value: 0, message: "Must be ≥ 0" },
                                  max: { value: 100, message: "Must be ≤ 100" },
                                })}
                                placeholder="89.6"
                                className={inputCls(errors.educations?.[idx]?.percentage)}
                              />
                            </F>
                            <Err name={`educations.${idx}.percentage`} />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        educationArray.append({
                          level: "BACHELORS",
                          institutionName: "",
                          boardOrUniversity: "",
                          degree: "",
                          fieldOfStudy: "",
                          startDate: "",
                          endDate: "",
                          cgpa: "",
                          percentage: "",
                        })
                      }
                      className="btn-outline text-sm inline-flex items-center gap-2 w-full justify-center"
                    >
                      <Plus className="h-4 w-4" /> Add Education
                    </button>
                  </div>
                )}

                {/* ── STEP 5: Social Links ── */}
                {step === 5 && (
                  <div className="space-y-4">
                    {socialArray.fields.map((field, idx) => (
                      <div key={field.id} className="flex items-end gap-3">
                        <div className="w-36 shrink-0">
                          <F label="Platform">
                            <select
                              {...register(`socialLinks.${idx}.platform`)}
                              className={inputCls()}
                            >
                              {SOCIAL_PLATFORMS.map((p) => (
                                <option key={p}>{p}</option>
                              ))}
                            </select>
                          </F>
                        </div>
                        <div className="flex-1">
                          <F label="URL *">
                            <input
                              {...register(`socialLinks.${idx}.url`, {
                                validate: (v) =>
                                  !v || /^https?:\/\/.+/.test(v) || "Must be a valid URL",
                              })}
                              placeholder="https://github.com/username"
                              className={inputCls(errors.socialLinks?.[idx]?.url)}
                            />
                          </F>
                          <Err name={`socialLinks.${idx}.url`} />
                        </div>
                        {socialArray.fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => socialArray.remove(idx)}
                            className="text-destructive hover:text-destructive/80 mb-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => socialArray.append({ platform: "GitHub", url: "" })}
                      className="btn-outline text-sm inline-flex items-center gap-2 w-full justify-center"
                    >
                      <Plus className="h-4 w-4" /> Add Social Link
                    </button>

                    <div className="mt-4 rounded-2xl bg-primary/10 p-4 text-sm text-muted-foreground">
                      <strong className="text-foreground">Almost there.</strong> Hit{" "}
                      <em>Save Profile</em> below to complete your profile and start matching with
                      NCC-friendly jobs.
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={goBack}
                disabled={step === 1}
                className="btn-outline text-sm inline-flex items-center gap-1.5 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>

              {step < STEPS.length ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="btn-primary text-sm inline-flex items-center gap-1.5"
                >
                  Continue <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                /* Final step — explicit submit button */
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary text-sm inline-flex items-center gap-2 min-w-[150px] justify-center"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                    </>
                  ) : (
                    "Save Profile"
                  )}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Page export ──────────────────────────────────────────────────────────────

export default function ProfileCompletionForm() {
  return <ProfileCompletionFormInner />;
}

// ─── Style helpers ────────────────────────────────────────────────────────────

function inputCls(err) {
  return `mt-1 w-full h-11 px-3 rounded-xl bg-card border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
    err ? "border-destructive" : "border-border"
  }`;
}

function F({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
