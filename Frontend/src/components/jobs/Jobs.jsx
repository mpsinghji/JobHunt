import React, { useState, useEffect } from "react";
import JobCard from "./JobCard.jsx";
import FilterCard from "./FilterCard.jsx";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../shared/Navbar.jsx";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import useGetJobs from "../../hooks/useGetJobs";

const Jobs = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(6);
  const [activeFilters, setActiveFilters] = useState({
    "Job Type": "",
    "Experience Level": "",
    "Salary Range": "",
  });
  const { allJobs } = useSelector((store) => store.job);
  const { applications } = useSelector((store) => store.application);
  const { user } = useSelector((store) => store.auth);
  const { isLoading } = useGetJobs();

  useEffect(() => {
    // Get search query from URL
    const params = new URLSearchParams(location.search);
    const searchParam = params.get("search");
    if (searchParam) {
      setSearchQuery(decodeURIComponent(searchParam));
    }
  }, [location]);

  const handleFilterChange = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const parseSalary = (salary) => {
    if (!salary) return 0;    
    if (typeof salary === 'number') {
      return salary;
    }
    if (typeof salary === 'string') {
      const numericString = salary.replace(/[^0-9.]/g, '');
      const parsedSalary = parseFloat(numericString);
      if (salary.toLowerCase().includes('l') || salary.toLowerCase().includes('lakh')) {
        return parsedSalary * 100000;
      } 
      return parsedSalary;
    }    
    return 0;
  };

  useEffect(() => {
    if (!allJobs) return;

    // First, filter out applied jobs
    let filtered = allJobs.filter(job => {
      // If user is not logged in or no applications, show all jobs
      if (!user || !applications || applications.length === 0) {
        return true;
      }
      
      // Check if this job is in the user's applications
      const hasApplied = applications.some(app => 
        app && app.job && app.job._id === job._id
      );
      
      // Only include jobs that haven't been applied to
      return !hasApplied;
    });

    // Then apply search filter
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
    
    // Apply other filters
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

    // Shuffle the filtered jobs array for randomized display
    const shuffleJobs = (array) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };
    
    const shuffledJobs = shuffleJobs(filtered);
    setFilteredJobs(shuffledJobs);
    setCurrentPage(1);
  }, [searchQuery, allJobs, activeFilters, user, applications]);

  // Get current jobs for pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // Change page
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(()=>{
    scrollTo(0,0)
  },[])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 mt-12">
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
            <div className="sticky top-24">
              <FilterCard onFilterChange={handleFilterChange} activeFilters={activeFilters} />
            </div>
          </div>

          {/* Jobs Grid */}
          <div className={`${showFilters ? "lg:w-3/4" : "w-full"}`}>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading jobs...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600">
                  {searchQuery || Object.values(activeFilters).some(Boolean)
                    ? "Try adjusting your search terms or filters"
                    : "Check back later for new opportunities"}
                </p>
              </div>
            ) : (
              <>
                <div className={`grid grid-cols-1 md:grid-cols-2 ${!showFilters ? 'lg:grid-cols-3' : ''} gap-6`}>
                  {currentJobs.map((job) => (
                    <div
                      key={job._id}
                      className="transform hover:scale-105 transition-transform duration-200"
                    >
                      <JobCard job={job} />
                    </div>
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex justify-center">
                    <nav className="flex items-center bg-white px-4 py-3 rounded-lg shadow-md">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`mr-2 p-2 rounded-full flex items-center justify-center ${
                          currentPage === 1 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      
                      <div className="flex space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                          <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`w-8 h-8 flex items-center justify-center rounded-full ${
                              currentPage === number
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-blue-50'
                            }`}
                          >
                            {number}
                          </button>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`ml-2 p-2 rounded-full flex items-center justify-center ${
                          currentPage === totalPages
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;