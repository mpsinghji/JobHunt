import React, { useEffect } from "react";
import Navbar from "../shared/Navbar";
import ApplicantsTable from "./ApplicantsTable";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobApplicants } from "../../redux/applicationSlice";
import { toast } from "sonner";

const Applicants = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { currentJob, loading, error } = useSelector((state) => state.application);

  useEffect(() => {
    console.log("Fetching applicants for job ID:", params.id);
    dispatch(fetchJobApplicants(params.id))
      .then((result) => {
        console.log("API Response:", result);
        if (result.error) {
          console.error("Error fetching applicants:", result.error);
        }
      });
  }, [dispatch, params.id]);

  useEffect(() => {
    if (error) {
      console.error("Application error:", error);
      toast.error(error.message || "Failed to fetch applicants");
    }
  }, [error]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  console.log("Current Job Data:", currentJob);
  console.log("Applications Array:", currentJob?.applications);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-bold text-2xl mb-6">
          Applicants {currentJob?.applications?.length || 0}
        </h1>
        {currentJob && <ApplicantsTable />}
      </div>
    </div>
  );
};

export default Applicants;
