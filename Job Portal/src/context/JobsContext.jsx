import { createContext, useContext, useState, useCallback } from "react";
import { getPublicJobs, getSavedJobs, saveJob, deleteSavedJob } from "../services/jobsApi";
import toast from "react-hot-toast";

const JobsContext = createContext(null);

export function JobsProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [savedJobsMap, setSavedJobsMap] = useState({}); // jobId -> savedJobId (primary key id of the SavedJob model)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPublicJobs();
      setJobs(data);
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch jobs");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSavedJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSavedJobs();
      // data is { savedJobs, pagination }
      const list = data?.savedJobs || [];
      setSavedJobs(list);

      // Create mapping of jobId -> savedJobId
      const map = {};
      list.forEach((item) => {
        if (item.jobId) {
          map[item.jobId] = item.id;
        }
      });
      setSavedJobsMap(map);
      return list;
    } catch (err) {
      setError(err.message || "Failed to fetch saved jobs");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleSaveJob = useCallback(async (jobId) => {
    const savedJobId = savedJobsMap[jobId];
    if (savedJobId) {
      // Unsave the job
      try {
        await deleteSavedJob(savedJobId, jobId);
        // update local list
        setSavedJobs((prev) => prev.filter((item) => item.id !== savedJobId));
        // update map
        setSavedJobsMap((prev) => {
          const next = { ...prev };
          delete next[jobId];
          return next;
        });
        toast.success("Job removed from saved");
        return false; // isSaved = false
      } catch (err) {
        toast.error(err.message || "Failed to remove job");
        throw err;
      }
    } else {
      // Save the job
      try {
        const newSavedJob = await saveJob(jobId);
        // update map & lists
        setSavedJobsMap((prev) => ({
          ...prev,
          [jobId]: newSavedJob.id,
        }));
        // find job in jobs list to add to savedJobs list, or add dummy
        const jobDetails = jobs.find((j) => j.id === jobId) || null;
        setSavedJobs((prev) => [
          ...prev,
          {
            id: newSavedJob.id,
            studentId: newSavedJob.studentId,
            jobId: jobId,
            job: jobDetails,
          },
        ]);
        toast.success("Job saved successfully!");
        return true; // isSaved = true
      } catch (err) {
        toast.error(err.message || "Failed to save job");
        throw err;
      }
    }
  }, [savedJobsMap, jobs]);

  return (
    <JobsContext.Provider
      value={{
        jobs,
        savedJobs,
        savedJobsMap,
        loading,
        error,
        fetchJobs,
        fetchSavedJobs,
        toggleSaveJob,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
}

export const useJobsContext = () => {
  const ctx = useContext(JobsContext);
  if (!ctx) throw new Error("useJobsContext must be used inside <JobsProvider>");
  return ctx;
};
