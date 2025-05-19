"use client";

import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  User,
  Receipt,
  FileText,
  MessageCircle,
  XCircle,
  AlertTriangle,
  MapPin,
  ArrowLeft,
  Loader2,
  Stethoscope,
} from "lucide-react";
import {
  CancelAppointment,
  fetchPrescriptionFile,
  getAppoinmentsDetails,
} from "@/services/user/auth/authService";
import { AppointmentDetailDTO } from "@/types/slotBooking";
import { formatDisplayDate, formatTime2 } from "../../utils/dateutilities";
import toast from "react-hot-toast";
import DoctorReviewForm, { ReviewFormData } from "../commonUIElements/DoctorReviewForm";
import Image from "next/image";

interface Props {
  appointmentId: string;
  onBack: () => void;
}

const AppointmentDetail: React.FC<Props> = ({ appointmentId, onBack }) => {
  const [appointment, setAppointment] = useState<AppointmentDetailDTO | null>(
    null
  );

  console.log("==>", appointment);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  const appoinmentStatusCancelled = appointment?.status === "cancelled";
  const appoinmentStatusCompleted = appointment?.status === "completed";
  console.log(appoinmentStatusCancelled);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      if (!appointmentId) {
        setError("Appointment ID is missing");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const data = await getAppoinmentsDetails(appointmentId!);

        if (!data) {
          throw new Error("No data returned from the API");
        }

        

        setAppointment(data);
        setError(null);
      } catch (err) {
        setError("Failed to load appointment details");
        console.error("Error fetching appointment details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (appointmentId) {
      console.log("--->", appointmentId);

      fetchAppointmentDetails();
    }
  }, [appointmentId]);

  const extractFileName = (url: string) => {
    return url.substring(url.lastIndexOf("/") + 1);
  };

  const downloadPrescription = async (fileName: string) => {
    try {
      const fileNameExtracted = extractFileName(fileName);


      const fileBlob = await fetchPrescriptionFile(fileNameExtracted);

      
      const customDownloadName = `Prescription_${Date.now()}.pdf`;
  
      const blobUrl = window.URL.createObjectURL(fileBlob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", customDownloadName); // optional: custom name
      document.body.appendChild(link);
      link.click();
      link.remove();
  
      // Clean up the blob after use
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed", err);
      toast.error("Failed to download prescription.");
    }
  };
  
  const handleCancelAppointment = async () => {
    if (!appointment || !appointment._id) {
    toast.error("Invalid appointment.");
    return;
  }
    try {
      setIsCancelling(true);

      const result = await CancelAppointment(appointment._id, cancelReason);

      

      toast.success(result.message);

      setAppointment((prev) => ({
        ...prev!,
        status: "cancelled",
      }));

      setShowCancelModal(false);
      setCancelReason("");
    } catch (error: unknown) {
      const message =
      error instanceof Error ? error.message : "Failed to cancel appointment";
    toast.error(message);
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getServiceModeIcon = (mode: string) => {
    switch (mode.toLowerCase()) {
      case "online":
        return "🌐";
      case "in-person":
        return "🏥";
      case "both":
        return "🔄";
      default:
        return "📋";
    }
  };

  const handleSuccess  = (data:ReviewFormData) =>{
    console.log(data);
    
   toast.success('Review submitted successfully!');
  }
   const handleError = (error: unknown) => {
    toast.error('Failed to submit review. Please try again.');
    console.error('Review submission error:', error);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="mr-2 animate-spin" />
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="p-4 text-red-600">{error || "Appointment not found"}</div>
    );
  }

  const appointmentDate = new Date(appointment.appointmentDate);
  const startTime = new Date(appointment.slot.start_time);
  const endTime = new Date(appointment.slot.end_time);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="mb-4 flex items-center text-sm text-green-600 hover:underline"
      >
        <ArrowLeft className="mr-1" size={16} /> Back to Appointments
      </button>

      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Appointment Details
      </h2>

      {/* Status and ID */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-3">
        <div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              appointment.status
            )}`}
          >
            {appointment.status}
          </span>
          <span className="text-gray-500 text-sm ml-2">
            ID: {appointment._id.substring(0, 8)}
          </span>
        </div>
        <div
          className={`flex items-center ${getPaymentStatusColor(
            appointment.paymentStatus!
          )}`}
        >
          <Receipt size={16} className="mr-1" />
          <span className="font-medium">{appointment.paymentStatus}</span>
        </div>
      </div>

      {/* Date and Time */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex items-center mb-3">
          <Calendar size={20} className="text-medical-green mr-2" />
          <span className="font-medium">
            {formatDisplayDate(appointmentDate)}
          </span>
        </div>
        <div className="flex items-center">
          <Clock size={20} className="text-medical-green mr-2" />
          <span className="font-medium">
            {formatTime2(startTime)} - {formatTime2(endTime)}
          </span>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-blue-50">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
          <Stethoscope size={18} className="text-medical-green mr-2" />
          <span>Service Details</span>
          <span className="ml-2">✨</span>
        </h3>

        <div className="space-y-3">
          <div className="flex items-start">
            <div className="w-24 text-gray-600 font-medium">Service:</div>
            <div className="flex-1 font-semibold">
              {appointment.service.name}
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-24 text-gray-600 font-medium">Mode:</div>
            <div className="flex-1">
              <span className="mr-2">
                {getServiceModeIcon(appointment.service.mode)}
              </span>
              {appointment.service.mode}
            </div>
          </div>

          <div className="flex items-start">
            <div className="w-24 text-gray-600 font-medium">Fee:</div>
            <div className="flex-1 font-medium text-green-700">
              ₹{appointment.service.fee.toFixed(2)}
            </div>
          </div>

          {appointment.service.description && (
            <div className="flex items-start">
              <div className="w-24 text-gray-600 font-medium">Description:</div>
              <div className="flex-1 text-gray-700">
                {appointment.service.description}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Doctor Details */}
      <div className="border border-gray-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Doctor Information
        </h3>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Doctor Image */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
              {appointment.doctor.profileImage ? (
                <Image
                width={65}
                height={65}
                  src={appointment.doctor.profileImage}
                  alt={appointment.doctor.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={36} className="text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Doctor Info */}
          <div className="flex-grow">
            <h4 className="font-bold text-lg">{appointment.doctor.fullName}</h4>
            <p className="text-gray-600">{appointment.doctor.specialization}</p>
            <p className="text-sm text-gray-500 mb-2">
              {appointment.doctor.experience} years experience
            </p>

            {appointment.doctor.clinicAddress && (
              <div className="mt-2">
                <div className="flex items-start">
                  <MapPin
                    size={16}
                    className="text-gray-500 mt-1 mr-1 flex-shrink-0"
                  />
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">
                      {appointment.doctor.clinicAddress.clinicName}
                    </p>
                    <p>{appointment.doctor.clinicAddress.street}</p>
                    <p>
                      {appointment.doctor.clinicAddress.city},{" "}
                      {appointment.doctor.clinicAddress.state},{" "}
                      {appointment.doctor.clinicAddress.country}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prescription Information (if available) */}
      {appointment.prescription && (
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
            <FileText size={18} className="text-medical-green mr-2" />
            Prescription
          </h3>

          <div className="bg-gray-50 p-3 rounded">
            <p className="font-medium mb-2">Diagnosis:</p>
            <p className="text-gray-700 mb-3">
              {appointment.prescription.diagnosis}
            </p>

            {appointment.prescriptionUrl && (
              <button
                onClick={() => downloadPrescription(appointment.prescriptionUrl!)}
                className="inline-flex items-center text-medical-green hover:text-medical-green-light transition-colors"
              >
                <FileText size={16} className="mr-1" />
                Download Prescription File
              </button>
            )}
            
          </div>
        </div>
      )}

       
      <DoctorReviewForm 
      doctorId={appointment.doctor._id!}
       onSuccess={handleSuccess}
        onError={handleError}
      />
    

      {/* Action Buttons */}
      {!appoinmentStatusCancelled && !appoinmentStatusCompleted && (
        <div className="flex flex-col md:flex-row gap-3 mt-6">
          <button className="flex-1 bg-medical-green text-white py-3 px-4 rounded-md hover:bg-medical-green-light transition-colors font-medium flex items-center justify-center">
            <MessageCircle size={18} className="mr-2" />
            Message Doctor
          </button>

          <button
            onClick={() => setShowCancelModal(true)}
            className="flex-1 bg-red-500 text-white py-3 px-4 rounded-md hover:bg-red-600 transition-colors font-medium flex items-center justify-center"
          >
            <XCircle size={18} className="mr-2" />
            Cancel Appointment
          </button>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-4 p-3 bg-yellow-50 rounded-md flex items-start">
        <AlertTriangle
          size={18}
          className="text-yellow-600 mr-2 flex-shrink-0 mt-0.5"
        />
        <p className="text-sm text-yellow-800">
          <strong className="font-semibold">Cancellation Policy:</strong> You
          can cancel your appointment only{" "}
          <span className="font-medium">at least 4 hours before</span> the
          scheduled slot start time. Cancellations made after this period are
          not eligible for a refund.
        </p>
      </div>

      {/* modal canncelaltion */}

      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Confirm Cancellation
            </h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to cancel this appointment? This action
              cannot be undone.
            </p>

            <textarea
              placeholder="Optional: Reason for cancellation"
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-sm px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200"
              >
                Close
              </button>
              <button
                onClick={handleCancelAppointment}
                disabled={isCancelling}
                className="text-sm px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 flex items-center"
              >
                {isCancelling && (
                  <Loader2 size={16} className="mr-2 animate-spin" />
                )}
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentDetail;

