import { createContext, useContext, useState, useCallback } from "react";
import { getAllMentors, requestMentorship } from "../services/mentorshipApi";
import toast from "react-hot-toast";

const MentorshipContext = createContext(null);

export function MentorshipProvider({ children }) {
  const [mentors, setMentors] = useState([]);
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

  const sendMentorshipRequest = useCallback(async ({ teacherId, note }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await requestMentorship({ teacherId, note });
      toast.success("Mentorship request sent successfully!");
      // Optionally refetch mentors to reflect new connection status
      await fetchMentors();
      return res;
    } catch (err) {
      setError(err.message || "Failed to send mentorship request");
      toast.error(err.message || "Failed to send mentorship request");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchMentors]);

  return (
    <MentorshipContext.Provider
      value={{
        mentors,
        loading,
        error,
        fetchMentors,
        sendMentorshipRequest,
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
