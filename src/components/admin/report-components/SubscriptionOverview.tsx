"use client";

import { fetchSubscriptionOverview } from "@/services/admin/adminServices";
import { SubscriptionOverviewDTO } from "@/types/adminReportDto";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
const PRIMARY_COLOR = "#1e222d";

const SubscriptionOverview: React.FC = () => {
  const [overview, setOverview] = useState<SubscriptionOverviewDTO | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const data = await fetchSubscriptionOverview();
        console.log("==>",data);
        
        setOverview(data);
      } catch (error) {
        console.error("Failed to load overview data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, []);
  return (
    <div className="bg-white shadow rounded-lg p-6 w-full">
      <h2 className="text-xl font-semibold text-[#1e222d] mb-6">
        📊 Subscription Overview
      </h2>

      {loading ? (
         <Loader2 size={20} className="animate-spin" />
      ) : !overview ? (
        <p className="text-red-500">Failed to load data.</p>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            <div className="bg-[#1e222d] text-white p-6 rounded-lg shadow-md">
              <p className="text-sm mb-2">Total Subscription Revenue</p>
              <h3 className="text-2xl font-bold">
                ₹{overview.totalRevenue.toLocaleString()}
              </h3>
            </div>

            <div className="bg-[#1e222d] text-white p-6 rounded-lg shadow-md">
              <p className="text-sm mb-2">Active Subscriptions</p>
              <h3 className="text-2xl font-bold">
                {overview.activeSubscriptions}
              </h3>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="text-md font-semibold text-[#1e222d] mb-4">
              Top Plans Distribution
            </h4>
            {overview.topPlans.length === 0 ? (
              <p className="text-gray-500">No top plan data available.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={overview.topPlans}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="planName" />
                  <Tooltip />
                  <Bar dataKey="subscriptionCount" fill={PRIMARY_COLOR}>
                    {overview.topPlans.map((_, idx) => (
                      <Cell key={`bar-${idx}`} fill={PRIMARY_COLOR} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SubscriptionOverview;
