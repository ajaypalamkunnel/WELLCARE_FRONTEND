import { fetchAllDoctors } from "@/services/admin/authServices";
import IDoctorProfileDataType from "@/types/doctorFullDataType";
import React, { useEffect, useState } from "react";
import DoctorCard from "../ui/Card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import DoctorDetailsModal from "../ui/DoctorDetailsModalComponent";
import { verifyDoctorApplication } from "@/services/admin/adminServices";
import toast from "react-hot-toast";

const ApplicationsContent: React.FC = () => {
  const [doctors, setDoctors] = useState<IDoctorProfileDataType[]>([]);
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

        const response = await fetchAllDoctors();

        const unverifiedDoctors = response.data.data.filter(
          (doctor: IDoctorProfileDataType) =>
            !doctor.isVerified && doctor.licenseNumber && doctor.status !== -2// -2 removing rejected doctors
        );

        setDoctors(unverifiedDoctors);

        // console.log("response data == >",response.data.data);
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

  const handleViewDetails = (_id: string) => {
    const doctor = doctors.find((doc) => doc._id === _id);
    if (doctor) {
      setSelectedDoctor(doctor);
      setIsModalOpen(true);
    }
  };


  const handleDoctorVerification = async (doctorId:string,isVerified:boolean)=>{

    try {

      const response = await verifyDoctorApplication(doctorId,isVerified)

      if(response.status === 200){

        setDoctors((prevDoctors) =>
          prevDoctors.filter((doc) => doc._id !== doctorId && doc.status !== -2)
        );
        console.log(">>>>>>>>>",doctors);
        
        toast.success(`Doctor application ${isVerified ? "Accepted" : "Rejected"} successfully!`);
      }else{
        throw new Error("Failed to update doctor verification status.")
      }

      
    } catch (error) {
      console.error("Failed to verify doctor:", error);
      toast.error("Error verifying doctor. Please try again.");
      
    }finally{
      setIsModalOpen(false)
    }



  }
  console.log("----------->", doctors);

  return (
    <div
      className="p-6"
      style={{ backgroundColor: "#1b1e27", minHeight: "100vh" }}
    >
      <h2 className="text-2xl font-bold text-white mb-6">Doctors</h2>
      <h4 className="mb-4 font-medium text-gray-400">
        New Doctors Applications
      </h4>
      {loading && <p className="text-white">Loading doctors...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4">
        {currentDoctors.map((doctor, i) => (
          <DoctorCard
            key={i}
            fullName={doctor?.fullName || "NA"}
            avatarUrl={doctor?.profileImage}
            specialty={doctor?.specialization || "NA"}
            phone={doctor?.mobile || "NA"}
            email={doctor?.email || "NA"}
            onViewDetails={() => handleViewDetails(doctor?._id!)}
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
          onClose={() => setIsModalOpen(false)}
          mode="verify"
          onAccept={()=>handleDoctorVerification(selectedDoctor._id!,true)}
          onReject={()=>handleDoctorVerification(selectedDoctor._id!,false)}
        />
      )}
    </div>
  );
};

export default ApplicationsContent;
