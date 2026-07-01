import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", remember: true });
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
      <div className="hidden lg:flex flex-col justify-between hero-gradient text-white p-10">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-white/15 grid place-items-center"><Shield className="h-5 w-5"/></div>
          <span className="font-display font-extrabold">NCC Career AI</span>
        </Link>
        <div>
          <h2 className="text-4xl font-display font-extrabold leading-tight">Welcome back, cadet.</h2>
          <p className="mt-3 text-white/85 max-w-md">Your AI-powered mission control for landing the right role.</p>
        </div>
        <div className="text-xs text-white/70">© NCC Career AI</div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="w-full max-w-md card-soft p-8"
        >
          <h1 className="text-2xl font-display font-extrabold">Sign in</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back. Please enter your details.</p>

          <div className="mt-6 space-y-4">
            <Field icon={Mail} type="email" label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <Field icon={Lock} type="password" label="Password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })}/>
                Remember me
              </label>
              <button type="button" className="text-primary font-semibold hover:underline">Forgot password?</button>
            </div>
          </div>

          <button disabled={loading} className="btn-primary w-full mt-6">{loading ? "Signing in…" : "Sign in"}</button>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px bg-border flex-1"/> OR <div className="h-px bg-border flex-1"/>
          </div>

          <button type="button" className="w-full h-11 rounded-full border border-border bg-card hover:bg-muted font-semibold text-sm flex items-center justify-center gap-2">
            <svg className="h-4 w-4" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.2-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7C33.6 6.3 29 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.4-.3-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12.5 24 12.5c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7C33.6 6.3 29 4.5 24 4.5c-7.5 0-14 4.3-17.7 10.2z"/><path fill="#4CAF50" d="M24 43.5c5 0 9.5-1.7 13-4.6l-6-5.1c-2 1.5-4.4 2.3-7 2.3-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.9 39.1 16.4 43.5 24 43.5z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.3 4.1-4.3 5.4l6 5.1c4.1-3.8 6.5-9.4 6.5-15 0-1.2-.1-2.4-.3-3.5z"/></svg>
            Continue with Google
          </button>

          <p className="text-sm text-center mt-6 text-muted-foreground">
            New here? <Link to="/register" className="text-primary font-semibold hover:underline">Create an account</Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, type = "text", value, onChange }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-1 relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
        <input
          required type={type} value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full h-11 pl-10 pr-3 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>
    </label>
  );
}
