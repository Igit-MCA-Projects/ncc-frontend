import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CalendarDays, Plus, Pencil, Link2, Briefcase, DollarSign } from "lucide-react";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { createHiringCalendar, getHiringCalendar, updateHiringCalendar } from "@/services/adminService";

function HiringCalendarPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [form, setForm] = useState({
    companyName: "",
    title: "",
    description: "",
    salaryRange: "",
    hiringMonth: "",
    applyLink: "",
    prepairResource: "",
  });

  const loadEntries = async (nextPage = page) => {
    setLoading(true);
    const response = await getHiringCalendar(nextPage, 10);
    if (response?.success) {
      setEntries(response.data?.hiringCalenders || []);
      setPagination(response.data?.pagination || { page: nextPage, limit: 10, total: 0, totalPages: 0 });
    } else {
      toast.error(response?.message || "Failed to load hiring calendar");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadEntries(1);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      companyName: "",
      title: "",
      description: "",
      salaryRange: "",
      hiringMonth: "",
      applyLink: "",
      prepairResource: "",
    });
    setEditingEntry(null);
    setShowForm(false);
  };

  const openEdit = (entry) => {
    setEditingEntry(entry);
    setForm({
      companyName: entry.companyName || "",
      title: entry.title || "",
      description: entry.description || "",
      salaryRange: entry.salaryRange || "",
      hiringMonth: entry.hiringMonth ? new Date(entry.hiringMonth).toISOString().slice(0, 16) : "",
      applyLink: entry.applyLink || "",
      prepairResource: Array.isArray(entry.prepairResource) ? entry.prepairResource.join(", ") : entry.prepairResource || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      prepairResource: form.prepairResource
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    let response;
    if (editingEntry?.id) {
      response = await updateHiringCalendar({ ...payload, id: editingEntry.id });
    } else {
      response = await createHiringCalendar(payload);
    }
    if (response?.success) {
      toast.success(editingEntry ? "Hiring calendar updated" : "Hiring calendar created");
      resetForm();
      loadEntries(page);
    } else {
      toast.error(response?.message || "Request failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Hiring Calendar</h1>
          <p className="text-sm text-muted-foreground">Track upcoming hiring windows and application links.</p>
        </div>
        <button
          onClick={() => {
            setShowForm((prev) => !prev);
            if (showForm) resetForm();
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus size={16} /> {showForm ? "Close" : "Add Entry"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card-surface rounded-2xl p-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Company Name</label>
            <input name="companyName" value={form.companyName} onChange={handleChange} className="mt-1 w-full rounded-xl border px-3 py-2" required />
          </div>
          <div>
            <label className="text-sm font-medium">Title</label>
            <input name="title" value={form.title} onChange={handleChange} className="mt-1 w-full rounded-xl border px-3 py-2" required />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Description</label>
            <textarea name="description" rows={4} value={form.description} onChange={handleChange} className="mt-1 w-full rounded-xl border px-3 py-2" required />
          </div>
          <div>
            <label className="text-sm font-medium">Salary Range</label>
            <input name="salaryRange" value={form.salaryRange} onChange={handleChange} className="mt-1 w-full rounded-xl border px-3 py-2" required />
          </div>
          <div>
            <label className="text-sm font-medium">Hiring Month</label>
            <input type="datetime-local" name="hiringMonth" value={form.hiringMonth} onChange={handleChange} className="mt-1 w-full rounded-xl border px-3 py-2" required />
          </div>
          <div>
            <label className="text-sm font-medium">Apply Link</label>
            <input name="applyLink" value={form.applyLink} onChange={handleChange} className="mt-1 w-full rounded-xl border px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium">Prep Resources</label>
            <input name="prepairResource" value={form.prepairResource} onChange={handleChange} className="mt-1 w-full rounded-xl border px-3 py-2" placeholder="Resume, DSA, System Design" />
          </div>
          <div className="md:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={resetForm} className="rounded-xl border border-input bg-card px-4 py-2 text-sm hover:bg-muted">Cancel</button>
            <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">{editingEntry ? "Save Changes" : "Create Entry"}</button>
          </div>
        </form>
      )}

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : entries.length === 0 ? (
        <div className="card-surface p-8 text-center text-sm text-muted-foreground">No hiring calendar entries yet.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {entries.map((entry) => (
            <div key={entry.id} className="card-surface p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">{entry.companyName}</p>
                  <h3 className="font-semibold">{entry.title}</h3>
                </div>
                <div className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">
                  {entry.hiringMonth ? new Date(entry.hiringMonth).toLocaleDateString() : "TBD"}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{entry.description}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign size={14} /> {entry.salaryRange}
              </div>
              {entry.applyLink && (
                <a href={entry.applyLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                  <Link2 size={14} /> Open application
                </a>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase size={14} /> {Array.isArray(entry.prepairResource) ? entry.prepairResource.join(", ") : entry.prepairResource || "No prep resources"}
              </div>
              <button onClick={() => openEdit(entry)} className="inline-flex items-center gap-2 rounded-xl border border-input bg-card px-3 py-2 text-sm hover:bg-muted">
                <Pencil size={14} /> Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="flex justify-end gap-2">
          <button disabled={page <= 1} onClick={() => { const nextPage = page - 1; setPage(nextPage); loadEntries(nextPage); }} className="rounded-xl border border-input bg-card px-3 py-2 text-sm disabled:opacity-50">Previous</button>
          <button disabled={page >= pagination.totalPages} onClick={() => { const nextPage = page + 1; setPage(nextPage); loadEntries(nextPage); }} className="rounded-xl border border-input bg-card px-3 py-2 text-sm disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
}

export default HiringCalendarPage;
