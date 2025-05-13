"use client";
import React, { useEffect, useState } from "react";
import DoctorCard from "../ui/Card";
import { fetchAllDoctors } from "@/services/admin/authServices";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import IDoctorProfileDataType from "@/types/doctorFullDataType";
import DoctorDetailsModal from "../ui/DoctorDetailsModalComponent";
import toast from "react-hot-toast";
import {
  featchAllDepartments,
  updateDoctorStatus,
} from "@/services/admin/adminServices";

const DoctorsList: React.FC = () => {
  const [doctors, setDoctors] = useState<IDoctorProfileDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const doctorsPerPage = 6;
  const [searchTerm, setSearchTerm] = useState("");

  //fiter states
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isVerified, setIsVerified] = useState("");
  const [status, setStatus] = useState("");
  const [availability, setAvailability] = useState<string[]>([]);
  const [isSubscribed, setIsSubscribed] = useState("");
  const [minExp, setMinExp] = useState("");
  const [maxExp, setMaxExp] = useState("");
  //modal state

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] =
    useState<IDoctorProfileDataType | null>(null);

  useEffect(() => {
    const getDoctors = async () => {
      try {
        setLoading(true);

        const response = await fetchAllDoctors(
          currentPage,
          doctorsPerPage,
          searchTerm,
          {
            isVerified,
            status,
            departmentId: selectedDepartment || undefined,
            isSubscribed,
            availability:
              availability.length > 0 ? availability.join(",") : undefined,
            minExp: minExp || undefined,
            maxExp: maxExp || undefined,
          }
        );

        console.log("my doctors : ", response.data.data);

        const verifiedDoctors = response.data.data.filter(
          (doctor: IDoctorProfileDataType) => {
            return doctor.isVerified;
          }
        );

        console.log("===>", verifiedDoctors);

        setDoctors(response.data.data);
        console.log("Total : ", response.data.total);

        setTotalDoctors(response.data.total || 0);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setError("Failed to fetch doctors");
      } finally {
        setLoading(false);
      }
    };

    getDoctors();
  }, [
    currentPage,
    searchTerm,
    isVerified,
    status,
    availability,
    selectedDepartment,
    isSubscribed,
    minExp,
    maxExp,
  ]);

  useEffect(() => {
    const getDepartments = async () => {
      try {
        const response = await featchAllDepartments();
        setDepartments(response.data); // Adjust if needed based on API shape
      } catch (error) {
        console.error("Failed to fetch departments", error);
      }
    };

    getDepartments();
  }, []);

  const totalPages = Math.ceil(totalDoctors / doctorsPerPage);

  //   const filteredDoctors = doctors.filter((doctor)=>
  //   doctor.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  // )

  //   const indexOfLastDoctor = currentPage * doctorsPerPage;
  //   const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  //   const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

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

  // 🆕 Toggle availability checkboxes
  const handleAvailabilityChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value, checked } = event.target;
    setAvailability((prev) =>
      checked ? [...prev, value] : prev.filter((a) => a !== value)
    );
    setCurrentPage(1);
  };

  // 🆕 Clear all filters
  const clearFilters = () => {
    setIsVerified("");
    setStatus("");
    setAvailability([]);
    setSelectedDepartment("");
    setIsSubscribed("");
    setMinExp("");
    setMaxExp("");
    setCurrentPage(1);
  };

  return (
    <div
      className="p-6"
      style={{ backgroundColor: "#1b1e27", minHeight: "100vh" }}
    >
      <h2 className="text-2xl font-bold text-white mb-6">Doctors</h2>

      {/* 🆕 Search Input */}
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

      {/* =================== 🆕 Filter Panel =================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* ✅ Verification Status Filter */}
        <div>
          <label className="text-white flex items-center gap-2 mb-1">
            <span className="text-sm">Verification</span>
          </label>
          <select
            value={isVerified}
            onChange={(e) => {
              setIsVerified(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 rounded-md bg-gray-800 text-white"
          >
            <option value="">All</option>
            <option value="true">Verified</option>
            <option value="false">Not Verified</option>
          </select>
        </div>

        {/* ✅ Status Filter */}
        <div>
          <label className="text-white flex items-center gap-2 mb-1">
            <span className="text-sm">Doctor Status</span>
          </label>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 rounded-md bg-gray-800 text-white"
          >
            <option value="">All</option>
            <option value="1">Active</option>
            <option value="-1">Blocked</option>
          </select>
        </div>

        {/* ✅ Availability Filter */}
        <div>
          <label className="text-white flex items-center gap-2 mb-1">
            <span className="text-sm">Availability</span>
          </label>
          <div className="flex items-center gap-4">
            <label className="text-white text-sm">
              <input
                type="checkbox"
                value="Online"
                checked={availability.includes("Online")}
                onChange={(e) => handleAvailabilityChange(e)}
                className="mr-1"
              />
              Online
            </label>
            <label className="text-white text-sm">
              <input
                type="checkbox"
                value="Offline"
                checked={availability.includes("Offline")}
                onChange={(e) => handleAvailabilityChange(e)}
                className="mr-1"
              />
              Offline
            </label>
          </div>
        </div>

        {/* ✅ Department Filter */}
        <div>
          <label className="text-white flex items-center gap-2 mb-1">
            <span className="text-sm">Department</span>
          </label>
          <select
            value={selectedDepartment}
            onChange={(e) => {
              setSelectedDepartment(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 rounded-md bg-gray-800 text-white"
          >
            <option value="">All Departments</option>
            {departments.map((dept: any) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ Subscription Status Filter */}
        <div>
          <label className="text-white flex items-center gap-2 mb-1">
            <span className="text-sm">Subscription</span>
          </label>
          <select
            value={isSubscribed}
            onChange={(e) => {
              setIsSubscribed(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 rounded-md bg-gray-800 text-white"
          >
            <option value="">All</option>
            <option value="true">Subscribed</option>
            <option value="false">Not Subscribed</option>
          </select>
        </div>

        {/* ✅ Experience Filter */}
        <div>
          <label className="text-white flex items-center gap-2 mb-1">
            <span className="text-sm">Experience (Years)</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minExp}
              onChange={(e) => {
                setMinExp(e.target.value);
                setCurrentPage(1);
              }}
              className="w-1/2 px-2 py-1 rounded bg-gray-800 text-white"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxExp}
              onChange={(e) => {
                setMaxExp(e.target.value);
                setCurrentPage(1);
              }}
              className="w-1/2 px-2 py-1 rounded bg-gray-800 text-white"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={clearFilters}
          className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Clear Filters
        </button>
      </div>

      {!loading && !error && doctors.length === 0 && (
        <p className="text-center text-white text-lg mt-4">No results found.</p>
      )}
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4">
        {doctors.map((doctor) => (
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
