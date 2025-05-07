import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { DatePicker, Select, Button } from "antd";
import dayjs from "dayjs";
import { RevenueDoctorTrendDTO } from "@/types/adminDashboardDoctoryAnlyticsDto";
import { fetchDoctorRevenueTrend } from "@/services/admin/adminServices";
import { Loader2 } from "lucide-react";

const { RangePicker } = DatePicker;
const { Option } = Select;

const DoctorRevenueTrendChart = () => {
  const [trendData, setTrendData] = useState<RevenueDoctorTrendDTO[]>([]);
  const [interval, setInterval] = useState<"day" | "month">("day");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, "day"),
    dayjs(),
  ]);

  const fetchData = async () => {
    try {
      const data = await fetchDoctorRevenueTrend(
        dateRange[0].toISOString(),
        dateRange[1].toISOString(),
        interval
      );
      setTrendData(data);
    } catch (error) {
      console.error("Failed to load revenue trend data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const groupedData: Record<string, Record<string, number>> = {};
  trendData.forEach((item) => {
    if (!groupedData[item.label]) groupedData[item.label] = {};
    groupedData[item.label][item.fullName] = item.revenue;
  });

  const chartData = Object.entries(groupedData).map(([label, doctors]) => ({
    label,
    ...doctors,
  }));

  const doctorNames = Array.from(
    new Set(trendData.map((item) => item.fullName))
  );

  return (
    <div>
      <div
        className="filters"
        style={{ marginBottom: 20, display: "flex", gap: 10 }}
      >
        <RangePicker
          value={dateRange}
          onChange={(range) => {
            if (range && range[0] && range[1]) {
              setDateRange([range[0], range[1]]);
            }
          }}
        />
        <Select
          value={interval}
          onChange={(val) => setInterval(val)}
          style={{ width: 120 }}
        >
          <Option value="day">Day</Option>
          <Option value="month">Month</Option>
        </Select>
        <Button type="primary" onClick={fetchData}>
          Apply
        </Button>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          {doctorNames.map((name) => (
            <Line
              key={name}
              type="monotone"
              dataKey={name}
              stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DoctorRevenueTrendChart;
