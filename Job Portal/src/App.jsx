import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import SavedJobs from "./pages/SavedJobs";
import Profile from "./pages/Profile";
import ProfileCompletionForm from "./pages/ProfileCompletionform";
import Settings from "./pages/Settings";
import CareerAssistant from "./pages/CareerAssistant";
import NccCadetProfile from "./pages/NccCadetProfile";
import NotFound from "./pages/NotFound";
import HiringCalendar from "./pages/HiringCalendar";
import NccBenefits from "./pages/NccBenefits";
import Scholarships from "./pages/Scholarships";
import Notifications from "./pages/Notifications";
import MentorshipStatus from "./pages/MentorshipStatus";
import { JobsProvider } from "./context/JobsContext";
import { ProfileProvider } from "./context/ProfileContext";
import { NccProfileProvider } from "./context/NccProfileContext";
import { NotificationProvider } from "./context/NotificationContext";
import { MentorshipProvider } from "./context/MentorshipContext";

export default function App() {
  return (
    <ProfileProvider>
      <NccProfileProvider>
        <JobsProvider>
          <NotificationProvider>
            <MentorshipProvider>
              <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route path="/hiring-calendar" element={<HiringCalendar />} />
            <Route path="/ncc-benefits" element={<NccBenefits />} />
            <Route path="/scholarships" element={<Scholarships />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/mentorship-status" element={<MentorshipStatus />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile-complete" element={<ProfileCompletionForm />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/career-assistant" element={<CareerAssistant />} />
            <Route path="/ncc-profile" element={<NccCadetProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MentorshipProvider>
      </NotificationProvider>
    </JobsProvider>
  </NccProfileProvider>
</ProfileProvider>
  );
}
