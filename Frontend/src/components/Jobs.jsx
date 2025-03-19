import React from "react";
import FilterCard from "./FilterCard.jsx";
import JobCard from "./JobCard";
import Navbar from "./shared/Navbar";

const JobArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const Jobs = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5">
        <div className="flex gap-5">
          <div className="w-[20%]">
            <FilterCard />
          </div>
          {JobArray.length <= 0 ? (
            <span>Job not found</span>
          ) : (
            <div className="flex-1  h-[88vh] overflow-y-auto pb-5">
              <div className="grid grid-cols-3 gap-4">
                {JobArray.map((item, index) => (
                  <div>
                    <JobCard />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>


    </div>
  );
};

export default Jobs;
