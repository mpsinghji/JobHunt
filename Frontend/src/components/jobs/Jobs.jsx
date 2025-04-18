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
  const [activeFilters, setActiveFilters] = useState({
    "Job Type": "",
    "Experience Level": "",
    "Salary Range": "",
  });
  const { allJobs } = useSelector((store) => store.job);

  const handleFilterChange = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const parseSalary = (salary) => {
    if (!salary) return 0;
    
    // If salary is already a number, return it
    if (typeof salary === 'number') {
      return salary;
    }
    
    // If salary is a string, parse it
    if (typeof salary === 'string') {
      // Remove all non-numeric characters except decimal point
      const numericString = salary.replace(/[^0-9.]/g, '');
      
      // Convert to number
      const parsedSalary = parseFloat(numericString);
      
      // If salary is in lakhs (contains 'L' or 'lakh')
      if (salary.toLowerCase().includes('l') || salary.toLowerCase().includes('lakh')) {
        return parsedSalary * 100000; // Convert lakhs to rupees
      }
      
      return parsedSalary;
    }
    
    return 0;
  };

  // Filter jobs based on search query and active filters
  useEffect(() => {
    scrollTo(0,0);
    let filtered = [...allJobs];

    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((job) => {
        const jobTitle = job.title?.toLowerCase() || "";
        const companyName = job.companyId?.name?.toLowerCase() || "";
        const jobType = job.jobType?.toLowerCase() || "";
        const experience = job.experience?.toLowerCase() || "";
        const requirements = job.requirements?.join(" ").toLowerCase() || "";
        const description = job.description?.toLowerCase() || "";

        return (
          jobTitle.includes(query) ||
          companyName.includes(query) ||
          jobType.includes(query) ||
          experience.includes(query) ||
          requirements.includes(query) ||
          description.includes(query)
        );
      });
    }

    // Apply active filters
    Object.entries(activeFilters).forEach(([filterType, value]) => {
      if (value) {
        filtered = filtered.filter((job) => {
          switch (filterType) {
            case "Job Type":
              return job.jobType?.toLowerCase() === value.toLowerCase();
            case "Experience Level":
              return job.experience?.toLowerCase() === value.toLowerCase();
            case "Salary Range":
              const salary = parseSalary(job.salary);
              switch (value) {
                case "0-5L":
                  return salary <= 500000;
                case "5L-10L":
                  return salary > 500000 && salary <= 1000000;
                case "10L-20L":
                  return salary > 1000000 && salary <= 2000000;
                case "20L+":
                  return salary > 2000000;
                default:
                  return true;
              }
            default:
              return true;
          }
        });
      }
    });

    setFilteredJobs(filtered);
  }, [searchQuery, allJobs, activeFilters]);

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
                placeholder="Search jobs by title, company, type, experience..."
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
              showFilters ? "block" : "hidden"
            }`}
          >
            <FilterCard onFilterChange={handleFilterChange} activeFilters={activeFilters} />
          </div>

          {/* Jobs Grid */}
          <div className={`${showFilters ? "lg:w-3/4" : "w-full"}`}>
            {filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600">
                  {searchQuery || Object.values(activeFilters).some(Boolean)
                    ? "Try adjusting your search terms or filters"
                    : "Check back later for new opportunities"}
                </p>
              </div>
            ) : (
              <div className={`grid grid-cols-1 md:grid-cols-2 ${!showFilters ? 'lg:grid-cols-3' : ''} gap-6`}>
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
