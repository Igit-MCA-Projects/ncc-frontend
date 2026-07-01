import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import JobCard from "../components/JobCard";
import EmptyState from "../components/EmptyState";
import { getSavedJobs } from "../services/api";
import { Link } from "react-router-dom";

export default function SavedJobs() {
  const [jobs, setJobs] = useState(null);
  useEffect(() => { getSavedJobs().then(setJobs); }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl sm:text-3xl font-display font-extrabold">Saved jobs</h1>
      <p className="text-sm text-muted-foreground mt-1">Jobs you've bookmarked, all in one place.</p>

      <div className="mt-6">
        {jobs === null ? (
          <div className="text-muted-foreground text-sm">Loading…</div>
        ) : jobs.length === 0 ? (
          <EmptyState
            title="No saved jobs yet"
            description="Browse jobs and tap the bookmark to save them for later."
            action={<Link to="/jobs" className="btn-primary text-sm">Browse jobs</Link>}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {jobs.map((j, i) => <JobCard key={j.id} job={j} index={i}/>)}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
