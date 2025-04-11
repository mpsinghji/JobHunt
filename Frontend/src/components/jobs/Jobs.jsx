import React, { useState, useEffect } from "react";
import JobCard from "./JobCard.jsx";
import FilterCard from "./FilterCard.jsx";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import Navbar from "../shared/Navbar.jsx";
import { useSelector } from "react-redux";

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const { allJobs } = useSelector((store) => store.job);

  // Filter jobs based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredJobs(allJobs);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allJobs.filter((job) => {
      return (
        job.title?.toLowerCase().includes(query) ||
        job.company?.name?.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query) ||
        job.position?.toLowerCase().includes(query) ||
        job.jobType?.toLowerCase().includes(query) ||
        job.requirements?.some((req) => req.toLowerCase().includes(query))
      );
    });
    setFilteredJobs(filtered);
  }, [searchQuery, allJobs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search jobs by title, company, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full bg-gray-50 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
            >
              <SlidersHorizontal className="h-5 w-5" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Section */}
          <div
            className={`lg:w-1/4 transition-all duration-300 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <FilterCard />
          </div>

          {/* Jobs Grid */}
          <div className="lg:w-3/4">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600">
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : "Check back later for new opportunities"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredJobs.map((job) => (
                  <div
                    key={job._id}
                    className="transform hover:scale-105 transition-transform duration-200"
                  >
                    <JobCard job={job} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
