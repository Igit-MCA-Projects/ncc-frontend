import { useEffect, useState } from "react";
import { getJobs } from "../services/api";

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    getJobs().then((d) => alive && (setJobs(d), setLoading(false)));
    return () => { alive = false; };
  }, []);
  return { jobs, loading };
}
