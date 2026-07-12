import { useEffect, useState, useMemo } from "react";
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  ArrowRight,
  Trash2,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useMentorshipContext } from "../context/MentorshipContext";
import toast from "react-hot-toast";

const STATUS_METADATA = {
  ACCEPTED: {
    label: "Accepted",
    color:
      "text-green-600 border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900/60 dark:text-green-400",
    icon: CheckCircle2,
  },
  PENDING: {
    label: "Pending",
    color:
      "text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/60 dark:text-amber-400",
    icon: Clock,
  },
  REJECTED: {
    label: "Rejected",
    color:
      "text-rose-600 border-rose-200 bg-rose-50 dark:bg-rose-950/20 dark:border-rose-900/60 dark:text-rose-400",
    icon: XCircle,
  },
};

function formatDate(isoString) {
  if (!isoString) return "-";
  try {
    const d = new Date(isoString);
    return (
      d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }) +
      " at " +
      d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  } catch (err) {
    return isoString;
  }
}

export default function MentorshipStatus() {
  const { mentorshipRequests, loading, fetchMentorshipRequests, deleteMentorship } =
    useMentorshipContext();
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchMentorshipRequests().catch((err) => {
      toast.error(err.message || "Failed to load mentorship status data");
    });
  }, [fetchMentorshipRequests]);

  // Compute counts for tab badges
  const counts = useMemo(() => {
    const total = mentorshipRequests.length;
    const pending = mentorshipRequests.filter((r) => r.status === "PENDING").length;
    const accepted = mentorshipRequests.filter((r) => r.status === "ACCEPTED").length;
    const rejected = mentorshipRequests.filter((r) => r.status === "REJECTED").length;
    return { ALL: total, PENDING: pending, ACCEPTED: accepted, REJECTED: rejected };
  }, [mentorshipRequests]);

  // Filtered requests list
  const filteredRequests = useMemo(() => {
    if (filter === "ALL") return mentorshipRequests;
    return mentorshipRequests.filter((r) => r.status === filter);
  }, [mentorshipRequests, filter]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold flex items-center gap-2">
            <Users className="text-primary h-7 w-7" />
            Mentorship Status
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track validation and updates of your connection requests with NCC mentors.
          </p>
        </div>
        <button
          onClick={async () => {
            try {
              await fetchMentorshipRequests();
              toast.success("Mentorship status refreshed!");
            } catch (err) {
              toast.error(err?.message || "Refresh failed");
            }
          }}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs font-semibold btn-outline max-w-max px-3.5 py-2"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Tabs Filter Bar */}
      <div className="mt-6 flex flex-wrap gap-2 border-b border-border pb-px">
        {["ALL", "PENDING", "ACCEPTED", "REJECTED"].map((tab) => {
          const isActive = filter === tab;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`pb-3 px-3 text-xs font-semibold uppercase tracking-wider relative transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "ALL" ? "All Requests" : tab}
              <span
                className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}
              >
                {counts[tab]}
              </span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Requests Content */}
      <div className="mt-6 flex flex-col gap-4">
        {loading && mentorshipRequests.length === 0 ? (
          <div className="card-soft min-h-[300px] flex flex-col justify-center items-center gap-2 text-muted-foreground text-sm">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
            <span>Loading mentorship status records...</span>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="card-soft min-h-[250px] flex flex-col justify-center items-center text-center p-6 gap-3">
            <div className="h-12 w-12 rounded-2xl bg-muted grid place-items-center mb-1 text-muted-foreground/60">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-base text-foreground">No Requests Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              {filter === "ALL"
                ? "You haven't requested mentorship from any advisor yet. Connect with verified mentors on the dashboard."
                : `You don't have any mentorship connection requests currently with status "${filter}".`}
            </p>
          </div>
        ) : (
          filteredRequests.map((req) => {
            const meta = STATUS_METADATA[req.status] || {
              label: req.status || "Unknown",
              color: "text-muted-foreground border-border bg-muted",
              icon: AlertCircle,
            };
            const StatusIcon = meta.icon;
            const mentorName = req.mentor?.fullName || "NCC Mentor";
            const avatarUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(mentorName)}&backgroundColor=800000`;

            return (
              <div
                key={req.id}
                className="card-soft p-5 flex flex-col md:flex-row justify-between gap-5 border border-border/80 hover:border-primary/20 hover:shadow-sm transition-all"
              >
                {/* Left Side: Mentor Profile & Request Stats */}
                <div className="flex flex-col gap-4 flex-1">
                  <div className="flex items-start gap-4">
                    <img
                      src={avatarUrl}
                      alt={mentorName}
                      className="h-12 w-12 rounded-2xl bg-muted outline outline-1 outline-border object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-base text-foreground leading-snug">
                        {mentorName}
                      </h4>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 mt-1 text-xs text-muted-foreground">
                        {req.mentor?.email && (
                          <a
                            href={`mailto:${req.mentor.email}`}
                            className="flex items-center gap-1 hover:text-primary transition-colors"
                          >
                            <Mail className="h-3.5 w-3.5 shrink-0" />
                            {req.mentor.email}
                          </a>
                        )}
                        {req.mentor?.phone && (
                          <a
                            href={`tel:${req.mentor.phone}`}
                            className="flex items-center gap-1 hover:text-primary transition-colors"
                          >
                            <Phone className="h-3.5 w-3.5 shrink-0" />
                            {req.mentor.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Notes / Chat sections */}
                  <div className="grid gap-3 sm:grid-cols-2 mt-2 bg-muted/20 p-3.5 rounded-2xl border border-border/50">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" /> My Student Note
                      </span>
                      <p className="text-xs text-foreground italic break-words leading-relaxed">
                        &quot;{req.note || "No note attached to request."}&quot;
                      </p>
                    </div>
                    {req.message && (
                      <div className="flex flex-col gap-1 border-t sm:border-t-0 sm:border-l border-border/50 pt-2 sm:pt-0 sm:pl-3.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-primary" /> Response message
                        </span>
                        <p className="text-xs text-foreground font-medium break-words leading-relaxed">
                          {req.message}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Status Badge & Timestamps */}
                <div className="flex flex-row md:flex-col justify-between md:justify-start md:items-end gap-3 shrink-0 border-t md:border-t-0 md:border-l border-border/60 pt-3.5 md:pt-0 md:pl-5">
                  <div className="flex flex-col gap-2 md:items-end">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      Connection Status
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${meta.color}`}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {meta.label}
                      </span>
                      <button
                        onClick={async () => {
                          try {
                            await deleteMentorship(req.id);
                          } catch (err) {
                            // Already handled
                          }
                        }}
                        className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 hover:text-rose-700 transition-colors shrink-0"
                        title="Delete Mentorship Request"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 text-xs text-muted-foreground md:text-right mt-1">
                    <div className="flex items-center gap-1 justify-start md:justify-end">
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                      <span>Requested: {formatDate(req.requestedAt)}</span>
                    </div>
                    {req.respondedAt && (
                      <div className="flex items-center gap-1 justify-start md:justify-end text-[color:var(--ncc-army)] font-medium">
                        <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                        <span>Responded: {formatDate(req.respondedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </DashboardLayout>
  );
}
