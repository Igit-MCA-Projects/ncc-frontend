import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import ProfileCompletionCard from "../components/ProfileCompletionCard";
import { useProfile, ProfileProvider } from "../context/ProfileContext";
import {
  Linkedin, Github, Mail, Phone, MapPin, Award,
  FileText, Globe, Twitter, Briefcase, GraduationCap,
  BookOpen, DollarSign, RefreshCw
} from "lucide-react";
import toast from "react-hot-toast";

// ─── Inner component (needs ProfileContext) ───────────────────────────────────

function ProfileInner() {
  const { profile, profileLoading, profileError, fetchProfile } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile().catch(() => {}); // error shown via profileError
  }, [fetchProfile]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (profileLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
        <p className="text-muted-foreground text-sm">Loading your profile…</p>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (profileError && !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <p className="text-destructive font-semibold">Could not load profile</p>
        <p className="text-muted-foreground text-sm">{profileError}</p>
        <button onClick={() => fetchProfile().catch(() => {})} className="btn-outline text-sm inline-flex items-center gap-2">
          <RefreshCw className="h-4 w-4" /> Retry
        </button>
      </div>
    );
  }

  // ── Profile not complete → redirect to completion form ─────────────────────
  if (!profile || !profile.profileCompleted) {
    // Navigate programmatically so the URL changes properly
    navigate("/profile-complete");
    return null;
  }

  // ── Full profile view ──────────────────────────────────────────────────────
  const p = profile;

  // Derive display helpers
  const currentAddress = p.addresses?.find((a) => a.type === "CURRENT");
  const permanentAddress = p.addresses?.find((a) => a.type === "PERMANENT");
  const socialMap = Object.fromEntries((p.socialLinks || []).map((s) => [s.platform, s.url]));

  // Calculate a simple completion % (rough)
  const filled = [p.phone, p.headline, p.bio, p.resumeUrl, p.preferredRole,
    p.educations?.length, p.addresses?.length, p.socialLinks?.length].filter(Boolean).length;
  const completionPct = Math.round((filled / 8) * 100);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* ── Main column ── */}
      <div className="lg:col-span-2 space-y-6">

        {/* Header card */}
        <div className="card-soft p-6 sm:p-8">
          <div className="flex items-start gap-5 flex-wrap">
            {p.profileImage
              ? <img src={p.profileImage} alt="Avatar" className="h-24 w-24 rounded-2xl ring-2 ring-border object-cover bg-muted" />
              : <div className="h-24 w-24 rounded-2xl ring-2 ring-border bg-muted grid place-items-center text-3xl font-bold text-muted-foreground">{p.fullName?.[0]?.toUpperCase()}</div>
            }
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-display font-extrabold">{p.fullName}</h1>
              {p.headline && <p className="text-muted-foreground mt-0.5">{p.headline}</p>}
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {p.email && <span className="inline-flex items-center gap-1"><Mail className="h-4 w-4" />{p.email}</span>}
                {p.phone && <span className="inline-flex items-center gap-1"><Phone className="h-4 w-4" />{p.phone}</span>}
                {currentAddress && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-4 w-4" />{currentAddress.city}, {currentAddress.state}
                  </span>
                )}
              </div>
            </div>
          </div>
          {p.bio && <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{p.bio}</p>}
        </div>

        {/* Job preferences */}
        {(p.preferredRole || p.preferredLocation?.length) && (
          <Section title="Job Preferences">
            <dl className="grid sm:grid-cols-2 gap-3 text-sm">
              {p.preferredRole && <Row k="Preferred Role" v={<span className="inline-flex items-center gap-1"><Briefcase className="h-4 w-4" />{p.preferredRole}</span>} />}
              {p.expectedSalary && <Row k="Expected Salary" v={<span className="inline-flex items-center gap-1"><DollarSign className="h-4 w-4" />₹{p.expectedSalary.toLocaleString()}</span>} />}
              {p.willingToRelocate !== undefined && <Row k="Willing to Relocate" v={p.willingToRelocate ? "Yes" : "No"} />}
              {p.openToRemote !== undefined && <Row k="Open to Remote" v={p.openToRemote ? "Yes" : "No"} />}
            </dl>
            {p.preferredLocation?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {p.preferredLocation.map((loc) => <span key={loc} className="chip">{loc}</span>)}
              </div>
            )}
          </Section>
        )}

        {/* Education */}
        {p.educations?.length > 0 && (
          <Section title="Education">
            <ul className="space-y-4">
              {p.educations.map((edu, i) => (
                <li key={i} className="rounded-xl bg-muted/60 p-4">
                  <div className="flex items-start gap-3">
                    <GraduationCap className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                    <div>
                      <p className="font-semibold">{edu.institutionName}</p>
                      <p className="text-sm text-muted-foreground">{edu.degree} · {edu.fieldOfStudy}</p>
                      <p className="text-sm text-muted-foreground">{edu.boardOrUniversity}</p>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                        {edu.startDate && <span>{new Date(edu.startDate).getFullYear()} – {edu.endDate ? new Date(edu.endDate).getFullYear() : "Present"}</span>}
                        {edu.cgpa && <span>CGPA: {edu.cgpa}</span>}
                        {edu.percentage && <span>Percentage: {edu.percentage}%</span>}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Addresses */}
        {p.addresses?.length > 0 && (
          <Section title="Addresses">
            <div className="grid sm:grid-cols-2 gap-4">
              {p.addresses.map((addr, i) => (
                <div key={i} className="rounded-xl bg-muted/60 p-4 text-sm">
                  <p className="font-semibold mb-1">{addr.type === "CURRENT" ? "Current" : "Permanent"} Address</p>
                  <p className="text-muted-foreground">{[addr.building, addr.street, addr.landMark].filter(Boolean).join(", ")}</p>
                  <p className="text-muted-foreground">{addr.city}, {addr.district}</p>
                  <p className="text-muted-foreground">{addr.state}, {addr.country} – {addr.pinCode}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Resume & Links */}
        <Section title="Resume & Links">
          <div className="flex flex-wrap gap-3 text-sm">
            {p.resumeUrl && <a href={p.resumeUrl} target="_blank" rel="noreferrer" className="btn-outline inline-flex items-center gap-2"><FileText className="h-4 w-4" />Resume</a>}
            {socialMap.LinkedIn && <a href={socialMap.LinkedIn} target="_blank" rel="noreferrer" className="btn-outline inline-flex items-center gap-2"><Linkedin className="h-4 w-4" />LinkedIn</a>}
            {socialMap.GitHub && <a href={socialMap.GitHub} target="_blank" rel="noreferrer" className="btn-outline inline-flex items-center gap-2"><Github className="h-4 w-4" />GitHub</a>}
            {socialMap.Portfolio && <a href={socialMap.Portfolio} target="_blank" rel="noreferrer" className="btn-outline inline-flex items-center gap-2"><Globe className="h-4 w-4" />Portfolio</a>}
            {socialMap.Twitter && <a href={socialMap.Twitter} target="_blank" rel="noreferrer" className="btn-outline inline-flex items-center gap-2"><Twitter className="h-4 w-4" />Twitter</a>}
          </div>
        </Section>
      </div>

      {/* ── Sidebar column ── */}
      <div className="space-y-6">
        <ProfileCompletionCard percent={completionPct} />

        {currentAddress && (
          <div className="card-soft p-6">
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[color:var(--ncc-maroon)]" /><h3 className="font-semibold">Based in</h3></div>
            <p className="mt-2 text-sm text-muted-foreground">{currentAddress.city}, {currentAddress.state}</p>
          </div>
        )}

        {/* NCC placeholder — extend later */}
        <div className="card-soft p-6">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-[color:var(--ncc-gold)]" />
            <h3 className="font-semibold">NCC Information</h3>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">NCC details are managed separately in your settings.</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="card-soft p-6">
          <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" /><h3 className="font-semibold">Profile Stats</h3></div>
          <dl className="mt-4 space-y-2">
            <Row k="Education entries" v={p.educations?.length ?? 0} />
            <Row k="Addresses" v={p.addresses?.length ?? 0} />
            <Row k="Social links" v={p.socialLinks?.length ?? 0} />
          </dl>
        </div>
      </div>
    </div>
  );
}

// ─── Page wrapper ─────────────────────────────────────────────────────────────

export default function Profile() {
  return (
    <DashboardLayout>
      <ProfileProvider>
        <ProfileInner />
      </ProfileProvider>
    </DashboardLayout>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
      <dt className="text-muted-foreground text-sm">{k}</dt>
      <dd className="font-semibold text-sm">{v}</dd>
    </div>
  );
}
