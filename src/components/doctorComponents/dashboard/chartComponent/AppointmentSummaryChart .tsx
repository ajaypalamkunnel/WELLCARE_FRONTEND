"use client";

import { getAppointmentSummary } from "@/services/doctor/doctorService";
import { Loader2 } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#03045e", "#00b4d8", "#90e0ef", "#caf0f8", "#0077b6"];
const AppointmentSummaryChart = () => {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");


  const fetchSummary = useCallback(async ()=>{
    try {

        const summary = await getAppointmentSummary(
            startDate || undefined,
            endDate || undefined
        )

        const chartData = [
            { name: "Booked", value: summary.booked },
            { name: "Completed", value: summary.completed },
            { name: "Cancelled", value: summary.cancelled },
            { name: "Pending", value: summary.pending },
          ];
          setData(chartData);
        
    } catch (err) {
        console.error("Chart data error", err);
    }finally {
        setLoading(false);
      }
},[startDate,endDate])

  useEffect(()=>{
   fetchSummary()
  },[fetchSummary])


  const handleFilter = (e:React.FormEvent) =>{
    e.preventDefault();
    fetchSummary()

    
  }

  const handleClear = ()=>{
    setStartDate("")
    setEndDate("")
    fetchSummary()

  }

  if(loading) return  <Loader2 size={24} className="animate-spin" />

  return (
    <div className="bg-white p-4 rounded-lg shadow-md  w-full md:w-1/2">
      <h2 className="text-xl font-semibold text-[#03045e] mb-4">Appointment Summary</h2>

    <form 
    onSubmit={handleFilter}
        className="flex flex-wrap gap-4 mb-4 items-end"
    >
        <div>
          <label className="block text-sm text-gray-700 font-medium mb-1">
            Start Date
          </label>
          <input
            type="date"
            className="border border-gray-300 rounded px-3 py-2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
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
          />
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

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AppointmentSummaryChart;
