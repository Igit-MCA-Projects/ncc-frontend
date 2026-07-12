import { useState } from "react";
import { Bell, Search, Menu } from "lucide-react";
import Sidebar from "../components/Sidebar";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex bg-background">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <div className="flex-1 min-w-0 flex flex-col">
          <header className="sticky top-0 z-20 h-16 bg-card/80 backdrop-blur border-b border-border flex items-center gap-3 px-4 sm:px-6">
            <button onClick={() => setOpen(true)} className="lg:hidden p-2 -ml-2" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search jobs, companies…"
                className="w-full h-10 pl-9 pr-4 rounded-xl bg-muted/60 border border-transparent focus:border-border focus:bg-card focus:outline-none text-sm"
              />
            </div>
            <button className="relative p-2 rounded-full hover:bg-muted" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
            </button>
            <img
              src={user?.avatar || "https://api.dicebear.com/9.x/avataaars/svg?seed=Cadet"}
              alt="avatar"
              className="h-9 w-9 rounded-full ring-2 ring-border"
            />
          </header>
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
