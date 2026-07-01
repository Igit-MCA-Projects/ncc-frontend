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
import { getCompanies, blockCompany, unblockCompany } from "@/services/adminService";


function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [confirm, setConfirm] = useState(null);

  const load = () => {
    setLoading(true);
    getCompanies().then((r) => setCompanies(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return companies;
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        c.email.toLowerCase().includes(s) ||
        c.industry.toLowerCase().includes(s)
    );
  }, [companies, q]);

  const { page, setPage, totalPages, pageItems } = usePagination(filtered, 8);

  const doAction = async () => {
    if (!confirm) return;
    try {
      if (confirm.action === "block") await blockCompany(confirm.id);
      else await unblockCompany(confirm.id);
      toast.success(`Company ${confirm.action}ed`);
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
          <h1 className="text-2xl font-semibold">Companies</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} registered {filtered.length === 1 ? "company" : "companies"}
          </p>
        </div>
        <SearchBar value={q} onChange={setQ} placeholder="Search by name, industry..." />
      </div>

      <div className="card-surface overflow-hidden">
        {loading ? (
          <div className="p-4"><LoadingSkeleton /></div>
        ) : pageItems.length === 0 ? (
          <EmptyState title="No companies found" />
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Industry</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Jobs</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pageItems.map((c) => (
                    <tr key={c.id} className="hover:bg-muted/40">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={c.logo} alt="" className="h-9 w-9 rounded-xl object-cover bg-muted" />
                          <span className="font-medium">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{c.email}</td>
                      <td className="px-4 py-3">{c.industry}</td>
                      <td className="px-4 py-3">{c.location}</td>
                      <td className="px-4 py-3">{c.totalJobs}</td>
                      <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <Link
                            to={`/companies/${c.id}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-input hover:bg-muted"
                          >
                            <Eye size={15} />
                          </Link>
                          {c.status === "active" ? (
                            <button
                              onClick={() => setConfirm({ id: c.id, action: "block" })}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-input hover:bg-destructive/10 text-destructive"
                            >
                              <Ban size={15} />
                            </button>
                          ) : (
                            <button
                              onClick={() => setConfirm({ id: c.id, action: "unblock" })}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-input hover:bg-[color:var(--color-success)]/10 text-[color:var(--color-success)]"
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

            <div className="md:hidden divide-y divide-border">
              {pageItems.map((c) => (
                <div key={c.id} className="p-4 flex items-center gap-3">
                  <img src={c.logo} alt="" className="h-11 w-11 rounded-xl object-cover bg-muted shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium truncate">{c.name}</p>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{c.industry} • {c.location}</p>
                    <p className="text-xs text-muted-foreground">{c.totalJobs} jobs</p>
                    <div className="mt-2 flex gap-2">
                      <Link to={`/companies/${c.id}`} className="text-xs rounded-lg border border-input px-2.5 py-1 hover:bg-muted">
                        View
                      </Link>
                      {c.status === "active" ? (
                        <button onClick={() => setConfirm({ id: c.id, action: "block" })} className="text-xs rounded-lg border border-input px-2.5 py-1 text-destructive hover:bg-destructive/10">
                          Block
                        </button>
                      ) : (
                        <button onClick={() => setConfirm({ id: c.id, action: "unblock" })} className="text-xs rounded-lg border border-input px-2.5 py-1 text-[color:var(--color-success)] hover:bg-[color:var(--color-success)]/10">
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
        title={confirm?.action === "block" ? "Block company?" : "Unblock company?"}
        description={
          confirm?.action === "block"
            ? "The company will not be able to post new jobs until unblocked."
            : "The company will regain full posting access."
        }
        confirmLabel={confirm?.action === "block" ? "Block" : "Unblock"}
        tone={confirm?.action === "block" ? "destructive" : "primary"}
        onCancel={() => setConfirm(null)}
        onConfirm={doAction}
      />
    </div>
  );
}

export default CompaniesPage;
