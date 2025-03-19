import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "../ui/button";
import { Briefcase, Code, PenTool, Database, Brain, Cpu } from "lucide-react";

const categories = [
  { name: "Web Development", icon: Code },
  { name: "UI/UX Design", icon: PenTool },
  { name: "Data Science", icon: Database },
  { name: "Machine Learning", icon: Brain },
  { name: "AI", icon: Cpu },
  { name: "Business", icon: Briefcase },
];

const CategoryCarousel = () => {
  return (
    <div className="py-4">
      <Carousel className="w-full max-w-5xl mx-auto">
        <CarouselContent className="-ml-2 md:-ml-4">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/3 lg:basis-1/4">
                <div className="p-1">
                  <Button
                    variant="outline"
                    className="w-full h-24 flex flex-col items-center justify-center gap-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-300"
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{category.name}</span>
                  </Button>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-12" />
        <CarouselNext className="hidden md:flex -right-12" />
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;
