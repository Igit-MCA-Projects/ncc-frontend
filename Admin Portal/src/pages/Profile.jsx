import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Save, X } from "lucide-react";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { getAdminProfile, updateAdminProfile } from "@/services/adminService";
import { uploadFile } from "@/services/assetService";
import { useAuth } from "@/context/AuthContext";

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return "Not provided";
  return value;
};

const formatBoolean = (value) => (value ? "Yes" : "No");

const formatDate = (value) => {
  if (!value) return "Not provided";
  return new Date(value).toLocaleString();
};

function ProfilePage() {
  const { setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [uploading, setUploading] = useState({ profileImage: false, organizationLogo: false });
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    adminRole: "",

    phone: "",
    profileImage: "",
    designation: "",

    organization: {
      name: "",
      email: "",
      phone: "",
      website: "",
      logo: "",
      description: "",
    },
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getAdminProfile();
        if (response?.success) {
          const data = response.data;
          setProfile(data);
          setForm({
            fullName: data.fullName || "",
            email: data.email || "",
            password: "",
            adminRole: data.adminRole || "",

            phone: data.phone || "",
            profileImage: data.profileImage || "",
            designation: data.designation || "",

            organization: {
              name: data.organization?.name || "",
              email: data.organization?.email || "",
              phone: data.organization?.phone || "",
              website: data.organization?.website || "",
              logo: data.organization?.logo || "",
              description: data.organization?.description || "",
            },
          });
          console.log("Profile data loaded:", data);
        } else {
          toast.error("Failed to load profile");
        }
      } catch (error) {
        toast.error(error?.message || "Failed to load profile");
        toast.error("Complete your profile information to avoid issues.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleImageUpload = async (field, file) => {
    if (!file) return;

    setUploading((prev) => ({ ...prev, [field]: true }));

    try {
      const response = await uploadFile(file);
      const uploadedUrl = response?.data?.url || response?.data?.imageUrl || response?.data?.fileUrl || response?.data;

      if (!uploadedUrl) {
        throw new Error("No image URL returned");
      }

      if (field === "profileImage") {
        setForm((prev) => ({ ...prev, profileImage: uploadedUrl }));
      } else if (field === "organizationLogo") {
        setForm((prev) => ({
          ...prev,
          organization: {
            ...prev.organization,
            logo: uploadedUrl,
          },
        }));
      }

      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error(error?.message || "Failed to upload image");
    } finally {
      setUploading((prev) => ({ ...prev, [field]: false }));
    }
  };

  const save = async () => {
    try {
      const payload = {
        fullName: form.fullName,
        phone: form.phone,
        profileImage: form.profileImage,
        designation: form.designation,
        organization: {
          ...form.organization,
          logo: form.organization.logo,
        },
      };

      console.log(payload);
      const response = await updateAdminProfile(payload);
      console.log("Update Response:", response);

      if (response?.success) {
        const updatedProfile = response?.data || {
          ...(profile || {}),
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          profileImage: form.profileImage,
          designation: form.designation,
          organization: form.organization,
        };

        setProfile(updatedProfile);
        setUser(updatedProfile);
        localStorage.setItem("ncc_admin_user", JSON.stringify(updatedProfile));
        setEdit(false);
        toast.success("Profile updated");
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      console.log(error.response?.data);
      console.log(error.response?.status);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) return <LoadingSkeleton rows={4} />;

  const profileFields = [
    { label: "Full Name", key: "fullName" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    { label: "Role", key: "adminRole" },
    { label: "Designation", key: "designation" },
    { label: "Organization", key: "organization" },
    { label: "Email Verified", key: "emailVerifyed", type: "boolean" },
    { label: "Account Active", key: "isActive", type: "boolean" },
    { label: "Verified", key: "isVerified", type: "boolean" },
    { label: "Created At", key: "createdAt", type: "date" },
    { label: "Updated At", key: "updatedAt", type: "date" },
    { label: "ID", key: "id" },
  ];

  const renderValue = (field, value) => {
    if (value === null || value === undefined || value === "") return "Not provided";
    if (field.type === "boolean") return value ? "Yes" : "No";
    if (field.type === "date") return new Date(value).toLocaleString();
    return value;
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <h1 className="text-2xl font-semibold">Profile</h1>

      <div className="card-surface p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <img
            src={profile?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.fullName || "Admin")}`}
            alt=""
            className="h-24 w-24 rounded-2xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold">{renderValue({ key: "fullName" }, profile?.fullName)}</h2>
            <p className="text-sm text-muted-foreground">{renderValue({ key: "role" }, profile?.role)}</p>
            <p className="text-sm text-muted-foreground mt-1">{renderValue({ key: "email" }, profile?.email)}</p>
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
          {/* Full Name */}
          <div>
            <label className="text-xs uppercase text-muted-foreground">Full Name</label>
            {edit ? (
              <input
                value={form.fullName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, fullName: e.target.value }))
                }
                className="mt-1 w-full rounded-xl border border-input px-3 py-2"
              />
            ) : (
              <p className="mt-1">{profile?.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-xs uppercase text-muted-foreground">Email</label>
            {edit ? (
              <input
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                className="mt-1 w-full rounded-xl border border-input px-3 py-2"
              />
            ) : (
              <p className="mt-1">{profile?.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs uppercase text-muted-foreground">Phone</label>
            {edit ? (
              <input
                value={form.phone}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="mt-1 w-full rounded-xl border border-input px-3 py-2"
              />
            ) : (
              <p className="mt-1">{profile?.phone}</p>
            )}
          </div>

          {/* Designation */}
          <div>
            <label className="text-xs uppercase text-muted-foreground">Designation</label>
            {edit ? (
              <input
                value={form.designation}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, designation: e.target.value }))
                }
                className="mt-1 w-full rounded-xl border border-input px-3 py-2"
              />
            ) : (
              <p className="mt-1">{profile?.designation}</p>
            )}
          </div>

          {/* Profile Image */}
          <div className="sm:col-span-2">
            <label className="text-xs uppercase text-muted-foreground">Profile Image</label>
            {edit ? (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload("profileImage", file);
                      e.target.value = "";
                    }
                  }}
                  className="mt-1 w-full rounded-xl border border-input px-3 py-2"
                  disabled={!edit || uploading.profileImage}
                />
                {uploading.profileImage && (
                  <p className="mt-2 text-sm text-muted-foreground">Uploading profile image...</p>
                )}
              </>
            ) : (
              <p className="mt-1 overflow-hidden">{profile?.profileImage || "No profile image uploaded"}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <h3 className="font-semibold mt-4">Organization</h3>
          </div>

          {/* Organization Name */}
          <div>
            <label className="text-xs uppercase text-muted-foreground">Organization Name</label>
            <input
              value={form.organization.name}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  organization: {
                    ...prev.organization,
                    name: e.target.value,
                  },
                }))
              }
              className="mt-1 w-full rounded-xl border border-input px-3 py-2"
              disabled={!edit}
            />
          </div>

          {/* Organization Email */}
          <div>
            <label className="text-xs uppercase text-muted-foreground">Organization Email</label>
            <input
              value={form.organization.email}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  organization: {
                    ...prev.organization,
                    email: e.target.value,
                  },
                }))
              }
              className="mt-1 w-full rounded-xl border border-input px-3 py-2"
              disabled={!edit}
            />
          </div>

          {/* Organization Phone */}
          <div>
            <label className="text-xs uppercase text-muted-foreground">Organization Phone</label>
            <input
              value={form.organization.phone}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  organization: {
                    ...prev.organization,
                    phone: e.target.value,
                  },
                }))
              }
              className="mt-1 w-full rounded-xl border border-input px-3 py-2"
              disabled={!edit}
            />
          </div>

          {/* Organization Website */}
          <div>
            <label className="text-xs uppercase text-muted-foreground">Website</label>
            <input
              value={form.organization.website}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  organization: {
                    ...prev.organization,
                    website: e.target.value,
                  },
                }))
              }
              className="mt-1 w-full rounded-xl border border-input px-3 py-2"
              disabled={!edit}
            />
          </div>

          {/* Organization Logo */}
          <div>
            <label className="text-xs uppercase text-muted-foreground">Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleImageUpload("organizationLogo", file);
                  e.target.value = "";
                }
              }}
              className="mt-1 w-full rounded-xl border border-input px-3 py-2"
              disabled={!edit || uploading.organizationLogo}
            />
            {uploading.organizationLogo && (
              <p className="mt-2 text-sm text-muted-foreground">Uploading logo...</p>
            )}
          </div>

          {/* Organization Description */}
          <div className="sm:col-span-2">
            <label className="text-xs uppercase text-muted-foreground">Description</label>
            <textarea
              value={form.organization.description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  organization: {
                    ...prev.organization,
                    description: e.target.value,
                  },
                }))
              }
              className="mt-1 w-full rounded-xl border border-input px-3 py-2"
              rows={4}
              disabled={!edit}
            />
          </div>
        </div>

        {edit && (
          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={() => {
                setForm({
                  fullName: profile.fullName || "",
                  email: profile.email || "",
                  password: "",
                  adminRole: profile.adminRole || "",
                  phone: profile.phone || "",
                  profileImage: profile.profileImage || "",
                  designation: profile.designation || "",
                  organization: {
                    name: profile.organization?.name || "",
                    email: profile.organization?.email || "",
                    phone: profile.organization?.phone || "",
                    website: profile.organization?.website || "",
                    logo: profile.organization?.logo || "",
                    description: profile.organization?.description || "",
                  },
                });
                setEdit(false);
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-input bg-card px-4 py-2 text-sm hover:bg-muted"
            >
              <X size={14} /> Cancel
            </button>
            <button
              onClick={save}
              disabled={uploading.profileImage || uploading.organizationLogo}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
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
