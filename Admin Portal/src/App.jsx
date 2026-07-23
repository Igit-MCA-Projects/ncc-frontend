import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Students from "@/pages/Students";
import StudentDetails from "@/pages/StudentDetails";
import JobApproval from "@/pages/JobApproval";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import PostJobPage from "@/pages/PostJobs";
import HiringCalendarPage from "@/pages/HiringCalendar";
import NotificationsPage from "@/pages/Notifications";
import MentorshipPage from "@/pages/Mentorship";
import NccBenefitsPage from "@/pages/NccBenefits";
import ScholarshipsPage from "@/pages/Scholarships";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/students/:id" element={<StudentDetails />} />
        <Route path="/mentorship" element={<MentorshipPage />} />
        <Route path="/job-approval" element={<JobApproval />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/ncc-benefits" element={<NccBenefitsPage />} />
        <Route path="/scholarships" element={<ScholarshipsPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/addJob" element={<PostJobPage />} />
        <Route path="/hiring-calendar" element={<HiringCalendarPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
