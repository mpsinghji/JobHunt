import { useState } from "react";
import { useDispatch } from "react-redux";
import { JOB_API_END_POINT } from "../utils/constants";
import { setAllJobs } from "../redux/jobSlice";
import { toast } from "sonner";

const useDeleteJob = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const deleteJob = async (jobId) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${JOB_API_END_POINT}/delete/${jobId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      if (data.success === false) {
        throw new Error(data.message);
      }

      // Update the jobs list in Redux state
      dispatch(setAllJobs(data.jobs));
      toast.success("Job deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete job");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteJob, isLoading };
};

export default useDeleteJob;