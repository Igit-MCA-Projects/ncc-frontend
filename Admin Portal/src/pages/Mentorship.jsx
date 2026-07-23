import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Search,
  Users,
} from "lucide-react";
import StatCard from "@/components/StatCard";
import SearchBar from "@/components/SearchBar";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import ConfirmModal from "@/components/ConfirmModal";
import {
  getMentorshipRequests,
  updateMentorshipStatus,
} from "@/services/adminService";

export default function MentorshipPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL"); // 'ALL', 'PENDING', 'ACCEPTED', 'REJECTED'
  const [q, setQ] = useState("");
  const [confirmModal, setConfirmModal] = useState(null); // { id, action: 'ACCEPTED' | 'REJECTED', studentName }
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = () => {
    setLoading(true);
    getMentorshipRequests()
      .then((res) => {
        setRequests(res?.data || []);
      })
      .catch(() => {
        toast.error("Failed to load mentorship requests");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAction = async (requestId, status) => {
    setActionLoading(true);
    try {
      const res = await updateMentorshipStatus(requestId, status);
      if (res.success) {
        toast.success(
          `Mentorship request ${status === "ACCEPTED" ? "accepted" : "rejected"} successfully`
        );
        setConfirmModal(null);
        loadData();
      } else {
        toast.error(res.message || "Failed to update status");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      // Filter by status tab
      if (filter !== "ALL" && r.status !== filter) return false;

      // Filter by search query
      if (q.trim()) {
        const query = q.trim().toLowerCase();
        const student = r.student || {};
        const name = (student.name || student.fullName || "").toLowerCase();
        const email = (student.email || "").toLowerCase();
        const headline = (student.headline || "").toLowerCase();
        return name.includes(query) || email.includes(query) || headline.includes(query);
      }

      return true;
    });
  }, [requests, filter, q]);

  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === "PENDING").length;
    const accepted = requests.filter((r) => r.status === "ACCEPTED").length;
    const rejected = requests.filter((r) => r.status === "REJECTED").length;
    return { total, pending, accepted, rejected };
  }, [requests]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Mentorship Requests</h1>
          <p className="text-sm text-muted-foreground">
            Review and respond to student mentorship requests.
          </p>
        </div>
        <SearchBar
          value={q}
          onChange={setQ}
          placeholder="Search by student name, email..."
        />
      </div>

      {/* Stats row */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total Requests"
          value={stats.total}
          tone="primary"
        />
        <StatCard
          icon={Clock}
          label="Pending Review"
          value={stats.pending}
          tone="warning"
        />
        <StatCard
          icon={CheckCircle2}
          label="Accepted"
          value={stats.accepted}
          tone="success"
        />
        <StatCard
          icon={XCircle}
          label="Rejected"
          value={stats.rejected}
          tone="destructive"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto">
        {[
          { id: "ALL", label: `All (${stats.total})` },
          { id: "PENDING", label: `Pending (${stats.pending})` },
          { id: "ACCEPTED", label: `Accepted (${stats.accepted})` },
          { id: "REJECTED", label: `Rejected (${stats.rejected})` },
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

      {/* Table / Cards View */}
      <div className="card-surface overflow-hidden">
        {loading ? (
          <div className="p-5">
            <LoadingSkeleton rows={5} />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No mentorship requests found"
            description={
              filter === "ALL"
                ? "There are currently no mentorship requests from students."
                : `No requests found with status "${filter}".`
            }
          />
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Requested On</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((r) => {
                    const student = r.student || {};
                    return (
                      <tr key={r.id} className="hover:bg-muted/40 transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={student.photo}
                              alt={student.name}
                              className="h-10 w-10 rounded-full object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-medium truncate">{student.name}</p>
                              {student.headline && (
                                <p className="text-xs text-muted-foreground truncate">
                                  {student.headline}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs font-medium">{student.email}</p>
                          <p className="text-xs text-muted-foreground">{student.phone}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {r.requestedAt ? new Date(r.requestedAt).toLocaleDateString() : "N/A"}
                          {r.respondedAt && (
                            <p className="text-[10px] text-muted-foreground">
                              Responded: {new Date(r.respondedAt).toLocaleDateString()}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              r.status === "ACCEPTED"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : r.status === "REJECTED"
                                ? "bg-destructive/10 text-destructive"
                                : "bg-amber-500/10 text-amber-600"
                            }`}
                          >
                            {r.status === "ACCEPTED" && <CheckCircle2 size={13} />}
                            {r.status === "REJECTED" && <XCircle size={13} />}
                            {r.status === "PENDING" && <Clock size={13} />}
                            {r.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/students/${student.id}`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-input hover:bg-muted transition"
                              title="View Student Profile"
                            >
                              <Eye size={15} />
                            </Link>

                            {r.status === "PENDING" && (
                              <>
                                <button
                                  onClick={() =>
                                    setConfirmModal({
                                      id: r.id,
                                      action: "ACCEPTED",
                                      studentName: student.name,
                                    })
                                  }
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 transition"
                                  title="Accept Request"
                                >
                                  <CheckCircle2 size={15} />
                                </button>
                                <button
                                  onClick={() =>
                                    setConfirmModal({
                                      id: r.id,
                                      action: "REJECTED",
                                      studentName: student.name,
                                    })
                                  }
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition"
                                  title="Reject Request"
                                >
                                  <XCircle size={15} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-border">
              {filtered.map((r) => {
                const student = r.student || {};
                return (
                  <div key={r.id} className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.photo}
                        alt={student.name}
                        className="h-10 w-10 rounded-full object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium truncate">{student.name}</p>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                              r.status === "ACCEPTED"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : r.status === "REJECTED"
                                ? "bg-destructive/10 text-destructive"
                                : "bg-amber-500/10 text-amber-600"
                            }`}
                          >
                            {r.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs text-muted-foreground">
                      <span>
                        Requested: {r.requestedAt ? new Date(r.requestedAt).toLocaleDateString() : "N/A"}
                      </span>
                      <div className="flex gap-2">
                        <Link
                          to={`/students/${student.id}`}
                          className="rounded-lg border border-input px-2.5 py-1 text-xs hover:bg-muted"
                        >
                          Profile
                        </Link>
                        {r.status === "PENDING" && (
                          <>
                            <button
                              onClick={() =>
                                setConfirmModal({
                                  id: r.id,
                                  action: "ACCEPTED",
                                  studentName: student.name,
                                })
                              }
                              className="rounded-lg bg-emerald-600 text-white px-2.5 py-1 text-xs font-medium hover:bg-emerald-700"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                setConfirmModal({
                                  id: r.id,
                                  action: "REJECTED",
                                  studentName: student.name,
                                })
                              }
                              className="rounded-lg bg-destructive text-destructive-foreground px-2.5 py-1 text-xs font-medium hover:bg-destructive/90"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <ConfirmModal
          open={!!confirmModal}
          title={
            confirmModal.action === "ACCEPTED"
              ? "Accept Mentorship Request?"
              : "Reject Mentorship Request?"
          }
          description={
            confirmModal.action === "ACCEPTED"
              ? `Are you sure you want to accept the mentorship request from ${confirmModal.studentName}?`
              : `Are you sure you want to reject the mentorship request from ${confirmModal.studentName}?`
          }
          confirmLabel={confirmModal.action === "ACCEPTED" ? "Accept Request" : "Reject Request"}
          tone={confirmModal.action === "ACCEPTED" ? "primary" : "destructive"}
          onCancel={() => setConfirmModal(null)}
          onConfirm={() => handleAction(confirmModal.id, confirmModal.action)}
        />
      )}
    </div>
  );
}
