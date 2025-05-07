import React, { useEffect, useState } from "react";

import { TopDoctorDTO } from "@/types/adminDashboardDoctoryAnlyticsDto";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";
import { Table, Card, Spin } from "antd";
import { fetchTopPerformingDoctors } from "@/services/admin/adminServices";



const TopDoctorsAnalytics = () => {
    const [data, setData] = useState<TopDoctorDTO[]>([]);
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      const loadTopDoctors = async () => {
        try {
          setLoading(true);
          const result = await fetchTopPerformingDoctors();
          setData(result);
        } catch (error) {
          console.error("Failed to fetch top doctors", error);
        } finally {
          setLoading(false);
        }
      };
  
      loadTopDoctors();
    }, []);
  
    const tableColumns = [
      { title: "Doctor Name", dataIndex: "fullName", key: "fullName" },
      { title: "Total Revenue (₹)", dataIndex: "totalRevenue", key: "totalRevenue" },
      { title: "Appointment Count", dataIndex: "appointmentCount", key: "appointmentCount" },
    ];
  
    return (
      <div className="mt-5">
        <Card title="Top Performing Doctors - Chart" style={{ marginBottom: 24 }}>
          {loading ? (
            <Spin />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="fullName" type="category" />
                <Tooltip />
                <Bar dataKey="totalRevenue" fill="#4CAF50" name="Total Revenue">
                  <LabelList dataKey="totalRevenue" position="right" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
  
        <Card title="Top Performing 10 Doctors">
          <Table
            columns={tableColumns}
            dataSource={data}
            rowKey="doctorId"
            loading={loading}
            pagination={false}
          />
        </Card>
      </div>
    );
  };
  
  export default TopDoctorsAnalytics;