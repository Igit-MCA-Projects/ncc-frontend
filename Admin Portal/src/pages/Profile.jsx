import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Save, X } from "lucide-react";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { getProfile, updateProfile } from "@/services/adminService";
import { useAuth } from "@/context/AuthContext";


function ProfilePage() {
  const { setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    getProfile()
      .then((r) => {
        setProfile(r.data);
        setForm(r.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    const { data } = await updateProfile(form);
    setProfile(data);
    setUser(data);
    if (typeof window !== "undefined") localStorage.setItem("ncc_admin_user", JSON.stringify(data));
    setEdit(false);
    toast.success("Profile updated");
  };

  if (loading) return <LoadingSkeleton rows={4} />;

  return (
    <div className="space-y-5 max-w-3xl">
      <h1 className="text-2xl font-semibold">Profile</h1>

      <div className="card-surface p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <img src={profile.photo} alt="" className="h-24 w-24 rounded-2xl object-cover" />
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold">{profile.name}</h2>
            <p className="text-sm text-muted-foreground">{profile.role}</p>
            <p className="text-sm text-muted-foreground mt-1">{profile.email}</p>
          </div>
          {!edit && (
            <button
              onClick={() => setEdit(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-input bg-card px-4 py-2 text-sm hover:bg-muted"
            >
              <Pencil size={14} /> Edit Profile
            </button>
          )}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {["name", "email", "phone", "role"].map((f) => (
            <div key={f}>
              <label className="text-xs uppercase text-muted-foreground">{f}</label>
              {edit ? (
                <input
                  value={form[f] || ""}
                  onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              ) : (
                <p className="mt-1 text-sm">{profile[f]}</p>
              )}
            </div>
          ))}
        </div>

        {edit && (
          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={() => { setForm(profile); setEdit(false); }}
              className="inline-flex items-center gap-2 rounded-xl border border-input bg-card px-4 py-2 text-sm hover:bg-muted"
            >
              <X size={14} /> Cancel
            </button>
            <button
              onClick={save}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Save size={14} /> Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
