import { fetchPlanDistribution } from "@/services/admin/adminServices";
import { PlanDistributionDTO } from "@/types/adminReportDto";
import { Asap } from "next/font/google";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DatePicker, Button } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#00C49F",
  "#1e222d",
];

const PlanDistributionChart = () => {
  const [data, setData] = useState<PlanDistributionDTO[]>([]);
  const [startDate, setStartDate] = useState<Dayjs >(dayjs().subtract(30,"days"));
const [endDate, setEndDate] = useState<Dayjs>(dayjs());

  const loadData = async () => {
    try {
      const result = await fetchPlanDistribution(startDate.toString(), endDate.toString());

      setData(result);
    } catch (error) {
      toast.error("Plan distribution fetching error");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFilter = () => {
    loadData();
  };

  return (
    <div className="bg-[#1e222d] p-6 rounded-md shadow-md text-white mt-5">
      <h2 className="text-xl font-semibold mb-4">Plan Distribution</h2>

      <div className="flex items-center gap-4 mb-4">
  <div>
    <label className="block text-sm mb-1">Start Date</label>
    <DatePicker
      value={startDate}
      onChange={(date) => setStartDate(date)}
      className="bg-white rounded"
      allowClear
    />
  </div>
  <div>
    <label className="block text-sm mb-1">End Date</label>
    <DatePicker
      value={endDate}
      onChange={(date) => setEndDate(date)}
      className="bg-white rounded"
      allowClear
    />
  </div>
  <Button onClick={handleFilter} type="primary" className="bg-white text-[#1e222d]">
    Filter
  </Button>
</div>


      <div className="h-80 w-full">
        {data.length > 0 ? (
          <ResponsiveContainer>
            <PieChart>
              <Pie
                dataKey="subscriptionCount"
                nameKey="planName"
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data.map((entry, index) => (
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
        ) : (
          <p className="text-center mt-10 text-gray-400">No data to display</p>
        )}
      </div>
    </div>
  );
};

export default PlanDistributionChart;
