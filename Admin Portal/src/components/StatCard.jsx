export default function StatCard({ icon: Icon, label, value, tone = "primary" }) {
  const toneMap = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/20 text-accent-foreground",
    success: "bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]",
    warning: "bg-[color:var(--color-warning)]/20 text-[color:var(--color-warning-foreground)]",
    destructive: "bg-destructive/15 text-destructive",
  };
  return (
    <div className="card-surface p-5 flex items-center gap-4 transition hover:shadow-md">
      <div className={`h-12 w-12 shrink-0 rounded-2xl grid place-items-center ${toneMap[tone]}`}>
        {Icon ? <Icon size={22} /> : null}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground truncate">{label}</p>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
      </div>
    </div>
  );
}
