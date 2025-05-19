"use client";

"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import dayjs from "dayjs";
import { getRevenueTrend } from "@/services/doctor/doctorService";
import { RevenueTrendData } from "@/types/dashboardDto";

const RevenueTrendChart = () => {
  const [data, setData] = useState<RevenueTrendData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [startDate, setStartDate] = useState<string>(
    dayjs().subtract(6, "day").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [interval, setInterval] = useState<"day" | "week" | "month">("day");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const revenue = await getRevenueTrend(startDate, endDate, interval);

      setData(revenue);
    } catch (error) {
      console.error("Revenue trend fetch error", error)
    } finally {
      setLoading(false);
    }
  },[startDate,endDate,interval]);

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
        💰 Revenue Trend
      </h2>

      {/* 🆕 Filters */}
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
        <p>No revenue data for selected period.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalRevenue" fill="#00b4d8" name="Total Revenue" />
            <Bar dataKey="count" fill="#03045e" name="Appointments" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default RevenueTrendChart;
