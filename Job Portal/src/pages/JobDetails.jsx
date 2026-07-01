import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, IndianRupee, Briefcase, Bookmark, Sparkles, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import { getJob, isSaved, toggleSavedJob } from "../services/api";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getJob(id).then((j) => { setJob(j); setSaved(isSaved(id)); });
  }, [id]);

  if (!job) {
    return <DashboardLayout><div className="text-muted-foreground">Loading job…</div></DashboardLayout>;
  }

  const handleSave = () => { toggleSavedJob(id); setSaved((s) => !s); toast.success(saved ? "Removed" : "Saved"); };
  const handleApply = () => toast.success("Application submitted (mock).");

  return (
    <DashboardLayout>
      <Link to="/jobs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4"/> Back to jobs
      </Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl overflow-hidden card-soft">
            <div className="h-32 hero-gradient relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(201,162,39,0.4),transparent_45%)]"/>
            </div>
            <div className="p-6 -mt-10">
              <img src={job.logo} alt="" className="h-16 w-16 rounded-2xl ring-4 ring-card bg-card"/>
              <h1 className="mt-3 text-2xl font-display font-extrabold">{job.title}</h1>
              <p className="text-muted-foreground">{job.company}</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4"/>{job.location}</span>
                <span className="inline-flex items-center gap-1"><IndianRupee className="h-4 w-4"/>{job.salary}</span>
                <span className="inline-flex items-center gap-1"><Briefcase className="h-4 w-4"/>{job.experience}</span>
                <span className="inline-flex items-center gap-1">{job.type} · {job.posted}</span>
              </div>
              <div className="mt-5 flex gap-3">
                <button onClick={handleApply} className="btn-primary">Apply now</button>
                <button onClick={handleSave} className="btn-outline inline-flex items-center gap-2">
                  <Bookmark className={"h-4 w-4 " + (saved ? "fill-primary text-primary" : "")}/>
                  {saved ? "Saved" : "Save job"}
                </button>
              </div>
            </div>
          </div>

          <Section title="Job description"><p className="text-muted-foreground">{job.description}</p></Section>
          <Section title="Requirements"><List items={job.requirements}/></Section>
          <Section title="Responsibilities"><List items={job.responsibilities}/></Section>
          <Section title="Skills required">
            <div className="flex flex-wrap gap-2">
              {job.skills.map((s) => <span key={s} className="chip">{s}</span>)}
            </div>
          </Section>
        </div>

        <aside className="space-y-6">
          <div className="card-soft p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[color:var(--ncc-gold)]"/>
              <h3 className="font-semibold">AI analysis</h3>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Overall match</span>
                <span className="font-bold">{job.match}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full hero-gradient" style={{ width: `${job.match}%` }}/>
              </div>
            </div>
            <div className="mt-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Strengths</div>
              <ul className="mt-2 space-y-1 text-sm">
                {job.matched.map((m) => (
                  <li key={m} className="flex items-center gap-2"><Check className="h-4 w-4 text-[color:var(--ncc-army)]"/>{m}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Missing skills</div>
              <ul className="mt-2 space-y-1 text-sm">
                {job.missing.map((m) => (
                  <li key={m} className="flex items-center gap-2"><X className="h-4 w-4 text-destructive"/>{m}</li>
                ))}
              </ul>
            </div>
            <div className="mt-5 rounded-xl bg-muted/60 p-3 text-sm">
              <strong>Suggestion:</strong> {job.aiSuggestion}
            </div>
          </div>
        </aside>
      </motion.div>
    </DashboardLayout>
  );
}

function Section({ title, children }) {
  return (
    <div className="card-soft p-6">
      <h2 className="font-display font-bold text-lg">{title}</h2>
      <div className="mt-3 text-sm">{children}</div>
    </div>
  );
}
function List({ items }) {
  return (
    <ul className="space-y-2">
      {items.map((i) => (
        <li key={i} className="flex gap-2"><span className="text-[color:var(--ncc-maroon)]">•</span>{i}</li>
      ))}
    </ul>
  );
}
