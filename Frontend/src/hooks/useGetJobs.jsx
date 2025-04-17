import { useState, useEffect } from "react";
import axios from "axios";
import { JOB_API_END_POINT } from "../components/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { setAllJobs, setSingleJob } from "../redux/jobSlice";

const useGetJobs = (jobId = null) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (jobId) {
          // Fetch single job
          const response = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
            withCredentials: true,
          });
          if (response.data.success) {
            dispatch(setSingleJob(response.data.job));
          }
        } else {
          // Fetch all jobs for the current user
          const response = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {
            withCredentials: true,
          });
          
          console.log("Jobs API Response:", response.data);
          
          if (response.data.success) {
            const jobs = response.data.jobs || [];
            console.log("Fetched jobs:", jobs);
            dispatch(setAllJobs(jobs));
          }
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError(error.response?.data?.message || "Failed to fetch jobs");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?._id) {
      fetchJobs();
    }
  }, [jobId, dispatch, user?._id]);

  return { isLoading, error };
};

export default useGetJobs;