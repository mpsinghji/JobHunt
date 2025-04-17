import React, { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Navbar from "../shared/Navbar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { JOB_API_END_POINT,APPLICATION_API_END_POINT } from "../../utils/constants";
import { setSingleJob } from "@/redux/jobSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

const JobDescription = () => {
  const params = useParams();
  const JobId = params.id;
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const isInitiallyApplied =
    singleJob?.application?.some(
      (application) => application.applicant === user?._id
    ) || false;
  const [isApplied, setIsApplied] = useState(isInitiallyApplied);

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${JobId}`,
        {
          withCredentials: true,
        }
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
    const fetchSingleJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${JobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          const hasApplied =
            res.data.job.application?.some(
              (application) => application.applicant?._id === user?._id
            ) || false;
          setIsApplied(hasApplied);
          // console.log("Application status:", hasApplied);
          // console.log("Applications:", res.data.job.application);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJobs();
  }, [JobId, dispatch, user?._id]);
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10">
        <div className="flex justify-between items-center">
          <div>
            {/* company ka naam dalunga */}
            <h1 className="font-bold text-xl">{singleJob?.title}</h1>
            <div className="flex items-center gap-2 mt-4">
              <Badge variant="outline" className="bg-black text-white">
                {singleJob?.position}
              </Badge>
              <Badge variant="ghost" className="bg-blue-600 text-white">
                {singleJob?.jobType}
              </Badge>
              {/* <Badge variant="ghost" className="bg-green-600 text-white">
                {singleJob?.salary}
              </Badge> */}
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
        <h1 className="border-b-2 border-b-gray-300 font-medium py-4">
          Job Description
        </h1>
        <div className="my-4">
          <h1 className="font-bold my-1">
            Role:{" "}
            <span className="pl-4 font-normal text-gray-800">
              {singleJob?.title}
            </span>
          </h1>
          <h1 className="font-bold my-1">
            Location:{" "}
            <span className="pl-4 font-normal text-gray-800">
              {singleJob?.location}
            </span>
          </h1>
          <h1 className="font-bold my-1">
            Description:{" "}
            <span className="pl-4 font-normal text-gray-800">
              {singleJob?.description}
            </span>
          </h1>
          <h1 className="font-bold my-1">
            Requirements:{" "}
            <span className="pl-4 font-normal text-gray-800">
              {Array.isArray(singleJob?.requirements)
                ? singleJob.requirements.map((req, index) => (
                    <span key={index}>
                      {index > 0 && ", "}
                      {req}
                    </span>
                  ))
                : "No specific requirements"}
            </span>
          </h1>
          <h1 className="font-bold my-1">
            Experience:{" "}
            <span className="pl-4 font-normal text-gray-800">
              {singleJob?.experience}
            </span>
          </h1>
          <h1 className="font-bold my-1">
            Salary:{" "}
            <span className="pl-4 font-normal text-gray-800">
              {singleJob?.salary} LPA
            </span>
          </h1>
          <h1 className="font-bold my-1">
            Total Applicants:{""}
            <span className="pl-4 font-normal text-gray-800">
              {singleJob?.application?.length}
            </span>
          </h1>
          <h1 className="font-bold my-1">
            Posted Date:{""}
            <span className="pl-4 font-normal text-gray-800">
              {singleJob?.createdAt
                ? new Date(singleJob.createdAt).toLocaleDateString()
                : "Not available"}
            </span>
          </h1>
        </div>
      </div>
    </>
  );
};

export default JobDescription;
