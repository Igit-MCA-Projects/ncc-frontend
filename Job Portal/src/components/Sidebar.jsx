import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Briefcase, Bookmark, User, Settings, LogOut, Shield, X, Bot, ShieldCheck,
  Calendar, GraduationCap, Bell, Users,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";


const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/ncc-profile", label: "NCC Profile", icon: ShieldCheck },
  { to: "/career-assistant", label: "Career Assistant", icon: Bot },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/saved-jobs", label: "Saved Jobs", icon: Bookmark },
  { to: "/hiring-calendar", label: "Hiring Calendar", icon: Calendar },
  { to: "/ncc-benefits", label: "NCC Benefits", icon: Shield },
  { to: "/scholarships", label: "Scholarships", icon: GraduationCap },
  { to: "/mentorship-status", label: "Mentorship Status", icon: Users },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
];



export default function Sidebar({ open, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={[
          "fixed lg:sticky top-0 z-40 lg:z-auto h-screen w-64 shrink-0 bg-card border-r border-border",
          "transition-transform duration-200 flex flex-col overflow-y-auto",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg hero-gradient grid place-items-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="font-display font-extrabold">NCC Career AI</span>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1" aria-label="Close sidebar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {items.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={onClose}
             
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/80 hover:bg-muted transition-colors"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* NCC Cadet Profile Card */}
        <div className="flex-1" />
      

        <div className="p-3 border-t border-border shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/80 hover:bg-muted"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
