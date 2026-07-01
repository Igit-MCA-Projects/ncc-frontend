import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { LogOut, Moon, Bell } from "lucide-react";

export default function Settings() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [notify, setNotify] = useState(true);

  const handleLogout = () => { logout(); toast.success("Logged out"); navigate("/"); };

  return (
    <DashboardLayout>
      <h1 className="text-2xl sm:text-3xl font-display font-extrabold">Settings</h1>
      <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences.</p>

      <div className="mt-6 grid gap-4 max-w-2xl">
        <Toggle icon={Moon} title="Dark mode" desc="Easier on the eyes during late drills." value={dark} onChange={setDark}/>
        <Toggle icon={Bell} title="Notifications" desc="Job matches, applications and reminders." value={notify} onChange={setNotify}/>

        <div className="card-soft p-5 flex items-center justify-between">
          <div>
            <div className="font-semibold">Logout</div>
            <div className="text-sm text-muted-foreground">Sign out of NCC Career AI on this device.</div>
          </div>
          <button onClick={handleLogout} className="btn-outline inline-flex items-center gap-2 text-sm">
            <LogOut className="h-4 w-4"/> Logout
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Toggle({ icon: Icon, title, desc, value, onChange }) {
  return (
    <div className="card-soft p-5 flex items-center justify-between gap-4">
      <div className="flex items-start gap-3 min-w-0">
        <div className="h-10 w-10 rounded-xl bg-muted grid place-items-center shrink-0"><Icon className="h-4 w-4"/></div>
        <div className="min-w-0">
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-muted-foreground">{desc}</div>
        </div>
      </div>
      <button
        onClick={() => onChange(!value)}
        aria-pressed={value}
        className={"shrink-0 h-7 w-12 rounded-full transition-colors " + (value ? "bg-primary" : "bg-muted")}
      >
        <span className={"block h-6 w-6 rounded-full bg-white shadow transition-transform " + (value ? "translate-x-5" : "translate-x-0.5")}/>
      </button>
    </div>
  );
}
