import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Users,
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
} from "lucide-react";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import {
  getStudents,
  getCompanies,
  getJobs,
  getSubAdmins,
} from "@/services/adminService";


function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    students: [],
    companies: [],
    jobs: [],
    subAdmins: [],
  });

  useEffect(() => {
    Promise.all([getStudents(), getCompanies(), getJobs(), getSubAdmins()])
      .then(([s, c, j, sa]) => {
        setData({ students: s.data, companies: c.data, jobs: j.data, subAdmins: sa.data });
      })
      .finally(() => setLoading(false));
  }, []);

  const pending = data.jobs.filter((j) => j.status === "pending").length;
  const approved = data.jobs.filter((j) => j.status === "approved").length;
  const rejected = data.jobs.filter((j) => j.status === "rejected").length;
  const activeSubs = data.subAdmins.filter((s) => s.status === "active").length;
  const recentStudents = data.students.slice(0, 5);
  const recentCompanies = data.companies.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Platform overview at a glance.</p>
      </div>

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : (
        <>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <StatCard icon={Users} label="Total Students" value={data.students.length} tone="primary" />
            <StatCard icon={Building2} label="Total Companies" value={data.companies.length} tone="secondary" />
            <StatCard icon={Clock} label="Pending Jobs" value={pending} tone="warning" />
            <StatCard icon={CheckCircle2} label="Approved Jobs" value={approved} tone="success" />
            <StatCard icon={XCircle} label="Rejected Jobs" value={rejected} tone="destructive" />
            <StatCard icon={ShieldCheck} label="Active Sub Admins" value={activeSubs} tone="accent" />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="card-surface p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Recent Students</h2>
                <Link to="/students" className="text-sm text-primary hover:underline">View all</Link>
              </div>
              <div className="space-y-3">
                {recentStudents.map((s) => (
                  <div key={s.id} className="flex items-center gap-3">
                    <img src={s.photo} alt={s.name} className="h-9 w-9 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{s.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{s.college}</p>
                    </div>
                    <StatusBadge status={s.status} />
                  </div>
                ))}
              </div>
            </div>

            <div className="card-surface p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Recent Companies</h2>
                <Link to="/companies" className="text-sm text-primary hover:underline">View all</Link>
              </div>
              <div className="space-y-3">
                {recentCompanies.map((c) => (
                  <div key={c.id} className="flex items-center gap-3">
                    <img src={c.logo} alt={c.name} className="h-9 w-9 rounded-xl object-cover bg-muted" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {c.industry} • {c.location}
                      </p>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardPage;
