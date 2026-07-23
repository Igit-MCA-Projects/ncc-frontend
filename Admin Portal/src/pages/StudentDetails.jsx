import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Github,
  Linkedin,
  Globe,
  Twitter,
  FileText,
  Ban,
  CheckCircle2,
  ShieldCheck,
  Award,
  Send,
  X,
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { getStudent, blockStudent, unblockStudent, createNotification } from "@/services/adminService";

function StudentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifModalOpen, setNotifModalOpen] = useState(false);
  const [notifTitle, setNotifTitle] = useState("");
  const [notifDesc, setNotifDesc] = useState("");
  const [sendingNotif, setSendingNotif] = useState(false);

  const load = () => {
    setLoading(true);
    getStudent(id)
      .then((r) => setStudent(r.data))
      .finally(() => setLoading(false));
  };
  useEffect(load, [id]);

  const toggleStatus = async () => {
    if (!student) return;
    try {
      if (student.status === "active") await blockStudent(student.id);
      else await unblockStudent(student.id);
      toast.success("Status updated");
      load();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!notifTitle.trim()) {
      toast.error("Notification title is required");
      return;
    }

    setSendingNotif(true);
    try {
      const res = await createNotification({
        title: notifTitle.trim(),
        Descripton: notifDesc.trim(),
        type: "PERSONAL",
        studentId: student.id,
      });

      if (res.success) {
        toast.success("Notification sent to " + student.name);
        setNotifModalOpen(false);
        setNotifTitle("");
        setNotifDesc("");
      } else {
        toast.error(res.message || "Failed to send notification");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred");
    } finally {
      setSendingNotif(false);
    }
  };

  if (loading) return <LoadingSkeleton rows={6} />;
  if (!student) {
    return (
      <div className="card-surface p-8 text-center">
        <p>Student not found.</p>
        <button onClick={() => navigate("/students")} className="mt-4 text-primary hover:underline">
          Go back
        </button>
      </div>
    );
  }

  const Section = ({ title, children }) => (
    <div className="card-surface p-5">
      <h3 className="font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="space-y-5">
      <Link to="/students" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={16} /> Back to students
      </Link>

      <div className="card-surface p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <img src={student.photo} alt="" className="h-16 w-16 rounded-2xl object-cover" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-semibold truncate">{student.name}</h1>
              <StatusBadge status={student.status} />
              {student.emailVerified && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-medium">
                  <ShieldCheck size={12} /> Email Verified
                </span>
              )}
              {student.phoneVerified && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 font-medium">
                  <ShieldCheck size={12} /> Phone Verified
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate mt-0.5">
              {student.email} • {student.phone}
            </p>
            {student.headline && (
              <p className="text-xs text-muted-foreground mt-1 italic">{student.headline}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {typeof student.profileScore === "number" && (
            <div className="text-right hidden md:block">
              <p className="text-xs text-muted-foreground">Profile Score</p>
              <p className="text-sm font-semibold text-primary">{student.profileScore}%</p>
            </div>
          )}
          <button
            onClick={() => setNotifModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-input px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            <Send size={15} /> Send Message
          </button>
          <button
            onClick={toggleStatus}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium ${
              student.status === "active"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {student.status === "active" ? (
              <>
                <Ban size={16} /> Block
              </>
            ) : (
              <>
                <CheckCircle2 size={16} /> Unblock
              </>
            )}
          </button>
        </div>
      </div>

      {student.bio && (
        <Section title="About / Bio">
          <p className="text-sm text-muted-foreground whitespace-pre-line">{student.bio}</p>
        </Section>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <Section title="Basic Information">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <dt className="text-muted-foreground">College / School</dt>
            <dd>{student.college}</dd>
            <dt className="text-muted-foreground">Course / Major</dt>
            <dd>{student.course}</dd>
            <dt className="text-muted-foreground">Gender</dt>
            <dd>{student.gender}</dd>
            {student.dateOfBirth && (
              <>
                <dt className="text-muted-foreground">Date of Birth</dt>
                <dd>{student.dateOfBirth}</dd>
              </>
            )}
            <dt className="text-muted-foreground">Location</dt>
            <dd>{student.location}</dd>
            <dt className="text-muted-foreground">Preferred Role</dt>
            <dd>{student.preferredRole}</dd>
            <dt className="text-muted-foreground">Expected Salary</dt>
            <dd>{student.expectedSalary}</dd>
            <dt className="text-muted-foreground">Open to Remote</dt>
            <dd>{student.openToRemote ? "Yes" : student.openToRemote === false ? "No" : "N/A"}</dd>
            <dt className="text-muted-foreground">Willing to Relocate</dt>
            <dd>{student.willingToRelocate ? "Yes" : student.willingToRelocate === false ? "No" : "N/A"}</dd>
          </dl>
        </Section>

        <Section title="NCC Details">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <dt className="text-muted-foreground">Unit</dt>
            <dd>{student.ncc?.unit || "-"}</dd>
            <dt className="text-muted-foreground">Rank</dt>
            <dd>{student.ncc?.rank || "-"}</dd>
            <dt className="text-muted-foreground">Certificate</dt>
            <dd>{student.ncc?.certificate || "-"}</dd>
          </dl>
        </Section>

        <Section title="Education">
          {student.education?.length ? (
            <ul className="space-y-3 text-sm divide-y divide-border/50">
              {student.education.map((e, i) => (
                <li key={i} className={i > 0 ? "pt-2" : ""}>
                  <div className="flex justify-between font-medium">
                    <span>
                      {e.degree}
                      {e.fieldOfStudy ? ` in ${e.fieldOfStudy}` : ""}
                    </span>
                    <span className="text-muted-foreground text-xs">{e.year}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{e.institute}</p>
                  {e.grade && <p className="text-xs text-muted-foreground mt-0.5">Grade/CGPA: {e.grade}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No education records.</p>
          )}
        </Section>

        <Section title="Skills">
          {student.skills?.length ? (
            <div className="flex flex-wrap gap-2">
              {student.skills.map((s) => (
                <span key={s} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                  {s}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No skills added.</p>
          )}
        </Section>

        {student.projects?.length > 0 && (
          <Section title="Projects">
            <ul className="space-y-2 text-sm">
              {student.projects.map((p, i) => (
                <li key={i}>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-muted-foreground text-xs">{p.desc}</p>
                </li>
              ))}
            </ul>
          </Section>
        )}

        <Section title="Links & Resume">
          <div className="flex flex-wrap gap-2 text-sm">
            {student.resume ? (
              <a
                href={student.resume}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-input px-3 py-1.5 hover:bg-muted font-medium text-primary"
              >
                <FileText size={14} /> Resume
              </a>
            ) : null}
            {student.github ? (
              <a
                href={student.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-input px-3 py-1.5 hover:bg-muted"
              >
                <Github size={14} /> GitHub
              </a>
            ) : null}
            {student.linkedin ? (
              <a
                href={student.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-input px-3 py-1.5 hover:bg-muted text-blue-600"
              >
                <Linkedin size={14} /> LinkedIn
              </a>
            ) : null}
            {student.portfolio ? (
              <a
                href={student.portfolio}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-input px-3 py-1.5 hover:bg-muted"
              >
                <Globe size={14} /> Portfolio
              </a>
            ) : null}
            {student.twitter ? (
              <a
                href={student.twitter}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-input px-3 py-1.5 hover:bg-muted"
              >
                <Twitter size={14} /> Twitter
              </a>
            ) : null}
            {!student.resume && !student.github && !student.linkedin && !student.portfolio && !student.twitter && (
              <p className="text-muted-foreground">No links available.</p>
            )}
          </div>
        </Section>
      </div>

      {/* Send Notification Modal */}
      {notifModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm grid place-items-center p-4">
          <div className="card-surface w-full max-w-md p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Send size={18} className="text-primary" />
                <h2 className="text-lg font-semibold">Send Message</h2>
              </div>
              <button
                onClick={() => setNotifModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Sending personal notification to <span className="font-semibold text-foreground">{student.name}</span>.
            </p>

            <form onSubmit={handleSendNotification} className="space-y-4 text-sm">
              <div>
                <label className="block font-medium mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  placeholder="e.g. Action Required: Verification"
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Message Description</label>
                <textarea
                  rows={3}
                  value={notifDesc}
                  onChange={(e) => setNotifDesc(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setNotifModalOpen(false)}
                  className="rounded-xl border border-input px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingNotif}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {sendingNotif ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentDetailsPage;

