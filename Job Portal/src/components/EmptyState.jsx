import { Inbox } from "lucide-react";

export default function EmptyState({ title = "Nothing here yet", description, action }) {
  return (
    <div className="card-soft p-10 text-center">
      <div className="mx-auto h-14 w-14 rounded-2xl bg-muted grid place-items-center">
        <Inbox className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
