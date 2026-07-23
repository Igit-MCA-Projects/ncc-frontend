import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Check, X, Eye, MapPin, Briefcase, Calendar, Wallet, Pencil } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { getJobs, approveJob, rejectJob, updateJob } from "@/services/adminService";
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
  const [editingJob, setEditingJob] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    skillText: "",
    Location: "",
    hirignType: "",
    ctc: "",
    stipend: "",
    applyLink: "",
    startDate: "",
    endData: "",
    organization: {
      name: "",
      email: "",
      phone: "",
      website: "",
      description: "",
    },
  });

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

  const openEdit = (job) => {
    setEditingJob(job);
    setEditForm({
      title: job?.title || "",
      description: job?.description || "",
      skillText: Array.isArray(job?.skills) ? job.skills.join(", ") : job?.skills || "",
      Location: job?.Location || job?.location || "",
      hirignType: job?.hirignType || "",
      ctc: job?.ctc || "",
      stipend: job?.stipend || "",
      applyLink: job?.applyLink || "",
      startDate: job?.startDate ? new Date(job.startDate).toISOString().slice(0, 16) : "",
      endData: job?.endData ? new Date(job.endData).toISOString().slice(0, 16) : "",
      organization: {
        name: job?.organization?.name || "",
        email: job?.organization?.email || "",
        phone: job?.organization?.phone || "",
        website: job?.organization?.website || "",
        description: job?.organization?.description || "",
      },
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("organization.")) {
      const key = name.split(".")[1];
      setEditForm((prev) => ({
        ...prev,
        organization: {
          ...prev.organization,
          [key]: value,
        },
      }));
      return;
    }

    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingJob?.id) return;

    try {
      const payload = {
        jobId: editingJob.id,
        title: editForm.title || undefined,
        description: editForm.description || undefined,
        skills: editForm.skillText
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        Location: editForm.Location || undefined,
        hirignType: editForm.hirignType || undefined,
        ctc: editForm.ctc || undefined,
        stipend: editForm.stipend || undefined,
        applyLink: editForm.applyLink || undefined,
        startDate: editForm.startDate || undefined,
        endData: editForm.endData || undefined,
        organization: {
          name: editForm.organization.name || undefined,
          email: editForm.organization.email || undefined,
          phone: editForm.organization.phone || undefined,
          website: editForm.organization.website || undefined,
          description: editForm.organization.description || undefined,
        },
      };

      const response = await updateJob(payload);
      if (response?.success) {
        toast.success("Job updated successfully");
        setEditingJob(null);
        load();
      } else {
        toast.error(response?.message || "Failed to update job");
      }
    } catch (error) {
      toast.error(error?.message || "Failed to update job");
    }
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
                <button
                  onClick={() => openEdit(j)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-input px-3 py-1.5 text-sm hover:bg-muted"
                >
                  <Pencil size={14} /> Edit
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

      {editingJob && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setEditingJob(null)}>
          <div className="card-surface w-full max-w-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Edit Job</h3>
              <button onClick={() => setEditingJob(null)} className="rounded-xl border border-input bg-card px-3 py-1.5 text-sm hover:bg-muted">
                Close
              </button>
            </div>

            <form onSubmit={handleUpdate} className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Title</label>
                <input name="title" value={editForm.title} onChange={handleEditChange} className="mt-1 w-full rounded-xl border px-3 py-2" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Description</label>
                <textarea name="description" rows={4} value={editForm.description} onChange={handleEditChange} className="mt-1 w-full rounded-xl border px-3 py-2" />
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <input name="Location" value={editForm.Location} onChange={handleEditChange} className="mt-1 w-full rounded-xl border px-3 py-2" />
              </div>
              <div>
                <label className="text-sm font-medium">Hiring Type</label>
                <select name="hirignType" value={editForm.hirignType} onChange={handleEditChange} className="mt-1 w-full rounded-xl border px-3 py-2">
                  <option value="">Select</option>
                  <option value="FULLTIME">Full Time</option>
                  <option value="PARTTME">Part Time</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">CTC</label>
                <input name="ctc" value={editForm.ctc} onChange={handleEditChange} className="mt-1 w-full rounded-xl border px-3 py-2" />
              </div>
              <div>
                <label className="text-sm font-medium">Stipend</label>
                <input name="stipend" value={editForm.stipend} onChange={handleEditChange} className="mt-1 w-full rounded-xl border px-3 py-2" />
              </div>
              <div>
                <label className="text-sm font-medium">Apply Link</label>
                <input name="applyLink" value={editForm.applyLink} onChange={handleEditChange} className="mt-1 w-full rounded-xl border px-3 py-2" />
              </div>
              <div>
                <label className="text-sm font-medium">Start Date</label>
                <input type="datetime-local" name="startDate" value={editForm.startDate} onChange={handleEditChange} className="mt-1 w-full rounded-xl border px-3 py-2" />
              </div>
              <div>
                <label className="text-sm font-medium">End Date</label>
                <input type="datetime-local" name="endData" value={editForm.endData} onChange={handleEditChange} className="mt-1 w-full rounded-xl border px-3 py-2" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Skills (comma separated)</label>
                <input name="skillText" value={editForm.skillText} onChange={handleEditChange} className="mt-1 w-full rounded-xl border px-3 py-2" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Organization Name</label>
                <input name="organization.name" value={editForm.organization.name} onChange={handleEditChange} className="mt-1 w-full rounded-xl border px-3 py-2" />
              </div>
              <div>
                <label className="text-sm font-medium">Organization Email</label>
                <input name="organization.email" value={editForm.organization.email} onChange={handleEditChange} className="mt-1 w-full rounded-xl border px-3 py-2" />
              </div>
              <div>
                <label className="text-sm font-medium">Organization Phone</label>
                <input name="organization.phone" value={editForm.organization.phone} onChange={handleEditChange} className="mt-1 w-full rounded-xl border px-3 py-2" />
              </div>
              <div>
                <label className="text-sm font-medium">Organization Website</label>
                <input name="organization.website" value={editForm.organization.website} onChange={handleEditChange} className="mt-1 w-full rounded-xl border px-3 py-2" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Organization Description</label>
                <textarea name="organization.description" rows={3} value={editForm.organization.description} onChange={handleEditChange} className="mt-1 w-full rounded-xl border px-3 py-2" />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobApprovalPage;
