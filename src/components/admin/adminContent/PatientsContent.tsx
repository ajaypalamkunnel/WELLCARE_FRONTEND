import React, { useEffect, useState } from "react";
import DoctorCard from "../ui/Card";
import IUser from "@/types/user";
import toast from "react-hot-toast";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import {
  fetchAllPatients,
  updateUserStatus,
} from "@/services/admin/adminServices";
import useDebounce from "@/hooks/useDebounce";
import PatientDetailsModal from "./PatientDetailsModal";

const PatientsContent = () => {
  const [patients, setPatients] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<IUser | null>(null);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  useEffect(() => {
    const getPatients = async () => {
      try {
        setLoading(true);
        const response = await fetchAllPatients(
          currentPage,
          6,
          debouncedSearchTerm
        );
        console.log(response);

        setPatients(response?.data.users);
        setTotalPages(response.data.totalPages || 0);
      } catch (error) {
        console.error("Error fetching patients:", error);
        setError("Failed to fetch patients");
        toast.error("Failed to load patients. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    getPatients();
  }, [currentPage, debouncedSearchTerm]);

  const handleViewDetails = (patient: IUser) => {
    setSelectedPatient(patient);
    setIsPatientModalOpen(true);
  };

  //--------------------------------pagination Handler functions----------------------------
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

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleBlock = async (_id: string, currentStatus: number) => {
    try {
      const newStatus = currentStatus === 1 ? -1 : 1;

      const response = await updateUserStatus(_id, newStatus);

      if (response.status === 200) {
        setPatients((prevPatients) =>
          prevPatients.map((patient) =>
            patient._id === _id ? { ...patient, status: newStatus } : patient
          )
        );
        toast.success(
          `Patient has been ${
            newStatus === -1 ? "Blocked" : "Unblocked"
          } successfully!`
        );
      } else {
        throw new Error("Failed to update status in API");
      }
    } catch (error) {
      console.error("Failed to update patient status", error);
      toast.error("Error updating patient status. Please try again.");
    }
  };

  return (
    <div
      className="p-6"
      style={{ backgroundColor: "#1b1e27", minHeight: "100vh" }}
    >
      <h2 className="text-2xl font-bold text-white mb-6">Patients</h2>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search by doctor name..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-4 py-2 pl-10 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
      </div>

      {!loading && !error && patients.length === 0 && (
        <p className="text-center text-white text-lg mt-4">No results found.</p>
      )}
      {error && <p className="text-red-500">{error}</p>}
      <div className="space-y-4">
        {patients.map((patient) => (
          <DoctorCard
            key={patient._id}
            fullName={patient?.fullName || "NA"}
            email={patient?.email || "NA"}
            avatarUrl={patient?.profileUrl}
            phone={patient?.mobile || "NA"}
            status={patient?.status}
            onBlock={() => handleBlock(patient._id!, patient.status!)}
            onViewDetails={() => handleViewDetails(patient)}
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

      {selectedPatient && (
        <PatientDetailsModal
          isOpen={isPatientModalOpen}
          patient={selectedPatient}
          onClose={() => setIsPatientModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PatientsContent;
