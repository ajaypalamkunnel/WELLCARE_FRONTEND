"use client";

import React from "react";
import {
  X,
  Mail,
  Phone,
  User,
  Home,
  MapPin,
  Calendar,
  Heart,
  AlertTriangle,
  PlusCircle,
} from "lucide-react";
import IUser from "@/types/user";

interface PatientDetailsModalProps {
  patient: IUser;
  isOpen: boolean;
  onClose: () => void;
}

const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({
  patient,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !patient) return null;

  const { fullName, email, mobile, address, personalInfo, status } = patient;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Patient Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Basic Info</h3>
            <div className="text-gray-300 flex items-center gap-2">
              <User size={18} className="text-gray-400" />
              {fullName}
            </div>
            <div className="text-gray-300 flex items-center gap-2">
              <Mail size={18} className="text-gray-400" />
              {email}
            </div>
            <div className="text-gray-300 flex items-center gap-2">
              <Phone size={18} className="text-gray-400" />
              {mobile}
            </div>
          </div>

          {/* Personal Info */}
          {personalInfo && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">
                Personal Info
              </h3>
              <div className="text-gray-300 flex items-center gap-2">
                <Calendar size={18} className="text-gray-400" />
                Age: {personalInfo.age}
              </div>
              <div className="text-gray-300 flex items-center gap-2">
                <User size={18} className="text-gray-400" />
                Gender: {personalInfo.gender}
              </div>
              <div className="text-gray-300 flex items-center gap-2">
                <Heart size={18} className="text-gray-400" />
                Blood Group: {personalInfo.blood_group}
              </div>
              <div className="text-gray-300 flex items-center gap-2">
                <AlertTriangle size={18} className="text-gray-400" />
                Allergies: {personalInfo.allergies}
              </div>
              <div className="text-gray-300 flex items-center gap-2">
                <PlusCircle size={18} className="text-gray-400" />
                Chronic Disease: {personalInfo.chronic_disease}
              </div>
            </div>
          )}

          {/* Address */}
          {address && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Address</h3>
              <div className="text-gray-300 flex items-center gap-2">
                <Home size={18} className="text-gray-400" />
                {address.houseName}, {address.street}
              </div>
              <div className="text-gray-300 flex items-center gap-2">
                <MapPin size={18} className="text-gray-400" />
                {address.city}, {address.state}, {address.postalCode},{" "}
                {address.country}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsModal;
