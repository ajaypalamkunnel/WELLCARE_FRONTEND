"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import dayjs from "dayjs";
import { getTopServices } from "@/services/doctor/doctorService";
import { TopServiceData } from "@/types/dashboardDto";

const COLORS = [
  "#03045e",
  "#0077b6",
  "#00b4d8",
  "#90e0ef",
  "#caf0f8",
  "#ade8f4",
];

const TopServicesChart = () => {
  const [data, setData] = useState<TopServiceData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 🔽 Filter states
  const [startDate, setStartDate] = useState<string>(
    dayjs().subtract(6, "day").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [interval, setInterval] = useState<"day" | "week" | "month">("day");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getTopServices(startDate, endDate, interval);
      // Format for Pie Chart
      
      
      const chartData = response.map((item: TopServiceData) => ({
        name: item.serviceName,
        value: item.totalAppointments, // OR item.totalRevenue depending on your goal
      }));

      
      setData(chartData);
    } catch (error) {
        console.log("Top service data fetching error: ",error)
    }finally{
        setLoading(false)
    }
  },[startDate, endDate, interval])

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleClear = () => {
    const defaultStart = dayjs().subtract(6, "day").format("YYYY-MM-DD");
    const defaultEnd = dayjs().format("YYYY-MM-DD");

    setStartDate(defaultStart);
    setEndDate(defaultEnd);
    setInterval("day");
    fetchData();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full mt-8">
      <h2 className="text-xl font-semibold text-[#03045e] mb-4">
        📈 Top Services by Appointments
      </h2>

      {/* 🔍 Filter Section */}
      <form
        onSubmit={handleFilter}
        className="flex flex-wrap gap-4 mb-6 items-end"
      >
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Start Date
          </label>
          <input
            type="date"
            className="border border-gray-300 px-3 py-2 rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            End Date
          </label>
          <input
            type="date"
            className="border border-gray-300 px-3 py-2 rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Interval
          </label>
          <select
            className="border border-gray-300 px-3 py-2 rounded"
            value={interval}
            onChange={(e) =>
              setInterval(e.target.value as "day" | "week" | "month")
            }
          >
            <option value="day">Daily</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-[#03045e] text-white px-4 py-2 rounded hover:bg-blue-900"
        >
          Apply Filter
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="text-[#03045e] border border-[#03045e] px-4 py-2 rounded hover:bg-[#03045e] hover:text-white"
        >
          Clear Filter
        </button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p>No service data available for selected range.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              fill="#8884d8"
              label
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TopServicesChart;
