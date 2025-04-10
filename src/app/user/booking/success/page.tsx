"use client"
import { useEffect, useState } from 'react';
import { Check, Calendar, Clock, ArrowLeft, ClipboardList, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { BookingDetails } from '@/types/slotBooking';
import { getBookingDetails } from '@/services/user/auth/authService';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatTime, formatTime2 } from '@/utils/dateutilities';
// Types


const BookingConfirmation = () => {
//   const { bookingId, slotId } = useParams<{ bookingId: string; slotId: string }>();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
//   const navigate = useNavigate();
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')
  const slotId = searchParams.get('slotId')
  const router = useRouter()


  useEffect(() => {
    const fetchBookingDetails = async () => {

        if (!bookingId || !slotId) {
          toast.error("Missing booking information");
          return;
        }
        setLoading(true);
        
      try {
        const response = await getBookingDetails(bookingId, slotId);
        console.log("success aayi vannath ==> ",response);
        
        setBooking(response.data);
      } catch (error) {
        toast.error("Failed to load booking details. Please try again.");
        console.error("Error fetching booking details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId, slotId]);

  const handleGoHome = () => {
    router.push("/")
  };

  const handleViewAppointments = () => {
    // navigate('/user/my-appointments');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
        <div className="w-16 h-16 border-4 border-t-4 border-t-medical-green rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">Loading your confirmation...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <h2 className="mt-4 text-xl font-bold text-gray-800">Booking Not Found</h2>
        <p className="mt-2 text-gray-600">We couldn't find your booking details.</p>
        <button 
          onClick={handleGoHome}
          className="px-6 py-2 mt-6 text-white rounded-full bg-medical-green hover:bg-medical-green-light transition-all duration-300"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 animate-fadeIn">
        {/* Success Header */}
        <div className="bg-medical-green p-6 flex items-center justify-center">
          <div className="bg-white rounded-full p-2 animate-scaleIn">
            <Check className="w-8 h-8 text-medical-green" />
          </div>
          <h1 className="text-white text-xl md:text-2xl font-bold ml-3">Appointment Confirmed</h1>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Doctor Info */}
          <div className="flex items-center mb-6 animate-slideIn">
            <img 
              src={booking.doctorId.profileImage || "/api/placeholder/80/80"} 
              alt={booking.doctorId.fullName}
              className="w-16 h-16 rounded-full object-cover border-2 border-medical-green"
            />
            <div className="ml-4">
              <h2 className="text-lg font-bold text-gray-800">{booking.doctorId.fullName}</h2>
              <p className="text-gray-600">{booking.doctorId.specialization}</p>
              <p className="text-sm text-gray-500">{booking.doctorId.experience} Years Experience</p>
            </div>
          </div>

          {/* Department */}
          <div className="mb-4 border-b pb-4">
            <p className="text-gray-600">
              <span className="font-medium">Department:</span> {booking.departmentId.name.charAt(0).toUpperCase() + booking.departmentId.name.slice(1)}
            </p>
          </div>

          {/* Date & Time */}
          <div className="mb-4 border-b pb-4">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-medical-green mr-2" />
              <span className="font-medium text-gray-700">Appointment Date:</span>
            </div>
            <p className="ml-7 text-gray-600">{new Date(booking.appointmentDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            
            <div className="flex items-center mt-3 mb-2">
              <Clock className="w-5 h-5 text-medical-green mr-2" />
              <span className="font-medium text-gray-700">Time Slot:</span>
            </div>
            <p className="ml-7 text-gray-600">
              {formatTime2(new Date(booking.selectdSlot.start_time))} - 
              {formatTime2(new Date(booking.selectdSlot.end_time))}
            </p>
          </div>

          {/* Service Details */}
          <div className="mb-4 border-b pb-4">
            <h3 className="font-medium text-gray-700 mb-2">Service Details:</h3>
            <p className="text-gray-600"><span className="font-medium">Name:</span> {booking.serviceId.name}</p>
            <p className="text-gray-600"><span className="font-medium">Mode:</span> {booking.serviceId.mode}</p>
            <p className="text-gray-600"><span className="font-medium">Fee:</span> ₹{booking.serviceId.fee}</p>
          </div>

          {/* Status */}
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="py-1 px-3 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Status: {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
            <span className="py-1 px-3 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              Payment: {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button 
              onClick={handleGoHome}
              className="flex-1 py-3 px-4 rounded-full border-2 border-medical-green text-medical-green hover:bg-gray-50 font-medium flex items-center justify-center transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go to Home
            </button>
            <button 
              onClick={handleViewAppointments}
              className="flex-1 py-3 px-4 rounded-full bg-medical-green text-white hover:bg-medical-green-light font-medium flex items-center justify-center transition-all duration-300"
            >
              <ClipboardList className="w-4 h-4 mr-2" />
              View My Appointments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;