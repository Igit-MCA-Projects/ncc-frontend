import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const btn =
    "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-input bg-card text-sm hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed";
  return (
    <div className="flex items-center justify-between gap-2 pt-4">
      <p className="text-xs text-muted-foreground">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button className={btn} onClick={() => onChange(page - 1)} disabled={page === 1}>
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: totalPages }).map((_, i) => {
          const p = i + 1;
          const active = p === page;
          return (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`h-8 min-w-8 rounded-lg px-2 text-sm ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "border border-input bg-card hover:bg-muted"
              }`}
            >
              {p}
            </button>
          );
        })}
        <button
          className={btn}
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
