import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllJobs } from "../redux/jobSlice";
import { JOB_API_END_POINT } from "../utils/constants";
import axios from "axios";
import { toast } from "sonner";

const useGetJobs = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await axios.get(
          `${JOB_API_END_POINT}/getadminjobs`,
          {
            withCredentials: true,
            params: {
              userId: user?._id
            }
          }
        );

        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs));
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError(error.response?.data?.message || "Failed to fetch jobs");
        toast.error(error.response?.data?.message || "Failed to fetch jobs");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?._id) {
      fetchJobs();
    }
  }, [dispatch, user?._id]);

  return { isLoading, error };
};

export default useGetJobs;