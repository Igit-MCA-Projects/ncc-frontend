import { motion } from "framer-motion";
import { TrendingUp, Briefcase, Bookmark, Award, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import ProfileCompletionCard from "../components/ProfileCompletionCard";
import JobCard from "../components/JobCard";
import { useJobs } from "../hooks/useJobs";
import { useAuth } from "../context/AuthContext";
import profileData from "../data/profile";

const stats = [
  { label: "Applications", value: 8, icon: Briefcase },
  { label: "Saved jobs", value: 12, icon: Bookmark },
  { label: "Profile views", value: 47, icon: TrendingUp },
  { label: "NCC bonus", value: "+12%", icon: Award },
];

const suggestions = [
  "Add 2 projects to lift your match scores by ~8%.",
  "Learn Redux Toolkit — it unlocks 4 new frontend roles.",
  "Update your NCC rank to Sergeant for leadership-tagged roles.",
];

export default function Dashboard() {
  const { user } = useAuth();
  const { jobs, loading } = useJobs();
  const top = [...jobs].sort((a, b) => b.match - a.match).slice(0, 3);
  const completion = user?.completion ?? profileData.completion;

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl hero-gradient text-white p-7 sm:p-10 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(201,162,39,0.35),transparent_45%)]"/>
        <div className="relative">
          <p className="text-xs uppercase tracking-widest text-white/80">Welcome back</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-display font-extrabold">
            Hey {user?.fullName?.split(" ")[0] || "Cadet"} 👋
          </h1>
          <p className="mt-2 text-white/85 max-w-xl">
            You have <strong>3 new high-match jobs</strong> waiting. Keep your momentum going.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/jobs" className="rounded-full bg-white text-[color:var(--ncc-maroon)] px-5 py-2 font-semibold text-sm">Browse jobs</Link>
            <Link to="/profile" className="rounded-full bg-white/10 hover:bg-white/15 px-5 py-2 font-semibold text-sm backdrop-blur">Complete profile</Link>
          </div>
        </div>
      </motion.div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card-soft p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</span>
              <s.icon className="h-4 w-4 text-[color:var(--ncc-maroon)]"/>
            </div>
            <div className="mt-2 text-2xl font-display font-extrabold">{s.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-display font-bold">Recommended for you</h2>
            <Link to="/jobs" className="text-sm font-semibold text-primary hover:underline">See all →</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading recommendations…</div>
            ) : (
              top.map((j, i) => <JobCard key={j.id} job={j} index={i}/>)
            )}
          </div>
        </div>

        <div className="space-y-6">
          <ProfileCompletionCard percent={completion}/>

          <div className="card-soft p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[color:var(--ncc-gold)]"/>
              <h3 className="font-semibold">AI career suggestions</h3>
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {suggestions.map((s) => (
                <li key={s} className="rounded-xl bg-muted/60 p-3">{s}</li>
              ))}
            </ul>
          </div>

          <div className="card-soft p-5">
            <h3 className="font-semibold">Recent applications</h3>
            <ul className="mt-3 space-y-3 text-sm">
              {top.map((j) => (
                <li key={j.id} className="flex items-center gap-3">
                  <img src={j.logo} className="h-9 w-9 rounded-lg ring-1 ring-border" alt=""/>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{j.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{j.company} · Applied</div>
                  </div>
                  <span className="text-xs text-[color:var(--ncc-army)] font-semibold">In review</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
