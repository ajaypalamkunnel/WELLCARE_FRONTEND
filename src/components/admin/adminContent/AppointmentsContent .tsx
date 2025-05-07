import React from "react";
import DoctorAnalyticsSummary from "../doctorAnalytics/DoctorAnalyticsSummary";
import DoctorRevenueTrendChart from "../doctorAnalytics/DoctorRevenueTrendChart";
import ServiceRevenueChart from "../doctorAnalytics/ServiceRevenueChart";
import TopDoctorsAnalytics from "../doctorAnalytics/TopDoctorsAnalytics";

const AppointmentsContent = () => {
  return (
    <>
      <div className="px-6 py-4">
        <h2 className="text-xl font-semibold mb-4">
          Doctor Performance Summary
        </h2>
        <DoctorAnalyticsSummary />
      <DoctorRevenueTrendChart/>
      <ServiceRevenueChart/>
      <TopDoctorsAnalytics/>
      </div>
    </>
  );
};

export default AppointmentsContent;
