import React from "react";
import { Button } from "../ui/button";
import { Search, ChevronDown } from "lucide-react";

const HeroSection = () => {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 overflow-hidden">
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-200 rounded-full opacity-20" />
      <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-96 h-96 bg-indigo-200 rounded-full opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
            No. 1 Job Hunt Website
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            Search, Apply & Get Your{" "}<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Dream Job
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600">
            Find your next career opportunity with our powerful job search platform. Thousands of companies are hiring today!
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="flex items-center bg-white rounded-full shadow-xl p-2">
              <input
                type="text"
                placeholder="Search jobs by title, company, or keywords..."
                className="flex-1 px-6 py-3 text-gray-900 placeholder-gray-500 focus:outline-none"
              />
              <Button size="lg" className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-600">
              <span>Popular:</span>
              <div className="flex gap-2">
                {["Remote", "Full-Time", "Tech", "Marketing"].map((tag) => (
                  <button
                    key={tag}
                    className="px-3 py-1 rounded-full bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Animation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer" onClick={scrollToContent}>
        <div className="flex flex-col items-center text-gray-600">
          <span className="text-sm mb-2">Scroll Down</span>
          <ChevronDown className="h-6 w-6 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
