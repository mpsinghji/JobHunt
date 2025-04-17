import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setAllCompanies } from "../redux/companySlice";
import { COMPANY_API_END_POINT } from "../utils/constants";
import { toast } from "sonner";

const useGetCompanies = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await axios.get(
          `${COMPANY_API_END_POINT}/getadmincompanies`,
          {
            withCredentials: true
          }
        );

        if (res.data.success) {
          dispatch(setAllCompanies(res.data.companies));
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
        setError(error.response?.data?.message || "Failed to fetch companies");
        toast.error(error.response?.data?.message || "Failed to fetch companies");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?._id) {
      fetchCompanies();
    }
  }, [dispatch, user?._id]);

  return { isLoading, error };
};

export default useGetCompanies; 