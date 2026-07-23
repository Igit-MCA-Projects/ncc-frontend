import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import {
  Award,
  Plus,
  Trash2,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  X,
  Search,
  CheckCircle2,
} from "lucide-react";
import SearchBar from "@/components/SearchBar";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import ConfirmModal from "@/components/ConfirmModal";
import {
  getNccBenefits,
  addNccBenefit,
  deleteNccBenefit,
} from "@/services/adminService";

export default function NccBenefitsPage() {
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL"); // 'ALL', 'Certificate A', 'Certificate B', 'Certificate C'
  const [q, setQ] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [cirtificate, setCirtificate] = useState("Certificate C");
  const [customCertificate, setCustomCertificate] = useState("");
  const [benifit, setBenifit] = useState("");
  const [bonusMark, setBonusMark] = useState("");
  const [nccQuota, setNccQuota] = useState("");
  const [scholarshipInput, setScholarshipInput] = useState("");

  const loadData = () => {
    setLoading(true);
    getNccBenefits(1, 100)
      .then((res) => {
        if (res?.success) {
          setBenefits(res?.data || []);
        } else {
          toast.error(res?.message || "Failed to load NCC benefits");
          setBenefits(res?.data || []);
        }
      })
      .catch((err) => {
        toast.error(err?.message || "Failed to load NCC benefits");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const finalCert = cirtificate === "OTHER" ? customCertificate.trim() : cirtificate;

    if (!finalCert) {
      toast.error("Certificate type is required");
      return;
    }
    if (!benifit.trim()) {
      toast.error("Benefit description is required");
      return;
    }

    const scholarshipsArr = scholarshipInput
      .split("\n")
      .flatMap((line) => line.split(","))
      .map((item) => item.trim())
      .filter(Boolean);

    setSubmitting(true);
    try {
      const res = await addNccBenefit({
        cirtificate: finalCert,
        benifit: benifit.trim(),
        Scholarship: scholarshipsArr[0] || "",
        bonusMark: bonusMark.trim() || undefined,
        nccQuota: nccQuota.trim() || undefined,
        scholarships: scholarshipsArr,
      });

      if (res.success) {
        toast.success("NCC Benefit added successfully!");
        setModalOpen(false);
        setBenifit("");
        setBonusMark("");
        setNccQuota("");
        setScholarshipInput("");
        setCustomCertificate("");
        loadData();
      } else {
        toast.error(res.message || "Failed to add benefit");
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
      const res = await deleteNccBenefit(confirmDelete.id);
      if (res.success) {
        toast.success("NCC Benefit deleted successfully");
        setConfirmDelete(null);
        loadData();
      } else {
        toast.error(res.message || "Failed to delete benefit");
      }
    } catch {
      toast.error("Failed to delete benefit");
    }
  };

  const filtered = useMemo(() => {
    return benefits.filter((b) => {
      // Filter by Certificate Tab
      if (filter !== "ALL") {
        const certName = (b.cirtificate || b.certificate || "").toLowerCase();
        if (!certName.includes(filter.toLowerCase())) return false;
      }

      // Filter by Search Query
      if (q.trim()) {
        const query = q.trim().toLowerCase();
        const cert = (b.cirtificate || b.certificate || "").toLowerCase();
        const ben = (b.benifit || b.benefit || "").toLowerCase();
        const mark = (b.bonusMark || "").toLowerCase();
        const quota = (b.nccQuota || "").toLowerCase();
        const schol = (b.scholarships || []).join(" ").toLowerCase();
        return (
          cert.includes(query) ||
          ben.includes(query) ||
          mark.includes(query) ||
          quota.includes(query) ||
          schol.includes(query)
        );
      }

      return true;
    });
  }, [benefits, filter, q]);

  const getCertBadgeStyle = (cert = "") => {
    const c = cert.toUpperCase();
    if (c.includes("CERTIFICATE C") || c.includes(" 'C'") || c.endsWith(" C")) {
      return "bg-purple-500/10 text-purple-700 border-purple-500/30";
    }
    if (c.includes("CERTIFICATE B") || c.includes(" 'B'") || c.endsWith(" B")) {
      return "bg-blue-500/10 text-blue-700 border-blue-500/30";
    }
    if (c.includes("CERTIFICATE A") || c.includes(" 'A'") || c.endsWith(" A")) {
      return "bg-emerald-500/10 text-emerald-700 border-emerald-500/30";
    }
    return "bg-primary/10 text-primary border-primary/30";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">NCC Certificate Benefits</h1>
          <p className="text-sm text-muted-foreground">
            Manage incentives, bonus marks, quotas, and scholarships for NCC Cadets.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 shadow-sm transition"
        >
          <Plus size={16} />
          Add NCC Benefit
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto">
          {[
            { id: "ALL", label: "All Benefits" },
            { id: "Certificate C", label: "Certificate C" },
            { id: "Certificate B", label: "Certificate B" },
            { id: "Certificate A", label: "Certificate A" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition ${
                filter === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <SearchBar
          value={q}
          onChange={setQ}
          placeholder="Search benefits, quota, marks..."
        />
      </div>

      {/* Benefits List Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="card-surface p-5">
            <LoadingSkeleton rows={4} />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No NCC benefits found"
            description="Add benefits to guide cadets on government quotas, bonus marks, and scholarships."
          />
        ) : (
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {filtered.map((b) => {
              const certName = b.cirtificate || b.certificate || "NCC Certificate";
              const benText = b.benifit || b.benefit || "";
              const scholList = b.scholarships || [];

              return (
                <div
                  key={b.id}
                  className="card-surface p-5 flex flex-col justify-between gap-4 hover:border-primary/40 transition shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getCertBadgeStyle(
                          certName
                        )}`}
                      >
                        <Award size={14} />
                        {certName}
                      </span>
                      <button
                        onClick={() =>
                          setConfirmDelete({ id: b.id, title: certName })
                        }
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-input text-destructive hover:bg-destructive/10 transition"
                        title="Delete Benefit"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-foreground leading-relaxed whitespace-pre-line">
                        {benText}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-border/50 text-xs">
                      {b.bonusMark && (
                        <div className="flex items-start gap-2 p-2 rounded-xl bg-amber-500/10 text-amber-700">
                          <Sparkles size={14} className="shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-[11px]">Bonus Marks</p>
                            <p>{b.bonusMark}</p>
                          </div>
                        </div>
                      )}

                      {b.nccQuota && (
                        <div className="flex items-start gap-2 p-2 rounded-xl bg-blue-500/10 text-blue-700">
                          <ShieldCheck size={14} className="shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-[11px]">Quota / Direct Entry</p>
                            <p>{b.nccQuota}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {scholList.length > 0 && (
                      <div className="pt-2 border-t border-border/50">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-1.5">
                          <GraduationCap size={14} className="text-primary" />
                          <span>Scholarship Opportunities</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {scholList.map((item, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted text-[11px] font-medium"
                            >
                              <CheckCircle2 size={11} className="text-primary" />
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-border/40 text-[11px] text-muted-foreground flex justify-between items-center">
                    <span>Added: {new Date(b.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Add NCC Benefit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm grid place-items-center p-4">
          <div className="card-surface w-full max-w-lg p-6 space-y-5 shadow-xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-primary" />
                <h2 className="text-lg font-semibold">Add NCC Benefit</h2>
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
                <label className="block font-medium mb-1">NCC Certificate *</label>
                <select
                  value={cirtificate}
                  onChange={(e) => setCirtificate(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Certificate C">Certificate C ('C' Cert)</option>
                  <option value="Certificate B">Certificate B ('B' Cert)</option>
                  <option value="Certificate A">Certificate A ('A' Cert)</option>
                  <option value="OTHER">Other / Custom Certificate</option>
                </select>
              </div>

              {cirtificate === "OTHER" && (
                <div>
                  <label className="block font-medium mb-1">Custom Certificate Name *</label>
                  <input
                    type="text"
                    required
                    value={customCertificate}
                    onChange={(e) => setCustomCertificate(e.target.value)}
                    placeholder="e.g. Republic Day Parade (RDC) Special"
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              )}

              <div>
                <label className="block font-medium mb-1">Benefit Description *</label>
                <textarea
                  rows={3}
                  required
                  value={benifit}
                  onChange={(e) => setBenifit(e.target.value)}
                  placeholder="Describe the main benefits and opportunities available for cadets..."
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Bonus Marks (Optional)</label>
                <input
                  type="text"
                  value={bonusMark}
                  onChange={(e) => setBonusMark(e.target.value)}
                  placeholder="e.g. +5% Bonus marks in Defence & Police recruitment exams"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">NCC Quota / Direct Entry (Optional)</label>
                <input
                  type="text"
                  value={nccQuota}
                  onChange={(e) => setNccQuota(e.target.value)}
                  placeholder="e.g. Exempted from CDS Written Exam / Direct SSB Interview"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Scholarships (Optional)</label>
                <textarea
                  rows={2}
                  value={scholarshipInput}
                  onChange={(e) => setScholarshipInput(e.target.value)}
                  placeholder="Enter scholarships separated by commas or lines (e.g. Sahara Scholarship, Cadets Welfare Society)"
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
                  {submitting ? "Saving..." : "Add Benefit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={!!confirmDelete}
        title="Delete NCC Benefit?"
        description={`Are you sure you want to delete the benefit for "${confirmDelete?.title}"?`}
        confirmLabel="Delete Benefit"
        tone="destructive"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
