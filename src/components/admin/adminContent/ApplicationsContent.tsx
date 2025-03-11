import { fetchAllDoctors } from "@/services/admin/authServices";
import IDoctorProfileDataType from "@/types/doctorFullDataType";
import React, { useEffect, useState } from "react";
import DoctorCard from "../ui/Card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import DoctorDetailsModal from "../ui/DoctorDetailsModalComponent";
import { verifyDoctorApplication } from "@/services/admin/adminServices";
import toast from "react-hot-toast";

const ApplicationsContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"applications" | "allDoctors">(
    "applications"
  );

  const [applications, setApplications] = useState<IDoctorProfileDataType[]>([]);
  const [allDoctors, setAllDoctors] = useState<IDoctorProfileDataType[]>([]);
  const [rejectedDoctors, setRejectedDoctors] = useState<IDoctorProfileDataType[]>([]);

  const [appPage, setAppPage] = useState(1);
  const [docPage, setDocPage] = useState(1);
  const itemsPerPage = 6;

  const [doctors, setDoctors] = useState<IDoctorProfileDataType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 6;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] =useState<IDoctorProfileDataType | null>(null);
  const [selectedUnVerifiedDoctor, setSelectedUnVerifiedDoctor] =useState<IDoctorProfileDataType | null>(null);
  const [selectedRejectedDoctor, setSelectedRejectedDoctor] =useState<IDoctorProfileDataType | null>(null);
  
  useEffect(() => {
    const getDoctors = async () => {
      try {
        setLoading(true);

        const response = await fetchAllDoctors();

        const doctorList = response.data.data;

        //This doctor appliction submitted for admin verfication (Pending Admin Verification)
        const applicationDoctors = doctorList.filter(
          (doctor: IDoctorProfileDataType) => {
            return (
              doctor.status === 2 &&
              doctor.licenseNumber &&
              doctor.isVerified === false
            );
          }
        );

        console.log(">>>>>>", applicationDoctors);

        //  Filter: **Non-Verified Doctors**  
        //  (Account Created but Application NOT Submitted) + (Rejected Applications)
        const nonVerifiedDoctors = doctorList.filter(
          (doctor: IDoctorProfileDataType) =>
            (doctor.status === 1 && doctor.isVerified === false) || //  Account created but not submitted
            (doctor.status === -2 && doctor.licenseNumber) // Application rejected but has a license
        );

       

       //  Separate Rejected Doctors
       const rejectedApplications = doctorList.filter(
        (doctor: IDoctorProfileDataType) => doctor.status === -2 && doctor.licenseNumber
      );

      setApplications(applicationDoctors);
      setAllDoctors(nonVerifiedDoctors);
      setRejectedDoctors(rejectedApplications);

        // console.log("response data == >",response.data.data);
      } catch (error) {
        setError("Failed to fetch doctors");
      } finally {
        setLoading(false);
      }
    };
    getDoctors();
  }, []);

  // const handleNextPage = () => {
  //   if (currentPage < totalPages) {
  //     setCurrentPage((prev) => prev + 1);
  //   }
  // };

  // const handlePrevPage = () => {
  //   if (currentPage > 1) {
  //     setCurrentPage((prev) => prev - 1);
  //   }
  // };

  const handleViewDetails = (_id: string) => {
  
    const doctor = applications.find((doc) => doc._id === _id);
    if (doctor) {
        console.log("------>",doctor);
        
      setSelectedDoctor(doctor);
      setIsModalOpen(true);
    }
  };


  const handleUnVerifiedView = (_id:string)=>{

    const doctor = currentDoctors.find((doc)=>doc._id === _id)

    if(doctor){
      setSelectedUnVerifiedDoctor(doctor)
      setIsModalOpen(true)
    }


  } 

  const handleRejctedView = (_id:string)=>{
    const doctor = currentRejected.find((doc)=>doc._id === _id)

    if(doctor){
      setSelectedRejectedDoctor(doctor)
      setIsModalOpen(true)
    }

  }

   // ---------------------- Accept/Reject Handling ------------------------
  const handleDoctorVerification = async (
    doctorId: string,
    isVerified: boolean
  ) => {
    try {
      const response = await verifyDoctorApplication(doctorId, isVerified);

      if (response.status === 200) {
        setDoctors((prevDoctors) =>
          prevDoctors.filter((doc) => doc._id !== doctorId && doc.status !== -2)
        );
        console.log(">>>>>>>>>", doctors);

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

  const totalPagesApps = Math.ceil(applications.length / itemsPerPage);
  const totalPagesDocs = Math.ceil(allDoctors.length / itemsPerPage);
  const currentApplications = applications.slice(
    (appPage - 1) * itemsPerPage,
    appPage * itemsPerPage
  );
  const currentDoctors = allDoctors.slice(
    (docPage - 1) * itemsPerPage,
    docPage * itemsPerPage
  );

  const currentRejected = rejectedDoctors.slice(
    (docPage - 1) * itemsPerPage,
    docPage * itemsPerPage
  );

  // console.log("----------->", doctors);

  return (
    <div
      className="p-6"
      style={{ backgroundColor: "#1b1e27", minHeight: "100vh" }}
    >
      <h2 className="text-2xl font-bold text-white mb-6">Doctors</h2>
      <h4 className="mb-4 font-medium text-gray-400">
        New Doctors Applications
      </h4>

      {/* 🆕 Tab Navigation */}
      <div className="flex mb-6">
        <button
          className={`px-6 py-2 rounded-l-lg text-white transition-colors duration-200 
            ${
              activeTab === "applications"
                ? "bg-blue-600"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          onClick={() => setActiveTab("applications")}
        >
          Applications
        </button>
        <button
          className={`px-6 py-2 rounded-r-lg text-white transition-colors duration-200 
            ${
              activeTab === "allDoctors"
                ? "bg-blue-600"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          onClick={() => setActiveTab("allDoctors")}
        >
          Non verified
        </button>
      </div>

      {loading && <p className="text-white">Loading doctors...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* 🆕 Show Content Based on Active Tab */}
      {activeTab === "applications" ? (
        <>
          <h4 className="mb-4 font-medium text-gray-400">
            New Doctors Applications
          </h4>
          <div className="space-y-4">
            {currentApplications.map((doctor, i) => (
              // Doctors with pending applications
              <DoctorCard
                key={i}
                fullName={doctor?.fullName || "NA"}
                avatarUrl={doctor?.profileImage}
                specialty={doctor?.specialization || "NA"}
                phone={doctor?.mobile || "NA"}
                email={doctor?.email || "NA"}
                onViewDetails={() => {
                  // setSelectedDoctor(doctor);
                  // setIsModalOpen(true);
                  handleViewDetails(doctor._id!);
                }}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <h4 className="mb-4 font-medium text-gray-400">Non verified Doctors</h4>
          <div className="space-y-4">
            {currentDoctors.map((doctor, i) => (
              // doctors with account created and block doctors
              <DoctorCard
                key={i}
                fullName={doctor?.fullName || "NA"}
                avatarUrl={doctor?.profileImage}
                specialty={doctor?.specialization || "NA"}
                phone={doctor?.mobile || "NA"}
                email={doctor?.email || "NA"}
                status={doctor.status}
                onViewDetails={() => {
                handleUnVerifiedView(doctor._id!);
                }}
              />
            ))}
          </div>

           {/* 🆕 Application Rejected Section */}
           {currentRejected.length > 0 && (
            <>
              <h4 className="mt-8 mb-4 font-medium text-red-400">Application Rejected</h4>
              <div className="space-y-4">
                {currentRejected.map((doctor, i) => (
                  <DoctorCard
                    key={i}
                    fullName={doctor?.fullName || "NA"}
                    avatarUrl={doctor?.profileImage}
                    specialty={doctor?.specialization || "NA"}
                    phone={doctor?.mobile || "NA"}
                    email={doctor?.email || "NA"}
                    status={doctor.status}
                    onViewDetails={() => {
                    handleRejctedView(doctor._id!);
                    }}
                  />
                ))}
              </div>
            </>
          )}

          

        </>
      )}

      {((activeTab === "applications" && totalPagesApps > 1) ||
        (activeTab === "allDoctors" && totalPagesDocs > 1)) && (
        <div className="flex justify-center mt-6 space-x-4">
          {/* 🔙 Previous Page Button */}
          <button
            onClick={() =>
              activeTab === "applications"
                ? setAppPage((p) => Math.max(p - 1, 1))
                : setDocPage((p) => Math.max(p - 1, 1))
            }
            disabled={(activeTab === "applications" ? appPage : docPage) === 1}
            className="p-2 rounded-md bg-white"
          >
            <ArrowLeft className="w-5 h-5 text-black" />
          </button>

          {/* 🔢 Page Indicator */}
          <span className="text-white text-lg">
            Page {activeTab === "applications" ? appPage : docPage} of{" "}
            {activeTab === "applications" ? totalPagesApps : totalPagesDocs}
          </span>

          {/* 🔜 Next Page Button */}
          <button
            onClick={() =>
              activeTab === "applications"
                ? setAppPage((p) => p + 1)
                : setDocPage((p) => p + 1)
            }
            disabled={
              (activeTab === "applications" ? appPage : docPage) ===
              (activeTab === "applications" ? totalPagesApps : totalPagesDocs)
            }
            className="p-2 rounded-md bg-white"
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
          onAccept={() => handleDoctorVerification(selectedDoctor._id!, true)}
          onReject={() => handleDoctorVerification(selectedDoctor._id!, false)}
        />
      )}

      {
        selectedUnVerifiedDoctor&&(
          <DoctorDetailsModal
          doctor={selectedUnVerifiedDoctor}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          mode="view"
          />
        )
      }
      
  
      {
        selectedRejectedDoctor&&(
          <DoctorDetailsModal
          doctor={selectedRejectedDoctor}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          mode="verify"
          onAccept={() => handleDoctorVerification(selectedRejectedDoctor._id!, true)}
          onReject={() => handleDoctorVerification(selectedRejectedDoctor._id!, false)}
          />
        )
      }





    </div>
  );
};

export default ApplicationsContent;
