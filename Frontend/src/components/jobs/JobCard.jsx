import React from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { MapPin, Briefcase, Building2, Clock } from "lucide-react";

const JobCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Senior Frontend Developer
            </h3>
            <div className="flex items-center gap-2 text-gray-600">
              <Building2 className="h-4 w-4" />
              <span className="text-sm">Tech Corp</span>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
            Full Time
          </Badge>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">Bangalore, India</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Briefcase className="h-4 w-4" />
            <span className="text-sm">5+ years experience</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Posted 2 days ago</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant="outline" className="bg-gray-50 text-gray-700">
            React
          </Badge>
          <Badge variant="outline" className="bg-gray-50 text-gray-700">
            TypeScript
          </Badge>
          <Badge variant="outline" className="bg-gray-50 text-gray-700">
            Node.js
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-blue-600">₹12L - ₹15L</div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-all duration-200">
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;