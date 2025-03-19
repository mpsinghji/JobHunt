import React, { useState } from "react";
import JobCard from "./JobCard.jsx";
import FilterCard from "./FilterCard.jsx";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import { Search, SlidersHorizontal } from "lucide-react";
import Navbar from "../shared/Navbar.jsx";

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        {/* <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search jobs..."
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
        </div> */}

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6].map((job) => (
                <div key={job} className="transform hover:scale-105 transition-transform duration-200">
                  <JobCard />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
