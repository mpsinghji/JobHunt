import React from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import AdminJobsTable from "./AdminJobsTable";
import { useNavigate } from "react-router-dom";
import useGetJobs from "../../hooks/useGetJobs";
import { useSelector } from "react-redux";

const AdminJobs = () => {
  const navigate = useNavigate();
  const { allJobs = [] } = useSelector((state) => state.job);
  const { isLoading, error } = useGetJobs();

  // console.log("Current jobs in state:", allJobs);

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto my-10">
        <div className="flex items-center justify-between my-5">
          <Input
            className="w-fit"
            placeholder="Search jobs..."
          />
          <Button onClick={() => navigate("/admin/jobs/create")}>
            Post New Job
          </Button>
        </div>
        {isLoading ? (
          <div className="text-center py-8">Loading jobs...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <AdminJobsTable jobs={allJobs} />
        )}
      </div>
    </>
  );
};

export default AdminJobs;
