import React, { useState, useEffect } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Navbar from "../shared/Navbar";
import { useParams } from "react-router-dom";
import { JOB_API_END_POINT, APPLICATION_API_END_POINT, COMPANY_API_END_POINT } from "../../utils/constants";
import { setSingleJob } from "@/redux/jobSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Card } from "../ui/card";
import { Building2, MapPin, Calendar, DollarSign, Briefcase, Users, Globe, Mail, Phone } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import api from "../../utils/api";

const JobDescription = () => {
  const params = useParams();
  const jobId = params.jobId;
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [companyDetails, setCompanyDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isInitiallyApplied =
    singleJob?.application?.some(
      (application) => application.applicant === user?._id
    ) || false;
  const [isApplied, setIsApplied] = useState(isInitiallyApplied);

  const applyJobHandler = async () => {
    try {
      const res = await api.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`
      );

      if (res.data.success) {
        setIsApplied(true);
        const updatedJob = {
          ...singleJob,
          application: [
            ...(singleJob.application || []),
            { applicant: user?._id },
          ],
        };
        dispatch(setSingleJob(updatedJob));
        toast.success(res.data.message || "Application submitted successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to apply for job");
    }
  };

  useEffect(() => {
    const fetchJobAndCompanyDetails = async () => {
      try {
        setIsLoading(true);
        // Fetch job details
        const jobRes = await api.get(`${JOB_API_END_POINT}/get/${jobId}`);

        if (jobRes.data.success) {
          dispatch(setSingleJob(jobRes.data.job));
          const hasApplied =
            jobRes.data.job.application?.some(
              (application) => application.applicant?._id === user?._id
            ) || false;
          setIsApplied(hasApplied);

          // Fetch company details if job has companyId
          if (jobRes.data.job.companyId) {
            const companyRes = await api.get(
              `${COMPANY_API_END_POINT}/get/${jobRes.data.job.companyId}`
            );
            if (companyRes.data.success) {
              setCompanyDetails(companyRes.data.company);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load job details");
      } finally {
        setIsLoading(false);
      }
    };

    if (jobId) {
      fetchJobAndCompanyDetails();
    }
  }, [jobId, dispatch, user?._id]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto my-10 px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto my-20 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Job Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">{singleJob?.title}</h1>
                  <div className="flex items-center gap-2 mt-4">
                    <Badge variant="outline" className="bg-blue-100 text-blue-700">
                      {singleJob?.jobType}
                    </Badge>
                    <Badge variant="outline" className="bg-green-100 text-green-700">
                      {singleJob?.salary} LPA
                    </Badge>
                  </div>
                </div>
                <Button
                  disabled={isApplied}
                  onClick={isApplied ? null : applyJobHandler}
                  className={`rounded-lg ${
                    isApplied
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isApplied ? "Already Applied" : "Apply Now"}
                </Button>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 className="h-5 w-5" />
                  <span>{companyDetails?.name || "Company Name Not Available"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <span>{singleJob?.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-5 w-5" />
                  <span>Posted {new Date(singleJob?.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700">About the Role</h3>
                  <p className="mt-2 text-gray-600">{singleJob?.description}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Requirements</h3>
                  <ul className="mt-2 list-disc list-inside text-gray-600">
                    {Array.isArray(singleJob?.requirements) ? (
                      singleJob.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))
                    ) : (
                      <li>No specific requirements</li>
                    )}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Experience</h3>
                  <p className="mt-2 text-gray-600">{singleJob?.experience}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Company Details */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex flex-col items-center mb-4">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage
                    src={companyDetails?.logo?.url}
                    alt={companyDetails?.name}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {companyDetails?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{companyDetails?.name}</h2>
                {companyDetails?.website && (
                  <a
                    href={companyDetails.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Globe className="h-4 w-4" />
                    Visit Website
                  </a>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">About Company</h3>
                  <p className="text-gray-600">{companyDetails?.description || "No description available"}</p>
                </div>
                
                <div className="space-y-2">
                  {/* <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-5 w-5" />
                    <span>{companyDetails?.email || "Email not available"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-5 w-5" />
                    <span>{companyDetails?.phone || "Phone not available"}</span>
                  </div> */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-5 w-5" />
                    <span>{singleJob?.application?.length || 0} Applicants</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobDescription;
