import { fetchAllDoctors } from "@/services/admin/authServices";
import IDoctorProfileDataType from "@/types/doctorFullDataType";
import React, { useEffect, useState } from "react";
import DoctorCard from "../ui/Card";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import DoctorDetailsModal from "../ui/DoctorDetailsModalComponent";
import { verifyDoctorApplication } from "@/services/admin/adminServices";
import toast from "react-hot-toast";
import useDebounce from "@/hooks/useDebounce";
const ApplicationsContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"applications" | "allDoctors">(
    "applications"
  );

  const [doctors, setDoctors] = useState<IDoctorProfileDataType[]>([]);
  const [totalDoctors, setTotalDoctors] = useState(0); // total count from backend
  const [searchTerm, setSearchTerm] = useState(""); //  search input
  const debouncedSearchTerm = useDebounce(searchTerm,500)

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 6;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] =
    useState<IDoctorProfileDataType | null>(null);

  useEffect(() => {
    const getDoctors = async () => {
      try {
        setLoading(true);

        const filters: Record<string, string|number> = {};

        if (activeTab === "applications") {
          filters.status = "2";
          filters.isVerified = "false";
        } else if (activeTab === "allDoctors") {
          // non-verified includes:
          // status = 1 & isVerified = false OR status = -2 & licenseNumber exists
          // for simplicity, use one API call for status = 1 & isVerified = false,
          // and another for rejected (status = -2 & licenseNumber)

          filters.status = "1,-2"; // backend should handle both
          filters.isVerified = "false";
        }

        const response = await fetchAllDoctors(
          currentPage,
          doctorsPerPage,
          debouncedSearchTerm ,
          filters
        );

        setDoctors(response.data.data);
        setTotalDoctors(response.data.total || 0);
      } catch (error) {
        console.log("Failed to fetch doctors:",error);
        setError("Failed to fetch doctors");
      } finally {
        setLoading(false);
      }
    };

    getDoctors();
  }, [currentPage, activeTab, debouncedSearchTerm ]);


  const totalPages = Math.ceil(totalDoctors / doctorsPerPage);


  const handleSearchChange =  (e:React.ChangeEvent<HTMLInputElement>)=>{
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleViewDetails = (_id: string) => {
    const doctor = doctors.find((doc) => doc._id === _id);
    if (doctor) {
      setSelectedDoctor(doctor);
      setIsModalOpen(true);
    }
  };

  // const handleUnVerifiedView = (_id: string) => {
  //   const doctor = currentDoctors.find((doc) => doc._id === _id);

  //   if (doctor) {
  //     setSelectedUnVerifiedDoctor(doctor);
  //     setIsModalOpen(true);
  //   }
  // };

  // const handleRejctedView = (_id: string) => {
  //   const doctor = currentRejected.find((doc) => doc._id === _id);

  //   if (doctor) {
  //     setSelectedRejectedDoctor(doctor);
  //     setIsModalOpen(true);
  //   }
  // };

  // ---------------------- Accept/Reject Handling ------------------------
  const handleDoctorVerification = async (
    doctorId: string,
    isVerified: boolean,
    rejectionReason?: string
  ) => {
    try {
      const response = await verifyDoctorApplication(
        doctorId,
        isVerified,
        rejectionReason
      );

      if (response.status === 200) {
        setDoctors((prevDoctors) =>
          prevDoctors.filter((doc) => doc._id !== doctorId && doc.status !== -2)
        );
        

        toast.success(
          `Doctor application ${
            isVerified ? "Accepted" : "Rejected"
          } successfully!`
        );
      } else {
        throw new Error("Failed to update doctor verification status.");
      }
    } catch (error) {
      console.error("Failed to verify doctor:", error);
      toast.error("Error verifying doctor. Please try again.");
    } finally {
      setIsModalOpen(false);
    }
  };

 

  // console.log("----------->", doctors);

  return (
    <div className="p-6" style={{ backgroundColor: "#1b1e27", minHeight: "100vh" }}>
      <h2 className="text-2xl font-bold text-white mb-6">Doctors</h2>

      {/* 🆕 Tab Navigation */}
      <div className="flex mb-6">
        <button
          className={`px-6 py-2 rounded-l-lg text-white transition-colors duration-200 ${
            activeTab === "applications" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
          }`}
          onClick={() => {
            setActiveTab("applications");
            setCurrentPage(1);
          }}
        >
          Applications
        </button>
        <button
          className={`px-6 py-2 rounded-r-lg text-white transition-colors duration-200 ${
            activeTab === "allDoctors" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"
          }`}
          onClick={() => {
            setActiveTab("allDoctors");
            setCurrentPage(1);
          }}
        >
          Non verified
        </button>
      </div>

      {/* 🆕 Search Input */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search by doctor name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 pl-10 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
      </div>

      {loading && <p className="text-white">Loading doctors...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && doctors.length === 0 && (
        <p className="text-white">No results found.</p>
      )}

      <div className="space-y-4">
        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor._id}
            fullName={doctor?.fullName || "NA"}
            avatarUrl={doctor?.profileImage}
            specialty={doctor?.specialization || "NA"}
            phone={doctor?.mobile || "NA"}
            email={doctor?.email || "NA"}
            status={doctor.status}
            onViewDetails={() => handleViewDetails(doctor._id!)}
          />
        ))}
      </div>

      {/* 🆕 Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded-md ${
              currentPage === 1 ? "bg-gray-600 cursor-not-allowed" : "bg-white"
            }`}
          >
            <ArrowLeft className="w-5 h-5 text-black" />
          </button>

          <span className="text-white text-lg">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-md ${
              currentPage === totalPages ? "bg-gray-600 cursor-not-allowed" : "bg-white"
            }`}
          >
            <ArrowRight className="w-5 h-5 text-black" />
          </button>
        </div>
      )}

      {/* 🆕 Doctor Detail Modal */}
      {selectedDoctor && (
        <DoctorDetailsModal
          doctor={selectedDoctor}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          mode={activeTab === "applications" ? "verify" : "view"}
          onAccept={
            activeTab === "applications"
              ? () => handleDoctorVerification(selectedDoctor._id!, true)
              : undefined
          }
          onReject={
            activeTab === "applications"
              ? (reason) => handleDoctorVerification(selectedDoctor._id!, false, reason)
              : undefined
          }
        />
      )}
    </div>)
};

export default ApplicationsContent;
