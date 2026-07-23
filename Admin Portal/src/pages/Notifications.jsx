import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Bell,
  Send,
  Trash2,
  Plus,
  User,
  Radio,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import ConfirmModal from "@/components/ConfirmModal";
import {
  getNotifications,
  createNotification,
  deleteNotification,
  getStudents,
} from "@/services/adminService";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'GENERAL', 'PERSONAL', 'deleted'
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("GENERAL");
  const [studentId, setStudentId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      getNotifications(1, 50),
      getStudents(1, 100),
    ])
      .then(([notifRes, studRes]) => {
        setNotifications(notifRes?.data || []);
        setStudents(studRes?.data || []);
      })
      .catch(() => {
        toast.error("Failed to load notifications");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (type === "PERSONAL" && !studentId.trim()) {
      toast.error("Please select a student for personal notifications");
      return;
    }

    setSubmitting(true);
    try {
      const res = await createNotification({
        title: title.trim(),
        Descripton: description.trim(),
        type,
        studentId: type === "PERSONAL" ? studentId.trim() : undefined,
      });

      if (res.success) {
        toast.success("Notification sent successfully!");
        setModalOpen(false);
        setTitle("");
        setDescription("");
        setType("GENERAL");
        setStudentId("");
        loadData();
      } else {
        toast.error(res.message || "Failed to send notification");
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
      const res = await deleteNotification(confirmDelete.id);
      if (res.success) {
        toast.success("Notification deleted");
        setConfirmDelete(null);
        loadData();
      } else {
        toast.error(res.message || "Failed to delete");
      }
    } catch {
      toast.error("Failed to delete notification");
    }
  };

  const filteredNotifs = notifications.filter((n) => {
    if (filter === "GENERAL") return n.type === "GENERAL" && !n.isDeleted;
    if (filter === "PERSONAL") return n.type === "PERSONAL" && !n.isDeleted;
    if (filter === "deleted") return n.isDeleted;
    return true; // 'all'
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Broadcast general announcements or send targeted personal messages to students.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 shadow-sm transition"
        >
          <Plus size={16} />
          Create Notification
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto">
        {[
          { id: "all", label: "All Notifications" },
          { id: "GENERAL", label: "General Broadcasts" },
          { id: "PERSONAL", label: "Personal Messages" },
          { id: "deleted", label: "Deleted" },
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

      {/* Notification List */}
      <div className="card-surface overflow-hidden">
        {loading ? (
          <div className="p-5">
            <LoadingSkeleton rows={5} />
          </div>
        ) : filteredNotifs.length === 0 ? (
          <EmptyState
            title="No notifications found"
            description="Create a notification to announce updates to students."
          />
        ) : (
          <div className="divide-y divide-border">
            {filteredNotifs.map((n) => {
              const targetStudent = students.find((s) => String(s.id) === String(n.studentId));
              return (
                <div
                  key={n.id}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                    n.isDeleted ? "opacity-60 bg-muted/20" : "hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div
                      className={`h-10 w-10 shrink-0 rounded-2xl grid place-items-center ${
                        n.type === "PERSONAL"
                          ? "bg-purple-500/10 text-purple-600"
                          : "bg-blue-500/10 text-blue-600"
                      }`}
                    >
                      {n.type === "PERSONAL" ? <User size={18} /> : <Bell size={18} />}
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-sm">{n.title}</h3>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            n.type === "PERSONAL"
                              ? "bg-purple-500/10 text-purple-700"
                              : "bg-blue-500/10 text-blue-700"
                          }`}
                        >
                          {n.type}
                        </span>
                        {n.isDeleted && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">
                            Deleted
                          </span>
                        )}
                      </div>
                      {(n.description || n.Descripton) && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {n.description || n.Descripton}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {n.type === "PERSONAL" && (
                          <span>
                            Target:{" "}
                            <span className="font-medium text-foreground">
                              {targetStudent ? targetStudent.name : n.studentId || "Student"}
                            </span>
                          </span>
                        )}
                        {n.createdAt && (
                          <span>{new Date(n.createdAt).toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {!n.isDeleted && (
                    <div className="flex items-center justify-end shrink-0">
                      <button
                        onClick={() => setConfirmDelete({ id: n.id, title: n.title })}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-input text-destructive hover:bg-destructive/10 transition"
                        title="Delete notification"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Create Notification */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm grid place-items-center p-4">
          <div className="card-surface w-full max-w-lg p-6 space-y-5 shadow-xl animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Send size={18} className="text-primary" />
                <h2 className="text-lg font-semibold">New Notification</h2>
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
                <label className="block font-medium mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Campus Placement Drive Announcement"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide details about the announcement..."
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block font-medium mb-2">Target Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setType("GENERAL")}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition ${
                      type === "GENERAL"
                        ? "border-primary bg-primary/5 text-primary font-medium"
                        : "border-input bg-card hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <Bell size={20} className="mb-1" />
                    <span>General Broadcast</span>
                    <span className="text-[11px] text-muted-foreground">All students</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setType("PERSONAL")}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition ${
                      type === "PERSONAL"
                        ? "border-primary bg-primary/5 text-primary font-medium"
                        : "border-input bg-card hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <User size={20} className="mb-1" />
                    <span>Personal Message</span>
                    <span className="text-[11px] text-muted-foreground">Specific student</span>
                  </button>
                </div>
              </div>

              {type === "PERSONAL" && (
                <div>
                  <label className="block font-medium mb-1">Select Student *</label>
                  <select
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">-- Choose a student --</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

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
                  {submitting ? "Sending..." : "Send Notification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={!!confirmDelete}
        title="Delete Notification?"
        description={`Are you sure you want to delete "${confirmDelete?.title}"?`}
        confirmLabel="Delete"
        tone="destructive"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
