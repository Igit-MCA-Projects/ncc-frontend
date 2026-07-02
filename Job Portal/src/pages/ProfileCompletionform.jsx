import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const WINGS = ["Army", "Navy", "Air"];
const CERTS = ["A", "B", "C"];
const RANKS = ["Cadet", "Corporal", "Sergeant", "Senior Under Officer"];

export default function ProfilecomlitionForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", password: "",
    college: "", course: "", branch: "", passingYear: "", cgpa: "",
    location: "", skills: "", preferredRole: "",
    linkedin: "", github: "", resume: null,
    nccWing: "Army", nccCertificate: "B", nccRank: "Cadet",
  });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target?.files ? e.target.files[0] : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ ...form, skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean) });
      toast.success("Account created. Welcome aboard!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link to="/" className="flex items-center gap-2 mb-6">
          <div className="h-9 w-9 rounded-xl hero-gradient grid place-items-center"><Shield className="h-5 w-5 text-white"/></div>
          <span className="font-display font-extrabold">NCC Career AI</span>
        </Link>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="card-soft p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-display font-extrabold">Create your cadet profile</h1>
              <p className="text-sm text-muted-foreground mt-1">Step {step} of 3</p>
            </div>
            <div className="h-2 w-32 rounded-full bg-muted overflow-hidden">
              <div className="h-full hero-gradient transition-all" style={{ width: `${(step / 3) * 100}%` }}/>
            </div>
          </div>

          {step === 1 && (
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Full name" value={form.fullName} onChange={set("fullName")} required/>
              <Input label="Email" type="email" value={form.email} onChange={set("email")} required/>
              <Input label="Phone" value={form.phone} onChange={set("phone")} />
              <Input label="Password" type="password" value={form.password} onChange={set("password")} required/>
              <Input label="Location" value={form.location} onChange={set("location")} />
              <Input label="Preferred role" value={form.preferredRole} onChange={set("preferredRole")} placeholder="e.g. Frontend Developer"/>
            </div>
          )}

          {step === 2 && (
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="College" value={form.college} onChange={set("college")} />
              <Input label="Course" value={form.course} onChange={set("course")} placeholder="B.Tech"/>
              <Input label="Branch" value={form.branch} onChange={set("branch")} />
              <Input label="Passing year" type="number" value={form.passingYear} onChange={set("passingYear")} />
              <Input label="CGPA" value={form.cgpa} onChange={set("cgpa")} />
              <Input label="Skills (comma separated)" value={form.skills} onChange={set("skills")} placeholder="React, JS, SQL"/>
              <Input label="LinkedIn" value={form.linkedin} onChange={set("linkedin")} />
              <Input label="GitHub" value={form.github} onChange={set("github")} />
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resume (PDF)</label>
                <div className="mt-1 flex items-center gap-3">
                  <label className="btn-outline text-sm cursor-pointer inline-flex items-center gap-2">
                    <Upload className="h-4 w-4"/> {form.resume ? "Replace file" : "Upload resume"}
                    <input type="file" className="hidden" onChange={set("resume")} accept="application/pdf"/>
                  </label>
                  {form.resume && <span className="text-sm text-muted-foreground">{form.resume.name}</span>}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid sm:grid-cols-3 gap-4">
              <Select label="NCC Wing" value={form.nccWing} onChange={set("nccWing")} options={WINGS}/>
              <Select label="Certificate" value={form.nccCertificate} onChange={set("nccCertificate")} options={CERTS}/>
              <Select label="Rank" value={form.nccRank} onChange={set("nccRank")} options={RANKS}/>
              <div className="sm:col-span-3 rounded-2xl bg-muted/60 p-4 text-sm text-muted-foreground">
                <strong className="text-foreground">Almost there.</strong> Your NCC details improve match accuracy by up to 18%.
              </div>
            </div>
          )}

          <div className="mt-7 flex items-center justify-between gap-3">
            <button type="button" onClick={() => setStep((s) => Math.max(1, s - 1))}
              className="btn-outline text-sm" disabled={step === 1}>
              Back
            </button>
            {step < 3 ? (
              <button type="button" onClick={() => setStep((s) => s + 1)} className="btn-primary text-sm">Continue</button>
            ) : (
              <button disabled={loading} className="btn-primary text-sm">{loading ? "Creating…" : "Create account"}</button>
            )}
          </div>

          <p className="text-sm text-center mt-6 text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input {...props} className="mt-1 w-full h-11 px-3 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/40"/>
    </label>
  );
}
function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <select value={value} onChange={onChange}
        className="mt-1 w-full h-11 px-3 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/40">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}
