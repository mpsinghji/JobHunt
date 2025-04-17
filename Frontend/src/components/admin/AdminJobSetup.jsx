import React, { useState, useEffect } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { JOB_API_END_POINT } from "../../utils/constants";
import { useSelector } from "react-redux";
import useGetJobs from "../../hooks/useGetJobs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import useGetCompanies from "../../hooks/useGetCompanies";

const AdminJobSetup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const { singleJob } = useSelector((state) => state.job);
  const { allCompanies = [] } = useSelector((state) => state.company);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    salary: "",
    jobType: "",
    position: "",
    companyId: "",
    experience: "",
  });

  // Fetch companies and job details when component mounts
  useGetCompanies();
  useGetJobs(params.id);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (singleJob) {
      setFormData({
        title: singleJob.title || "",
        description: singleJob.description || "",
        requirements: singleJob.requirements?.join(", ") || "",
        location: singleJob.location || "",
        salary: singleJob.salary || "",
        jobType: singleJob.jobType || "",
        position: singleJob.position || "",
        companyId: singleJob.companyId || "",
        experience: singleJob.experience || "",
      });
    }
  }, [singleJob]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const jobData = {
        ...formData,
        requirements: formData.requirements.split(',').map(req => req.trim())
      };

      const response = await axios.put(
        `${JOB_API_END_POINT}/update/${params.id}`,
        jobData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      console.error("Job update error:", error);
      toast.error(error.response?.data?.message || "Failed to update job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Button
            variant="outline"
            className="flex items-center gap-2 text-gray-500 font-semibold mb-6"
            onClick={() => navigate("/admin/jobs")}
            type="button"
          >
            <ArrowLeft />
            <span>Back</span>
          </Button>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Edit Job Posting
                </h1>
                <p className="text-gray-600">
                  Update the job details as needed
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Job Title
                    </label>
                    <Input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter job title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Company
                    </label>
                    <Select
                      value={formData.companyId}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, companyId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        {allCompanies.length > 0 ? (
                          allCompanies.map((company) => (
                            <SelectItem key={company._id} value={company._id}>
                              {company.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>
                            No companies available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <Input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Enter job location"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Salary
                    </label>
                    <Input
                      type="text"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      placeholder="Enter salary range"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Job Type
                    </label>
                    <Select
                      value={formData.jobType}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, jobType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Experience Level
                    </label>
                    <Select
                      value={formData.experience}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Entry Level">Entry Level</SelectItem>
                        <SelectItem value="Mid Level">Mid Level</SelectItem>
                        <SelectItem value="Senior Level">Senior Level</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter job description"
                    className="min-h-[120px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Requirements (comma separated)
                  </label>
                  <Textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    placeholder="Enter job requirements"
                    className="min-h-[80px]"
                    required
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
                      Update Job
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

export default AdminJobSetup; 