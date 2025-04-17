import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setAllCompanies } from "../redux/companySlice";
import { COMPANY_API_END_POINT } from "../utils/constants";
import { toast } from "sonner";

const useGetCompanies = () => {
  const dispatch = useDispatch();
  const { allCompanies } = useSelector((state) => state.company);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(
          `${COMPANY_API_END_POINT}/get`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setAllCompanies(res.data.companies));
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    if (!allCompanies || allCompanies.length === 0) {
      fetchCompanies();
    }
  }, [dispatch, allCompanies]);

  return { allCompanies };
};

export default useGetCompanies; 