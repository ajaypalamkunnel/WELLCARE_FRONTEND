import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, Typography, Spin } from "antd";
import { fetchServiceRevenue } from "@/services/admin/adminServices";
import { ServiceRevenueDTO } from "@/types/adminDashboardDoctoryAnlyticsDto";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#d0ed57", "#a4de6c"];


const ServiceRevenueChart: React.FC = () => {
    const [data, setData] = useState<ServiceRevenueDTO[]>([]);
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      const loadRevenue = async () => {
        setLoading(true);
        try {
          const result = await fetchServiceRevenue();
          setData(result);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
  
      loadRevenue();
    }, []);
  
    return (
      <Card title="Service-wise Revenue Distribution" style={{ marginTop: 24 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <Spin size="large" />
          </div>
        ) : data.length === 0 ? (
          <Typography.Text type="secondary">No revenue data available.</Typography.Text>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                dataKey="revenue"
                nameKey="serviceName"
                cx="50%"
                cy="50%"
                outerRadius={140}
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `₹ ${value.toLocaleString()}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Card>
    );
  };

export default ServiceRevenueChart