import DashboardLayout from "../layouts/DashboardLayout";
import ProfileCompletionCard from "../components/ProfileCompletionCard";
import { useAuth } from "../context/AuthContext";
import profileData from "../data/profile";
import { Linkedin, Github, Mail, Phone, MapPin, Award, Pencil, FileText } from "lucide-react";
import toast from "react-hot-toast";

export default function Profile() {
  const { user } = useAuth();
  const p = { ...profileData, ...(user || {}) };

  return (
    <DashboardLayout>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="card-soft p-6 sm:p-8">
            <div className="flex items-start gap-5 flex-wrap">
              <img src={p.avatar} alt="" className="h-24 w-24 rounded-2xl ring-2 ring-border bg-muted"/>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-display font-extrabold">{p.fullName}</h1>
                <p className="text-muted-foreground">{p.preferredRole} · {p.location}</p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Mail className="h-4 w-4"/>{p.email}</span>
                  <span className="inline-flex items-center gap-1"><Phone className="h-4 w-4"/>{p.phone}</span>
                </div>
              </div>
              <button onClick={() => toast("Editing coming soon")} className="btn-outline text-sm inline-flex items-center gap-2">
                <Pencil className="h-4 w-4"/> Edit profile
              </button>
            </div>
          </div>

          <Section title="Education">
            <p className="font-medium">{p.course} · {p.branch}</p>
            <p className="text-sm text-muted-foreground">{p.college} · Passing {p.passingYear} · CGPA {p.cgpa}</p>
          </Section>

          <Section title="Skills">
            <div className="flex flex-wrap gap-2">
              {p.skills.map((s) => <span key={s} className="chip">{s}</span>)}
            </div>
          </Section>

          <Section title="Projects">
            <ul className="space-y-3">
              {p.projects.map((pr) => (
                <li key={pr.name} className="rounded-xl bg-muted/60 p-3">
                  <div className="font-semibold">{pr.name}</div>
                  <div className="text-sm text-muted-foreground">{pr.desc}</div>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Resume & Links">
            <div className="flex flex-wrap gap-3 text-sm">
              <a href={p.resumeUrl} className="btn-outline inline-flex items-center gap-2"><FileText className="h-4 w-4"/> Resume</a>
              <a href={p.linkedin} className="btn-outline inline-flex items-center gap-2"><Linkedin className="h-4 w-4"/> LinkedIn</a>
              <a href={p.github} className="btn-outline inline-flex items-center gap-2"><Github className="h-4 w-4"/> GitHub</a>
            </div>
          </Section>
        </div>

        <div className="space-y-6">
          <ProfileCompletionCard percent={p.completion}/>

          <div className="card-soft p-6">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-[color:var(--ncc-gold)]"/>
              <h3 className="font-semibold">NCC Information</h3>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <Row k="Wing" v={p.ncc.wing}/>
              <Row k="Certificate" v={p.ncc.certificate}/>
              <Row k="Rank" v={p.ncc.rank}/>
            </dl>
          </div>

          <div className="card-soft p-6">
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[color:var(--ncc-maroon)]"/><h3 className="font-semibold">Based in</h3></div>
            <p className="mt-2 text-sm text-muted-foreground">{p.location}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Section({ title, children }) {
  return (
    <div className="card-soft p-6">
      <h2 className="font-display font-bold text-lg">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}
function Row({ k, v }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 last:border-0 pb-1.5 last:pb-0">
      <dt className="text-muted-foreground">{k}</dt><dd className="font-semibold">{v}</dd>
    </div>
  );
}
