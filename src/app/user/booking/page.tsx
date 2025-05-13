"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Clock, User, AlertCircle } from "lucide-react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { toast, Toaster } from "react-hot-toast";
import { Schedule, Slot } from "../../../types/slotBooking";
import {
  getDoctorById,
  getDoctorScheduleByDate,
  initiateConsultationBooking,
  verifyConsultationBooking,
} from "../../../services/user/auth/authService";
import { IDoctor } from "@/types/IDoctor";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/homeComponents/Header";
import { AxiosError } from "axios";
import { useAuthStore } from "@/store/user/authStore";
import { RazorpayPaymentResponse } from "@/components/doctorComponents/Subscription";
import { RazorpayOptions } from "@/types/razorpayType";
import Image from "next/image";

declare global {
  interface Window {
    Razorpay: any; // Ideally, install the official Razorpay SDK types
  }
}

const DoctorSchedule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  const [doctor, setDoctor] = useState<IDoctor | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(
    null
  );
  const searchParams = useSearchParams();
  const doctorId = searchParams.get("doctorId");
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const userId = user?.id;

  useEffect(() => {
    if (!doctorId) return;
    fetchDoctorProfile();
  }, [doctorId]);

  const fetchDoctorProfile = async () => {
    try {
      setLoading(true);

      const response = await getDoctorById(doctorId as string);

      setDoctor(response);
    } catch (error) {
      setError("Failed to load doctor profile.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctor schedules on component mount and when date changes
  useEffect(() => {
    fetchSchedules();
  }, [selectedDate]);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await getDoctorScheduleByDate(doctorId!, selectedDate);

      if (res.success) {
        setSchedules(res.data);
      } else {
        toast.error(res.message || "Something went wrong.");
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;

      const errorMsg =
        error.response?.data?.message || "Failed to fetch schedules.";
      setSchedules([]);

      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Date navigation handlers
  const goToPreviousDay = () => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - 1);
    setSelectedDate(prevDate);
  };

  const goToNextDay = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setSelectedDate(nextDate);
  };

  // Format time from ISO string to human-readable format (e.g., "1:00 PM")

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC", //  Force UTC time
    });
  };
  // Format date to display (e.g., "Monday, April 17, 2025")
  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handle slot selection
  const handleSlotSelect = (slot: Slot, scheduleId: string) => {
    console.log("eduthe slot==>", slot);

    if (slot.status === "available" && !slot.is_break) {
      setSelectedSlot(slot);
      setSelectedScheduleId(scheduleId);
    }
  };

  const handlePayNow = async (
    scheduleId: string,
    slotId: string,
    fee: number,
    scheduleDate: string,
    departmentId: string,
    doctorId: string,
    serviceId: string
  ) => {
    // Here you can implement your payment logic

    try {
      const loadRazorpay = () =>
        new Promise<void>((resolve, reject) => {
          const razorpayScript = document.createElement("script");
          razorpayScript.src = "https://checkout.razorpay.com/v1/checkout.js";
          razorpayScript.async = true;
          razorpayScript.onload = () => resolve();
          razorpayScript.onerror = () => reject("Razorpay SDK failed to load");
          document.body.appendChild(razorpayScript);
        });

      await loadRazorpay();

      const initResponse = await initiateConsultationBooking({
        patientId: userId!,
        doctorScheduleId: scheduleId,
        slotId: slotId,
      });

      const { orderId, amount, currency } = initResponse;

      console.log("kodukkan ponath ==>", initResponse);

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: amount * 100,
        currency,
        name: "WellCare Healthcare",
        description: "Consultation Appointment Booking",
        order_id: orderId,
        handler: async function (response: RazorpayPaymentResponse) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            response;

          try {
            const verifyResponse = await verifyConsultationBooking({
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
              patientId: userId!,
              doctorScheduleId: scheduleId,
              slotId,
              appointmentDate: scheduleDate,
              departmentId,
              doctorId,
              serviceId,
            });

            if (verifyResponse.status) {
              toast.success(`Appointment booked successfully!`);

              router.push(
                `/user/booking/success?bookingId=${verifyResponse.bookingId}&slotId=${slotId}`
              );
            }
          } catch (verifyError) {
            toast.error("Payment succeeded, but booking failed!");
          }
        },
        prefill: {
          name: user?.fullName, // Optional
          email: user?.email, // Optional
          contact: "", // Optional
        },
        theme: {
          color: "#0d9488",
        },
      };
      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error("Razorpay SDK failed to load. Please try again later.");
      }
    } catch (error) {
      toast.error("Failed to initiate payment");
    }
  };

  // Handle calendar date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setCalendarOpen(false);
  };

  // Generate days for mini calendar display
  const generateCalendarDays = () => {
    const days = [];
    const currentDate = new Date();
    for (let i = -3; i <= 3; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  // Check if a service is offline and show toast if needed
  const checkServiceStatus = (schedule: Schedule) => {
    if (schedule.serviceId.mode === "Offline") {
      toast.custom(
        (t) => (
          <div
            className={`bg-white shadow-lg rounded-lg p-4 flex items-center ${
              t.visible ? "animate-enter" : "animate-leave"
            }`}
          >
            <AlertCircle className="text-red-500 mr-2" />
            <span>This service is currently offline</span>
          </div>
        ),
        { id: "offline-service", duration: 3000 }
      );
    }
  };

  // Get total consultation fee
  const getConsultationFee = () => {
    if (schedules.length > 0) {
      return schedules[0].serviceId.fee;
    }
    return 0;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medical-green"></div>
      </div>
    );

  if (error) return <p className="text-red-500 text-center p-6">{error}</p>;
  if (!doctor)
    return <p className="text-center p-6">No doctor information found.</p>;

  return (
    <>
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Toaster position="top-right" />

        {/* Doctor Info and Date Selection */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-16 h-16 relative rounded-full overflow-hidden mr-4">
              <Image
                src={doctor?.profileImage || "/default-profile.png"}
                alt={doctor?.fullName || "Doctor profile"}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold">{doctor?.fullName}</h1>
              <p className="text-gray-600">{doctor?.specialization}</p>
              <div className="flex items-center text-sm text-gray-500">
                <User size={16} className="mr-1" />
                <span>{doctor?.experience} experience</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goToPreviousDay}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setCalendarOpen(!calendarOpen)}
                  className="flex items-center py-2 px-4 border rounded-lg"
                >
                  <Calendar size={18} className="mr-2 text-gray-600" />
                  <span>{formatDisplayDate(selectedDate)}</span>
                </button>

                {calendarOpen && (
                  <div className="absolute z-10 mt-2 p-4 bg-white rounded-lg shadow-lg border">
                    <div className="grid grid-cols-7 gap-1">
                      {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                        <div
                          key={i}
                          className="text-center text-xs font-medium text-gray-500"
                        >
                          {day}
                        </div>
                      ))}

                      {Array.from({ length: 35 }).map((_, i) => {
                        const calendarDate = new Date(selectedDate);
                        calendarDate.setDate(1);
                        const firstDayOfMonth = calendarDate.getDay();
                        calendarDate.setDate(i - firstDayOfMonth + 1);

                        const isCurrentMonth =
                          calendarDate.getMonth() === selectedDate.getMonth();
                        const isToday =
                          new Date().toDateString() ===
                          calendarDate.toDateString();
                        const isSelected =
                          selectedDate.toDateString() ===
                          calendarDate.toDateString();

                        return (
                          <button
                            key={i}
                            onClick={() =>
                              handleDateSelect(new Date(calendarDate))
                            }
                            disabled={!isCurrentMonth}
                            className={`
                            h-8 w-8 rounded-full flex items-center justify-center text-sm
                            ${
                              !isCurrentMonth
                                ? "text-gray-300"
                                : "hover:bg-gray-100"
                            }
                            ${isToday ? "border border-medical-green" : ""}
                            ${
                              isSelected
                                ? "bg-medical-green text-white hover:bg-medical-green-light"
                                : ""
                            }
                          `}
                          >
                            {calendarDate.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={goToNextDay}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="flex justify-center space-x-4 overflow-x-auto py-2">
              {generateCalendarDays().map((date, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  className={`
                  flex flex-col items-center p-2 rounded-lg min-w-14
                  ${
                    date.toDateString() === selectedDate.toDateString()
                      ? "bg-medical-green text-white"
                      : "hover:bg-gray-100"
                  }
                `}
                >
                  <span className="text-xs font-medium">
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </span>
                  <span className="text-lg font-semibold">
                    {date.getDate()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 mb-6 p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-white border-2 border-medical-green rounded-full mr-2"></div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-200 rounded-full mr-2"></div>
            <span className="text-sm">Booked</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded-full mr-2"></div>
            <span className="text-sm">Break</span>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg bg-gray-100 p-4">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div
                      key={j}
                      className="h-12 bg-gray-200 rounded w-24"
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Schedule Display */}
        {!loading && schedules.length === 0 && (
          <div className="text-center py-16">
            <div className="flex justify-center mb-4">
              <Clock size={48} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-700">
              No schedules available
            </h3>
            <p className="text-gray-500 mt-2">Try selecting a different date</p>
          </div>
        )}

        {!loading && schedules.length > 0 && (
          <div className="space-y-6">
            {schedules.map((schedule) => (
              <div key={schedule._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-medium text-lg">
                      {schedule.serviceId.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formatTime(schedule.start_time)} -{" "}
                      {formatTime(schedule.end_time)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`
                      px-3 py-1 rounded-full text-sm font-medium
                      ${
                        schedule.serviceId.mode === "Online"
                          ? "bg-gray-200 text-gray-700"
                          : "bg-red-100 text-red-700"
                      }
                    `}
                      onClick={() =>
                        schedule.serviceId.mode === "Offline" &&
                        checkServiceStatus(schedule)
                      }
                    >
                      {schedule.serviceId.mode}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-4">
                  {schedule.availability.map((slot) => {
                    // Determine the slot styling based on its status and properties
                    let slotClass =
                      "py-2 px-3 rounded-lg border text-center cursor-pointer transition";
                    if (slot.is_break) {
                      slotClass +=
                        " bg-yellow-50 border-yellow-300 cursor-not-allowed";
                    } else if (slot.status === "booked") {
                      slotClass +=
                        " bg-gray-200 text-gray-600 cursor-not-allowed";
                    } else if (slot.status === "pending") {
                      slotClass +=
                        " bg-orange-100 border-orange-300 text-orange-700 cursor-not-allowed";
                    } else {
                      slotClass +=
                        " border-medical-green hover:bg-medical-green hover:text-white";
                      // Add selected state
                      if (selectedSlot?.slot_id === slot.slot_id) {
                        slotClass += " bg-medical-green text-white";
                      }
                    }

                    return (
                      <div
                        key={slot.slot_id}
                        className={slotClass}
                        onClick={() => handleSlotSelect(slot, schedule._id)}
                      >
                        <div className="text-sm font-medium">
                          {formatTime(slot.start_time)}
                        </div>
                        <div className="text-xs">
                          {slot.is_break
                            ? "Break"
                            : slot.status === "booked"
                            ? "Booked"
                            : slot.status === "pending"
                            ? "Pending"
                            : "Available"}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-lg font-medium">
                    Consultation Fee: ₹{schedule.serviceId.fee}
                  </div>
                  <button
                    onClick={() => {
                      if (selectedSlot && selectedScheduleId === schedule._id) {
                        handlePayNow(
                          schedule._id,
                          selectedSlot.slot_id!,
                          schedule.serviceId.fee,
                          schedule.date,
                          doctor.departmentId._id,
                          doctorId!,
                          schedule.serviceId._id!
                        );
                      }
                    }}
                    disabled={
                      !selectedSlot ||
                      selectedSlot.status !== "available" ||
                      selectedSlot.is_break
                    }
                    className={`
                    px-6 py-2 rounded-lg font-medium
                    ${
                      !selectedSlot || selectedScheduleId !== schedule._id
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-medical-green text-white hover:bg-medical-green-light"
                    }
                  `}
                  >
                    Pay Now
                  </button>
                  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default DoctorSchedule;
