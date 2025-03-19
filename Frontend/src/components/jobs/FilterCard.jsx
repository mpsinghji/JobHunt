import React from "react";
import { RadioGroup } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { SlidersHorizontal } from "lucide-react";

const FilterData = [
  {
    type: "Job Type",
    options: ["Full Time", "Part Time", "Contract", "Internship"],
  },
  {
    type: "Experience Level",
    options: ["Entry Level", "Mid Level", "Senior Level", "Lead"],
  },
  {
    type: "Salary Range",
    options: ["₹0 - ₹5L", "₹5L - ₹10L", "₹10L - ₹20L", "₹20L+"],
  },
  {
    type: "Location",
    options: ["Remote", "On-site", "Hybrid", "Any"],
  },
];

const FilterCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <SlidersHorizontal className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
      </div>
      <div className="space-y-6">
        {FilterData.map((filter, index) => (
          <div key={index} className="border-b border-gray-100 pb-6 last:border-0">
            <h3 className="text-sm font-medium text-gray-700 mb-3">{filter.type}</h3>
            <RadioGroup className="space-y-2">
              {filter.options.map((option, itemIndex) => (
                <div key={itemIndex} className="flex items-center space-x-2">
                  <Input
                    type="radio"
                    name={filter.type.toLowerCase().replace(" ", "-")}
                    value={option.toLowerCase().replace(" ", "-")}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <Label className="text-sm text-gray-600 cursor-pointer hover:text-blue-600 transition-colors duration-200">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterCard;
