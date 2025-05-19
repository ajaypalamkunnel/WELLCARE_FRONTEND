import { fetchRevenueTrend } from "@/services/admin/adminServices";
import { RevenueTrendDTO } from "@/types/adminReportDto";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

const RevenueTrendChart = () => {
  const [data, setData] = useState<RevenueTrendDTO[]>([]);
  const [startDate, setStartDate] = useState<Dayjs>(() =>
    dayjs().subtract(7, "day")
  );

  const [endDate, setEndDate] = useState<Dayjs>(() => dayjs());
  const [interval, setInterval] = useState<"day" | "week" | "month">("day");
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const trendData = await fetchRevenueTrend(
        startDate.format("YYYY-MM-DD"),
        endDate.format("YYYY-MM-DD"),
        interval
      );
      setData(trendData);
    } catch (error) {
      console.log("failed to fetch revenue data",error);
      toast.error("failed to fetch revenue data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [startDate, endDate, interval]);

  return (
    <div className="bg-[#1e222d] text-white p-6 rounded-lg shadow-md w-full mt-5">
      <h2 className="text-xl font-semibold text-white mb-6">
        📊 Revenue Distribution
      </h2>
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div>
          <label className="block mb-1 text-sm">Start Date</label>
          <DatePicker
            value={startDate}
            onChange={(date) => date && setStartDate(date)}
            className="bg-white rounded"
            allowClear
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">End Date</label>
          <DatePicker
            value={endDate}
            onChange={(date) => date && setEndDate(date)}
            className="bg-white rounded"
            allowClear
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">Interval</label>
          <select
            value={interval}
            onChange={(e) =>
              setInterval(e.target.value as "day" | "week" | "month")
            }
            className="bg-gray-800 text-white border border-gray-600 p-2 rounded"
          >
            <option value="day">Daily</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-300">Loading...</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="label" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#2c2f36",
                border: "1px solid #444",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalRevenue"
              stroke="#00d09c"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Total Revenue"
            />
            <Line
              type="monotone"
              dataKey="transactionCount"
              stroke="#f5a623"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Transactions"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default RevenueTrendChart;
