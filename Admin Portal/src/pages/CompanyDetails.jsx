import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ArrowLeft, Globe, Ban, CheckCircle2 } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { getCompany, blockCompany, unblockCompany } from "@/services/adminService";


function CompanyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getCompany(id).then((r) => setCompany(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, [id]);

  const toggleStatus = async () => {
    if (!company) return;
    try {
      if (company.status === "active") await blockCompany(company.id);
      else await unblockCompany(company.id);
      toast.success("Status updated");
      load();
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <LoadingSkeleton rows={6} />;
  if (!company) {
    return (
      <div className="card-surface p-8 text-center">
        <p>Company not found.</p>
        <button onClick={() => navigate("/companies")} className="mt-4 text-primary hover:underline">
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
      <Link to="/companies" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={16} /> Back to companies
      </Link>

      <div className="card-surface p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <img src={company.logo} alt="" className="h-16 w-16 rounded-2xl object-cover bg-muted" />
          <div className="min-w-0">
            <h1 className="text-xl font-semibold truncate">{company.name}</h1>
            <p className="text-sm text-muted-foreground truncate">{company.industry} • {company.location}</p>
            <div className="mt-1"><StatusBadge status={company.status} /></div>
          </div>
        </div>
        <button
          onClick={toggleStatus}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium ${
            company.status === "active"
              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {company.status === "active" ? <><Ban size={16} /> Block</> : <><CheckCircle2 size={16} /> Unblock</>}
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Section title="Company Information">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <dt className="text-muted-foreground">Email</dt><dd className="truncate">{company.email}</dd>
            <dt className="text-muted-foreground">Industry</dt><dd>{company.industry}</dd>
            <dt className="text-muted-foreground">Location</dt><dd>{company.location}</dd>
            <dt className="text-muted-foreground">Website</dt>
            <dd>
              <a href={company.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                <Globe size={14} /> Visit
              </a>
            </dd>
          </dl>
          <p className="mt-4 text-sm text-muted-foreground">{company.description}</p>
        </Section>

        <Section title="HR Details">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <dt className="text-muted-foreground">Name</dt><dd>{company.hr?.name}</dd>
            <dt className="text-muted-foreground">Email</dt><dd className="truncate">{company.hr?.email}</dd>
            <dt className="text-muted-foreground">Phone</dt><dd>{company.hr?.phone}</dd>
          </dl>
        </Section>

        <div className="lg:col-span-2">
          <Section title={`Posted Jobs (${company.jobs?.length || 0})`}>
            {company.jobs?.length ? (
              <div className="space-y-2">
                {company.jobs.map((j) => (
                  <div key={j.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{j.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{j.location} • {j.salary} • {j.experience}</p>
                    </div>
                    <StatusBadge status={j.status} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No jobs posted yet.</p>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}

export default CompanyDetailsPage;
