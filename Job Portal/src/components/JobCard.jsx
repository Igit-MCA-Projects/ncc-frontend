import { motion } from "framer-motion";
import { Bookmark, MapPin, IndianRupee, Briefcase, Sparkles, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useJobsContext } from "../context/JobsContext";
import { useProfile } from "../context/ProfileContext";

export default function JobCard({ job, index = 0 }) {
  const { savedJobsMap, toggleSaveJob } = useJobsContext();
  const { profile } = useProfile();

  const saved = !!savedJobsMap[job.id];

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleSaveJob(job.id);
    } catch (err) {
      // toast is already fired inside toggleSaveJob
      console.error("Toggle save error:", err);
    }
  };

  // ── Derive company name & logo ──────────────────────────────────────────────
  const companyName = job.organization?.name || "TechCorp";
  const logoUrl = job.jobImage || job.organization?.logo ||
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(companyName)}&backgroundColor=800000`;

  // ── Dynamic AI Match Calculation ──────────────────────────────────────────
  const userSkills = (profile?.skills || []).map((s) => s.toLowerCase());
  const jobSkills = job.skills || [];

  const matched = jobSkills.filter((s) => userSkills.includes(s.toLowerCase()));
  const missing = jobSkills.filter((s) => !userSkills.includes(s.toLowerCase()));

  // Base match calculation + NCC bonus
  const baseMatch = jobSkills.length > 0
    ? Math.round((matched.length / jobSkills.length) * 100)
    : 80;
  // If student has NCC profile context or cert
  const hasNcc = !!profile?.nccUnit || !!profile?.enrolmentNumber;
  const matchPercent = Math.min(100, baseMatch + (hasNcc ? 12 : 0));

  // Determine label matches list (show a default if empty)
  const displayMatched = matched.length > 0 ? matched : ["NCC Background", "Discipline"];
  const displayMissing = missing.length > 0 ? missing : ["None! Perfect fit"];

  // ── Salary and details mapping ──────────────────────────────────────────────
  const salaryText = job.ctc || job.stipend || "Not Disclosed";
  const jobType = job.hirignType ? job.hirignType.charAt(0) + job.hirignType.slice(1).toLowerCase() : "Full-time";
  const locationText = job.Location || "Remote";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="card-soft p-5 hover:shadow-lg transition-shadow flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <img
              src={logoUrl}
              alt={companyName}
              className="h-12 w-12 rounded-xl shrink-0 ring-1 ring-border bg-muted object-cover"
              onError={(e) => {
                e.target.src = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(companyName)}`;
              }}
            />
            <div className="min-w-0">
              <h3 className="font-semibold truncate text-sm sm:text-base">{job.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{companyName}</p>
              <div className="mt-2 flex flex-wrap gap-x-2.5 gap-y-1 text-[11px] sm:text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {locationText}
                </span>
                <span className="inline-flex items-center gap-1">
                  <IndianRupee className="h-3.5 w-3.5" />
                  {salaryText}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  {jobType}
                </span>
              </div>
            </div>
          </div>
          <button onClick={handleToggle} aria-label="Save" className="p-2 rounded-full hover:bg-muted shrink-0 transition-colors">
            <Bookmark className={`h-4.5 w-4.5 ${saved ? "fill-primary text-primary" : "text-muted-foreground"}`} />
          </button>
        </div>

        {/* Match Percentage indicator */}
        <div className="mt-4 flex items-center justify-between">
          <span className="chip text-[11px] inline-flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            {matchPercent}% Match
          </span>
          <span className="text-[10px] text-muted-foreground">
            {jobType}
          </span>
        </div>

        {/* Dynamic skills match UI */}
        <div className="mt-3.5 grid grid-cols-2 gap-3 text-[11px] sm:text-xs">
          <div>
            <div className="font-semibold text-muted-foreground/80 mb-1 pointer-events-none">Matched Skills</div>
            <ul className="space-y-1 text-muted-foreground">
              {displayMatched.slice(0, 3).map((m) => (
                <li key={m} className="flex items-center gap-1 truncate text-green-600 font-medium">
                  <Check className="h-3 w-3 shrink-0" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-semibold text-muted-foreground/80 mb-1 pointer-events-none">Missing Skills</div>
            <ul className="space-y-1 text-muted-foreground">
              {displayMissing.slice(0, 3).map((m) => (
                <li key={m} className={`flex items-center gap-1 truncate ${missing.length > 0 ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                  {missing.length > 0 ? <X className="h-3 w-3 shrink-0" /> : <Check className="h-3 w-3 shrink-0 text-green-500" />}
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <Link to={`/jobs/${job.id}`} className="btn-primary text-xs flex-1 text-center py-2 h-9 flex items-center justify-center font-bold">
          View Details
        </Link>
        <button onClick={handleToggle} className={`btn-outline text-xs px-2.5 h-9 font-bold transition-all ${
          saved ? "bg-muted text-foreground" : ""
        }`}>
          {saved ? "Saved" : "Save"}
        </button>
      </div>
    </motion.div>
  );
}
