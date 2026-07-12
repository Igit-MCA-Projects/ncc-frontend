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

  // Map locations using the capitalized backend 'Location' field
  const locations = useMemo(() => {
    return [...new Set(jobs.map((j) => j.Location).filter(Boolean))];
  }, [jobs]);

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const companyName = j.organization?.name || "";
      const matchQ =
        !q ||
        j.title.toLowerCase().includes(q.toLowerCase()) ||
        companyName.toLowerCase().includes(q.toLowerCase()) ||
        (j.skills && j.skills.some((s) => s.toLowerCase().includes(q.toLowerCase())));

      const matchLoc = filters.location === "All" || j.Location === filters.location;

      // Filter by hiring type (map type options to DB hirignType string)
      const matchType = (() => {
        if (filters.type === "All") return true;
        const mappedType = filters.type.replace("-", "").toUpperCase(); // "Full-time" -> "FULLTIME"
        return j.hirignType === mappedType;
      })();

      // Custom Experience rule matching keywords in title/description (since experience is not a column)
      const matchExp = (() => {
        if (filters.experience === "All") return true;
        const textToSearch = `${j.title} ${j.description}`.toLowerCase();
        if (filters.experience === "Fresher") {
          return (
            textToSearch.includes("fresher") ||
            textToSearch.includes("0-") ||
            textToSearch.includes("no experience")
          );
        }
        if (filters.experience === "0–2 yrs") {
          return (
            textToSearch.includes("0-2") ||
            textToSearch.includes("1 year") ||
            textToSearch.includes("fresher")
          );
        }
        if (filters.experience === "2–4 yrs") {
          return (
            textToSearch.includes("2-4") ||
            textToSearch.includes("3 years") ||
            textToSearch.includes("4 years")
          );
        }
        if (filters.experience === "Internship") {
          return j.hirignType === "INTERNSHIP" || textToSearch.includes("intern");
        }
        return true;
      })();

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
          <SearchBar value={q} onChange={setQ} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <FilterPanel filters={filters} setFilters={setFilters} locations={locations} />
        <div>
          {loading ? (
            <LoadingSkeleton count={6} />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No jobs match your filters"
              description="Try widening your filters or clearing your search."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((j, i) => (
                <JobCard key={j.id} job={j} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
