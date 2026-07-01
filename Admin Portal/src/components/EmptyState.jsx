import { Inbox } from "lucide-react";

export default function EmptyState({ title = "Nothing here yet", description = "", icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <div className="h-12 w-12 rounded-2xl bg-muted grid place-items-center text-muted-foreground">
        <Icon size={22} />
      </div>
      <p className="font-medium">{title}</p>
      {description && <p className="text-sm text-muted-foreground max-w-sm">{description}</p>}
    </div>
  );
}
