"use client";
import React, { useEffect, useState } from "react";
import DoctorCard from "../ui/Card";
import { fetchAllDoctors } from "@/services/admin/authServices";
import IUser from "@/types/user";

// Sample data array of doctors
// const doctors = [
//   {
//     id: 1,
//     name: 'Dr. Sarah Wilson',
//     specialty: 'Cardiology',
//     phone: '+1 (555) 123-4567',
//     email: 'sarah.wilson@example.com'
//   },
//   {
//     id: 2,
//     name: 'Dr. James Rodriguez',
//     specialty: 'Neurology',
//     phone: '+1 (555) 987-6543',
//     email: 'james.rodriguez@example.com'
//   },
//   {
//     id: 3,
//     name: 'Dr. Emily Chen',
//     specialty: 'Pediatrics',
//     phone: '+1 (555) 456-7890',
//     email: 'emily.chen@example.com'
//   }
// ];

const DoctorsList: React.FC = () => {
  const [doctors, setDoctors] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getDoctors = async () => {
      try {
        setLoading(true);

        const response = await fetchAllDoctors();

        setDoctors(response.data.data);
      } catch (error) {
        setError("Failed to fetch doctors");
      } finally {
        setLoading(false);
      }
    };

    getDoctors();
  }, []);

  // Handler functions
  const handleViewDetails = (_id: string) => {
    console.log(`Viewing details for doctor with ID: ${_id}`);
    // Add your logic to view doctor details
  };

  const handleBlock = (_id: string) => {
    console.log(`Blocking doctor with ID: ${_id}`);
    // Add your logic to block a doctor
  };

  return (
    <div
      className="p-6"
      style={{ backgroundColor: "#1b1e27", minHeight: "100vh" }}
    >
      <h2 className="text-2xl font-bold text-white mb-6">Doctors</h2>

      <div className="space-y-4">
        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor._id}
            fullName={doctor?.fullName || "NA"}
            specialty={doctor?.specialization || "NA"}
            phone={doctor?.mobile || "NA"}
            email={doctor?.email||"NA"}
            onViewDetails={() => handleViewDetails(doctor?._id!)}
            onBlock={() => handleBlock(doctor._id!)}
          />
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
