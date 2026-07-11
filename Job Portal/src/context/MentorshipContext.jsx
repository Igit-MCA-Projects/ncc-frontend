import { createContext, useContext, useState, useCallback } from "react";
import { getAllMentors, requestMentorship, getMentorshipStatus, deleteMentorshipRequest } from "../services/mentorshipApi";
import toast from "react-hot-toast";

const MentorshipContext = createContext(null);

export function MentorshipProvider({ children }) {
  const [mentors, setMentors] = useState([]);
  const [mentorshipRequests, setMentorshipRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMentors = useCallback(async (jobId = null) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllMentors(jobId);
      setMentors(data || []);
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch mentors");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMentorshipRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMentorshipStatus();
      setMentorshipRequests(data || []);
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch mentorship requests");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMentorshipRequest = useCallback(async ({ teacherId, note }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await requestMentorship({ teacherId, note });
      toast.success("Mentorship request sent successfully!");
      // Optionally refetch mentors to reflect new connection status
      await fetchMentors();
      // Optionally refetch mentorship requests as well
      await fetchMentorshipRequests();
      return res;
    } catch (err) {
      setError(err.message || "Failed to send mentorship request");
      toast.error(err.message || "Failed to send mentorship request");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchMentors, fetchMentorshipRequests]);

  const deleteMentorship = useCallback(async (mentorshipId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await deleteMentorshipRequest(mentorshipId);
      toast.success("Mentorship request deleted successfully!");
      setMentorshipRequests((prev) => prev.filter((item) => item.id !== mentorshipId));
      return res;
    } catch (err) {
      setError(err.message || "Failed to delete mentorship request");
      toast.error(err.message || "Failed to delete mentorship request");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <MentorshipContext.Provider
      value={{
        mentors,
        mentorshipRequests,
        loading,
        error,
        fetchMentors,
        fetchMentorshipRequests,
        sendMentorshipRequest,
        deleteMentorship,
      }}
    >
      {children}
    </MentorshipContext.Provider>
  );
}

export const useMentorshipContext = () => {
  const ctx = useContext(MentorshipContext);
  if (!ctx) throw new Error("useMentorshipContext must be used inside <MentorshipProvider>");
  return ctx;
};
