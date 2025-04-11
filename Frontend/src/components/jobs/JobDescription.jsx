import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Navbar from "../shared/Navbar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { JOB_API_END_POINT } from "../../components/utils/constants.js";
import { setSingleJob } from "@/redux/jobSlice.js";
import { useDispatch, useSelector } from "react-redux";

const JobDescription = () => {
  const isApplied =
    singleJob?.application?.some(
      (application) => application.applicant === user?._id
    ) || false;
  const params = useParams();
  const JobId = params.id;
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSingleJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${JobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
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
            <h1 className="font-bold text-xl">{singleJob?.title}</h1>
            <div className="flex items-center gap-2 mt-4">
              <Badge variant="outline" className="bg-black text-white">
                {singleJob?.position}
              </Badge>
              <Badge variant="ghost" className="bg-blue-600 text-white">
                {singleJob?.jobType}
              </Badge>
              <Badge variant="ghost" className="bg-green-600 text-white">
                {singleJob?.salary}
              </Badge>
            </div>
          </div>
          <Button
            disabled={isApplied}
            className={`rounded-lg ${
              isApplied
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-[#7209b7] hover:bg-[#5f32ad]"
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
              {singleJob?.experience} yrs
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
