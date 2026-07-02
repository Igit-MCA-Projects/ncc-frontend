import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email: form.email, password: form.password });
      toast.success("Welcome back, cadet!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex flex-col justify-between hero-gradient text-white p-10">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-white/15 grid place-items-center">
            <Shield className="h-5 w-5" />
          </div>
          <span className="font-display font-extrabold">NCC Career AI</span>
        </Link>
        <div>
          <h2 className="text-4xl font-display font-extrabold leading-tight">
            Welcome back, cadet.
          </h2>
          <p className="mt-3 text-white/85 max-w-md">
            Your AI-powered mission control for landing the right role.
          </p>
        </div>
        <div className="text-xs text-white/70">© NCC Career AI</div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md card-soft p-8"
        >
          <h1 className="text-2xl font-display font-extrabold">Sign in</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back. Please enter your details.
          </p>

          <div className="mt-6 space-y-4">
            {/* Email */}
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email
              </span>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </label>

            {/* Password with eye toggle */}
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Password
              </span>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Your password"
                  className="w-full h-11 pl-10 pr-10 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-end text-sm">
              <button type="button" className="text-primary font-semibold hover:underline">
                Forgot password?
              </button>
            </div>
          </div>

          <button disabled={loading} className="btn-primary w-full mt-6">
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-sm text-center mt-6 text-muted-foreground">
            New here?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
}
