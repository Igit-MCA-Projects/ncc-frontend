import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Eye, Ban, CheckCircle2 } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ConfirmModal from "@/components/ConfirmModal";
import { usePagination } from "@/hooks/usePagination";
import {
  getStudents,
  blockStudent,
  unblockStudent,
} from "@/services/adminService";


function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [confirm, setConfirm] = useState(null);

  const load = () => {
    setLoading(true);
    getStudents(1, 100)
      .then((r) => setStudents(r?.data || []))
      .catch(() => toast.error("Failed to load students"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return students;
    return students.filter(
      (x) =>
        x.name.toLowerCase().includes(s) ||
        x.email.toLowerCase().includes(s) ||
        x.college.toLowerCase().includes(s)
    );
  }, [students, q]);

  const { page, setPage, totalPages, pageItems } = usePagination(filtered, 8);

  const doAction = async () => {
    if (!confirm) return;
    try {
      if (confirm.action === "block") await blockStudent(confirm.id);
      else await unblockStudent(confirm.id);
      toast.success(`Student ${confirm.action}ed`);
      setConfirm(null);
      load();
    } catch {
      toast.error("Action failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Students</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} registered {filtered.length === 1 ? "student" : "students"}
          </p>
        </div>
        <SearchBar value={q} onChange={setQ} placeholder="Search by name, email, college..." />
      </div>

      <div className="card-surface overflow-hidden">
        {loading ? (
          <div className="p-4"><LoadingSkeleton /></div>
        ) : pageItems.length === 0 ? (
          <EmptyState title="No students found" description="Try changing your search." />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">College</th>
                    <th className="px-4 py-3">Course</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pageItems.map((s) => (
                    <tr key={s.id} className="hover:bg-muted/40">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={s.photo} alt="" className="h-9 w-9 rounded-full object-cover" />
                          <span className="font-medium">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p>{s.email}</p>
                        <p className="text-xs text-muted-foreground">{s.phone}</p>
                      </td>
                      <td className="px-4 py-3">{s.college}</td>
                      <td className="px-4 py-3">{s.course}</td>
                      <td className="px-4 py-3">{s.location}</td>
                      <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <Link
                            to={`/students/${s.id}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-input hover:bg-muted"
                            title="View"
                          >
                            <Eye size={15} />
                          </Link>
                          {s.status === "active" ? (
                            <button
                              onClick={() => setConfirm({ id: s.id, action: "block" })}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-input hover:bg-destructive/10 text-destructive"
                              title="Block"
                            >
                              <Ban size={15} />
                            </button>
                          ) : (
                            <button
                              onClick={() => setConfirm({ id: s.id, action: "unblock" })}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-input hover:bg-[color:var(--color-success)]/10 text-[color:var(--color-success)]"
                              title="Unblock"
                            >
                              <CheckCircle2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-border">
              {pageItems.map((s) => (
                <div key={s.id} className="p-4 flex items-center gap-3">
                  <img src={s.photo} alt="" className="h-11 w-11 rounded-full object-cover shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium truncate">{s.name}</p>
                      <StatusBadge status={s.status} />
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                    <p className="text-xs text-muted-foreground truncate">{s.college} • {s.course}</p>
                    <div className="mt-2 flex gap-2">
                      <Link
                        to={`/students/${s.id}`}
                        className="text-xs rounded-lg border border-input px-2.5 py-1 hover:bg-muted"
                      >
                        View
                      </Link>
                      {s.status === "active" ? (
                        <button
                          onClick={() => setConfirm({ id: s.id, action: "block" })}
                          className="text-xs rounded-lg border border-input px-2.5 py-1 text-destructive hover:bg-destructive/10"
                        >
                          Block
                        </button>
                      ) : (
                        <button
                          onClick={() => setConfirm({ id: s.id, action: "unblock" })}
                          className="text-xs rounded-lg border border-input px-2.5 py-1 text-[color:var(--color-success)] hover:bg-[color:var(--color-success)]/10"
                        >
                          Unblock
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      <ConfirmModal
        open={!!confirm}
        title={confirm?.action === "block" ? "Block student?" : "Unblock student?"}
        description={
          confirm?.action === "block"
            ? "The student will lose access to the platform until unblocked."
            : "The student will regain full access to the platform."
        }
        confirmLabel={confirm?.action === "block" ? "Block" : "Unblock"}
        tone={confirm?.action === "block" ? "destructive" : "primary"}
        onCancel={() => setConfirm(null)}
        onConfirm={doAction}
      />
    </div>
  );
}

export default StudentsPage;
