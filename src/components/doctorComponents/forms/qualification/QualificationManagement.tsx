// QualificationManagement.tsx
import React, { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import {
  GraduationCap,
  Award,
  CalendarIcon,
  Building2,
  Plus,
  Edit,
} from "lucide-react";
import EducationModal from "../modals/EducationModal";
import CertificationModal from "../modals/CertificationModal";
import { ICertificate, IEducation } from "@/types/doctorFullDataType";
import {
  addNewCertification,
  addNewEducation,
  updateCertification,
  updateEducation,
} from "@/services/doctor/doctorService";
import toast from "react-hot-toast";

// Types
export interface EducationData {
  id: string;
  degree: string;
  institution: string;
  yearOfCompletion: string;
}

export interface CertificationData {
  id: string;
  name: string;
  issuedBy: string;
  yearOfCompletion: string;
}

export interface EducationFormData {
  _id?:string;
  degree: string;
  institution: string;
  yearOfCompletion: string;
}

export interface CertificationFormData {
  _id?:string;
  name: string;
  issuedBy: string;
  yearOfIssue: string;
}

interface QualificationsProp {
  education: IEducation[];
  certification: ICertificate[];
}

// Main Component
const QualificationManagement: React.FC<QualificationsProp> = ({
  education,
  certification,
}) => {
  console.log(" QualificationManagement");

  // Sample data - replace with your actual data
  const [educations, setEducations] = useState<IEducation[]>([]);

  const [certifications, setCertifications] = useState<ICertificate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("I am usestate ");

    setEducations(education);
    setCertifications(certification);
  }, [education, certification]);

  console.log("-------->", education);
  // Modal states
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showCertificationModal, setShowCertificationModal] = useState(false);
  const [editingEducation, setEditingEducation] = useState<IEducation | null>(
    null
  );
  const [editingCertification, setEditingCertification] =
    useState<ICertificate | null>(null);

  // Functions to handle education
  const handleAddEducation = async () => {
    setEditingEducation(null);
    setShowEducationModal(true);
  };

  const handleEditEducation = (education: IEducation) => {
    setEditingEducation(education);
    setShowEducationModal(true);
  };

  const handleSaveEducation: SubmitHandler<IEducation> = async (data) => {
    setLoading(true);
    try {
      if (editingEducation) {
        // Update existing education
        console.log(data);
        const updatedEducation = await updateEducation(data)
        console.log(updatedEducation);
        if(updatedEducation.success){
          toast.success("Education updated successfully")
        }
        
        setEducations(
          educations.map((edu) =>
            edu._id === editingEducation._id ? { ...edu, ...data } : edu
          )
        );
      } else {
        const newEducation = await addNewEducation(data);
        console.log("new education==>", newEducation);

        setEducations([...newEducation]);
        toast.success("🎓 Education added successfully!");
      }
    } catch (error) {
      console.error("Error adding education", error);
      toast.error(" Failed to save education");
    } finally {
      setLoading(false);
      setShowEducationModal(false);
    }
  };

  // Functions to handle certification
  const handleAddCertification = () => {
    setEditingCertification(null);
    setShowCertificationModal(true);
  };

  const handleEditCertification = (certification: ICertificate) => {
    setEditingCertification(certification);
    setShowCertificationModal(true);
  };

  const handleSaveCertification: SubmitHandler<CertificationFormData> = async (
    data
  ) => {
    setLoading(true);
    try {
      if (editingCertification) {

        console.log(data);
         
        const updatedCertificate = await updateCertification(data)

        if(updatedCertificate.success){
          toast.success("Certification updated successfullly")
        }
        setCertifications(
          certifications.map((cert) =>
            cert._id === editingCertification._id ? { ...cert, ...data } : cert
          )
        );
      } else {
        const newCertification = await addNewCertification(data);

        console.log("new certificate added", newCertification);

        setCertifications([...certifications, newCertification]);

        toast.success("Certification added successfully");
      }
    } catch (error) {
      console.error("Error adding certification", error);
      toast.error(" Failed to save certification");
    } finally {
      setShowCertificationModal(false);
      setLoading(false)
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-sm max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Qualifications</h1>

      {/* Education Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <GraduationCap className="mr-2" size={20} />
            <h2 className="text-lg font-semibold">Education</h2>
          </div>
          <button
            onClick={handleAddEducation}
            className="flex items-center bg-[#02045e] text-white px-3 py-2 rounded-md text-sm"
          >
            <Plus size={16} className="mr-1" /> Add Education
          </button>
        </div>

        <div className="bg-white rounded-md shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Degree
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Institution
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {educations.map((education, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {education.degree}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {education.institution}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {education.yearOfCompletion}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditEducation(education)}
                      className="text-[#02045e] hover:text-blue-800"
                    >
                      <Edit size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certifications Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Award className="mr-2" size={20} />
            <h2 className="text-lg font-semibold">Certifications</h2>
          </div>
          <button
            onClick={handleAddCertification}
            className="flex items-center bg-[#02045e] text-white px-3 py-2 rounded-md text-sm"
          >
            <Plus size={16} className="mr-1" /> Add Certification
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certifications.map((certification,i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-md shadow-sm border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <Award className="mr-2 mt-1 text-[#02045e]" size={18} />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {certification.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Building2 size={14} className="mr-1" />
                      <span>{certification.issuedBy}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <CalendarIcon size={14} className="mr-1" />
                      <span>{certification.yearOfIssue}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleEditCertification(certification)}
                  className="text-[#02045e] hover:text-blue-800"
                >
                  <Edit size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education Modal */}
      {showEducationModal && (
        <EducationModal
          onClose={() => setShowEducationModal(false)}
          onSave={handleSaveEducation}
          defaultValues={editingEducation || undefined}
          isLoading={loading}
        />
      )}

      {/* Certification Modal */}
      {showCertificationModal && (
        <CertificationModal
          onClose={() => setShowCertificationModal(false)}
          onSave={handleSaveCertification}
          defaultValues={editingCertification || undefined}
        />
      )}
    </div>
  );
};

export default QualificationManagement;
