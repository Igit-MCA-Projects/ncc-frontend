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
import { JobsProvider } from "./context/JobsContext";
import { ProfileProvider } from "./context/ProfileContext";
import { NccProfileProvider } from "./context/NccProfileContext";

export default function App() {
  return (
    <ProfileProvider>
      <NccProfileProvider>
        <JobsProvider>
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
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile-complete" element={<ProfileCompletionForm />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/career-assistant" element={<CareerAssistant />} />
            <Route path="/ncc-profile" element={<NccCadetProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </JobsProvider>
      </NccProfileProvider>
    </ProfileProvider>
  );
}
