import { Bell, Menu, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
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
    getNotifications().then((r) => setNotifs(r?.data || []));
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const activeNotifs = notifs.filter((n) => !n.isDeleted);
  const unreadCount = activeNotifs.length;

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
            <p className="font-semibold truncate">{user?.fullName || user?.name || "Admin"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative" ref={ref}>
            <button
              onClick={() => setOpen((o) => !o)}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-input bg-card hover:bg-muted"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 grid place-items-center rounded-full bg-primary text-primary-foreground text-[10px] font-semibold">
                  {unreadCount}
                </span>
              )}
            </button>
            {open && (
              <div className="card-surface absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto p-2 z-30 shadow-lg">
                <div className="px-3 pt-2 pb-2 flex items-center justify-between border-b border-border mb-1">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Notifications
                  </p>
                  <Link
                    to="/notifications"
                    onClick={() => setOpen(false)}
                    className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
                  >
                    Manage <ExternalLink size={12} />
                  </Link>
                </div>
                {activeNotifs.length === 0 ? (
                  <p className="px-3 py-4 text-xs text-center text-muted-foreground">
                    No active notifications
                  </p>
                ) : (
                  activeNotifs.slice(0, 6).map((n) => (
                    <div
                      key={n.id}
                      className="rounded-xl px-3 py-2 hover:bg-muted transition"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold truncate">{n.title}</p>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                          {n.type}
                        </span>
                      </div>
                      {(n.description || n.Descripton) && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {n.description || n.Descripton}
                        </p>
                      )}
                    </div>
                  ))
                )}
                <div className="pt-2 border-t border-border mt-1 text-center">
                  <Link
                    to="/notifications"
                    onClick={() => setOpen(false)}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>
          <Link
            to="/profile"
            className="flex items-center rounded-full hover:opacity-90 transition"
            title="View Profile"
          >
            <div className="h-10 w-10 shrink-0 rounded-full bg-primary text-primary-foreground grid place-items-center font-semibold overflow-hidden border-2 border-primary/20 shadow-sm">
              {user?.profileImage || user?.photo ? (
                <img
                  src={user.profileImage || user.photo}
                  alt={user?.fullName || user?.name || "Admin"}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials(user?.fullName || user?.name || "Admin")
              )}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
