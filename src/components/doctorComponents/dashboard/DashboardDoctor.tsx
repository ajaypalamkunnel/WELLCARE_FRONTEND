

import React from 'react'
import AppointmentSummaryChart from './chartComponent/AppointmentSummaryChart ';
import AppointmentTrendChart from './chartComponent/AppointmentTrendChart';
import RevenueTrendChart from './chartComponent/RevenueTrendChart';
import TopServicesChart from './chartComponent/TopServicesChart';
import ReportGenerator from './chartComponent/ReportGenerator';

const DashboardDoctor = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#03045e] mb-4">Doctor Dashboard</h1>
      <div className="flex flex-wrap gap-4">
        <AppointmentSummaryChart />
        <TopServicesChart/>
        <RevenueTrendChart/>
        <AppointmentTrendChart/>
        <ReportGenerator/>
      </div>
    </div>
  );
}

export default DashboardDoctor