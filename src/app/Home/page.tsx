import DepartmentSection from "@/components/homeComponents/DepartmentSection";
import Footer from "@/components/homeComponents/Footer";
import Header from "@/components/homeComponents/Header";
import MainBanner1 from "@/components/homeComponents/MainBanner1";
import MainBanner3 from "@/components/homeComponents/MainBanner3";
import MainBanner5 from "@/components/homeComponents/MainBanner5";
import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-20">
        {" "}
        {/* Add padding-top to account for fixed header */}
        <MainBanner1 />
        <DepartmentSection />
        <MainBanner3 />
        <MainBanner5 />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
