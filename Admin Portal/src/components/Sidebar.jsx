import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  ClipboardCheck,
  ShieldCheck,
  User,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";
import { cls } from "@/utils/format";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/students", label: "Students", icon: Users },
  { to: "/companies", label: "Companies", icon: Building2 },
  { to: "/job-approval", label: "Job Approval", icon: ClipboardCheck },
  { to: "/sub-admins", label: "Sub Admins", icon: ShieldCheck },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const { sidebarOpen, setSidebarOpen } = useUI();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={cls(
          "fixed z-40 top-0 left-0 h-screen w-64 flex flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-transform lg:sticky lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-border">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground grid place-items-center font-bold">
              N
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold">NCC Career AI</p>
              <p className="text-[11px] text-muted-foreground">Admin Panel</p>
            </div>
          </Link>
          <button
            className="lg:hidden text-muted-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={cls(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-sidebar-hover text-sidebar-foreground"
                )}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
