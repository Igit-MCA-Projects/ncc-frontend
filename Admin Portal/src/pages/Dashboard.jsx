import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Users,
  Clock,
  CheckCircle2,
  UserCheck,
  Award,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import {
  getStudents,
  getJobs,
  getMentorshipRequests,
  getNccBenefits,
  getScholarships,
} from "@/services/adminService";

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    students: [],
    jobs: [],
    mentorship: [],
    nccBenefits: [],
    scholarships: [],
  });

  useEffect(() => {
    Promise.all([
      getStudents(),
      getJobs(),
      getMentorshipRequests(),
      getNccBenefits(),
      getScholarships(),
    ])
      .then(([s, j, m, b, sc]) => {
        setData({
          students: s.data || [],
          jobs: j.data || [],
          mentorship: m.data || [],
          nccBenefits: b.data || [],
          scholarships: sc.data || [],
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const pendingJobs = data.jobs.filter((j) => j.status === "pending").length;
  const approvedJobs = data.jobs.filter((j) => j.status === "approved").length;
  const pendingMentorship = data.mentorship.filter((m) => m.status === "PENDING").length;
  const recentStudents = data.students.slice(0, 5);
  const recentJobs = data.jobs.slice(0, 5);

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
            <StatCard icon={UserCheck} label="Pending Mentorships" value={pendingMentorship} tone="accent" />
            <StatCard icon={Clock} label="Pending Jobs" value={pendingJobs} tone="warning" />
            <StatCard icon={CheckCircle2} label="Approved Jobs" value={approvedJobs} tone="success" />
            <StatCard icon={Award} label="NCC Benefits" value={data.nccBenefits.length} tone="secondary" />
            <StatCard icon={GraduationCap} label="Scholarships" value={data.scholarships.length} tone="primary" />
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
                <h2 className="font-semibold">Recent Jobs</h2>
                <Link to="/job-approval" className="text-sm text-primary hover:underline">View all</Link>
              </div>
              <div className="space-y-3">
                {recentJobs.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4 text-center">No job postings found</p>
                ) : (
                  recentJobs.map((j) => (
                    <div key={j.id} className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0">
                        <Briefcase size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{j.title}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {j.companyName} • {j.location || "Remote"}
                        </p>
                      </div>
                      <StatusBadge status={j.status} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardPage;
