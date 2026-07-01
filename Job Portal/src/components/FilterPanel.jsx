const TYPES = ["All", "Full-time", "Internship", "Part-time"];
const EXPERIENCE = ["All", "Fresher", "0–2 yrs", "2–4 yrs", "Internship"];

export default function FilterPanel({ filters, setFilters, locations = [] }) {
  const set = (k) => (e) => setFilters({ ...filters, [k]: e.target.value });
  return (
    <div className="card-soft p-5 space-y-4">
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location</label>
        <select value={filters.location} onChange={set("location")} className="mt-1 w-full h-10 rounded-xl border border-border bg-card px-3 text-sm">
          <option value="All">All locations</option>
          {locations.map((l) => <option key={l}>{l}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Job type</label>
        <select value={filters.type} onChange={set("type")} className="mt-1 w-full h-10 rounded-xl border border-border bg-card px-3 text-sm">
          {TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Experience</label>
        <select value={filters.experience} onChange={set("experience")} className="mt-1 w-full h-10 rounded-xl border border-border bg-card px-3 text-sm">
          {EXPERIENCE.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <button
        onClick={() => setFilters({ location: "All", type: "All", experience: "All" })}
        className="text-xs font-semibold text-primary hover:underline"
      >
        Reset filters
      </button>
    </div>
  );
}
