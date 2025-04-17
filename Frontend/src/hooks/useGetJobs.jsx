import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { JOB_API_END_POINT } from "../utils/constants";
import { setAllJobs, setSingleJob } from "../redux/jobSlice";
import { toast } from "sonner";

const useGetJobs = (jobId = null) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const endpoint = jobId
          ? `${JOB_API_END_POINT}/get/${jobId}`
          : `${JOB_API_END_POINT}/getadminjobs`;

        const res = await fetch(endpoint, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        // console.log("Jobs API Response:", data);

        if (data.success === false) {
          throw new Error(data.message);
        }

        if (jobId) {
          dispatch(setSingleJob(data.job));
        } else {
          dispatch(setAllJobs(data.jobs));
        }
        // console.log("Fetched jobs:", data.jobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error(error.message || "Failed to fetch jobs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [jobId, dispatch]);

  return { isLoading };
};

export default useGetJobs;