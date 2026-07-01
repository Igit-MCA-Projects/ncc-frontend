import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Moon, Bell, LogOut } from "lucide-react";
import { useUI } from "@/context/UIContext";
import { useAuth } from "@/context/AuthContext";


function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`h-6 w-11 rounded-full transition relative ${
        checked ? "bg-primary" : "bg-muted"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
          checked ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

function SettingsPage() {
  const { darkMode, setDarkMode, notificationsEnabled, setNotificationsEnabled } = useUI();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Signed out");
    navigate("/login", { replace: true });
  };

  const Row = ({ icon: Icon, title, desc, children }) => (
    <div className="flex items-center justify-between p-5 gap-4">
      <div className="flex items-start gap-3 min-w-0">
        <div className="h-10 w-10 shrink-0 rounded-xl bg-muted grid place-items-center text-muted-foreground">
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <p className="font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );

  return (
    <div className="space-y-5 max-w-2xl">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <div className="card-surface divide-y divide-border">
        <Row icon={Moon} title="Dark Mode" desc="Toggle dark theme (UI only)">
          <Toggle checked={darkMode} onChange={setDarkMode} />
        </Row>
        <Row icon={Bell} title="Notifications" desc="Enable in-app notifications">
          <Toggle checked={notificationsEnabled} onChange={setNotificationsEnabled} />
        </Row>
        <Row icon={LogOut} title="Sign out" desc="Log out of your admin account">
          <button
            onClick={handleLogout}
            className="rounded-xl bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
          >
            Logout
          </button>
        </Row>
      </div>
    </div>
  );
}

export default Toggle;
