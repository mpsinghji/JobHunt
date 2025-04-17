import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "../../redux/companySlice";
import { COMPANY_API_END_POINT } from "../../utils/constants";

const CompanyCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [companyName, setCompanyName] = useState("");

  const registerCompany = async () => {
    try {
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        { companyName },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      
      if (res?.data?.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message);
        const companyId = res.data.company._id;
        navigate(`/admin/companies/${companyId}`);
      }
    } catch (error) {
      console.error("Company registration error:", error);
      toast.error(error.response?.data?.message || "Failed to register company");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-100 p-3 rounded-full">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Create Your Company Profile
              </h1>
              <p className="text-gray-500 mt-1">
                Let's start by setting up your company's basic information
              </p>
            </div>
          </div>

            <div className="space-y-2">
              <Label
                htmlFor="companyName"
                className="text-sm font-medium text-gray-700"
              >
                Company Name
              </Label>
              <Input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., Microsoft, Google, Apple"
                className="w-full"
                required
              />
              <p className="text-sm text-gray-500">
                This will be the primary name of your company on JobHunt
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/companies")}
                className="w-24"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-24 bg-blue-600 hover:bg-blue-700"
                onClick={registerCompany}
              >
                Continue
              </Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;
