import { motion } from "framer-motion";
import { Bookmark, MapPin, IndianRupee, Briefcase, Sparkles, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { isSaved, toggleSavedJob } from "../services/api";
import toast from "react-hot-toast";

export default function JobCard({ job, index = 0 }) {
  const [saved, setSaved] = useState(() => isSaved(job.id));

  const toggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSavedJob(job.id);
    setSaved((s) => !s);
    toast.success(saved ? "Removed from saved" : "Job saved");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="card-soft p-5 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <img src={job.logo} alt={job.company} className="h-12 w-12 rounded-xl shrink-0 ring-1 ring-border bg-muted" />
          <div className="min-w-0">
            <h3 className="font-semibold truncate">{job.title}</h3>
            <p className="text-sm text-muted-foreground truncate">{job.company}</p>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5"/>{job.location}</span>
              <span className="inline-flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5"/>{job.salary}</span>
              <span className="inline-flex items-center gap-1"><Briefcase className="h-3.5 w-3.5"/>{job.experience}</span>
            </div>
          </div>
        </div>
        <button onClick={toggle} aria-label="Save" className="p-2 rounded-full hover:bg-muted">
          <Bookmark className={"h-5 w-5 " + (saved ? "fill-primary text-primary" : "text-muted-foreground")} />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="chip"><Sparkles className="h-3 w-3"/> {job.match}% Match</span>
        <span className="text-[11px] text-muted-foreground">{job.type} · {job.posted}</span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="font-semibold mb-1">Why matched</div>
          <ul className="space-y-1 text-muted-foreground">
            {job.matched.slice(0, 3).map((m) => (
              <li key={m} className="flex items-center gap-1.5"><Check className="h-3 w-3 text-[color:var(--ncc-army)]"/>{m}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-1">Missing</div>
          <ul className="space-y-1 text-muted-foreground">
            {job.missing.slice(0, 3).map((m) => (
              <li key={m} className="flex items-center gap-1.5"><X className="h-3 w-3 text-destructive"/>{m}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <Link to="/jobs/$id" params={{ id: job.id }} className="btn-primary text-sm flex-1 text-center">View & Apply</Link>
        <button onClick={toggle} className="btn-outline text-sm">{saved ? "Saved" : "Save"}</button>
      </div>
    </motion.div>
  );
}
