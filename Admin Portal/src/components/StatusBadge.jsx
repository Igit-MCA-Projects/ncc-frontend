import { cls } from "@/utils/format";

const tones = {
  active: "bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]",
  approved: "bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]",
  pending: "bg-[color:var(--color-warning)]/20 text-[color:var(--color-warning-foreground)]",
  rejected: "bg-destructive/15 text-destructive",
  blocked: "bg-destructive/15 text-destructive",
  inactive: "bg-muted text-muted-foreground",
};

export default function StatusBadge({ status }) {
  const key = String(status || "").toLowerCase();
  return (
    <span
      className={cls(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        tones[key] || "bg-muted text-muted-foreground"
      )}
    >
      {status}
    </span>
  );
}
