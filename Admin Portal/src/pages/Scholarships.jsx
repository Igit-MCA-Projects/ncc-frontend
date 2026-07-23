import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import {
  GraduationCap,
  Plus,
  Trash2,
  FileText,
  CheckCircle2,
  Sparkles,
  X,
  Award,
  IndianRupee,
  ShieldAlert,
} from "lucide-react";
import SearchBar from "@/components/SearchBar";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import ConfirmModal from "@/components/ConfirmModal";
import {
  getScholarships,
  addScholarship,
  deleteScholarship,
} from "@/services/adminService";

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [documentsInput, setDocumentsInput] = useState("");

  const loadData = () => {
    setLoading(true);
    getScholarships(1, 100)
      .then((res) => {
        if (res?.success) {
          setScholarships(res?.data || []);
        } else {
          toast.error(res?.message || "Failed to load scholarships");
          setScholarships(res?.data || []);
        }
      })
      .catch((err) => {
        toast.error(err?.message || "Failed to load scholarships");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Scholarship name is required");
      return;
    }
    if (!amount.trim()) {
      toast.error("Amount is required");
      return;
    }
    if (!eligibility.trim()) {
      toast.error("Eligibility criteria is required");
      return;
    }

    const requiredDocument = documentsInput
      .split("\n")
      .flatMap((line) => line.split(","))
      .map((item) => item.trim())
      .filter(Boolean);

    setSubmitting(true);
    try {
      const res = await addScholarship({
        name: name.trim(),
        amount: amount.trim(),
        eligibility: eligibility.trim(),
        requiredDocument,
      });

      if (res.success) {
        toast.success("Scholarship added successfully!");
        setModalOpen(false);
        setName("");
        setAmount("");
        setEligibility("");
        setDocumentsInput("");
        loadData();
      } else {
        toast.error(res.message || "Failed to add scholarship");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      const res = await deleteScholarship(confirmDelete.id);
      if (res.success) {
        toast.success("Scholarship deleted successfully");
        setConfirmDelete(null);
        loadData();
      } else {
        toast.error(res.message || "Failed to delete scholarship");
      }
    } catch {
      toast.error("Failed to delete scholarship");
    }
  };

  const filtered = useMemo(() => {
    if (!q.trim()) return scholarships;
    const query = q.trim().toLowerCase();
    return scholarships.filter((s) => {
      const nameMatch = (s.name || "").toLowerCase().includes(query);
      const amountMatch = (s.amount || "").toLowerCase().includes(query);
      const eligMatch = (s.eligibility || "").toLowerCase().includes(query);
      const docsMatch = (s.requiredDocument || [])
        .join(" ")
        .toLowerCase()
        .includes(query);
      return nameMatch || amountMatch || eligMatch || docsMatch;
    });
  }, [scholarships, q]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Scholarship Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage financial grants, merit awards, and document requirements for NCC Cadets.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 shadow-sm transition"
        >
          <Plus size={16} />
          Add Scholarship
        </button>
      </div>

      {/* Quick Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-surface p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center">
            <GraduationCap size={20} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Active Schemes</p>
            <p className="text-lg font-bold">{scholarships.length}</p>
          </div>
        </div>

        <div className="card-surface p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 grid place-items-center">
            <IndianRupee size={20} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Grant Directives</p>
            <p className="text-lg font-bold">Verifiable & Verified</p>
          </div>
        </div>

        <div className="card-surface p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 grid place-items-center">
            <Award size={20} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Beneficiary Cadets</p>
            <p className="text-lg font-bold">State & Central</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex justify-end">
        <SearchBar
          value={q}
          onChange={setQ}
          placeholder="Search scholarship name, eligibility, documents..."
        />
      </div>

      {/* Scholarships List Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="card-surface p-5">
            <LoadingSkeleton rows={4} />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No scholarships found"
            description="Add scholarship schemes to inform cadets about available financial support and eligibility criteria."
          />
        ) : (
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {filtered.map((s) => {
              const docList = s.requiredDocument || [];

              return (
                <div
                  key={s.id}
                  className="card-surface p-5 flex flex-col justify-between gap-4 hover:border-primary/40 transition shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                          <IndianRupee size={12} />
                          {s.amount || "Financial Support"}
                        </span>
                        <h3 className="text-base font-semibold text-foreground pt-1">
                          {s.name}
                        </h3>
                      </div>
                      <button
                        onClick={() =>
                          setConfirmDelete({ id: s.id, title: s.name })
                        }
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-input text-destructive hover:bg-destructive/10 transition"
                        title="Delete Scholarship"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-muted/40 border border-border/50 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-primary">
                        <Sparkles size={13} />
                        <span>Eligibility Criteria</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {s.eligibility}
                      </p>
                    </div>

                    {docList.length > 0 && (
                      <div className="pt-2 border-t border-border/50">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-2">
                          <FileText size={14} className="text-primary" />
                          <span>Required Documents</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {docList.map((doc, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-background border border-border text-[11px] font-medium"
                            >
                              <CheckCircle2 size={11} className="text-emerald-500" />
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-border/40 text-[11px] text-muted-foreground flex justify-between items-center">
                    <span>Added: {new Date(s.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Add Scholarship */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm grid place-items-center p-4">
          <div className="card-surface w-full max-w-lg p-6 space-y-5 shadow-xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap size={20} className="text-primary" />
                <h2 className="text-lg font-semibold">Add Scholarship Scheme</h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-sm">
              <div>
                <label className="block font-medium mb-1">Scholarship Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sahara Scholarship Scheme"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Scholarship Amount *</label>
                <input
                  type="text"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. ₹12,000 / year or ₹6,000 one-time"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Eligibility Criteria *</label>
                <textarea
                  rows={3}
                  required
                  value={eligibility}
                  onChange={(e) => setEligibility(e.target.value)}
                  placeholder="Specify academic percentage, NCC certificate requirement (A/B/C), or camp participation required..."
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Required Documents (Optional)</label>
                <textarea
                  rows={2}
                  value={documentsInput}
                  onChange={(e) => setDocumentsInput(e.target.value)}
                  placeholder="Enter required documents separated by commas or lines (e.g. NCC Certificate, Marksheet, Aadhaar Card)"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-input px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Add Scholarship"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={!!confirmDelete}
        title="Delete Scholarship?"
        description={`Are you sure you want to delete "${confirmDelete?.title}"?`}
        confirmLabel="Delete Scholarship"
        tone="destructive"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
