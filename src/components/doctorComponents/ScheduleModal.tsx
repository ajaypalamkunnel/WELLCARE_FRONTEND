import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import {
  XMarkIcon,
  CalendarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { useForm, Controller } from "react-hook-form";
import { ServiceData } from "./ServiceComponent";
import {
  createSchedule,
  generateSlote,
  getServices,
  validateSchedule,
} from "@/services/doctor/doctorService";
import { useAuthStoreDoctor } from "@/store/doctor/authStore";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/utils/handleError";
import axios from "axios";
import { Schedule } from "./AppoinmentSchedules";

// Define interfaces for type safety
interface Slot {
  slot_id?: string;
  start_time: string;
  end_time: string;
  is_break: boolean;
}

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newSchedule: Schedule) => void;
}

export interface ScheduleCreationData {
  doctorId: string | undefined;
  date?: string;
  service?: string;
  slots: Slot[];
}

export interface FormValues {
  doctorId?: string;
  date?: string;
  service?: string;
  start_time?: string;
  end_time?: string;
  duration?: number;
}

export default function ScheduleModal({
  isOpen,
  onClose,
  onSubmit,
}: ScheduleModalProps) {
  // React Hook Form setup
  const {
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      date: "",
      service: "",
      start_time: "",
      end_time: "",
      duration: 30,
    },
    mode: "onChange",
  });

  // Slots state
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [services, setServices] = useState<ServiceData[]>([]);
  const [timeError, setTimeError] = useState<string>("");
  const { user } = useAuthStoreDoctor();
  const doctorId = user?.id;
  // Watch all form fields to check completeness
  const formValues = watch();
  const isFormComplete =
    formValues.date &&
    formValues.service &&
    formValues.start_time &&
    formValues.end_time &&
    formValues?.duration && formValues.duration > 0

  // Track if schedule is validated
  const [isScheduleValidated, setIsScheduleValidated] =
    useState<boolean>(false);

  useEffect(() => {
    fetchServices();
  }, []);

  //  New validation for start time
  useEffect(() => {
    validateStartTime();
  }, [formValues.start_time, formValues.date]);

  const validateStartTime = () => {
    if (!formValues.date || !formValues.start_time) {
      setTimeError("");
      return;
    }

    const currentDate = new Date();
    const selectedDate = new Date(formValues.date);
    const [hours, minutes] = formValues.start_time.split(":").map(Number);

    // Set the selected time on the selected date
    selectedDate.setHours(hours, minutes, 0, 0);

    const today = new Date()
    today.setHours(0,0,0,0)


    if(selectedDate < today){
      setTimeError("Cannot select past dates");
      return
    }

    if (
      selectedDate.getDate() === currentDate.getDate() &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getFullYear() === currentDate.getFullYear()
    ) {
      // Calculate minimum start time (current time + 3 hours)
      const minStartTime = new Date(currentDate);
      minStartTime.setHours(currentDate.getHours() + 3);

      

      if (selectedDate < minStartTime) {
        setTimeError("Start time must be at least 3 hours from current time");
        return;
      }
    }
    setTimeError("");
  };

  useEffect(() => {
    if (isFormComplete) {
      validateScheduleData();
    } else {
      setIsScheduleValidated(false);
    }
  }, [
    formValues.date,
    formValues.service,
    formValues.start_time,
    formValues.end_time,
    formValues.duration,
  ]);

  const fetchServices = async () => {
     if (!doctorId) {
    toast.error("Doctor ID not found");
    return;
  }
    try {
      const response = await getServices(doctorId);

      if (response.success) {
        setServices(response.data || []);
      } else {
        toast.error(response.message || "Failed to fetch services");
      }
    } catch (error) {
      toast.error("An error occurred while fetching services");
      console.error("Error fetching services:", error);
    }
  };

  // Reset the form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset();
      setSlots([]);
      setError("");
      setTimeError("");
      setIsScheduleValidated(false);
    }
  }, [isOpen, reset]);

  //this function handle validation of conflict
  const validateScheduleData = async () => {
    console.log("hi validateSchedule");

    if (!isFormComplete) return;

    setIsValidating(true);
    setError("");
    setIsScheduleValidated(false);

    try {
      const validationData: FormValues = { ...formValues, doctorId };
      console.log("----->", validationData);

      const response = await validateSchedule(validationData);

      if (response.success) {
        setIsScheduleValidated(true);
      } else {
        setError(response.message || "Schedule validation failed");
        toast.error(response.message || "Schedule validation failed");
      }
    } catch (err: unknown) {
      console.log("888", err);

      if (axios.isAxiosError(err)) {
        const serverMessage = err.response?.data?.message;
        const errorMsg = serverMessage || err.message || "Validation failed";
        setError(errorMsg);
        toast.error(errorMsg);
      } else {
        // Handle non-Axios errors
        const errorMsg = getErrorMessage(err);
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setIsValidating(false);
    }
  };

  // Function to handle generating slots
  const generateSlots = async () => {
    if (!isFormComplete) return;

    setIsGenerating(true);
    setError("");

    try {
      const slotData: FormValues = { ...formValues, doctorId };
      const response = await generateSlote(slotData);

      if (response.success) {
        console.log("generated slot : ", response.data);

        // const processedSlots = response.data.map((slot: Slot) => ({
        //   ...slot,
        //   is_break: Boolean(slot.is_break)
        // }));

        setSlots(response.data);
        toast.success("Slots generated successfully!");
      } else {
        throw new Error(response.message || "Failed to generate slots");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  // Toggle break status for a slot
  const toggleBreak = (id: string) => {
    setSlots(
      slots.map((slot) => {
        if (slot.slot_id === id) {
          // Explicitly ensure is_break is a boolean value
          return { ...slot, is_break: !Boolean(slot.is_break) };
        }
        return slot;
      })
    );
  };

  // Handle final submit
  const handleFinalSubmit = async () => {
    if (slots.length === 0) {
      setError("Please generate slots before submitting");
      return;
    }

    setIsCreating(true);

    try {
      const scheduleData = {
        doctorId: doctorId,
        date: formValues?.date,
        serviceId: formValues?.service,
        start_time: formValues?.start_time,
        end_time: formValues?.end_time,
        duration: formValues?.duration,
        slots: slots,
      };

      console.log("final----", scheduleData);

      const response = await createSchedule(scheduleData);

      console.log("^^^^^^", response);

      if (response.success) {
        toast.success("Schedule created successfully!");
        console.log("ith aatooo response data.==>",response);
        
        onSubmit(response?.schedule);
        onClose();
      } else {
        throw new Error(response.message || "Failed to create schedule");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog
      as="div"
      className="fixed inset-0 z-50 overflow-y-auto"
      open={isOpen}
      onClose={onClose}
    >
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        aria-hidden="true"
      />

      <div className="min-h-screen px-4 text-center">
        {/* Trick the browser into centering the modal */}
        <span className="inline-block h-screen align-middle" aria-hidden="true">
          &#8203;
        </span>

        <Dialog.Panel className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex justify-between items-center">
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900"
            >
              Schedule Appointments
            </Dialog.Title>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <form className="mt-4 space-y-4">
            {/* Date Picker */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                Date
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <Controller
                  name="date"
                  control={control}
                  rules={{ required: "Date is required" }}
                  render={({ field }) => (
                    <input
                      type="date"
                      id="date"
                      className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md ${
                        errors.date ? "border-red-300" : ""
                      }`}
                      {...field}
                    />
                  )}
                />
              </div>
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Service Dropdown */}
            <div>
              <label
                htmlFor="service"
                className="block text-sm font-medium text-gray-700"
              >
                Service
              </label>
              <Controller
                name="service"
                control={control}
                rules={{ required: "Service is required" }}
                render={({ field }) => (
                  <select
                    id="service"
                    className={`mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.service ? "border-red-300" : ""
                    }`}
                    {...field}
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service._id} value={service._id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.service && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.service.message}
                </p>
              )}
            </div>

            {/* Time Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="start_time"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Time
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ClockIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <Controller
                    name="start_time"
                    control={control}
                    rules={{ required: "Start time is required" }}
                    render={({ field }) => (
                      <input
                        type="time"
                        id="start_time"
                        className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md ${
                          errors.start_time ? "border-red-300" : ""
                        }`}
                        {...field}
                      />
                    )}
                  />
                </div>
                {errors.start_time && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.start_time.message}
                  </p>
                )}
                {timeError && (
                  <p className="mt-1 text-sm text-red-600">{timeError}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="end_time"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Time
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ClockIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <Controller
                    name="end_time"
                    control={control}
                    rules={{ required: "End time is required" }}
                    render={({ field }) => (
                      <input
                        type="time"
                        id="end_time"
                        className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 sm:text-sm border-gray-300 rounded-md ${
                          errors.end_time ? "border-red-300" : ""
                        }`}
                        {...field}
                      />
                    )}
                  />
                </div>
                {errors.end_time && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.end_time.message}
                  </p>
                )}
              </div>
            </div>

            {/* Duration Input */}
            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-gray-700"
              >
                Duration (minutes)
              </label>
              <Controller
                name="duration"
                control={control}
                rules={{
                  required: "Duration is required",
                  min: {
                    value: 5,
                    message: "Duration must be at least 5 minutes",
                  },
                }}
                render={({ field }) => (
                  <input
                    type="number"
                    id="duration"
                    min={5}
                    step={5}
                    className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 sm:text-sm border-gray-300 rounded-md ${
                      errors.duration ? "border-red-300" : ""
                    }`}
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10) || 0)
                    }
                  />
                )}
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.duration.message}
                </p>
              )}
            </div>

            {isValidating && (
              <div className="flex items-center justify-center text-sm text-blue-600">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Validating schedule...
              </div>
            )}

            {isFormComplete && isScheduleValidated && !error && (
              <div className="flex items-center justify-center text-sm text-green-600">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Schedule validated successfully
              </div>
            )}

            {/* Generate Slots Button */}
            <div>
              <button
                type="button"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#03045e] hover:bg-[#020344] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                onClick={generateSlots}
                disabled={
                  !isFormComplete || !isScheduleValidated || isGenerating || !!timeError
                }
              >
                {isGenerating ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  "Generate Slots"
                )}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Slots Display */}
          {slots.length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 mb-3">
                Time Slots
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {slots.map((slot) => {
                  // Create Date objects from the UTC strings
                  const startDate = new Date(slot.start_time);
                  const endDate = new Date(slot.end_time);

                  // Format to IST time (HH:MM)
                  const startTimeIST = startDate.toLocaleTimeString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  });

                  const endTimeIST = endDate.toLocaleTimeString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  });

                  return (
                    <div
                      key={slot.slot_id}
                      className={`p-3 rounded-md border ${
                        slot.is_break
                          ? "bg-gray-100 border-gray-300"
                          : "bg-white border-gray-200"
                      } shadow-sm transition-all duration-200 hover:shadow`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">
                          {startTimeIST} - {endTimeIST}
                        </span>
                        <div className="flex items-center">
                          <input
                            id={`break-${slot.slot_id}`}
                            name={`break-${slot.slot_id}`}
                            type="checkbox"
                            className="h-4 w-4 text-[#03045e] focus:ring-blue-500 border-gray-300 rounded"
                            checked={slot.is_break}
                            onChange={() => toggleBreak(slot.slot_id!)}
                          />
                          <label
                            htmlFor={`break-${slot.slot_id}`}
                            className="ml-2 block text-sm text-gray-500"
                          >
                            Break
                          </label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="button"
              className="w-full inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#03045e] hover:bg-[#020344] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              onClick={handleFinalSubmit}
              disabled={slots.length === 0 || isCreating}
            >
              {isCreating ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Schedule...
                </>
              ) : (
                "Submit Schedule"
              )}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
