import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ArrowLeft, Github, Linkedin, FileText, Ban, CheckCircle2 } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { getStudent, blockStudent, unblockStudent } from "@/services/adminService";


function StudentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getStudent(id).then((r) => setStudent(r.data)).finally(() => setLoading(false));
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
            <h1 className="text-xl font-semibold truncate">{student.name}</h1>
            <p className="text-sm text-muted-foreground truncate">{student.email} • {student.phone}</p>
            <div className="mt-1"><StatusBadge status={student.status} /></div>
          </div>
        </div>
        <button
          onClick={toggleStatus}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium ${
            student.status === "active"
              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {student.status === "active" ? <><Ban size={16} /> Block</> : <><CheckCircle2 size={16} /> Unblock</>}
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Section title="Basic Information">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <dt className="text-muted-foreground">College</dt><dd>{student.college}</dd>
            <dt className="text-muted-foreground">Course</dt><dd>{student.course}</dd>
            <dt className="text-muted-foreground">Location</dt><dd>{student.location}</dd>
          </dl>
        </Section>

        <Section title="NCC Details">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <dt className="text-muted-foreground">Unit</dt><dd>{student.ncc?.unit || "-"}</dd>
            <dt className="text-muted-foreground">Rank</dt><dd>{student.ncc?.rank || "-"}</dd>
            <dt className="text-muted-foreground">Certificate</dt><dd>{student.ncc?.certificate || "-"}</dd>
          </dl>
        </Section>

        <Section title="Education">
          {student.education?.length ? (
            <ul className="space-y-2 text-sm">
              {student.education.map((e, i) => (
                <li key={i} className="flex justify-between">
                  <span>{e.degree} — {e.institute}</span>
                  <span className="text-muted-foreground">{e.year}</span>
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
                <span key={s} className="rounded-full bg-muted px-3 py-1 text-xs">{s}</span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No skills added.</p>
          )}
        </Section>

        <Section title="Projects">
          {student.projects?.length ? (
            <ul className="space-y-2 text-sm">
              {student.projects.map((p, i) => (
                <li key={i}>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-muted-foreground text-xs">{p.desc}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No projects listed.</p>
          )}
        </Section>

        <Section title="Links">
          <div className="flex flex-wrap gap-2 text-sm">
            {student.resume ? (
              <a href={student.resume} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-xl border border-input px-3 py-1.5 hover:bg-muted">
                <FileText size={14} /> Resume
              </a>
            ) : null}
            {student.github ? (
              <a href={student.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-xl border border-input px-3 py-1.5 hover:bg-muted">
                <Github size={14} /> GitHub
              </a>
            ) : null}
            {student.linkedin ? (
              <a href={student.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-xl border border-input px-3 py-1.5 hover:bg-muted">
                <Linkedin size={14} /> LinkedIn
              </a>
            ) : null}
            {!student.resume && !student.github && !student.linkedin && (
              <p className="text-muted-foreground">No links available.</p>
            )}
          </div>
        </Section>
      </div>
    </div>
  );
}

export default StudentDetailsPage;
