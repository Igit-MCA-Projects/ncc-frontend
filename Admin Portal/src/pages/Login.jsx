import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { loginAdmin } from "@/services/adminService";


function LoginPage() {
  const { login, ready, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  useEffect(() => {
    if (ready && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [ready, user, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login({ email, password });

      if (user) {
        toast.success("Welcome back!");
        navigate("/dashboard", { replace: true });
      } else {
        toast.error("Login failed");
      }
    } catch (err) {
      toast.error(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-10 bg-primary text-primary-foreground">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-accent text-accent-foreground grid place-items-center font-bold">
            N
          </div>
          <div>
            <p className="font-semibold">NCC Career AI</p>
            <p className="text-xs opacity-80">Admin Console</p>
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-semibold leading-tight">
            Guide careers.
            <br /> Empower cadets.
          </h1>
          <p className="mt-4 max-w-md text-primary-foreground/80">
            Manage students, companies, and job approvals across the NCC Career AI
            platform from one clean console.
          </p>
        </div>
        <p className="text-xs opacity-70">© {new Date().getFullYear()} NCC Career AI</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground grid place-items-center font-bold">
              N
            </div>
            <div>
              <p className="font-semibold">NCC Career AI</p>
              <p className="text-xs text-muted-foreground">Admin Console</p>
            </div>
          </div>
          <h2 className="text-2xl font-semibold">Sign in</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your credentials to access the admin panel.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <div className="relative mt-1">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  required
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card pl-9 pr-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="relative mt-1">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPw ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card pl-9 pr-10 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-input text-primary focus:ring-primary/40"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => setForgotOpen(true)}
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium hover:bg-primary/90 disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Sign in
            </button>
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  navigate("/register");
                }}
                className="text-sm text-primary hover:underline"
              >
                Register here
              </button>
            </p>
          </form>
        </div>
      </div>

      {forgotOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
          onClick={() => setForgotOpen(false)}
        >
          <div className="card-surface w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold">Reset your password</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your email and we'll send a reset link to your inbox.
            </p>
            <input
              type="email"
              placeholder="admin@ncc.ai"
              className="mt-4 w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setForgotOpen(false)}
                className="rounded-xl border border-input bg-card px-4 py-2 text-sm hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setForgotOpen(false);
                  toast.success("Reset link sent!");
                }}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Send link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
