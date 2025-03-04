"use client"


import React from 'react';
import { User, Mail, Phone, Briefcase, Calendar, GraduationCap, Award, FileText, Edit, Check } from 'lucide-react';

interface Step4ReviewProps {
  formData: any;
  onEdit: (step: number) => void;
}

const Step4Review: React.FC<Step4ReviewProps> = ({ formData, onEdit }) => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="step-title">Review Your Information</h2>
        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center dark:bg-green-900 dark:text-green-200">
          <Check className="w-4 h-4 mr-1" />
          Ready to Submit
        </div>
      </div>
      
      <div className="space-y-8">
        {/* Profile Information */}
        <div className="bg-gray-50 rounded-lg p-5 dark:bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Personal Information</h3>
            <button
              type="button"
              onClick={() => onEdit(1)}
              className="text-deep-blue hover:text-blue-700 flex items-center text-sm font-medium dark:text-blue-400"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex items-center">
              <User className="w-5 h-5 text-gray-500 mr-3 dark:text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</p>
                <p className="font-medium text-gray-900 dark:text-white">{formData.fullName}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-5 h-5 text-gray-500 mr-3 flex items-center justify-center dark:text-gray-400">
                <span className="text-lg">⚥</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</p>
                <p className="font-medium text-gray-900 dark:text-white">{formData.gender}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-gray-500 mr-3 dark:text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-white">{formData.email}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-gray-500 mr-3 dark:text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</p>
                <p className="font-medium text-gray-900 dark:text-white">{formData.phoneNumber}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Briefcase className="w-5 h-5 text-gray-500 mr-3 dark:text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Department</p>
                <p className="font-medium text-gray-900 dark:text-white">{formData.department}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-500 mr-3 dark:text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Years of Experience</p>
                <p className="font-medium text-gray-900 dark:text-white">{formData.experience} years</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Education & Certification */}
        <div className="bg-gray-50 rounded-lg p-5 dark:bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Education & Certification</h3>
            <button
              type="button"
              onClick={() => onEdit(2)}
              className="text-deep-blue hover:text-blue-700 flex items-center text-sm font-medium dark:text-blue-400"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-3 dark:text-gray-400">Education</h4>
              <div className="space-y-3">
                {formData.education && formData.education.map((edu: any, index: number) => (
                  <div key={index} className="bg-white p-3 rounded-md shadow-sm dark:bg-gray-700">
                    <div className="flex items-start">
                      <GraduationCap className="w-5 h-5 text-gray-500 mr-3 mt-0.5 dark:text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{edu.degree}</p>
                        <p className="text-gray-600 text-sm dark:text-gray-300">{edu.institution}, {edu.yearOfCompletion}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-3 dark:text-gray-400">Certifications</h4>
              <div className="space-y-3">
                {formData.certifications && formData.certifications.map((cert: any, index: number) => (
                  <div key={index} className="bg-white p-3 rounded-md shadow-sm dark:bg-gray-700">
                    <div className="flex items-start">
                      <Award className="w-5 h-5 text-gray-500 mr-3 mt-0.5 dark:text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{cert.name}</p>
                        <p className="text-gray-600 text-sm dark:text-gray-300">{cert.issuedBy}, {cert.yearOfIssue}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* License & Documents */}
        <div className="bg-gray-50 rounded-lg p-5 dark:bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">License & Documents</h3>
            <button
              type="button"
              onClick={() => onEdit(3)}
              className="text-deep-blue hover:text-blue-700 flex items-center text-sm font-medium dark:text-blue-400"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-gray-500 mr-3 dark:text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">License Number</p>
                <p className="font-medium text-gray-900 dark:text-white">{formData.licenseNumber}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2 dark:text-gray-400">Uploaded Documents</p>
              <div className="space-y-2">
                <div className="bg-white p-3 rounded-md shadow-sm flex items-center dark:bg-gray-700">
                  <FileText className="w-5 h-5 text-gray-500 mr-3 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Medical License</p>
                    <p className="text-gray-600 text-xs dark:text-gray-300">
                      {formData.licenseDocument ? formData.licenseDocument.name : 'Document uploaded'}
                    </p>
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-md shadow-sm flex items-center dark:bg-gray-700">
                  <FileText className="w-5 h-5 text-gray-500 mr-3 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">ID Proof</p>
                    <p className="text-gray-600 text-xs dark:text-gray-300">
                      {formData.idProof ? formData.idProof.name : 'Document uploaded'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <div className="bg-blue-50 border-l-4 border-deep-blue p-4 rounded-md dark:bg-blue-900/30 dark:border-blue-700">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Please verify all information before submitting. Your application will be reviewed by the administration team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4Review;
