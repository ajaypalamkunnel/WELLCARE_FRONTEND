"use client";
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  FileText,
  Camera,
  Upload,
  Phone,
  Home,
  Activity,
  AlertCircle,
  DollarSign,
  Tag,
  MapPin,
  AlertTriangle,
  MessageCircle,
} from "lucide-react";
import { formatDisplayDate, formatTime2 } from "../../utils/dateutilities";
import { DoctorAppointmentDetailDTO } from "@/types/slotBooking";
import { getDoctorAppointmentDetail } from "@/services/doctor/doctorService";
import { useRouter } from "next/navigation";
import { getSocket } from "@/utils/socket";
import { useAuthStoreDoctor } from "@/store/doctor/authStore";
import { useCallStore } from "@/store/call/callStore";

interface DoctorAppointmentDetailProps {
  appointmentId: string;
}

const DoctorAppointmentDetail: React.FC<DoctorAppointmentDetailProps> = ({
  appointmentId,
}) => {
  const [appointment, setAppointment] =
    useState<DoctorAppointmentDetailDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const userId = appointment?.patient._id;

  const doctor = useAuthStoreDoctor();
  const doctorId = doctor.user?.id;

  useEffect(() => {
    const fetchAppointmentDetail = async () => {
      try {
        setLoading(true);
        const data = await getDoctorAppointmentDetail(appointmentId);
        console.log("==>", data.patient._id);

        setAppointment(data);
        setError(null);
      } catch (err) {
        setError("Failed to load appointment details. Please try again later.");
        console.error("Error fetching appointment details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (appointmentId) {
      fetchAppointmentDetail();
    }
  }, [appointmentId]);

  const handleStartConsultation = (userId: string) => {
    if (!userId) return;

    const socket = getSocket();

    const callerId = doctorId;
    const receiverId = appointment?.patient._id;

    if (!callerId || !receiverId) return;

    socket?.emit("start-call", { callerId, receiverId });

    useCallStore
      .getState()
      .setCallerDetails(
        appointment.patient.fullName,
        appointment._id,
        appointment.patient._id
      );
    router.push(`/doctor/video-call/${appointment.patient._id}`);
  };

  const handleUploadPrescription = () => {
    console.log("Uploading prescription...");
    // Implementation for uploading prescription
  };

  const handleViewPrescription = () => {
    if (appointment?.prescription?.fileUrl) {
      window.open(appointment.prescription.fileUrl, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-indigo-900 mx-auto"></div>
          <p className="mt-4 text-indigo-900">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center text-red-500 mb-4">
          <AlertTriangle size={24} className="mr-2" />
          <h2 className="text-xl font-bold">Error</h2>
        </div>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-indigo-900 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center text-yellow-500 mb-4">
          <AlertCircle size={24} className="mr-2" />
          <h2 className="text-xl font-bold">No Data Found</h2>
        </div>
        <p>No appointment details were found.</p>
      </div>
    );
  }

  const isOnlineAppointment = appointment.service.mode === "Online";
  const hasAddress = appointment.patient.address;
  const hasPersonalInfo = appointment.patient.personalInfo;
  const hasPrescription = appointment.prescription;

  return (
    <div className="max-w-4xl mx-auto bg-white p-4 md:p-8 rounded-lg shadow-md">
      {/* Header with Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-indigo-900">
            Appointment Details
          </h1>
          <div className="text-gray-600 mt-1">ID: {appointment._id}</div>
        </div>
        <div className="flex flex-col mt-4 md:mt-0 md:items-end">
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              appointment.status === "booked"
                ? "bg-green-100 text-green-800"
                : appointment.status === "cancelled"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            <Tag size={16} className="mr-1" />
            {appointment.status.charAt(0).toUpperCase() +
              appointment.status.slice(1)}
          </div>
          <div
            className={`inline-flex items-center mt-2 px-3 py-1 rounded-full text-sm font-medium ${
              appointment.paymentStatus === "paid"
                ? "bg-blue-100 text-blue-800"
                : "bg-orange-100 text-orange-800"
            }`}
          >
            ₹ Payment:{" "}
            {appointment.paymentStatus.charAt(0).toUpperCase() +
              appointment.paymentStatus.slice(1)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Patient Info */}
        <div className="md:col-span-1">
          <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
            <h2 className="flex items-center text-lg font-semibold text-indigo-900 mb-4">
              <User size={20} className="mr-2" /> Patient Information
            </h2>

            <div className="flex items-center mb-4">
              {appointment.patient.profileUrl ? (
                <img
                  src={appointment.patient.profileUrl}
                  alt={appointment.patient.fullName}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-900 mr-4">
                  <User size={24} />
                </div>
              )}
              <div>
                <h3 className="font-medium">{appointment.patient.fullName}</h3>
                <p className="text-sm text-gray-600">
                  {appointment.patient.gender}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start">
                <Phone size={16} className="mr-2 mt-1 text-indigo-900" />
                <span>{appointment.patient.mobile}</span>
              </div>

              {hasPersonalInfo && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium mb-2">Personal Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Age: {hasPersonalInfo.age} years</div>
                    <div>Blood: {hasPersonalInfo.blood_group}</div>
                    <div className="col-span-2">
                      <p className="text-sm mt-1">
                        <span className="font-medium">Allergies:</span>{" "}
                        {hasPersonalInfo.allergies || "None"}
                      </p>
                      <p className="text-sm mt-1">
                        <span className="font-medium">Chronic Conditions:</span>{" "}
                        {hasPersonalInfo.chronic_disease || "None"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {hasAddress && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-start">
                    <MapPin size={16} className="mr-2 mt-1 text-indigo-900" />
                    <div className="text-sm">
                      {hasAddress.houseName && (
                        <div>{hasAddress.houseName}</div>
                      )}
                      {hasAddress.street && <div>{hasAddress.street}</div>}
                      <div>
                        {hasAddress.city && `${hasAddress.city}, `}
                        {hasAddress.state}
                      </div>
                      {hasAddress.postalCode && (
                        <div>{hasAddress.postalCode}</div>
                      )}
                      {hasAddress.country && <div>{hasAddress.country}</div>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Appointment Details */}
        <div className="md:col-span-2">
          {/* Date and Time Card */}
          <div className="bg-gray-50 rounded-lg p-4 shadow-sm mb-6">
            <h2 className="flex items-center text-lg font-semibold text-indigo-900 mb-4">
              <Calendar size={20} className="mr-2" /> Date & Time
            </h2>
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center mb-3 md:mb-0">
                <Calendar size={20} className="mr-3 text-indigo-900" />
                <span>
                  {formatDisplayDate(new Date(appointment.appointmentDate))}
                </span>
              </div>
              <div className="flex items-center">
                <Clock size={20} className="mr-3 text-indigo-900" />
                <span>
                  {formatTime2(new Date(appointment.slot.start_time))} -{" "}
                  {formatTime2(new Date(appointment.slot.end_time))}
                </span>
              </div>
            </div>
          </div>

          {/* Service Details Card */}
          <div className="bg-gray-50 rounded-lg p-4 shadow-sm mb-6">
            <h2 className="flex items-center text-lg font-semibold text-indigo-900 mb-4">
              <Activity size={20} className="mr-2" /> Service Details
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="font-medium text-lg">
                  {appointment.service.name}
                </div>
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    isOnlineAppointment
                      ? "bg-indigo-100 text-indigo-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {isOnlineAppointment ? (
                    <Camera size={16} className="mr-1" />
                  ) : (
                    <Home size={16} className="mr-1" />
                  )}
                  {appointment.service.mode}
                </div>
              </div>
              <div className="text-indigo-900 font-medium">
                Fee: ₹{appointment.service.fee.toFixed(2)}
              </div>
              {appointment.service.description && (
                <div className="text-gray-700">
                  <p>{appointment.service.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Prescription Card (if exists) */}
          {hasPrescription && (
            <div className="bg-gray-50 rounded-lg p-4 shadow-sm mb-6">
              <h2 className="flex items-center text-lg font-semibold text-indigo-900 mb-4">
                <FileText size={20} className="mr-2" /> Prescription
              </h2>
              <div className="mb-3">
                <h4 className="font-medium">Diagnosis:</h4>
                <p className="text-gray-700 mt-1">
                  {hasPrescription.diagnosis}
                </p>
              </div>
              <button
                onClick={handleViewPrescription}
                className="inline-flex items-center px-4 py-2 border border-indigo-900 text-sm font-medium rounded-md text-indigo-900 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FileText size={16} className="mr-2" />
                View Prescription
              </button>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-6">
            {isOnlineAppointment && (appointment.status !== "completed") ? (
              <button
                onClick={() => handleStartConsultation(appointment.patient._id)}
                className="w-full inline-flex justify-center items-center px-4 py-3 bg-indigo-900 text-white text-sm font-medium rounded-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <Camera size={20} className="mr-2" />
                Start Video Consultation
              </button>
            ) : (
              <button
                onClick={handleUploadPrescription}
                className="w-full inline-flex justify-center items-center px-4 py-3 bg-indigo-900 text-white text-sm font-medium rounded-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                <Upload size={20} className="mr-2" />
                Upload Prescription
              </button>
            )}+
            <button
              onClick={() => router.push(`/doctordashboard/chat/${userId}`)}
              className="w-full inline-flex justify-center items-center mt-4 px-4 py-3 bg-indigo-900 text-white text-sm font-medium rounded-md hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <MessageCircle size={20} className="mr-2" />
              Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointmentDetail;
