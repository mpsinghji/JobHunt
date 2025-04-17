import React from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { MapPin, Briefcase, Building2, Clock, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const formatSalary = (salary) => {
    if (!salary) return "Not specified";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const daysAgoFunction = (mongodbTime) => {
    if (!mongodbTime) return "Recently posted";
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    const days = Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1.5 hover:text-blue-600 transition-colors duration-200">
              {job?.title || "Job Title"}
            </h3>
            <div className="flex items-center gap-2 text-gray-600 mb-1.5">
              <Building2 className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">
                {job?.companyId?.name || "Company Name"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 mb-1.5">
              <Briefcase className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">
                {job?.jobType || "Job Type"}
              </span>
            </div>
            {/* <div className="flex items-center gap-2 text-gray-600">
              <UserCircle className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">
                {job?.position || "Position"}
              </span>
            </div> */}
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-gray-500 text-xs bg-gray-50 px-2 py-1 rounded-full">
              <Clock className="h-3 w-3" />
              <span>{daysAgoFunction(job?.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">
              {job?.location || "Location not specified"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Briefcase className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">
              {job?.experience} experience
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {Array.isArray(job?.requirements) && job.requirements.length > 0 ? (
            job.requirements.slice(0, 3).map((req, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-gray-50 text-gray-700 font-medium"
              >
                {req}
              </Badge>
            ))
          ) : (
            <Badge variant="outline" className="bg-gray-50 text-gray-700 font-medium">
              No specific requirements
            </Badge>
          )}
          {Array.isArray(job?.requirements) && job.requirements.length > 3 && (
            <Badge variant="outline" className="bg-gray-50 text-gray-700 font-medium">
              +{job.requirements.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="text-base font-bold text-gray-800">
            {formatSalary(job?.salary)}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate(`/description/${job?._id}`)}
              variant="outline"
              className="text-black hover:text-white hover:bg-black rounded-xl transition-all duration-200"
            >
              Details
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all duration-200"
              onClick={() => {/* TODO: Implement save functionality */}}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
