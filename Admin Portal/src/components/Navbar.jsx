import { Bell, Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";
import { getNotifications } from "@/services/adminService";
import { initials } from "@/utils/format";

export default function Navbar() {
  const { user } = useAuth();
  const { setSidebarOpen } = useUI();
  const [notifs, setNotifs] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    getNotifications().then((r) => setNotifs(r.data));
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const unread = notifs.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-border bg-background/80 backdrop-blur">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl border border-input"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={18} />
          </button>
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground truncate">Welcome back</p>
            <p className="font-semibold truncate">{user?.name || "Admin"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen((o) => !o)}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-input bg-card hover:bg-muted"
            >
              <Bell size={18} />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 grid place-items-center rounded-full bg-primary text-primary-foreground text-[10px] font-semibold">
                  {unread}
                </span>
              )}
            </button>
            {open && (
              <div className="card-surface absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto p-2 z-30">
                <p className="px-3 pt-2 pb-1 text-xs font-medium uppercase text-muted-foreground">
                  Notifications
                </p>
                {notifs.map((n) => (
                  <div
                    key={n.id}
                    className="rounded-xl px-3 py-2 hover:bg-muted flex items-start justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{n.time}</p>
                    </div>
                    {n.unread && <span className="mt-1 h-2 w-2 rounded-full bg-primary" />}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="h-10 w-10 shrink-0 rounded-full bg-primary text-primary-foreground grid place-items-center font-semibold overflow-hidden">
            {user?.photo ? (
              <img src={user.photo} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              initials(user?.name)
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
