import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  IndianRupee,
  Briefcase,
  Bookmark,
  Sparkles,
  Check,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import { useJobsContext } from "../context/JobsContext";
import { useProfile } from "../context/ProfileContext";

export default function JobDetails() {
  const { id } = useParams();
  const { jobs, savedJobsMap, toggleSaveJob, fetchJobs } = useJobsContext();
  const { profile } = useProfile();
  const [job, setJob] = useState(null);

  // If jobs not fetched yet, fetch them
  useEffect(() => {
    if (jobs.length === 0) {
      fetchJobs().catch(() => {});
    }
  }, [jobs, fetchJobs]);

  // Find job in central jobs array
  useEffect(() => {
    const found = jobs.find((j) => j.id === id);
    if (found) {
      setJob(found);
    }
  }, [jobs, id]);

  if (!job) {
    return (
      <DashboardLayout>
        <div className="text-muted-foreground">Loading job details…</div>
      </DashboardLayout>
    );
  }

  const saved = !!savedJobsMap[id];

  const handleSave = async () => {
    try {
      await toggleSaveJob(id);
    } catch (err) {
      // Error toast already triggered
    }
  };

  const handleApply = () => {
    if (job.applyLink) {
      window.open(job.applyLink, "_blank", "noopener,noreferrer");
    } else {
      toast.success("Application details opened.");
    }
  };

  // ── Derive company name & logo ──────────────────────────────────────────────
  const companyName = job.organization?.name || "TechCorp";
  const logoUrl =
    job.jobImage ||
    job.organization?.logo ||
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(companyName)}&backgroundColor=800000`;

  // ── Dynamic Skills Matching ──────────────────────────────────────────────────
  const userSkills = (profile?.skills || []).map((s) => s.toLowerCase());
  const jobSkills = job.skills || [];

  const matched = jobSkills.filter((s) => userSkills.includes(s.toLowerCase()));
  const missing = jobSkills.filter((s) => !userSkills.includes(s.toLowerCase()));

  // Base match calculation + NCC bonus
  const baseMatch =
    jobSkills.length > 0 ? Math.round((matched.length / jobSkills.length) * 100) : 80;
  const hasNcc = !!profile?.nccUnit || !!profile?.enrolmentNumber;
  const matchPercent = Math.min(100, baseMatch + (hasNcc ? 12 : 0));

  const displayMatched = matched.length > 0 ? matched : ["NCC Background", "Discipline"];
  const displayMissing = missing.length > 0 ? missing : ["None! Perfect fit"];

  const salaryText = job.ctc || job.stipend || "Not Disclosed";
  const jobType = job.hirignType
    ? job.hirignType.charAt(0) + job.hirignType.slice(1).toLowerCase()
    : "Full-time";
  const locationText = job.Location || "Remote";

  // format dates
  const startDateText = job.startDate ? new Date(job.startDate).toLocaleDateString() : "";
  const endDateText = job.endData ? new Date(job.endData).toLocaleDateString() : "";

  return (
    <DashboardLayout>
      <Link
        to="/jobs"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back to jobs
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 grid gap-6 lg:grid-cols-3"
      >
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl overflow-hidden card-soft">
            <div className="h-32 hero-gradient relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(201,162,39,0.4),transparent_45%)]" />
            </div>
            <div className="p-6 -mt-10">
              <img
                src={logoUrl}
                alt={companyName}
                className="h-16 w-16 rounded-2xl ring-4 ring-card bg-card object-cover"
              />
              <h1 className="mt-3 text-2xl font-display font-extrabold">{job.title}</h1>
              <p className="text-muted-foreground">{companyName}</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {locationText}
                </span>
                <span className="inline-flex items-center gap-1">
                  <IndianRupee className="h-4 w-4" />
                  {salaryText}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  {jobType}
                </span>
              </div>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={handleApply}
                  className="btn-primary py-2 px-5 font-semibold text-sm"
                >
                  Apply now
                </button>
                <button
                  onClick={handleSave}
                  className="btn-outline inline-flex items-center gap-2 py-2 px-4 text-sm font-semibold"
                >
                  <Bookmark className={`h-4 w-4 ${saved ? "fill-primary text-primary" : ""}`} />
                  {saved ? "Saved" : "Save job"}
                </button>
              </div>
            </div>
          </div>

          <Section title="Job description">
            <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
              {job.description}
            </p>
          </Section>

          {startDateText && (
            <Section title="Hiring Dates">
              <div className="flex gap-6 max-w-sm">
                <div>
                  <div className="text-xs text-muted-foreground uppercase font-semibold">
                    Start Date
                  </div>
                  <div className="font-semibold text-sm mt-1">{startDateText}</div>
                </div>
                {endDateText && (
                  <div>
                    <div className="text-xs text-muted-foreground uppercase font-semibold">
                      Apply End Date
                    </div>
                    <div className="font-semibold text-sm mt-1 text-destructive">{endDateText}</div>
                  </div>
                )}
              </div>
            </Section>
          )}

          <Section title="Skills required">
            <div className="flex flex-wrap gap-2">
              {jobSkills.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
          </Section>
        </div>

        <aside className="space-y-6">
          <div className="card-soft p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[color:var(--ncc-gold)]" />
              <h3 className="font-semibold text-sm sm:text-base">AI analysis</h3>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">Overall match</span>
                <span className="font-bold">{matchPercent}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full hero-gradient transition-all"
                  style={{ width: `${matchPercent}%` }}
                />
              </div>
            </div>
            <div className="mt-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Strengths
              </div>
              <ul className="mt-2 space-y-1 text-xs sm:text-sm">
                {displayMatched.map((m) => (
                  <li key={m} className="flex items-center gap-2 text-green-600 font-medium">
                    <Check className="h-4 w-4 text-[color:var(--ncc-army)] shrink-0" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Missing skills
              </div>
              <ul className="mt-2 space-y-1 text-xs sm:text-sm">
                {displayMissing.map((m) => (
                  <li
                    key={m}
                    className={`flex items-center gap-2 font-medium ${missing.length > 0 ? "text-destructive" : "text-muted-foreground"}`}
                  >
                    {missing.length > 0 ? (
                      <X className="h-4 w-4 text-destructive shrink-0" />
                    ) : (
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                    )}
                    {m}
                  </li>
                ))}
              </ul>
            </div>
            {job.description && (
              <div className="mt-5 rounded-xl bg-muted/60 p-3 text-xs sm:text-sm leading-relaxed">
                <strong>Suggestion:</strong> Align your profile headlines and highlight{" "}
                {missing.slice(0, 2).join(" & ") || "all required abilities"} to boost interview
                selector score.
              </div>
            )}
          </div>
        </aside>
      </motion.div>
    </DashboardLayout>
  );
}

function Section({ title, children }) {
  return (
    <div className="card-soft p-6">
      <h2 className="font-display font-bold text-base sm:text-lg">{title}</h2>
      <div className="mt-3 text-xs sm:text-sm">{children}</div>
    </div>
  );
}
