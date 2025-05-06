"use client"

import { generateDoctorReport } from '@/services/doctor/doctorService';
import dayjs from 'dayjs';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const ReportGenerator = () => {

    const [startDate, setStartDate] = useState(dayjs().subtract(6, "day").format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));
    const [format, setFormat] = useState<"pdf" | "excel">("pdf");
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);


    const handleGenerateReport = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          setLoading(true);
          const response = await generateDoctorReport(startDate, endDate, format);
          setDownloadUrl(response.downloadUrl);
        } catch (error) {
            toast.error("Failed to generate report")
          console.error("Failed to generate report", error);
        } finally {
          setLoading(false);
        }
      };


      const handleClear = () => {
        setStartDate(dayjs().subtract(6, "day").format("YYYY-MM-DD"));
        setEndDate(dayjs().format("YYYY-MM-DD"));
        setFormat("pdf");
        setDownloadUrl(null);
      };



      return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full mt-8">
          <h2 className="text-xl font-semibold text-[#03045e] mb-4">📝 Generate Report</h2>
    
          <form onSubmit={handleGenerateReport} className="flex flex-wrap gap-4 items-end mb-4">
            <div>
              <label className="text-sm text-gray-700 block mb-1">Start Date</label>
              <input
                type="date"
                className="border border-gray-300 px-3 py-2 rounded"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
    
            <div>
              <label className="text-sm text-gray-700 block mb-1">End Date</label>
              <input
                type="date"
                className="border border-gray-300 px-3 py-2 rounded"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
    
            <div>
              <label className="text-sm text-gray-700 block mb-1">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as "pdf" | "excel")}
                className="border border-gray-300 px-3 py-2 rounded"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
              </select>
            </div>
    
            <button
              type="submit"
              className="bg-[#03045e] text-white px-4 py-2 rounded hover:bg-blue-900"
            >
              {loading ? <Loader2 size={24} className="animate-spin"/> : "Generate Report"}
            </button>
    
            <button
              type="button"
              onClick={handleClear}
              className="text-[#03045e] border border-[#03045e] px-4 py-2 rounded hover:bg-[#03045e] hover:text-white"
            >
              Clear
            </button>
          </form>
    
          {downloadUrl && (
            <div className="mt-4">
              <p className="text-green-700 font-medium mb-2">✅ Report ready for download:</p>
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline"
              >
                Click here to download your report
              </a>
            </div>
          )}
        </div>
      );
}

export default ReportGenerator