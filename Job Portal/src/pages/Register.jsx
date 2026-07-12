import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register, verifyEmail } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ fullname: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpLoading, setOtpLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.fullname.trim()) errs.fullname = "Full name is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    if (form.password.length < 8) errs.password = "Password must be at least 8 characters.";
    return errs;
  };

  // ── Register submit ─────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      console.log("api call done");
      const res = await register({
        fullName: form.fullname,
        email: form.email,
        password: form.password,
      });
      console.log("api call res", res);
      toast.success("Account created! Check your email for the OTP.");
      setOtpStep(true);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── OTP input handling ──────────────────────────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < 3) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  // ── Verify OTP ──────────────────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 4) return;
    setOtpLoading(true);
    try {
      await verifyEmail({ email: form.email, otp: enteredOtp });
      toast.success("Email verified! Please sign in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setOtpLoading(false);
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
            Join the ranks, cadet.
          </h2>
          <p className="mt-3 text-white/85 max-w-md">
            Create your account and let AI guide your career mission.
          </p>
        </div>
        <div className="text-xs text-white/70">© NCC Career AI</div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md card-soft p-8 relative"
        >
          <h1 className="text-2xl font-display font-extrabold">Create account</h1>
          <p className="text-sm text-muted-foreground mt-1">Fill in your details to get started.</p>

          <div className="mt-6 space-y-4">
            {/* Full Name */}
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Full Name
              </span>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  required
                  type="text"
                  value={form.fullname}
                  onChange={(e) => setForm({ ...form, fullname: e.target.value })}
                  placeholder="John Doe"
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              {errors.fullname && <p className="text-xs text-red-500 mt-1">{errors.fullname}</p>}
            </label>

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
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
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
                  placeholder="Min. 8 characters"
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
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </label>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-6">
            {loading ? "Creating account…" : "Create Account"}
          </button>

          <p className="text-sm text-center mt-6 text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>

          {/* ── OTP Overlay ── */}
          <AnimatePresence>
            {otpStep && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 rounded-2xl bg-card/95 backdrop-blur-sm flex flex-col items-center justify-center gap-6 p-8 z-10"
              >
                <div className="text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 grid place-items-center mx-auto mb-3">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-display font-extrabold">Verify your email</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enter the 4-digit OTP sent to{" "}
                    <span className="font-semibold text-foreground">{form.email}</span>
                  </p>
                </div>

                {/* 4-box OTP input */}
                <div className="flex gap-3">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-12 h-12 text-center text-xl font-bold rounded-xl bg-card border-2 border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={otp.join("").length < 4 || otpLoading}
                  className="btn-primary w-full max-w-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {otpLoading ? "Verifying…" : "Verify OTP"}
                </button>

                <button
                  type="button"
                  onClick={() => setOtpStep(false)}
                  className="text-xs text-muted-foreground hover:underline"
                >
                  Go back
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
      </div>
    </div>
  );
}
