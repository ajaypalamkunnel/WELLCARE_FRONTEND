import { downloadSubscriptionReport } from "@/services/admin/adminServices";
import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";

const SubscriptionReportDownload = () => {
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().subtract(7, "day"));
  const [endDate, setEndDate] = useState<Dayjs>(dayjs());
  const [format, setFormat] = useState<"pdf" | "excel">("pdf");
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!startDate || !endDate || !format)
      return alert("All fields are required");

    try {
      setLoading(true);
      const response = await downloadSubscriptionReport(
        startDate.format("YYYY-MM-DD"),
        endDate.format("YYYY-MM-DD"),
        format
      );
      const downloadUrl = response.downloadUrl;
      if (!downloadUrl) {
        throw new Error("No download URL found");
      }
      const fileResponse = await fetch(downloadUrl);
      const blob = await fileResponse.blob();

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = `subscription_report.${
        format === "excel" ? "xlsx" : "pdf"
      }`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      toast.error("Failed to download report");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-[#1e222d] p-6 rounded-md shadow-md text-white max-w-2xl mx-auto mt-5">
      <h2 className="text-xl font-semibold mb-4">
        Download Subscription Report
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm mb-1">Start Date</label>
          <DatePicker
            value={startDate}
            onChange={(date) => date && setStartDate(date)}
            className="w-full"
            format="YYYY-MM-DD"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">End Date</label>
          <DatePicker
            value={endDate}
            onChange={(date) => date && setEndDate(date)}
            className="w-full"
            format="YYYY-MM-DD"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">File Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as "pdf" | "excel")}
            className="text-black px-3 py-2 rounded w-full"
          >
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleDownload}
        disabled={loading}
        className="bg-white text-[#1e222d] px-6 py-2 rounded hover:bg-gray-200 transition"
      >
        {loading ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          "Download Report"
        )}
      </button>
    </div>
  );
};

export default SubscriptionReportDownload;
