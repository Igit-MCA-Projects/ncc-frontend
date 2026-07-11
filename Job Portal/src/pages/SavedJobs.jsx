import { useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import JobCard from "../components/JobCard";
import EmptyState from "../components/EmptyState";
import { Link } from "react-router-dom";
import { useJobsContext } from "../context/JobsContext";

export default function SavedJobs() {
  const { savedJobs, fetchSavedJobs, loading } = useJobsContext();

  useEffect(() => {
    fetchSavedJobs().catch(() => {});
  }, [fetchSavedJobs]);

  // Extract the nested job info from each SavedJob DB model record
  const jobsList = (savedJobs || []).map((item) => item.job).filter(Boolean);

  return (
    <DashboardLayout>
      <h1 className="text-2xl sm:text-3xl font-display font-extrabold">Saved jobs</h1>
      <p className="text-sm text-muted-foreground mt-1">Jobs you've bookmarked, all in one place.</p>

      <div className="mt-6">
        {loading && jobsList.length === 0 ? (
          <div className="text-muted-foreground text-sm">Loading…</div>
        ) : jobsList.length === 0 ? (
          <EmptyState
            title="No saved jobs yet"
            description="Browse jobs and tap the bookmark to save them for later."
            action={
              <Link to="/jobs" className="btn-primary text-sm px-4 py-2 rounded-xl">
                Browse jobs
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {jobsList.map((j, i) => (
              <JobCard key={j.id} job={j} index={i} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
