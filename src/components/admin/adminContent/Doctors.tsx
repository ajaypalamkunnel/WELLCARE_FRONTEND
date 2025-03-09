"use client";
import React, { useEffect, useState } from "react";
import DoctorCard from "../ui/Card";
import { fetchAllDoctors } from "@/services/admin/authServices";
import IUser from "@/types/user";
import { ArrowLeft, ArrowRight } from "lucide-react";
import IDoctorProfileDataType from "@/types/doctorFullDataType";
import DoctorDetailsModal from "../ui/DoctorDetailsModalComponent";
import toast from "react-hot-toast";
import { updateDoctorStatus } from "@/services/admin/adminServices";

const DoctorsList: React.FC = () => {
  const [doctors, setDoctors] = useState<IDoctorProfileDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 6;

  //modal state

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] =
    useState<IDoctorProfileDataType | null>(null);

  useEffect(() => {
    const getDoctors = async () => {
      try {
        setLoading(true);

        const response = await fetchAllDoctors();

        const verifiedDoctors = response.data.data.filter(
          (doctor: IDoctorProfileDataType) => {
            return doctor.isVerified;
          }
        );

        setDoctors(verifiedDoctors);
      } catch (error) {
        setError("Failed to fetch doctors");
      } finally {
        setLoading(false);
      }
    };

    getDoctors();
  }, []);

  const totalPages = Math.ceil(doctors.length / doctorsPerPage);
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  //--------------------------------pagination  Handler functions----------------------------
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  //-------------------------------- Handler functions----------------------------
  const handleViewDetails = (_id: string) => {
    const doctor = doctors.find((doc) => doc._id === _id);
    if (doctor) {
      setSelectedDoctor(doctor);
      setIsModalOpen(true);
    }
  };

  //-------------------------------- Handler Block----------------------------

  const handleBlock = async (_id: string, currentStatus: number) => {
    try {
      const newStatus = currentStatus === 1 ? -1 : 1;

      const response = await updateDoctorStatus(_id, newStatus);

      if (response.status === 200) {
        setDoctors((prevDoctors: IDoctorProfileDataType[]) =>
          prevDoctors.map((doc) =>
            doc._id === _id ? { ...doc, status: newStatus } : doc
          )
        );
      } else {
        throw new Error("Failed to update status in API"); // Force error handling
      }

      toast.success(
        `Doctor has been ${
          newStatus === -1 ? "Blocked" : "Unblocked"
        } successfully!`
      );
    } catch (error) {
      console.error("Failed to update doctor status", error);
      setError("Failed to update doctor status");
      toast.error("Error updating doctor status. Please try again.");
    }
  };

  //-------------------------------- Handler modal close----------------------------
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      className="p-6"
      style={{ backgroundColor: "#1b1e27", minHeight: "100vh" }}
    >
      <h2 className="text-2xl font-bold text-white mb-6">Doctors</h2>
      {loading && <p className="text-white">Loading doctors...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="space-y-4">
        {currentDoctors.map((doctor) => (
          <DoctorCard
            key={doctor._id}
            fullName={doctor?.fullName || "NA"}
            specialty={doctor?.specialization || "NA"}
            avatarUrl={doctor?.profileImage}
            phone={doctor?.mobile || "NA"}
            status={doctor.status}
            email={doctor?.email || "NA"}
            onViewDetails={() => handleViewDetails(doctor?._id!)}
            onBlock={() => handleBlock(doctor._id!, doctor.status!)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-4">
          {/* 🔙 Previous Page Button */}
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`p-2 rounded-md ${
              currentPage === 1 ? "bg-gray-600 cursor-not-allowed" : "bg-white"
            }`}
          >
            <ArrowLeft className="w-5 h-5 text-black" />
          </button>

          {/* 🔢 Page Indicator */}
          <span className="text-white text-lg">
            Page {currentPage} of {totalPages}
          </span>

          {/* 🔜 Next Page Button */}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-white"
            }`}
          >
            <ArrowRight className="w-5 h-5 text-black" />
          </button>
        </div>
      )}

      {selectedDoctor && (
        <DoctorDetailsModal
          doctor={selectedDoctor}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default DoctorsList;
