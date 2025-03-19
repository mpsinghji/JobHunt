import React from "react";
import { Badge } from "./ui/badge";
import { Building2, MapPin, Clock, DollarSign } from "lucide-react";

const LatestJobCards = () => {
  return (
    <div className="group p-6 rounded-xl shadow-sm hover:shadow-md bg-white border border-gray-100 transition-all duration-300 hover:border-blue-100 cursor-pointer">
      <div className="space-y-4">
        {/* Company Info */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                Company Name
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>Bangalore, India</span>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
            New
          </Badge>
        </div>

        {/* Job Info */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Senior Frontend Developer
          </h2>
          <p className="text-gray-600 text-sm line-clamp-2">
            We are looking for an experienced Frontend Developer to join our team. You will be responsible for building the client-side of our web applications.
          </p>
        </div>

        {/* Job Meta */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Full Time
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            24-30 LPA
          </Badge>
          <Badge variant="outline">React</Badge>
          <Badge variant="outline">TypeScript</Badge>
        </div>
      </div>
    </div>
  );
};

export default LatestJobCards;
