import { useEffect } from "react";
import { useJobsContext } from "../context/JobsContext";

export function useJobs() {
  const { jobs, loading, error, fetchJobs, fetchSavedJobs, toggleSaveJob, savedJobsMap } =
    useJobsContext();

  useEffect(() => {
    fetchJobs().catch(() => {});
    fetchSavedJobs().catch(() => {});
  }, [fetchJobs, fetchSavedJobs]);

  return {
    jobs,
    loading,
    error,
    fetchJobs,
    toggleSaveJob,
    savedJobsMap,
  };
}
