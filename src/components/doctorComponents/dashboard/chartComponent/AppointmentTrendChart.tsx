"use client";

import { getAppointmentTrend } from "@/services/doctor/doctorService";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";


const COLORS = {
    booked: "#00b4d8",
    completed: "#03045e",
    cancelled: "#f94144",
  };

  
  const AppointmentTrendChart = () => {

    const [data,setData] = useState<[]>([])
    const [loading, setLoading] = useState<boolean>(true);

     const [startDate, setStartDate] = useState<string>(
        dayjs().subtract(6, "day").format("YYYY-MM-DD")
      );
      const [endDate, setEndDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [interval, setInterval] = useState<"day" | "week" | "month">("day");


    const fetchData = useCallback(async () =>{
        if(!startDate || !endDate)return

        try {

            setLoading(true)
            const trend = await getAppointmentTrend(startDate, endDate, interval);
            setData(trend);
            
        } catch (error) {
            toast.error("Trend fetch failed")
            console.error("Trend fetch failed", error);
        }finally {
            setLoading(false);
        }

    },[startDate,endDate,interval])

    useEffect(()=>{
        fetchData()
    },[fetchData])


    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        fetchData();
      };
    
      const handleClear = () => {
        setStartDate("");
        setEndDate("");
        setInterval("day");
        setData([]);
      };
    
 

      return (
        <div className="bg-white p-4 rounded-lg shadow-md w-full mt-8 md:w-1/2">
          <h2 className="text-xl font-semibold text-[#03045e] mb-4">
            Appointment Trend
          </h2>
    
          {/* 🆕 Date Range + Interval Filter */}
          <form onSubmit={handleFilter} className="flex flex-wrap gap-4 mb-6 items-end">
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1">
                Start Date
              </label>
              <input
                type="date"
                className="border border-gray-300 rounded px-3 py-2"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
    
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1">
                End Date
              </label>
              <input
                type="date"
                className="border border-gray-300 rounded px-3 py-2"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
    
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1">
                Interval
              </label>
              <select
                value={interval}
                onChange={(e) => setInterval(e.target.value as "day" | "week" | "month")}
                className="border border-gray-300 rounded px-3 py-2"
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
    
            {/* 🆕 Clear Button */}
            <button
              type="button"
              onClick={handleClear}
              className="text-[#03045e] border border-[#03045e] px-4 py-2 rounded hover:bg-[#03045e] hover:text-white"
            >
              Clear Filter
            </button>
          </form>
    
          {loading ? (
            <p>Loading trend...</p>
          ) : data.length === 0 ? (
            <p>No data available for selected range</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateLabel" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="booked"
                  stroke={COLORS.booked}
                  fill={COLORS.booked}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke={COLORS.completed}
                  fill={COLORS.completed}
                />
                <Area
                  type="monotone"
                  dataKey="cancelled"
                  stroke={COLORS.cancelled}
                  fill={COLORS.cancelled}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      );
  }
  
  export default AppointmentTrendChart