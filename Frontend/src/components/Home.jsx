import React from "react";
import Navbar from "./shared/Navbar.jsx";
import HeroSection from "./HeroSection.jsx";
import CategoryCarousel from "./CategoryCarousel.jsx";
import LatestJobs from "./LatestJobs";
import Footer from "./shared/Footer.jsx";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <HeroSection />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-16">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by Category</h2>
              <CategoryCarousel />
            </section>
            <section>
              <LatestJobs />
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
