import React, { useEffect, useState } from "react";
import { DoctorAnalyticsSummaryDTO } from "@/types/adminDashboardDoctoryAnlyticsDto";
import { Card, Spin, Table, Statistic, Row, Col } from "antd";
import { fetchDoctorAnalyticsSummary } from "@/services/admin/adminServices";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
const DoctorAnalyticsSummary = () => {
  const [data, setData] = useState<DoctorAnalyticsSummaryDTO[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoading(true);
        const summary = await fetchDoctorAnalyticsSummary();
        setData(summary);
      } catch (error) {
        console.error("Error summary data fetching error:", error);
        toast.error("Doctor summary data fetching error")
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  const aggregated = data.reduce(
    (acc, doc) => {
      acc.revenue += doc.totalRevenue;
      acc.appointments += doc.completedAppointments;
      acc.totalFee += doc.averageFee;
      acc.retentionRateSum += doc.retentionRate;
      return acc;
    },
    { revenue: 0, appointments: 0, totalFee: 0, retentionRateSum: 0 }
  );

  const doctorCount = data.length;

  if(loading){
    <Loader2 size={20} className="animate-spin" />
  }

  return (
    <Spin spinning={loading}>
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={aggregated.revenue}
              prefix="₹"
              precision={2}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Completed Appointments"
              value={aggregated.appointments}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Avg. Consultation Fee"
              value={aggregated.totalFee / doctorCount || 0}
              prefix="₹"
              precision={2}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Avg. Retention Rate"
              value={aggregated.retentionRateSum / doctorCount || 0}
              suffix="%"
              precision={2}
            />
          </Card>
        </Col>
      </Row>

      <Table
        dataSource={data}
        rowKey="doctorId"
        columns={[
          { title: "Doctor Name", dataIndex: "fullName", key: "fullName" },
          {
            title: "Total Revenue",
            dataIndex: "totalRevenue",
            key: "totalRevenue",
            render: (v) => `₹${v.toFixed(2)}`,
          },
          {
            title: "Completed Appointments",
            dataIndex: "completedAppointments",
            key: "completedAppointments",
          },
          {
            title: "Avg. Fee",
            dataIndex: "averageFee",
            key: "averageFee",
            render: (v) => `₹${v.toFixed(2)}`,
          },
          {
            title: "Retention Rate",
            dataIndex: "retentionRate",
            key: "retentionRate",
            render: (v) => `${v.toFixed(2)}%`,
          },
        ]}
        pagination={{ pageSize: 5 }}
        bordered
      />
    </Spin>
  );
};

export default DoctorAnalyticsSummary;
