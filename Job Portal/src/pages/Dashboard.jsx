import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bell, Bookmark, Users, ChevronLeft, ChevronRight,
  Briefcase, MapPin, TrendingUp, Award, Sparkles,
  Clock, CheckCheck, UserCheck, ExternalLink, Mail,
  Building2, BadgeCheck, RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { useJobsContext } from "../context/JobsContext";
import { useProfile } from "../context/ProfileContext";
import { useNotificationContext } from "../context/NotificationContext";
import { useMentorshipContext } from "../context/MentorshipContext";

// ─── Quick stats ──────────────────────────────────────────────────────────────
const stats = [
  { label: "Applications", value: 8,    icon: Briefcase,  color: "var(--ncc-maroon)" },
  { label: "Saved Jobs",   value: 12,   icon: Bookmark,   color: "var(--ncc-army)" },
  { label: "Profile Views",value: 47,   icon: TrendingUp, color: "var(--ncc-gold)" },
  { label: "NCC Bonus",    value: "+12%",icon: Award,      color: "var(--ncc-maroon)" },
];

// ─── Notification type styles ─────────────────────────────────────────────────
const NOTIF_META = {
  JOB_MATCH:   { label: "Job Match",   color: "text-[color:var(--ncc-army)]",   bg: "bg-[color:var(--ncc-army)]/10" },
  PROFILE:     { label: "Profile",     color: "text-[color:var(--ncc-gold)]",   bg: "bg-[color:var(--ncc-gold)]/10" },
  APPLICATION: { label: "Application", color: "text-[color:var(--ncc-maroon)]", bg: "bg-[color:var(--ncc-maroon)]/10" },
  MENTOR:      { label: "Mentor",      color: "text-primary",                   bg: "bg-primary/10" },
  GENERAL:     { label: "General",     color: "text-muted-foreground",          bg: "bg-muted" },
};

function timeAgo(iso) {
  if (!iso) return "recently";
  const d = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (isNaN(d) || d < 0) return "recently";
  if (d < 60) return `${d}s ago`;
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}

// ─── Carousel wrapper ─────────────────────────────────────────────────────────
const PAGE = 3;

function Carousel({ items, renderItem }) {
  const [page, setPage] = useState(0);
  const total = Math.ceil(items.length / PAGE);
  const slice = items.slice(page * PAGE, page * PAGE + PAGE);

  return (
    <div className="relative">
      <motion.div
        key={page}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.22 }}
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {slice.map((item, i) => renderItem(item, i))}
      </motion.div>

      {/* Pagination row */}
      {total > 1 && (
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="h-8 w-8 rounded-xl border border-border flex items-center justify-center hover:bg-muted disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-2 rounded-full transition-all ${
                  i === page ? "w-6 bg-primary" : "w-2 bg-border"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(total - 1, p + 1))}
            disabled={page === total - 1}
            className="h-8 w-8 rounded-xl border border-border flex items-center justify-center hover:bg-muted disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, iconColor, title, count, linkTo, linkLabel }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2.5">
        <div
          className="h-9 w-9 rounded-xl grid place-items-center shrink-0"
          style={{ background: `color-mix(in oklab, ${iconColor} 15%, transparent)` }}
        >
          <Icon className="h-4.5 w-4.5" style={{ color: iconColor }} />
        </div>
        <div>
          <h2 className="font-display font-bold text-base">{title}</h2>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{
            background: `color-mix(in oklab, ${iconColor} 12%, transparent)`,
            color: iconColor,
          }}
        >
          {count}
        </span>
        {linkTo && (
          <Link to={linkTo} className="text-xs font-semibold text-primary hover:underline">
            {linkLabel || "See all"} →
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── Notification card ────────────────────────────────────────────────────────
function NotificationCard({ item }) {
  const meta = NOTIF_META[item.type] || NOTIF_META.GENERAL;
  const isUnread = item.isRead === false; // Fallback if isRead is missing
  return (
    <div className={`card-soft p-4 flex flex-col gap-3 relative ${isUnread ? "ring-1 ring-primary/20" : ""}`}>
      {isUnread && (
        <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary animate-pulse" />
      )}
      <div className={`self-start text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${meta.bg} ${meta.color}`}>
        {meta.label}
      </div>
      <p className="text-sm font-semibold leading-snug">{item.title}</p>
      {item.Descripton && (
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{item.Descripton}</p>
      )}
      <div className="mt-auto flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        {timeAgo(item.createdAt)}
        {!isUnread && <CheckCheck className="h-3 w-3 ml-auto text-green-500" />}
      </div>
    </div>
  );
}

// ─── Saved Job card ───────────────────────────────────────────────────────────
function SavedJobCard({ item }) {
  const { profile } = useProfile();

  const companyName = item.organization?.name || "TechCorp";
  const logoUrl = item.jobImage || item.organization?.logo ||
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(companyName)}&backgroundColor=800000`;

  // Dynamic match logic
  const userSkills = (profile?.skills || []).map((s) => s.toLowerCase());
  const jobSkills = item.skills || [];
  const matched = jobSkills.filter((s) => userSkills.includes(s.toLowerCase()));
  const baseMatch = jobSkills.length > 0
    ? Math.round((matched.length / jobSkills.length) * 100)
    : 80;
  const hasNcc = !!profile?.nccUnit || !!profile?.enrolmentNumber;
  const matchPercent = Math.min(100, baseMatch + (hasNcc ? 12 : 0));

  const salaryText = item.ctc || item.stipend || "Not Disclosed";
  const locationText = item.Location || "Remote";

  return (
    <div className="card-soft p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <img
          src={logoUrl}
          alt={companyName}
          className="h-10 w-10 rounded-xl ring-1 ring-border bg-muted object-cover shrink-0"
          onError={(e) => {
            e.target.src = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(companyName)}`;
          }}
        />
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{item.title}</p>
          <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
            <Building2 className="h-3 w-3 shrink-0" /> {companyName}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {(item.skills || []).slice(0, 3).map((s) => (
          <span key={s} className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-muted border border-border/60">
            {s}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3 w-3" /> {locationText}
        </span>
        <span className="font-semibold text-[color:var(--ncc-army)]">{salaryText}</span>
      </div>

      {/* Match bar */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-muted-foreground">Match</span>
          <span className="font-bold" style={{
            color: matchPercent >= 85 ? "var(--ncc-army)" : matchPercent >= 70 ? "var(--ncc-gold)" : "var(--ncc-maroon)"
          }}>{matchPercent}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${matchPercent}%`,
              background: matchPercent >= 85 ? "var(--ncc-army)" : matchPercent >= 70 ? "var(--ncc-gold)" : "var(--ncc-maroon)",
            }}
          />
        </div>
      </div>

      <Link
        to={`/jobs/${item.id}`}
        className="mt-auto inline-flex items-center justify-center gap-1.5 text-xs font-semibold btn-outline h-8"
      >
        <ExternalLink className="h-3 w-3" /> View Job
      </Link>
    </div>
  );
}

// ─── Mentor card ──────────────────────────────────────────────────────────────
function MentorCard({ item, onConnect }) {
  const isAvailable = item.available !== false;
  const orgName = typeof item.organization === "object" ? item.organization?.name : item.organization;
  const specialties = item.expertise || ["Leadership", "Career Guidance"];
  const avatarUrl = item.profileImage || `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(item.fullName || "Mentor")}&backgroundColor=800000`;

  return (
    <div className="card-soft p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <img
            src={avatarUrl}
            alt={item.fullName}
            className="h-12 w-12 rounded-2xl ring-1 ring-border bg-muted object-cover"
            onError={(e) => {
              e.target.src = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(item.fullName || "Mentor")}`;
            }}
          />
          <span
            className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-card ${
              isAvailable ? "bg-green-500" : "bg-muted-foreground"
            }`}
          />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{item.fullName}</p>
          <p className="text-xs text-muted-foreground truncate">{item.designation || "NCC Mentor & Advisor"}</p>
          {orgName && (
            <p className="text-[10px] text-muted-foreground/70 truncate flex items-center gap-1">
              <Building2 className="h-3 w-3 shrink-0" /> {orgName}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {specialties.slice(0, 3).map((e) => (
          <span key={e} className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-primary/8 text-primary border border-primary/20">
            {e}
          </span>
        ))}
      </div>

      <div className={`text-[10px] font-semibold flex items-center gap-1 ${
        isAvailable ? "text-green-600" : "text-muted-foreground"
      }`}>
        <BadgeCheck className="h-3 w-3" />
        {isAvailable ? "Available for sessions" : "Currently unavailable"}
      </div>

      <button
        onClick={() => onConnect(item)}
        disabled={!isAvailable}
        className="mt-auto inline-flex items-center justify-center gap-1.5 text-xs font-semibold btn-primary h-8 disabled:opacity-40"
      >
        <UserCheck className="h-3 w-3" /> Connect
      </button>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const { jobs, savedJobs, fetchJobs, fetchSavedJobs } = useJobsContext();
  const { personalNotifications, fetchPersonalNotifications } = useNotificationContext();
  const { mentors, fetchMentors, sendMentorshipRequest } = useMentorshipContext();

  const [selectedMentor, setSelectedMentor] = useState(null);
  const [note, setNote] = useState("hey i want your mentorship");
  const [submittingConnect, setSubmittingConnect] = useState(false);
  const [loadingRealData, setLoadingRealData] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      setLoadingRealData(true);
      try {
        await Promise.all([
          fetchJobs().catch(() => {}),
          fetchSavedJobs().catch(() => {}),
          fetchPersonalNotifications().catch(() => {}),
          fetchMentors().catch(() => {}),
        ]);
      } catch (err) {
        console.error("Dashboard failed to reload data: ", err);
      } finally {
        setLoadingRealData(false);
      }
    };
    loadAll();
  }, [fetchJobs, fetchSavedJobs, fetchPersonalNotifications, fetchMentors]);

  // Extract real job details from the savedJobs record list
  const realSavedJobs = (savedJobs || []).map((item) => item.job).filter(Boolean);
  // fallback: if none saved, show top 6 public jobs
  const displaySaved = realSavedJobs.length ? realSavedJobs : jobs.slice(0, 6);
  
  const displayNotifications = personalNotifications || [];
  const unreadCount = displayNotifications.filter((n) => n.isRead === false).length;

  const handleConnectMentor = (mentor) => {
    setSelectedMentor(mentor);
  };

  const handleConfirmConnect = async () => {
    if (!selectedMentor) return;
    setSubmittingConnect(true);
    try {
      await sendMentorshipRequest({ teacherId: selectedMentor.id, note });
      setSelectedMentor(null);
      setNote("hey i want your mentorship");
    } catch (err) {
      // toast is already displayed inside sendMentorshipRequest context catch block
    } finally {
      setSubmittingConnect(false);
    }
  };

  return (
    <DashboardLayout>
      {/* ── Hero Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl hero-gradient text-white p-7 sm:p-10 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(201,162,39,0.35),transparent_45%)]" />
        <div className="relative">
          <p className="text-xs uppercase tracking-widest text-white/80">Welcome back</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-display font-extrabold">
            Hey {user?.fullName?.split(" ")[0] || "Cadet"} 👋
          </h1>
          <p className="mt-2 text-white/85 max-w-xl">
            You have <strong>{unreadCount} unread notifications</strong> and new jobs waiting.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/jobs" className="rounded-full bg-white text-[color:var(--ncc-maroon)] px-5 py-2 font-semibold text-sm">
              Browse jobs
            </Link>
            <Link to="/profile" className="rounded-full bg-white/10 hover:bg-white/15 px-5 py-2 font-semibold text-sm backdrop-blur">
              Complete profile
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════
          SECTION 1 — NOTIFICATIONS
      ═══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8 card-soft p-6"
      >
        <SectionHeader
          icon={Bell}
          iconColor="var(--ncc-maroon)"
          title="Notifications"
          count={`${unreadCount} unread / ${displayNotifications.length} total`}
          linkTo="/notifications"
        />
        {loadingRealData ? (
          <div className="py-12 flex justify-center items-center gap-2 text-muted-foreground text-sm">
            <RefreshCw className="h-4 w-4 animate-spin text-primary" /> Loading notifications...
          </div>
        ) : displayNotifications.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground text-sm italic">
            No personal notifications found.
          </div>
        ) : (
          <Carousel
            items={displayNotifications}
            renderItem={(item) => <NotificationCard key={item.id} item={item} />}
          />
        )}
      </motion.div>

      {/* ═══════════════════════════════════════════
          SECTION 2 — SAVED JOBS
      ═══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="mt-6 card-soft p-6"
      >
        <SectionHeader
          icon={Bookmark}
          iconColor="var(--ncc-army)"
          title="Saved Jobs"
          count={`${displaySaved.length} jobs`}
          linkTo="/saved-jobs"
          linkLabel="View saved"
        />
        {loadingRealData ? (
          <div className="py-12 flex justify-center items-center gap-2 text-muted-foreground text-sm">
            <RefreshCw className="h-4 w-4 animate-spin text-primary" /> Loading saved jobs...
          </div>
        ) : (
          <Carousel
            items={displaySaved}
            renderItem={(item) => <SavedJobCard key={item.id} item={item} />}
          />
        )}
      </motion.div>

      {/* ═══════════════════════════════════════════
          SECTION 3 — MENTOR CONNECT
      ═══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="mt-6 card-soft p-6"
      >
        <SectionHeader
          icon={Users}
          iconColor="var(--ncc-gold)"
          title="Mentor Connect"
          count={`${(mentors || []).filter((m) => m.available !== false).length} available`}
        />
        {loadingRealData ? (
          <div className="py-12 flex justify-center items-center gap-2 text-muted-foreground text-sm">
            <RefreshCw className="h-4 w-4 animate-spin text-primary" /> Loading mentors...
          </div>
        ) : (mentors || []).length === 0 ? (
          <div className="py-10 text-center text-muted-foreground text-sm italic">
            No mentors are currently registered.
          </div>
        ) : (
          <Carousel
            items={mentors}
            renderItem={(item) => (
              <MentorCard key={item.id} item={item} onConnect={handleConnectMentor} />
            )}
          />
        )}
      </motion.div>

      {/* ═══════════════════════════════════════════
          MENTORSHIP CONNECT MODAL Overlay (Custom UI)
      ═══════════════════════════════════════════ */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-card border border-border p-6 rounded-3xl shadow-xl flex flex-col gap-4 text-left font-sans"
          >
            <div>
              <h3 className="text-lg font-bold text-foreground">Connect with {selectedMentor.fullName}</h3>
              <p className="text-xs text-muted-foreground mt-1 font-sans">
                Send a personalized request message to request mentorship.
              </p>
            </div>
            
            <div className="flex flex-col gap-1.5 font-sans">
              <label className="text-xs font-semibold text-muted-foreground font-sans">Mentorship Note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Brief note about why you want to connect..."
                className="w-full h-24 p-3 rounded-2xl border border-border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none font-sans text-foreground"
              />
            </div>
            
            <div className="flex justify-end gap-2.5 mt-2 font-sans">
              <button
                onClick={() => setSelectedMentor(null)}
                disabled={submittingConnect}
                className="btn-outline px-4 py-2 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmConnect}
                disabled={submittingConnect}
                className="btn-primary px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5"
              >
                {submittingConnect ? (
                  <>
                    <RefreshCw className="h-3 w-3 animate-spin" /> Connecting...
                  </>
                ) : (
                  "Request Mentorship"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}
