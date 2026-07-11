import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Award, Star,
  Hash, Flag, Trophy, User, Edit2,
  Loader2, X, AlertCircle, Plus, Upload, CheckCircle2, Image,
} from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import { NccProfileProvider, useNccProfile } from "../context/NccProfileContext";
import { api } from "../services/api";

/* ─────────────────────────────────────────────
   ZOD SCHEMAS (mirrors backend validation)
───────────────────────────────────────────── */
const nccProfileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  FatherFullName: z.string().min(1, "Father's full name is required"),
  MotherFullName: z.string().min(1, "Mother's full name is required"),
  photo: z.string().min(1, "Photo URL is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  aadharNo: z.string().optional(),
  aadhar: z.string().optional(),
  nccDirector: z.string().min(1, "NCC Director is required"),
  nccGroupHQ: z.string().min(1, "NCC Group HQ is required"),
  enrolmentNumber: z.string().min(1, "Enrolment number is required"),
  nccBattalion: z.string().min(1, "NCC Battalion is required"),
  nccUnit: z.string().min(1, "NCC Unit is required"),
  nccCirtificate: z.string().optional(),
  nccRank: z.string().optional(),
});

const updateNccProfileSchema = nccProfileSchema.partial();

/* ─────────────────────────────────────────────
   STYLE HELPERS
───────────────────────────────────────────── */
function inputCls(err) {
  return `mt-1 w-full h-11 px-3 rounded-xl bg-card border text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 ${
    err ? "border-destructive" : "border-border"
  }`;
}

function F({ label, children, required = false }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}

function FieldError({ errors, name }) {
  const msg = name.split(".").reduce((o, k) => o?.[k], errors)?.message;
  return msg ? <p className="mt-1 text-xs text-destructive">{msg}</p> : null;
}

/* ─────────────────────────────────────────────
   FORM FIELDS CONFIG
───────────────────────────────────────────── */
// photo + aadhar are handled by dedicated upload widgets (not in this list)
const CREATE_FIELDS = [
  { name: "fullName",       label: "Full Name",          required: true,  placeholder: "Bibek Samal" },
  { name: "FatherFullName", label: "Father's Full Name", required: true,  placeholder: "Ramesh Chandra Samal" },
  { name: "MotherFullName", label: "Mother's Full Name", required: true,  placeholder: "Sunita Samal" },
  { name: "dateOfBirth",    label: "Date of Birth",      required: true,  type: "date" },
  { name: "aadharNo",       label: "Aadhaar Number",     required: false, placeholder: "1234 1234 1234" },
  { name: "nccDirector",    label: "NCC Directorate",    required: true,  placeholder: "Odisha Directorate" },
  { name: "nccGroupHQ",     label: "NCC Group HQ",       required: true,  placeholder: "Cuttack Group HQ" },
  { name: "enrolmentNumber",label: "Enrolment Number",   required: true,  placeholder: "OD/SD/2024/001234" },
  { name: "nccBattalion",   label: "NCC Battalion",      required: true,  placeholder: "12 Odisha Battalion NCC" },
  { name: "nccUnit",        label: "NCC Unit",           required: true,  placeholder: "B Company" },
  { name: "nccCirtificate", label: "NCC Certificate",    required: false, placeholder: "B Certificate" },
  { name: "nccRank",        label: "NCC Rank",           required: false, placeholder: "Sergeant" },
];

/* ─────────────────────────────────────────────
   GENERIC FILE UPLOAD HELPER
───────────────────────────────────────────── */
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
    const url = res.data.data;
    onUrl(url);
    setUploaded(true);
    toast.success(`${label} uploaded!`);
  } catch (err) {
    toast.error(err.response?.data?.message || err.message || "Upload failed");
  } finally {
    setUploading(false);
  }
}

/* ─────────────────────────────────────────────
   PHOTO UPLOAD FIELD
───────────────────────────────────────────── */
function PhotoUploadField({ register, setValue, errors, defaultPreview = "" }) {
  // fileName kept in its own state — never cleared when browser resets the native <input>
  const [fileName, setFileName]       = useState("");
  const [fileRef, setFileRef]         = useState(null);
  const [uploading, setUploading]     = useState(false);
  const [uploaded, setUploaded]       = useState(!!defaultPreview);
  const [preview, setPreview]         = useState(defaultPreview);
  const [uploadedUrl, setUploadedUrl] = useState(defaultPreview);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    if (!f) return;
    setFileRef(f);
    setFileName(f.name);   // persist filename in state
    setUploaded(false);
    setUploadedUrl("");
    setValue("photo", "");
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = () =>
    uploadFile(fileRef, {
      label: "Photo",
      onUrl: (url) => { setValue("photo", url); setPreview(url); setUploadedUrl(url); },
      setUploading,
      setUploaded,
    });

  return (
    <div className="sm:col-span-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
        Profile Photo <span className="text-destructive">*</span>
      </span>

      <div className="flex items-start gap-4">
        {/* Thumbnail preview */}
        <div className="h-20 w-20 rounded-2xl border border-border bg-muted/40 overflow-hidden shrink-0 flex items-center justify-center">
          {preview
            ? <img src={preview} alt="Preview" className="h-full w-full object-cover"
                onError={(e) => { e.target.style.display = "none"; }} />
            : <Image className="h-8 w-8 text-muted-foreground/50" />}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <label className="flex-1 cursor-pointer">
              <div className={`h-11 px-3 rounded-xl bg-card border text-sm flex items-center gap-2 overflow-hidden ${
                uploaded ? "border-green-500/60" : errors?.photo ? "border-destructive" : "border-border"
              }`}>
                {uploaded
                  ? <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  : <Upload className="h-4 w-4 text-muted-foreground shrink-0" />}
                <span className="truncate text-muted-foreground text-sm">
                  {fileName || "Choose image file…"}
                </span>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>

            <button type="button" disabled={!fileRef || uploading || uploaded} onClick={handleUpload}
              className="btn-primary text-sm px-3 h-11 shrink-0 disabled:opacity-40 flex items-center gap-1.5">
              {uploading
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</>
                : uploaded
                ? <><CheckCircle2 className="h-4 w-4" /> Uploaded</>
                : <><Upload className="h-4 w-4" /> Upload</>}
            </button>
          </div>

          {/* Visible URL after upload */}
          {uploadedUrl && (
            <div className="flex items-center gap-1.5 text-xs text-green-600">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <a href={uploadedUrl} target="_blank" rel="noopener noreferrer"
                className="truncate hover:underline font-medium">{uploadedUrl}</a>
            </div>
          )}
        </div>
      </div>

      <input type="hidden" {...register("photo", { required: "Photo is required" })} />
      {errors?.photo && <p className="mt-1 text-xs text-destructive">{errors.photo.message}</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   AADHAAR DOCUMENT UPLOAD FIELD
───────────────────────────────────────────── */
function AadharUploadField({ register, setValue, defaultUrl = "" }) {
  const [fileName, setFileName]       = useState("");
  const [fileRef, setFileRef]         = useState(null);
  const [uploading, setUploading]     = useState(false);
  const [uploaded, setUploaded]       = useState(!!defaultUrl);
  const [uploadedUrl, setUploadedUrl] = useState(defaultUrl);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    if (!f) return;
    setFileRef(f);
    setFileName(f.name);
    setUploaded(false);
    setUploadedUrl("");
    setValue("aadhar", "");
  };

  const handleUpload = () =>
    uploadFile(fileRef, {
      label: "Aadhaar document",
      onUrl: (url) => { setValue("aadhar", url); setUploadedUrl(url); },
      setUploading,
      setUploaded,
    });

  return (
    <div className="sm:col-span-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
        Aadhaar Document
      </span>

      <div className="flex items-center gap-2">
        <label className="flex-1 cursor-pointer">
          <div className={`h-11 px-3 rounded-xl bg-card border text-sm flex items-center gap-2 overflow-hidden ${
            uploaded ? "border-green-500/60" : "border-border"
          }`}>
            {uploaded
              ? <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
              : <Upload className="h-4 w-4 text-muted-foreground shrink-0" />}
            <span className="truncate text-muted-foreground text-sm">
              {fileName || "Choose PDF / image file…"}
            </span>
          </div>
          <input type="file" accept=".pdf,image/*,application/pdf" className="hidden"
            onChange={handleFileChange} />
        </label>

        <button type="button" disabled={!fileRef || uploading || uploaded} onClick={handleUpload}
          className="btn-primary text-sm px-3 h-11 shrink-0 disabled:opacity-40 flex items-center gap-1.5">
          {uploading
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</>
            : uploaded
            ? <><CheckCircle2 className="h-4 w-4" /> Uploaded</>
            : <><Upload className="h-4 w-4" /> Upload</>}
        </button>
      </div>

      {/* Visible URL after upload */}
      {uploadedUrl && (
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-green-600">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          <a href={uploadedUrl} target="_blank" rel="noopener noreferrer"
            className="truncate hover:underline font-medium">{uploadedUrl}</a>
        </div>
      )}

      <input type="hidden" {...register("aadhar")} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   CREATE FORM
───────────────────────────────────────────── */
function CreateNccProfileForm() {
  const { createProfile } = useNccProfile();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(nccProfileSchema),
    defaultValues: {
      fullName: "", FatherFullName: "", MotherFullName: "", photo: "",
      dateOfBirth: "", aadharNo: "", aadhar: "", nccDirector: "",
      nccGroupHQ: "", enrolmentNumber: "", nccBattalion: "",
      nccUnit: "", nccCirtificate: "", nccRank: "",
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await createProfile(data);
      toast.success("NCC Profile created successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to create NCC profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl hero-gradient text-white p-7 sm:p-10 relative overflow-hidden mb-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(201,162,39,0.35),transparent_45%)]" />
        <div className="relative flex items-start gap-4">
          <div className="h-14 w-14 rounded-2xl bg-white/15 grid place-items-center shrink-0">
            <Plus className="h-7 w-7 text-white" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-white/70">NCC Cadet</p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-display font-extrabold">
              Create your NCC Profile
            </h1>
            <p className="mt-1 text-sm text-white/70">
              Fill in your NCC details to showcase your service record.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="card-soft p-6 sm:p-8"
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Photo upload widget */}
            <PhotoUploadField register={register} setValue={setValue} errors={errors} />

            {/* Text fields */}
            {CREATE_FIELDS.map(({ name, label, required, type, placeholder }) => (
              <div key={name}>
                <F label={label} required={required}>
                  <input
                    type={type || "text"}
                    {...register(name)}
                    placeholder={placeholder}
                    className={inputCls(errors[name])}
                  />
                </F>
                <FieldError errors={errors} name={name} />
              </div>
            ))}

            {/* Aadhaar document upload widget */}
            <AadharUploadField register={register} setValue={setValue} />
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary text-sm inline-flex items-center gap-2 min-w-[160px] justify-center"
            >
              {submitting
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating…</>
                : <><Shield className="h-4 w-4" /> Create NCC Profile</>}
            </button>
          </div>
        </form>
      </motion.div>
    </DashboardLayout>
  );
}

/* ─────────────────────────────────────────────
   UPDATE MODAL
───────────────────────────────────────────── */
function UpdateNccProfileModal({ profile, onClose }) {
  const { updateProfile } = useNccProfile();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateNccProfileSchema),
    defaultValues: {
      fullName: profile.fullName ?? "",
      FatherFullName: profile.FatherFullName ?? "",
      MotherFullName: profile.MotherFullName ?? "",
      photo: profile.photo ?? "",
      dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.slice(0, 10) : "",
      aadharNo: profile.aadharNo ?? "",
      aadhar: profile.aadhar ?? "",
      nccDirector: profile.nccDirector ?? "",
      nccGroupHQ: profile.nccGroupHQ ?? "",
      enrolmentNumber: profile.enrolmentNumber ?? "",
      nccBattalion: profile.nccBattalion ?? "",
      nccUnit: profile.nccUnit ?? "",
      nccCirtificate: profile.nccCirtificate ?? "",
      nccRank: profile.nccRank ?? "",
    },
  });

  const onSubmit = async (data) => {
    const payload = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== "" && v !== undefined)
    );
    setSubmitting(true);
    try {
      await updateProfile(payload);
      toast.success("NCC Profile updated successfully!");
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to update NCC profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto card-soft p-6 sm:p-8 z-10"
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-display font-bold">Update NCC Profile</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Change only the fields you want to update.
              </p>
            </div>
            <button onClick={onClose}
              className="h-8 w-8 rounded-xl border border-border flex items-center justify-center hover:bg-muted transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Photo upload — pre-filled with existing photo */}
              <PhotoUploadField
                register={register}
                setValue={setValue}
                errors={errors}
                defaultPreview={profile.photo ?? ""}
              />

              {/* Text fields */}
              {CREATE_FIELDS.map(({ name, label, required, type, placeholder }) => (
                <div key={name}>
                  <F label={label} required={required}>
                    <input
                      type={type || "text"}
                      {...register(name)}
                      placeholder={placeholder}
                      className={inputCls(errors[name])}
                    />
                  </F>
                  <FieldError errors={errors} name={name} />
                </div>
              ))}

              {/* Aadhaar document upload — pre-filled with existing URL */}
              <AadharUploadField
                register={register}
                setValue={setValue}
                defaultUrl={profile.aadhar ?? ""}
              />
            </div>

            <div className="mt-8 flex items-center justify-end gap-3">
              <button type="button" onClick={onClose} className="btn-outline text-sm">
                Cancel
              </button>
              <button type="submit" disabled={submitting}
                className="btn-primary text-sm inline-flex items-center gap-2 min-w-[140px] justify-center">
                {submitting
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
                  : <><Edit2 className="h-4 w-4" /> Save Changes</>}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────
   PROFILE DISPLAY HELPERS
───────────────────────────────────────────── */
function Section({ icon: Icon, iconColor, title, children, delay = 0 }) {
  return (
    <motion.div
      className="card-soft p-5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-border">
        <div
          className="h-8 w-8 rounded-xl grid place-items-center shrink-0"
          style={{ background: `color-mix(in oklab, ${iconColor} 12%, white)` }}
        >
          <Icon className="h-4 w-4" style={{ color: iconColor }} />
        </div>
        <h2 className="font-display font-bold text-base">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border/60 last:border-0">
      <span className="text-sm text-muted-foreground shrink-0 w-44">{label}</span>
      <span className="text-sm font-semibold text-right">{value}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PROFILE VIEW
───────────────────────────────────────────── */
function NccProfileView({ profile }) {
  const [showUpdate, setShowUpdate] = useState(false);

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <DashboardLayout>
      {/* ── Hero Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl hero-gradient text-white p-7 sm:p-10 relative overflow-hidden mb-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(201,162,39,0.35),transparent_45%)]" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          {profile.photo ? (
            <img
              src={profile.photo}
              alt={profile.fullName}
              onError={(e) => { e.target.style.display = "none"; }}
              className="h-20 w-20 rounded-2xl ring-4 ring-white/30 object-cover shrink-0"
            />
          ) : (
            <div className="h-20 w-20 rounded-2xl ring-4 ring-white/30 bg-white/15 grid place-items-center shrink-0">
              <User className="h-10 w-10 text-white/70" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-widest text-white/70">NCC Cadet Profile</p>
            <h1 className="mt-1 text-3xl sm:text-4xl font-display font-extrabold">
              {profile.fullName}
            </h1>
            <div className="mt-2 flex flex-wrap gap-2">
              {profile.nccRank && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/15 backdrop-blur px-3 py-1 rounded-full">
                  <Star className="h-3 w-3" /> {profile.nccRank}
                </span>
              )}
              {profile.nccCirtificate && (
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: "var(--gradient-gold)", color: "#1a1200" }}
                >
                  <Award className="h-3 w-3" /> {profile.nccCirtificate}
                </span>
              )}
              {profile.enrolmentNumber && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/15 backdrop-blur px-3 py-1 rounded-full">
                  <Hash className="h-3 w-3" /> {profile.enrolmentNumber}
                </span>
              )}
            </div>
          </div>

          {/* Update button */}
          <button
            onClick={() => setShowUpdate(true)}
            className="shrink-0 inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            <Edit2 className="h-4 w-4" /> Update Profile
          </button>
        </div>
      </motion.div>

      {/* ── Profile Data ── */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* NCC Service Details */}
        <Section icon={Shield} iconColor="var(--ncc-maroon)" title="NCC Service Details" delay={0.05}>
          <Row label="Full Name" value={profile.fullName} />
          <Row label="Date of Birth" value={formatDate(profile.dateOfBirth)} />
          <Row label="Father's Name" value={profile.FatherFullName} />
          <Row label="Mother's Name" value={profile.MotherFullName} />
          <Row label="Enrolment Number" value={profile.enrolmentNumber} />
          <Row label="NCC Rank" value={profile.nccRank} />
          <Row label="NCC Certificate" value={profile.nccCirtificate} />
        </Section>

        {/* Unit Information */}
        <Section icon={Flag} iconColor="var(--ncc-army)" title="Unit Information" delay={0.08}>
          <Row label="NCC Directorate" value={profile.nccDirector} />
          <Row label="NCC Group HQ" value={profile.nccGroupHQ} />
          <Row label="NCC Battalion" value={profile.nccBattalion} />
          <Row label="NCC Unit" value={profile.nccUnit} />
        </Section>

        {/* Documents — only if at least one is present */}
        {(profile.aadharNo || profile.aadhar) && (
          <Section icon={Trophy} iconColor="var(--ncc-gold)" title="Documents" delay={0.11}>
            <Row label="Aadhaar Number" value={profile.aadharNo} />
            {profile.aadhar && (
              <div className="flex items-start justify-between gap-4 py-3 border-b border-border/60 last:border-0">
                <span className="text-sm text-muted-foreground shrink-0 w-44">Aadhaar Document</span>
                <a
                  href={profile.aadhar}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  View Document ↗
                </a>
              </div>
            )}
          </Section>
        )}
      </div>

      {/* Update Modal */}
      {showUpdate && (
        <UpdateNccProfileModal
          profile={profile}
          onClose={() => setShowUpdate(false)}
        />
      )}
    </DashboardLayout>
  );
}

/* ─────────────────────────────────────────────
   LOADING & ERROR STATES
───────────────────────────────────────────── */
function LoadingState() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Loading NCC profile…</p>
      </div>
    </DashboardLayout>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-foreground font-semibold">{message || "Failed to load profile"}</p>
        <button onClick={onRetry} className="btn-primary text-sm">
          Try Again
        </button>
      </div>
    </DashboardLayout>
  );
}

/* ─────────────────────────────────────────────
   INNER COMPONENT (uses context)
───────────────────────────────────────────── */
function NccCadetProfileInner() {
  const { nccProfile, nccLoading, nccError, fetchNccProfile } = useNccProfile();

  useEffect(() => {
    fetchNccProfile();
  }, [fetchNccProfile]);

  if (nccLoading) return <LoadingState />;
  if (nccError) return <ErrorState message={nccError} onRetry={fetchNccProfile} />;
  if (nccProfile === null) return <CreateNccProfileForm />;
  if (nccProfile) return <NccProfileView profile={nccProfile} />;
  return <LoadingState />;
}

/* ─────────────────────────────────────────────
   PAGE EXPORT
───────────────────────────────────────────── */
export default function NccCadetProfile() {
  return <NccCadetProfileInner />;
}
