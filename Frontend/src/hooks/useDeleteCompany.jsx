import axios from "axios";
import { COMPANY_API_END_POINT } from "../components/utils/constants";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setCompanies } from "../redux/companySlice";

const useDeleteCompany = () => {
  const dispatch = useDispatch();

  const deleteCompany = async (companyId) => {
    try {
      const res = await axios.delete(`${COMPANY_API_END_POINT}/delete/${companyId}`, {
        withCredentials: true,
      });
      
      if (res.data.success) {
        // Fetch updated companies list
        const updatedCompanies = await axios.get(`${COMPANY_API_END_POINT}/get`, {
          withCredentials: true,
        });
        
        if (updatedCompanies.data.success) {
          dispatch(setCompanies(updatedCompanies.data.companies));
          toast.success("Company deleted successfully");
        }
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error(error.response?.data?.message || "Failed to delete company");
    }
  };

  return deleteCompany;
};

export default useDeleteCompany; 