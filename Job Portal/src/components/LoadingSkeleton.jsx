export default function LoadingSkeleton({ count = 4 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-soft p-5 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </div>
          <div className="mt-5 space-y-2">
            <div className="h-3 bg-muted rounded" />
            <div className="h-3 bg-muted rounded w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
}
