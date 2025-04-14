import React, { useState, useEffect } from "react";
import { 
  Calendar, Clock, User, Stethoscope, ChevronLeft, ChevronRight, 
  ArrowRight, Search, Filter, X, ExternalLink, RefreshCw, Eye
} from "lucide-react";
import { getDoctorAppointments } from "@/services/doctor/doctorService";
// import { formatDisplayDate, formatTime2 } from "@/utils/dateutilities";
import { DoctorAppointmentListItemDTO, PaginationInfo } from "@/types/slotBooking";
import DoctorAppointmentDetail from "./AppointmentDetails";



const formatDisplayDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime2 = (timeString: Date) => {
  const date = new Date(timeString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
};



// Status Badge Component
const StatusBadge: React.FC<{ status: DoctorAppointmentListItemDTO["status"] }> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case "booked":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rescheduled":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Payment Status Badge Component
const PaymentBadge: React.FC<{ status: DoctorAppointmentListItemDTO["paymentStatus"] }> = ({ status }) => {
  const getPaymentColor = () => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "unpaid":
        return "bg-gray-100 text-gray-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentColor()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Appointment Card Component
const AppointmentCard: React.FC<{ appointment: DoctorAppointmentListItemDTO }> = ({ appointment }) => {
  const [viewDetails,setViewDetails] = useState<boolean>(false)
  const [appointmentDetailId,setAppointmentDetailId] = useState<string>("")

  const handleViewDetails = (id: string) => {
    if (appointmentDetailId === id) {
      
      setViewDetails(false);
      setAppointmentDetailId("");
    } else {
     
      setAppointmentDetailId(id);
      setViewDetails(true);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 border border-gray-100 transition-all hover:shadow-lg">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center mb-3">
            <User size={20} className="text-[#03045e] mr-2" />
            <h3 className="font-semibold text-lg text-[#03045e]">{appointment.patient.fullName}</h3>
            <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {appointment.patient.gender}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
            <div className="flex items-center">
              <Calendar size={16} className="text-[#03045e] mr-2" />
              <span className="text-sm text-gray-700">
                {formatDisplayDate(appointment.appointmentDate)}
              </span>
            </div>
            
            <div className="flex items-center">
              <Clock size={16} className="text-[#03045e] mr-2" />
              <span className="text-sm text-gray-700">
                {formatTime2(appointment.slot.start_time)} - {formatTime2(appointment.slot.end_time)}
              </span>
            </div>
          </div>
          
          <div className="mb-3 flex items-center">
            <Stethoscope size={16} className="text-[#03045e] mr-2" />
            <span className="text-sm text-gray-700 mr-2">{appointment.service.name}</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {appointment.service.mode}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-start md:items-end gap-2">
          <StatusBadge status={appointment.status} />
          <PaymentBadge status={appointment.paymentStatus} />
          
          {/* View Details Button */}
          <div className="flex w-full justify-start md:justify-end mt-2 gap-2">
            <button 
              onClick={() => handleViewDetails(appointment._id)}
              className="flex items-center text-sm font-medium text-white bg-[#03045e] hover:bg-blue-900 transition-colors px-4 py-2 rounded-md shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#03045e] focus:ring-opacity-50"
              aria-label={`View details for ${appointment.patient.fullName}'s appointment`}
            >
              <Eye size={16} className="mr-2" />
              <span>View Details</span>
            </button>
          </div>
        </div>
      </div>

      {
        viewDetails&&(

          <DoctorAppointmentDetail appointmentId={appointmentDetailId}/>
        )
      }
      

    </div>
  );
};

// Filter Bar Component
const FilterBar: React.FC<{
  filters: {
    date: string;
    mode: string;
    status: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    date: string;
    mode: string;
    status: string;
    page: number;
  }>>;
}> = ({ filters, setFilters }) => {
  
  const dateOptions = [
    { value: "all", label: "All Dates" },
    { value: "today", label: "Today" },
    { value: "tomorrow", label: "Tomorrow" },
    { value: "past", label: "Past" },
    { value: "upcoming", label: "Upcoming" }
  ];
  
  const resetFilters = () => {
    setFilters({
      date: "all",
      mode: "all",
      status: "all",
      page: 1
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#03045e]">Filters</h2>
        <button 
          onClick={resetFilters}
          className="flex items-center text-xs text-gray-600 hover:text-[#03045e]"
        >
          <RefreshCw size={14} className="mr-1" /> Reset
        </button>
      </div>
      
      <div className="flex flex-wrap gap-4">
        {/* Date Filter */}
        <div className="flex flex-col flex-1 min-w-[150px]">
          <label className="text-xs font-medium text-gray-600 mb-1 flex items-center">
            <Calendar size={14} className="mr-1 text-[#03045e]" /> Date
          </label>
          <select 
            value={filters.date}
            onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value, page: 1 }))}
            className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#03045e] focus:border-transparent"
          >
            {dateOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        
        {/* Mode Filter */}
        <div className="flex flex-col flex-1 min-w-[150px]">
          <label className="text-xs font-medium text-gray-600 mb-1 flex items-center">
            <Stethoscope size={14} className="mr-1 text-[#03045e]" /> Mode
          </label>
          <select 
            value={filters.mode}
            onChange={(e) => setFilters(prev => ({ ...prev, mode: e.target.value, page: 1 }))}
            className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#03045e] focus:border-transparent"
          >
            <option value="all">All Modes</option>
            <option value="Online">Online</option>
            <option value="In-Person">In-Person</option>
            <option value="both">Both</option>
          </select>
        </div>
        
        {/* Status Filter */}
        <div className="flex flex-col flex-1 min-w-[150px]">
          <label className="text-xs font-medium text-gray-600 mb-1 flex items-center">
            <Filter size={14} className="mr-1 text-[#03045e]" /> Status
          </label>
          <select 
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
            className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#03045e] focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="booked">Booked</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="pending">Pending</option>
            <option value="rescheduled">Rescheduled</option>
          </select>
        </div>
      </div>
      
    </div>
  );
};

// Pagination Component
const Pagination: React.FC<{
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}> = ({ pagination, onPageChange }) => {
  const totalPages = Math.ceil(pagination.total / pagination.limit);
  
  return (
    <div className="flex items-center justify-between mt-6 text-sm">
      <div className="text-gray-600">
        Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to <span className="font-medium">
          {Math.min(pagination.page * pagination.limit, pagination.total)}
        </span> of <span className="font-medium">{pagination.total}</span> appointments
      </div>
      
      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
          className={`p-2 rounded-md flex items-center justify-center ${
            pagination.page === 1 
              ? "text-gray-300 cursor-not-allowed" 
              : "text-gray-700 hover:bg-gray-100"
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </button>
        
        <span className="px-4 py-2 rounded-md bg-[#03045e] text-white font-medium">
          {pagination.page}
        </span>
        
        <button
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page >= totalPages}
          className={`p-2 rounded-md flex items-center justify-center ${
            pagination.page >= totalPages 
              ? "text-gray-300 cursor-not-allowed" 
              : "text-gray-700 hover:bg-gray-100"
          }`}
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyState: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-100">
      <Calendar size={48} className="mx-auto text-[#03045e] mb-4 opacity-50" />
      <h3 className="text-xl font-medium text-[#03045e] mb-2">No appointments found</h3>
      <p className="text-gray-500 max-w-md mx-auto">
        There are no appointments matching your current filters. Try adjusting your filters or check back later.
      </p>
    </div>
  );
};

// Loading State Component
const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#03045e]"></div>
      <p className="mt-4 text-gray-600">Loading appointments...</p>
    </div>
  );
};

// Main Component
const DoctorAppointmentsPage: React.FC = () => {
  const [filters, setFilters] = useState({
    date: "all",
    mode: "all",
    status: "all",
    page: 1
  });
  
  const [appointments, setAppointments] = useState<DoctorAppointmentListItemDTO[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 10, total: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch appointments when filters or page changes
  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await getDoctorAppointments(filters);
        console.log("vannath===>",response)
        setAppointments(response.data);
        setPagination(response.pagination);
      } catch (err) {
        setError("Failed to load appointments. Please try again.");
        console.error("Error fetching appointments:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAppointments();
  }, [filters]);
  
  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#03045e] mb-2">Doctor Appointments</h1>
        <p className="text-gray-600">View and manage all your upcoming and past appointments</p>
      </div>
      
      <FilterBar filters={filters} setFilters={setFilters} />
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex items-center">
          <X size={20} className="mr-2" />
          {error}
        </div>
      )}
      
      {isLoading ? (
        <LoadingState />
      ) : appointments.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
            {appointments.map(appointment => (
              <AppointmentCard key={appointment._id} appointment={appointment} />
            ))}
          </div>
          
          <Pagination 
            pagination={pagination} 
            onPageChange={handlePageChange} 
          />
        </>
      )}
    </div>
  );
};

export default DoctorAppointmentsPage;