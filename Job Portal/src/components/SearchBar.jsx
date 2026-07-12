import { Search } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search jobs, companies, skills…",
}) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 h-11 rounded-2xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </div>
  );
}
