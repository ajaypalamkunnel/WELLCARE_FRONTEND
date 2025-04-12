"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Clock, User, Filter, ChevronRight } from "lucide-react";
import { getAppoinments } from "@/services/user/auth/authService";
import { AppointmentListItemDTO } from "@/types/slotBooking";
import {
  formatTime,
  formatDisplayDate,
  formatTime2,
} from "@/utils/dateutilities";
import { useRouter } from "next/navigation";
import AppointmentDetail from "./AppointmentDetail";
const UserAppointmentsList: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentListItemDTO[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("upcoming");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null) 

  const router = useRouter()

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const data = await getAppoinments(statusFilter);
        setAppointments(data);
        setError(null);
      } catch (err) {
        setError("Failed to load appointments. Please try again.");
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [statusFilter]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handleViewDetails = (appointmentId:string)=>{
    console.log("====>",appointmentId);
    setSelectedAppointmentId(appointmentId)
    
  }


  if(selectedAppointmentId){
    return(
      <AppointmentDetail
      appointmentId={selectedAppointmentId}
      onBack={()=>setSelectedAppointmentId(null)}
      />
    )
  }



  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          My Appointments
        </h1>

        <div className="flex items-center">
          <Filter className="mr-2 text-gray-500" size={20} />
          <select
            value={statusFilter}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            aria-label="Filter appointments by status"
          >
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-700">{error}</div>
      ) : appointments.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-md text-center">
          <p className="text-gray-600">
            No appointments found for the selected status.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                    {appointment.doctor.profileImage ? (
                      <img className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0" src={appointment.doctor.profileImage} alt="" />
                    ) : (
                      <User size={20} className="text-green-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">
                      {appointment.doctor.fullName}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {appointment.doctor.specialization}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                      appointment.status
                    )}`}
                  >
                    {appointment.status}
                  </span>
                </div>
              </div>

              <div className="px-6 py-4">
                <div className="flex items-center mb-3">
                  <Calendar size={18} className="text-green-600 mr-2" />
                  <span className="text-gray-700">
                    {formatDisplayDate(new Date(appointment.appointmentDate))}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock size={18} className="text-green-600 mr-2" />
                  <span className="text-gray-700">
                    {formatTime2(new Date(appointment.slot.start_time))}
                  </span>
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <button
                  className="flex w-full items-center justify-between px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
                  style={{ backgroundColor: "#03C03C" }}
                  onClick={()=>handleViewDetails(appointment._id)}
                >
                  <span>View Details</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserAppointmentsList;
