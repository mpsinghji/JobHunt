import React, { useState, useEffect } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { COMPANY_API_END_POINT } from "../../utils/constants";
import { useSelector } from "react-redux";
import useGetSingleCompany from "../../hooks/useGetSingleCompany";

const CompanySetup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const { singleCompany } = useSelector((state) => state.company);
  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });

  useGetSingleCompany(params.id);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    if (input.name) formData.append("name", input.name);
    if (input.description) formData.append("description", input.description);
    if (input.website) formData.append("website", input.website);
    if (input.location) formData.append("location", input.location);
    
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `${COMPANY_API_END_POINT}/update/${params.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/admin/companies");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (singleCompany) {
      setInput({
        name: singleCompany.name || "",
        description: singleCompany.description || "",
        website: singleCompany.website || "",
        location: singleCompany.location || "",
        file: null,
      });
    }
  }, [singleCompany]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Button
            variant="outline"
            className="flex items-center gap-2 text-gray-500 font-semibold mb-6"
            onClick={() => navigate("/admin/companies")}
            type="button"
          >
            <ArrowLeft />
            <span>Back</span>
          </Button>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {singleCompany ? "Edit Company" : "Company Setup"}
                </h1>
                <p className="text-gray-600">
                  {singleCompany
                    ? "Update your company details"
                    : "Fill in your company details to get started"}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Company Name
                    </label>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Enter company name"
                      value={input.name}
                      onChange={changeEventHandler}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Website
                    </label>
                    <Input
                      type="url"
                      name="website"
                      placeholder="https://example.com"
                      value={input.website}
                      onChange={changeEventHandler}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <Input
                      type="text"
                      name="location"
                      placeholder="Enter company location"
                      value={input.location}
                      onChange={changeEventHandler}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Company Logo
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors">
                          <label
                            htmlFor="logo-upload"
                            className="cursor-pointer"
                          >
                            <div className="flex flex-col items-center gap-2">
                              {singleCompany?.logo?.url ? (
                                <img
                                  src={singleCompany.logo.url}
                                  alt="Company logo"
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                              ) : (
                                <Upload className="w-6 h-6 text-gray-400" />
                              )}
                              <span className="text-sm text-gray-600">
                                {input.file
                                  ? input.file.name
                                  : "Click to upload logo"}
                              </span>
                              <span className="text-xs text-gray-500">
                                PNG, JPG up to 2MB
                              </span>
                            </div>
                          </label>
                          <input
                            id="logo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <Textarea
                    name="description"
                    placeholder="Enter company description"
                    value={input.description}
                    onChange={changeEventHandler}
                    className="min-h-[120px]"
                  />
                </div>
                {loading ? (
                  <div className="flex justify-center items-center">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {singleCompany ? "Update Company" : "Save Company Details"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CompanySetup;
