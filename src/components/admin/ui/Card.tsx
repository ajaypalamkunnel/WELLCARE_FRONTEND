"use client";

import React from "react";
import { Eye, Ban, Phone, Mail } from "lucide-react";

// Define props interface for the card component
interface DoctorCardProps {
  fullName: string;
  specialty?: string;
  phone?: string;
  email: string;
  avatarUrl?: string;
  onViewDetails: () => void;
  onBlock: () => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({
  fullName,
  specialty,
  phone,
  email,
  avatarUrl,
  onViewDetails,
  onBlock,
}) => {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-gray-300 bg-opacity-20 hover:bg-opacity-25 transition-all duration-200 mb-4"
      
    >
      {/* Left section - Doctor info */}
      <div className="flex items-center">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-gray-200 mr-4 overflow-hidden flex-shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${fullName}'s profile`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">
              {fullName.charAt(0)}
            </div>
          )}
        </div>

        {/* Doctor details */}
        <div>
          <h3 className="text-lg font-semibold text-white">{fullName}</h3>
          <p className="text-gray-400 text-sm mb-2">{specialty}</p>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Phone number */}
            <div className="flex items-center text-gray-300">
              <Phone size={16} className="mr-1 text-gray-400" />
              <span className="text-sm">{phone}</span>
            </div>

            {/* Email */}
            <div className="flex items-center text-gray-300">
              <Mail size={16} className="mr-1 text-gray-400" />
              <span className="text-sm">{email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right section - Action buttons */}
      <div className="flex mt-4 sm:mt-0 gap-2">
        <button
          onClick={onViewDetails}
          className="flex items-center justify-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors"
        >
          <Eye size={16} className="mr-2" />
          View Details
        </button>

        <button
          onClick={onBlock}
          className="flex items-center justify-center px-4 py-2 bg-red-900 hover:bg-red-800 text-white rounded-md transition-colors"
        >
          <Ban size={16} className="mr-2" />
          Block
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
