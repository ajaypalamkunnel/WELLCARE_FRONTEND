"use client";

import React, { useState } from "react";
import { 
  X, 
  Award, 
  GraduationCap, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  User, 
  Clock, 
  Briefcase,
  Globe,
  Building,
  XCircle,
  CheckCircle,
  SectionIcon,
  Group
} from "lucide-react";

import IDoctorProfileDataType from "@/types/doctorFullDataType";
import { fetchDoctorDocument } from "@/services/admin/adminServices";

interface DoctorDetailsModalProps {
  doctor: IDoctorProfileDataType;
  isOpen: boolean;
  onClose: () => void;
  mode?: "view" | "verify"; // New prop to determine modal mode
  onAccept?: () => void; // New prop for accept action
  onReject?: (reason:string) => void; // New prop for reject action
}

const DoctorDetailsModal: React.FC<DoctorDetailsModalProps> = ({
  doctor,
  isOpen,
  onClose,
  mode = "view", // Default to view mode
  onAccept,
  onReject,
}) => {
  if (!isOpen) return null;


  //State to handle rejection reason
  const [isRejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // 🆕 Function to handle rejection submission
  const handleRejectSubmission = () => {
    if (onReject && rejectionReason.trim() !== "") {
      onReject(rejectionReason);
      setRejectionModalOpen(false);
      setRejectionReason("");
    }
  };

  // Handle document opening in new window
  const openDocument = (url: string | File) => {
    if(url instanceof File){
        return null
    }
    window.open(url, "_blank");
  };

  // Check if doctor has offline availability
  const hasOfflineAvailability = doctor.availability?.includes("Offline");

  const modalTitle = mode === "verify" ? "Doctor Application" : "Doctor Details";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">{modalTitle}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Top Section - Basic Info with Avatar */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700">
                {doctor.profileImage ? (
                  <img
                    src={doctor.profileImage}
                    alt={`${doctor.fullName}'s profile`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                    {doctor.fullName?.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">{doctor.fullName}</h3>
              <p className="text-gray-300 text-lg mb-4">{doctor.specialization}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                <div className="flex items-center text-gray-300">
                  <User size={18} className="mr-2 text-gray-400" />
                  <span>{doctor.gender}</span>
                </div>
                
                <div className="flex items-center text-gray-300">
                  <Mail size={18} className="mr-2 text-gray-400" />
                  <span>{doctor.email}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Group size={18} className="mr-2 text-gray-400" />
                  <span>{doctor.departmentId?.name}</span>
                </div>
               
                
                <div className="flex items-center text-gray-300">
                  <Phone size={18} className="mr-2 text-gray-400" />
                  <span>{doctor.mobile}</span>
                </div>
                
                <div className="flex items-center text-gray-300">
                  <Briefcase size={18} className="mr-2 text-gray-400" />
                  <span>{doctor.experience} years experience</span>
                </div>
                
                <div className="flex items-center text-gray-300">
                  <FileText size={18} className="mr-2 text-gray-400" />
                  <span>License: {doctor.licenseNumber}</span>
                </div>
                
                <div className="flex items-center text-gray-300">
                  <Clock size={18} className="mr-2 text-gray-400" />
                  <span>Available: {doctor.availability?.join(", ")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 my-6"></div>

          {/* Education Section */}
          <div className="mb-6">
            <h4 className="flex items-center text-lg font-semibold text-white mb-4">
              <GraduationCap size={20} className="mr-2" />
              Education
            </h4>
            
            <div className="space-y-4 pl-2">
              {doctor.education && doctor.education.length > 0 ? (
                doctor.education.map((edu, index) => (
                  <div key={index} className="bg-gray-700 bg-opacity-30 p-4 rounded-md">
                    <p className="text-white font-medium">{edu.degree}</p>
                    <p className="text-gray-400">{edu.institution}</p>
                    <p className="text-gray-400 text-sm">Graduated: {edu.yearOfCompletion}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No education information available</p>
              )}
            </div>
          </div>

          {/* Certifications Section */}
          <div className="mb-6">
            <h4 className="flex items-center text-lg font-semibold text-white mb-4">
              <Award size={20} className="mr-2" />
              Certifications
            </h4>
            
            <div className="space-y-4 pl-2">
              {doctor.certifications && doctor.certifications.length > 0 ? (
                doctor.certifications.map((cert, index) => (
                  <div key={index} className="bg-gray-700 bg-opacity-30 p-4 rounded-md">
                    <p className="text-white font-medium">{cert.name}</p>
                    <p className="text-gray-400">Issued by: {cert.issuedBy}</p>
                    <p className="text-gray-400 text-sm">Year: {cert.yearOfIssue}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No certification information available</p>
              )}
            </div>
          </div>

          {/* Clinic Address - Only show if has offline availability */}
          {hasOfflineAvailability && (
            <div className="mb-6">
              <h4 className="flex items-center text-lg font-semibold text-white mb-4">
                <Building size={20} className="mr-2" />
                Clinic Address
              </h4>
              
              <div className="bg-gray-700 bg-opacity-30 p-4 rounded-md">
                {doctor.clinicAddress && (
                  <>
                    {doctor.clinicAddress.clinicName && (
                      <p className="text-white font-medium">{doctor.clinicAddress.clinicName}</p>
                    )}
                    <p className="text-gray-300">
                      {[
                        doctor.clinicAddress.street,
                        doctor.clinicAddress.city,
                        doctor.clinicAddress.state,
                        doctor.clinicAddress.postalCode,
                        doctor.clinicAddress.country,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </>
                )}
                {(!doctor.clinicAddress || Object.values(doctor.clinicAddress).every(v => !v)) && (
                  <p className="text-gray-400">No clinic address information available</p>
                )}
              </div>
            </div>
          )}

          {/* Documents Section */}
          <div className="mb-6">
            <h4 className="flex items-center text-lg font-semibold text-white mb-4">
              <FileText size={20} className="mr-2" />
              Documents
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctor.licenseDocument && (
                <button
                  onClick={() => fetchDoctorDocument("license",doctor._id!)}
                  className="flex items-center bg-gray-700 hover:bg-gray-600 p-4 rounded-md transition-colors"
                >
                  <FileText size={20} className="mr-2 text-blue-400" />
                  <span className="text-white">View License Document</span>
                </button>
              )}
              
              {doctor.IDProofDocument && (
                <button
                  onClick={() => fetchDoctorDocument("idproof",doctor._id!)}
                  className="flex items-center bg-gray-700 hover:bg-gray-600 p-4 rounded-md transition-colors"
                >
                  <FileText size={20} className="mr-2 text-blue-400" />
                  <span className="text-white">View ID Proof Document</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-700 flex justify-end">
          {/* Show Accept/Reject buttons only in verify mode */}
          {mode === "verify" ? (
            <>
              <button
                onClick={()=>setRejectionModalOpen(true)}
                className="flex items-center px-6 py-2 bg-red-800 hover:bg-red-700 text-white rounded-md transition-colors mr-4"
              >
                <XCircle size={18} className="mr-2" />
                Reject
              </button>
              <button
                onClick={onAccept}
                className="flex items-center px-6 py-2 bg-green-700 hover:bg-green-600 text-white rounded-md transition-colors"
              >
                <CheckCircle size={18} className="mr-2" />
                Accept
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>


      {isRejectionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold text-white mb-4">Reason for Rejection</h2>
            <textarea
              className="w-full bg-gray-700 text-white p-3 rounded-md focus:outline-none"
              rows={4}
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
             {rejectionReason.trim() === "" && (
        <p className="text-red-500 text-sm mt-1">Rejection reason is required.</p>
      )}
            <div className="flex justify-end space-x-3 mt-4">
              <button onClick={() => setRejectionModalOpen(false)} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                Cancel
              </button>
              <button onClick={handleRejectSubmission} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDetailsModal;