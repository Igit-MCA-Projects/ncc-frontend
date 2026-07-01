import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles, Target, ShieldCheck, GraduationCap, Briefcase, Users, Building2,
  Brain, Compass, Rocket, ChevronDown, Star,
} from "lucide-react";
import { useState } from "react";
import PublicLayout from "../layouts/PublicLayout";

const stats = [
  { value: "10,000+", label: "Jobs" },
  { value: "25,000+", label: "Students" },
  { value: "100+", label: "Companies" },
  { value: "90%", label: "AI Matching Accuracy" },
];

const features = [
  { icon: Brain, title: "AI Career Matching", desc: "Smart matching based on skills, education, interests and NCC achievements." },
  { icon: ShieldCheck, title: "NCC-aware Profile", desc: "Your wing, certificate and rank are first-class signals — not afterthoughts." },
  { icon: Target, title: "Skill Gap Insights", desc: "See exactly what to learn next to unlock each role." },
  { icon: Rocket, title: "1-click Applications", desc: "Apply faster with a profile that adapts to each company's expectations." },
];

const steps = [
  { icon: GraduationCap, title: "Build your profile", desc: "Education, skills, projects and NCC details — in under 4 minutes." },
  { icon: Compass, title: "Get AI matches", desc: "We rank every role by fit and explain the why behind each match." },
  { icon: Briefcase, title: "Apply with confidence", desc: "Track applications and prep with role-specific suggestions." },
];

const faqs = [
  { q: "Is NCC Career AI free for cadets?", a: "Yes — the platform is free for all NCC cadets and recent alumni." },
  { q: "How does AI matching work?", a: "Our model weights your skills, projects, education and NCC achievements against each role's requirements." },
  { q: "Do recruiters actually value NCC?", a: "Absolutely. Leadership, discipline and field experience are top-tier signals for many employers." },
  { q: "Can I use this without NCC details?", a: "Yes. NCC details boost certain matches but the platform is open to every student." },
];

export default function Landing() {
  return (
    <PublicLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-[0.97]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(201,162,39,0.25),transparent_45%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-xs font-semibold tracking-wide">
              <Sparkles className="h-3.5 w-3.5"/> AI-powered career platform for NCC cadets
            </span>
            <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold leading-[1.02]">
              NCC Career AI
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-white/85 max-w-2xl">
              Discover jobs that match your education, technical skills, interests and NCC
              achievements — powered by AI built for cadets.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="btn-gold">Register</Link>
              <Link to="/login" className="rounded-full bg-white/10 hover:bg-white/15 px-6 py-2.5 font-semibold backdrop-blur">Login</Link>
              <Link to="/jobs" className="rounded-full bg-white text-[color:var(--ncc-maroon)] hover:bg-white/90 px-6 py-2.5 font-semibold">Browse Jobs →</Link>
            </div>

            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                >
                  <div className="text-3xl font-display font-extrabold">{s.value}</div>
                  <div className="text-xs uppercase tracking-wider text-white/70 mt-1">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center max-w-2xl mx-auto">
          <span className="chip">Features</span>
          <h2 className="mt-4 text-4xl font-display font-extrabold">Built for cadets. Loved by recruiters.</h2>
          <p className="mt-3 text-muted-foreground">Everything you need to translate cadet life into a great career.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="card-soft p-6 hover:-translate-y-1 transition-transform"
            >
              <div className="h-11 w-11 rounded-xl hero-gradient grid place-items-center">
                <f.icon className="h-5 w-5 text-white"/>
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-card border-y border-border">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center max-w-2xl mx-auto">
            <span className="chip">How it works</span>
            <h2 className="mt-4 text-4xl font-display font-extrabold">Three steps to your next role</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative card-soft p-7"
              >
                <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full hero-gradient grid place-items-center text-white font-bold text-sm">
                  {i + 1}
                </div>
                <s.icon className="h-7 w-7 text-[color:var(--ncc-maroon)]" />
                <h3 className="mt-3 font-semibold text-lg">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI MATCHING SHOWCASE */}
      <section className="mx-auto max-w-7xl px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="chip">AI Career Matching</span>
          <h2 className="mt-4 text-4xl font-display font-extrabold">Every job, explained.</h2>
          <p className="mt-3 text-muted-foreground">
            We don't just show you jobs. We show you <strong>why</strong> a job fits, what
            skills you're missing, and how to close the gap — fast.
          </p>
          <ul className="mt-6 space-y-3">
            {["NCC achievements counted as real signals", "Personalised skill-gap roadmap", "Match score updated as you grow"].map((x) => (
              <li key={x} className="flex items-start gap-3">
                <span className="mt-1 h-5 w-5 rounded-full hero-gradient grid place-items-center"><Star className="h-3 w-3 text-white"/></span>
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="card-soft p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Match preview</div>
              <div className="font-semibold mt-1">Frontend Developer · Tatva Tech</div>
            </div>
            <span className="chip">92% Match</span>
          </div>
          <div className="mt-5 h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full hero-gradient" style={{ width: "92%" }}/>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold mb-2">Strengths</div>
              <ul className="space-y-1 text-muted-foreground">
                <li>✓ React</li><li>✓ JavaScript</li><li>✓ NCC C Certificate</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-2">Grow next</div>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Redux</li><li>• Node.js</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </section>

      {/* TRUSTED BY */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-14 text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Cadets hired at</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-muted-foreground font-display font-bold text-xl opacity-80">
            <span>TATVA</span><span>BharatShield</span><span>Skyline</span>
            <span>Trishul</span><span>Veer</span><span>Garuda</span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-24">
        <div className="text-center">
          <span className="chip">FAQ</span>
          <h2 className="mt-4 text-4xl font-display font-extrabold">Questions, answered</h2>
        </div>
        <div className="mt-10 space-y-3">
          {faqs.map((f, i) => <FaqItem key={i} {...f} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-3xl hero-gradient p-10 sm:p-14 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(201,162,39,0.35),transparent_45%)]" />
          <div className="relative">
            <Users className="h-10 w-10 mx-auto opacity-90"/>
            <h2 className="mt-4 text-4xl font-display font-extrabold">Your next mission starts here</h2>
            <p className="mt-3 text-white/85 max-w-xl mx-auto">Join thousands of cadets building careers with AI on their side.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link to="/register" className="btn-gold">Create free account</Link>
              <Link to="/jobs" className="rounded-full bg-white/10 hover:bg-white/15 px-6 py-2.5 font-semibold backdrop-blur">Explore jobs</Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card-soft">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between p-5 text-left">
        <span className="font-semibold">{q}</span>
        <ChevronDown className={"h-5 w-5 transition-transform " + (open ? "rotate-180" : "")} />
      </button>
      {open && <div className="px-5 pb-5 text-sm text-muted-foreground">{a}</div>}
    </div>
  );
}
