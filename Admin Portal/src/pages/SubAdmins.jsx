import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, X } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ConfirmModal from "@/components/ConfirmModal";
import { getSubAdmins, createSubAdmin, deleteSubAdmin } from "@/services/adminService";


function SubAdminsPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: "Moderator" });

  const load = () => {
    setLoading(true);
    getSubAdmins().then((r) => setList(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return toast.error("Name and email are required");
    await createSubAdmin(form);
    toast.success("Sub admin created");
    setOpen(false);
    setForm({ name: "", email: "", phone: "", password: "", role: "Moderator" });
    load();
  };

  const remove = async () => {
    if (!confirmId) return;
    await deleteSubAdmin(confirmId);
    toast.success("Sub admin removed");
    setConfirmId(null);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Sub Admins</h1>
          <p className="text-sm text-muted-foreground">Manage moderator and reviewer accounts.</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90"
        >
          <Plus size={16} /> Add Sub Admin
        </button>
      </div>

      <div className="card-surface overflow-hidden">
        {loading ? (
          <div className="p-4"><LoadingSkeleton /></div>
        ) : list.length === 0 ? (
          <EmptyState title="No sub admins yet" description="Add your first sub admin to help manage the platform." />
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Profile</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {list.map((s) => (
                    <tr key={s.id} className="hover:bg-muted/40">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={s.photo} alt="" className="h-9 w-9 rounded-full object-cover" />
                          <span className="font-medium">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{s.email}</td>
                      <td className="px-4 py-3">{s.phone}</td>
                      <td className="px-4 py-3">{s.role}</td>
                      <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end">
                          <button
                            onClick={() => setConfirmId(s.id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-input text-destructive hover:bg-destructive/10"
                            title="Remove"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-border">
              {list.map((s) => (
                <div key={s.id} className="p-4 flex items-center gap-3">
                  <img src={s.photo} alt="" className="h-11 w-11 rounded-full object-cover shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium truncate">{s.name}</p>
                      <StatusBadge status={s.status} />
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                    <p className="text-xs text-muted-foreground">{s.role}</p>
                  </div>
                  <button
                    onClick={() => setConfirmId(s.id)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-input text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={() => setOpen(false)}>
          <div className="card-surface w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Add Sub Admin</h3>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={submit} className="mt-4 space-y-3">
              {[
                { key: "name", label: "Name", type: "text" },
                { key: "email", label: "Email", type: "email" },
                { key: "phone", label: "Phone", type: "tel" },
                { key: "password", label: "Password", type: "password" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-sm font-medium">{f.label}</label>
                  <input
                    type={f.type}
                    value={(form )[f.key]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              ))}
              <div>
                <label className="text-sm font-medium">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option>Moderator</option>
                  <option>Reviewer</option>
                  <option>Support</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setOpen(false)} className="rounded-xl border border-input bg-card px-4 py-2 text-sm hover:bg-muted">
                  Cancel
                </button>
                <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!confirmId}
        title="Remove sub admin?"
        description="This action cannot be undone."
        confirmLabel="Remove"
        tone="destructive"
        onCancel={() => setConfirmId(null)}
        onConfirm={remove}
      />
    </div>
  );
}

export default SubAdminsPage;
