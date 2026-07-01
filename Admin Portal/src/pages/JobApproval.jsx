import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Check, X, Eye, MapPin, Briefcase, Calendar, Wallet } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { getJobs, approveJob, rejectJob } from "@/services/adminService";
import { cls } from "@/utils/format";


const TABS = [
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

function JobApprovalPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("pending");
  const [preview, setPreview] = useState(null);

  const load = () => {
    setLoading(true);
    getJobs().then((r) => setJobs(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = jobs.filter((j) => j.status === tab);

  const handleApprove = async (id) => {
    await approveJob(id);
    toast.success("Job approved");
    load();
  };
  const handleReject = async (id) => {
    await rejectJob(id);
    toast.success("Job rejected");
    load();
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Job Approval</h1>
        <p className="text-sm text-muted-foreground">Review job posts submitted by companies.</p>
      </div>

      <div className="inline-flex rounded-xl border border-border bg-card p-1">
        {TABS.map((t) => {
          const count = jobs.filter((j) => j.status === t.id).length;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cls(
                "px-4 py-1.5 rounded-lg text-sm transition",
                active ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              )}
            >
              {t.label} <span className={active ? "opacity-80" : "text-muted-foreground"}>({count})</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : filtered.length === 0 ? (
        <div className="card-surface"><EmptyState title={`No ${tab} jobs`} /></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((j) => (
            <div key={j.id} className="card-surface p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground truncate">{j.companyName}</p>
                  <h3 className="font-semibold truncate">{j.title}</h3>
                </div>
                <StatusBadge status={j.status} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="inline-flex items-center gap-1.5"><MapPin size={13} />{j.location}</div>
                <div className="inline-flex items-center gap-1.5"><Wallet size={13} />{j.salary}</div>
                <div className="inline-flex items-center gap-1.5"><Briefcase size={13} />{j.experience}</div>
                <div className="inline-flex items-center gap-1.5"><Calendar size={13} />{j.postedDate}</div>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setPreview(j)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-input px-3 py-1.5 text-sm hover:bg-muted"
                >
                  <Eye size={14} /> View
                </button>
                {j.status !== "approved" && (
                  <button
                    onClick={() => handleApprove(j.id)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[color:var(--color-success)] text-[color:var(--color-success-foreground)] px-3 py-1.5 text-sm hover:opacity-90"
                  >
                    <Check size={14} /> Approve
                  </button>
                )}
                {j.status !== "rejected" && (
                  <button
                    onClick={() => handleReject(j.id)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-destructive text-destructive-foreground px-3 py-1.5 text-sm hover:bg-destructive/90"
                  >
                    <X size={14} /> Reject
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setPreview(null)}>
          <div className="card-surface w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <p className="text-xs text-muted-foreground">{preview.companyName}</p>
            <h3 className="text-lg font-semibold">{preview.title}</h3>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <p>📍 {preview.location}</p>
              <p>💰 {preview.salary}</p>
              <p>💼 {preview.experience}</p>
              <p>📅 {preview.postedDate}</p>
            </div>
            <p className="mt-4 text-sm">{preview.description}</p>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setPreview(null)} className="rounded-xl border border-input bg-card px-4 py-2 text-sm hover:bg-muted">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobApprovalPage;
