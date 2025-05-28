import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
  X,
  Loader2,
  CalendarDaysIcon,
  Trash2,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  cancelSchedule,
  fetchSchedules,
  getServices,
} from "@/services/doctor/doctorService";
// import { ServiceData } from './ServiceComponent';
import { useAuthStoreDoctor } from "@/store/doctor/authStore";
import toast from "react-hot-toast";
import ScheduleModal from "./ScheduleModal";
import { AxiosError } from "axios";
import RecurringScheduleModal from "./RecurringScheduleModal";

// Interfaces
interface Doctor {
  name: string;
  specialization: string;
}

interface ServiceData {
  _id: string;
  name: string;
  mode: string;
  fee: number;
}

interface Slot {
  slot_id: string;
  status:
    | "available"
    | "booked"
    | "pending"
    | "rescheduled"
    | "cancelled"
    | "completed";
  start_time: string;
  end_time: string;
  is_break: boolean;
  _id: string;
  patient?: string;
}

export interface Schedule {
  _id: string;
  doctorId: string;
  serviceId: ServiceData;
  date: string;
  start_time: string;
  end_time: string;
  duration: number;
  isCancelled?: true;
  availability: Slot[];
  doctor?: Doctor;
}

interface PaginationInfo {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
}

export interface FilterParams {
  doctorId?: string;
  service?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Main Component
export default function DoctorScheduleManager() {
  const { user } = useAuthStoreDoctor();
  const doctorId = user?.id;

  // States
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    totalRecords: 0,
    totalPages: 0,
    currentPage: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );

  // Filter states
  const [filters, setFilters] = useState<FilterParams>({
    doctorId: doctorId,
    page: 1,
    limit: 10,
    sortBy: "date",
    sortOrder: "asc",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isRecurringScheduleModalOpen,setIsRecurringScheduleModalOpen] = useState(false);
  const [availableServices, setAvailableServices] = useState<ServiceData[]>([]);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(
    null
  );

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await getServices(doctorId!);

      if (response.success) {
        setAvailableServices(response.data || []);
      } else {
        toast.error(response.message || "Failed to fetch services");
      }
    } catch (error) {
      toast.error("An error occurred while fetching services");
      console.error("Error fetching services:", error);
    }
  };

  // Load schedules on mount and when filters change
  useEffect(() => {
    loadSchedules();
  }, [filters]);

  const loadSchedules = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchSchedules(filters);

      setSchedules(result.schedules);
      setPagination(result.pagination);
    } catch (err) {
      setError("Failed to load schedules. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (name: string, value: string|Date|number|null) => {
    console.log("name==",name,"==",value);
    
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      // Reset to page 1 when changing filters
      ...(name !== "page" && { page: 1 }),
    }));
  };

  // Quick filter handlers
  const handleTodayFilter = () => {
    const today = new Date();
    setFilters((prev) => ({
      ...prev,
      startDate: today,
      endDate: today,
      page: 1,
    }));
  };

  const handleTomorrowFilter = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setFilters((prev) => ({
      ...prev,
      startDate: tomorrow,
      endDate: tomorrow,
      page: 1,
    }));
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      doctorId: doctorId,
      page: 1,
      limit: 10,
      sortBy: "date",
      sortOrder: "asc",
    });
  };

  const handleCancelSchedule = async () => {
    if (!selectedScheduleId || !cancelReason) {
      toast.error("Please provide a cancellation reason.");
      return;
    }

    try {
      cancelSchedule(cancelReason, selectedScheduleId);

      toast.success("Schedule cancelled successfully.");
      setCancelModalOpen(false);
      setCancelReason("");
      setSelectedScheduleId(null);

      loadSchedules();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      const message = err.response?.data?.message || "Something went wrong.";
      toast.error(message);
    }
  };

  // View schedule details
  const handleViewSchedule = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };

  // Get slot status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "booked":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rescheduled":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get slot status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return "🟢";
      case "booked":
        return "🔴";
      case "pending":
        return "🟡";
      case "rescheduled":
        return "🟠";
      case "cancelled":
        return "⚫";
      case "completed":
        return "🔵";
      default:
        return "⚪";
    }
  };

  // Format date to display format
  const formatDate = (dateString: string) => {
    try {
      // Check if dateString is a valid ISO date
      if (dateString && Date.parse(dateString)) {
        return format(new Date(dateString), "dd MMM yyyy");
      }
      return "Invalid date";
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

   const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC", // 👈 Force UTC time
    });
  };

  // Count available slots
  const countAvailableSlots = (slots: Slot[]) => {
    return slots.filter((slot) => slot.status === "available").length;
  };

  const handleNewScheduleAdded = (newSchedule: Schedule) => {
    console.log("new : ",newSchedule);
    
      setSchedules(prev => [newSchedule, ...prev]); // Add new schedule at the beginning
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Doctor Schedules
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              View and manage appointment schedules for your medical practice
            </p>
          </div>
          <div className="mt-4 flex space-x-2 md:mt-0 md:ml-4">
            <button
              type="button"
              onClick={() => setIsScheduleModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#03045e] hover:bg-[#020344] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <CalendarDaysIcon className="h-5 w-5 mr-2" />
              Add per day Schedule
            </button>
            <button
              type="button"
              onClick={() => setIsRecurringScheduleModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#03045e] hover:bg-[#020344] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <CalendarDaysIcon className="h-5 w-5 mr-2" />
              Add Multiple day Schedule
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 mb-2 sm:mb-0"
            >
              <Filter className="w-4 h-4 mr-2" />
              {isFilterOpen ? "Hide Filters" : "Show Filters"}
            </button>

            <div className="flex space-x-2">
              <button
                onClick={handleTodayFilter}
                className="px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Today
              </button>
              <button
                onClick={handleTomorrowFilter}
                className="px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Tomorrow
              </button>
              <button
                onClick={handleResetFilters}
                className="px-3 py-2 text-xs font-medium text-white bg-[#03045e] rounded-md hover:bg-[#020344]"
              >
                Reset
              </button>
            </div>
          </div>

          {isFilterOpen && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* Service Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service
                </label>
                <select
                  value={filters.service || ""}
                  onChange={(e) =>
                    handleFilterChange("service", e.target.value)
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">All Services</option>
                  {availableServices.map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <DatePicker
                  selected={filters.startDate}
                  onChange={(date) => handleFilterChange("startDate", date)}
                  dateFormat="dd/MM/yyyy"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholderText="Select start date"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <DatePicker
                  selected={filters.endDate}
                  onChange={(date) => handleFilterChange("endDate", date)}
                  dateFormat="dd/MM/yyyy"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholderText="Select end date"
                  minDate={filters.startDate!}
                />
              </div>

              {/* Sorting */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="date">Date</option>
                  <option value="serviceId.name">Service Name</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort Order
                </label>
                <select
                  value={filters.sortOrder}
                  onChange={(e) =>
                    handleFilterChange(
                      "sortOrder",
                      e.target.value as "asc" | "desc"
                    )
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-[#03045e] animate-spin" />
            <span className="ml-2 text-lg font-medium text-gray-700">
              Loading schedules...
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
            <div className="flex">
              <X className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && schedules.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No schedules found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters or add new schedules.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#03045e] hover:bg-[#020344] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <CalendarDaysIcon
                  className="-ml-1 mr-2 h-5 w-5"
                  aria-hidden="true"
                />
                Add Schedule
              </button>
            </div>
          </div>
        )}

        {/* Schedules Grid */}
        {!loading && !error && schedules.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {schedules.map((schedule) => (
              <div
                key={schedule._id}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    {/* <div>
                      <h3 className="text-lg font-medium text-gray-900">Doctor ID: {schedule.doctorId}</h3>
                      {schedule.doctor && (
                        <p className="text-sm text-gray-500">{schedule.doctor.specialization}</p>
                      )}
                    </div> */}
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {formatDate(schedule.date)}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Service</span>
                      <span className="font-medium text-gray-900">
                        {schedule.serviceId.name}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-500">Mode</span>
                      <span className="font-medium text-gray-900">
                        {schedule.serviceId.mode}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-500">Fee</span>
                      <span className="font-medium text-gray-900">
                        ₹{schedule.serviceId.fee}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-500">Time</span>
                      <span className="font-medium text-gray-900">
                        {formatTime(schedule.start_time)} -{" "}
                        {formatTime(schedule.end_time)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-500">Duration</span>
                      <span className="font-medium text-gray-900">
                        {schedule.duration} mins
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-500">Available Slots</span>
                      <span
                        className={`font-medium ${
                          countAvailableSlots(schedule.availability) > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {countAvailableSlots(schedule.availability)} /{" "}
                        {schedule.availability.length}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <button
                    onClick={() => handleViewSchedule(schedule)}
                    className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#03045e] hover:bg-[#020344] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </button>
                  {!schedule.isCancelled ? (
                    <button
                      onClick={() => {
                        setSelectedScheduleId(schedule._id);
                        setCancelModalOpen(true);
                      }}
                      className="w-full mt-2 flex justify-center items-center px-4 py-2 border border-red-600 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Cancel Schedule
                    </button>
                  ) : (
                    <div className="w-full mt-2 px-4 py-2 text-sm text-center rounded-md bg-gray-100 text-red-500 border border-red-200">
                      Schedule Cancelled
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* canecell modal */}

        {cancelModalOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
              <h3 className="text-lg font-semibold text-red-600 mb-2">
                Cancel Schedule
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Cancelling this schedule will automatically refund any booked
                appointments. Please provide a reason for cancellation:
              </p>
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                placeholder="Enter reason..."
                rows={4}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => {
                    setCancelModalOpen(false);
                    setCancelReason("");
                    setSelectedScheduleId(null);
                  }}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCancelSchedule}
                  className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && schedules.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(pagination.currentPage - 1) * filters.limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      pagination.currentPage * filters.limit,
                      pagination.totalRecords
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{pagination.totalRecords}</span>{" "}
                  results
                </p>
              </div>
              <div className="flex items-center">
                <select
                  value={filters.limit}
                  onChange={(e) =>
                    handleFilterChange("limit", Number(e.target.value))
                  }
                  className="mr-4 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="10">10 per page</option>
                  <option value="20">20 per page</option>
                  <option value="50">50 per page</option>
                </select>

                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() =>
                      handleFilterChange("page", pagination.currentPage - 1)
                    }
                    disabled={pagination.currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      pagination.currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: pagination.totalPages }).map(
                    (_, index) => (
                      <button
                        key={index}
                        onClick={() => handleFilterChange("page", index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          pagination.currentPage === index + 1
                            ? "z-10 bg-[#03045e] border-[#03045e] text-white"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {index + 1}
                      </button>
                    )
                  )}

                  <button
                    onClick={() =>
                      handleFilterChange("page", pagination.currentPage + 1)
                    }
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      pagination.currentPage === pagination.totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>

            {/* Mobile pagination */}
            <div className="flex items-center justify-between w-full sm:hidden">
              <button
                onClick={() =>
                  handleFilterChange("page", pagination.currentPage - 1)
                }
                disabled={pagination.currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  pagination.currentPage === 1
                    ? "text-gray-300 bg-gray-50 cursor-not-allowed"
                    : "text-gray-700 bg-white hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              <div className="text-sm text-gray-700">
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>
              <button
                onClick={() =>
                  handleFilterChange("page", pagination.currentPage + 1)
                }
                disabled={pagination.currentPage === pagination.totalPages}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  pagination.currentPage === pagination.totalPages
                    ? "text-gray-300 bg-gray-50 cursor-not-allowed"
                    : "text-gray-700 bg-white hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Schedule Details Modal */}
      {isModalOpen && selectedSchedule && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Schedule Details
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="px-6 py-4">
              {/* Schedule Header */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Doctor ID
                    </h4>
                    <p className="text-base font-medium text-gray-900">
                      {selectedSchedule.doctorId}
                    </p>
                    {selectedSchedule.doctor && (
                      <p className="text-sm text-gray-500">
                        {selectedSchedule.doctor.specialization}
                      </p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Service
                    </h4>
                    <p className="text-base font-medium text-gray-900">
                      {selectedSchedule.serviceId.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Mode: {selectedSchedule.serviceId.mode}
                    </p>
                    <p className="text-sm text-gray-500">
                      Fee: ₹{selectedSchedule.serviceId.fee}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Date</h4>
                    <p className="text-base font-medium text-gray-900">
                      {formatDate(selectedSchedule.date)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Time</h4>
                    <p className="text-base font-medium text-gray-900">
                      {formatTime(selectedSchedule.start_time)} -{" "}
                      {formatTime(selectedSchedule.end_time)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Duration: {selectedSchedule.duration} minutes
                    </p>
                  </div>
                </div>
              </div>

              {/* Availability Slots */}
              <h4 className="text-lg font-medium text-gray-900 mb-3">
                Availability Slots
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {selectedSchedule.availability.map((slot) => (
                  <div
                    key={slot._id}
                    className={`p-3 rounded-lg flex items-center ${getStatusColor(
                      slot.status
                    )}`}
                  >
                    <div className="mr-2">{getStatusIcon(slot.status)}</div>
                    <div>
                      <p className="text-sm font-medium">
                        {slot.start_time && slot.end_time
                          ? `${formatTime(slot.start_time)} - ${formatTime(
                              slot.end_time
                            )}`
                          : `Slot #${slot.slot_id.slice(-4)}`}
                      </p>
                      <p className="text-xs capitalize">{slot.status}</p>
                      {slot.is_break && (
                        <p className="text-xs font-medium text-gray-500">
                          Break Time
                        </p>
                      )}
                      {slot.patient && (
                        <p className="text-xs">{slot.patient}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Status Legend */}
              <div className="mt-6 border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Status Legend
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div className="flex items-center text-xs">
                    <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                    <span>Booked</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                    <span>Pending</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
                    <span>Rescheduled</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="w-3 h-3 rounded-full bg-gray-500 mr-2"></span>
                    <span>Cancelled</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                    <span>Completed</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Schedule Modal */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSubmit={handleNewScheduleAdded}
      />

      <RecurringScheduleModal
      isOpen={isRecurringScheduleModalOpen}
      onClose={()=>setIsRecurringScheduleModalOpen(false)}
      />
    </div>
  );
}
