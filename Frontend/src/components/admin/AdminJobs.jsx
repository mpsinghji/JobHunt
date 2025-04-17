import React, {useState, useEffect} from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import AdminJobsTable from "./AdminJobsTable";
import { useNavigate } from "react-router-dom";
import useGetJobs from "../../hooks/useGetJobs";
import { useSelector } from "react-redux";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const AdminJobs = () => {
  const navigate = useNavigate();
  const { allJobs = [] } = useSelector((state) => state.job);
  const { isLoading, error } = useGetJobs();
  const [filteredJobs, setFilteredJobs] = useState(allJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");

  useEffect(() => {
    setFilteredJobs(allJobs);
  }, [allJobs]);

  useEffect(() => {
    const filtered = allJobs.filter((job) => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.companyId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesJobType = jobTypeFilter === "all" || job.jobType === jobTypeFilter;
      const matchesExperience = experienceFilter === "all" || job.experience === experienceFilter;
      return matchesSearch && matchesJobType && matchesExperience;
    });
    setFilteredJobs(filtered);
  }, [allJobs, searchTerm, jobTypeFilter, experienceFilter]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setJobTypeFilter("all");
    setExperienceFilter("all");
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto my-10">
        <div className="flex items-center justify-between my-5">
          <div className="flex items-center gap-4">
            <Input
              className="w-64"
              placeholder="Search by title or company..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>
            <Select value={experienceFilter} onValueChange={setExperienceFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Entry Level">Entry Level</SelectItem>
                <SelectItem value="Mid Level">Mid Level</SelectItem>
                <SelectItem value="Senior Level">Senior Level</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
          <Button onClick={() => navigate("/admin/jobs/create")}>
            Post New Job
          </Button>
        </div>
        {isLoading ? (
          <div className="text-center py-8">Loading jobs...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <AdminJobsTable jobs={filteredJobs} />
        )}
      </div>
    </>
  );
};

export default AdminJobs;
