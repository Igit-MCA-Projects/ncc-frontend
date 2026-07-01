import { useMemo, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import JobCard from "../components/JobCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import { useJobs } from "../hooks/useJobs";

export default function Jobs() {
  const { jobs, loading } = useJobs();
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState({ location: "All", type: "All", experience: "All" });

  const locations = useMemo(() => [...new Set(jobs.map((j) => j.location))], [jobs]);

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const matchQ =
        !q ||
        j.title.toLowerCase().includes(q.toLowerCase()) ||
        j.company.toLowerCase().includes(q.toLowerCase()) ||
        j.skills.some((s) => s.toLowerCase().includes(q.toLowerCase()));
      const matchLoc = filters.location === "All" || j.location === filters.location;
      const matchType = filters.type === "All" || j.type === filters.type;
      const matchExp = filters.experience === "All" || j.experience === filters.experience;
      return matchQ && matchLoc && matchType && matchExp;
    });
  }, [jobs, q, filters]);

  return (
    <DashboardLayout>
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold">Jobs</h1>
          <p className="text-sm text-muted-foreground mt-1">AI-ranked for cadets like you.</p>
        </div>
        <div className="w-full sm:w-80">
          <SearchBar value={q} onChange={setQ}/>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <FilterPanel filters={filters} setFilters={setFilters} locations={locations}/>
        <div>
          {loading ? (
            <LoadingSkeleton count={6}/>
          ) : filtered.length === 0 ? (
            <EmptyState title="No jobs match your filters" description="Try widening your filters or clearing your search."/>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((j, i) => <JobCard key={j.id} job={j} index={i}/>)}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
