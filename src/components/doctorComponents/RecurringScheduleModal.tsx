// components/doctor/RecurringScheduleModal.tsx
"use client";
import { Dialog } from "@headlessui/react";
import {
  XMarkIcon,
  CalendarIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getServices } from "@/services/doctor/doctorService";
import { generateRecurringSlots } from "@/services/doctor/doctorService";
import { useAuthStoreDoctor } from "@/store/doctor/authStore";
import { createMultiDaySchedule } from "@/services/doctor/doctorService";
import { ServiceData } from "./ServiceComponent";
import { GeneratedScheduleBlock, GeneratedSlot } from "@/types/slotBooking";

export interface TimeBlock {
  start_time: string;
  end_time: string;
}

export interface RecurringScheduleForm {
  startDate: string;
  endDate: string;
  service: string;
  duration: number;
  timeBlocks: TimeBlock[];
}

interface RecurringScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RecurringScheduleModal({
  isOpen,
  onClose,
}: RecurringScheduleModalProps) {
  const { user } = useAuthStoreDoctor();
  const doctorId = user?.id;

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<RecurringScheduleForm>({
    defaultValues: {
      startDate: "",
      endDate: "",
      service: "",
      duration: 30,
      timeBlocks: [{ start_time: "", end_time: "" }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "timeBlocks",
  });

  const [services, setServices] = useState<ServiceData[]>([]);
  const [generatedSchedules, setGeneratedSchedules] = useState<
    GeneratedScheduleBlock[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      if (!doctorId) return;
      const response = await getServices(doctorId);
      if (response.success) {
        setServices(response.data || []);
      } else {
        toast.error("Failed to fetch services");
      }
    };
    fetchServices();
  }, [doctorId]);

  const onPreview = async (data: RecurringScheduleForm) => {
    if (!doctorId) {
      toast.error("Doctor ID not found");
      return;
    }

    try {
      setLoading(true);
      setGeneratedSchedules([]);
      const response = await generateRecurringSlots({ ...data, doctorId });

      if (response.success) {
        toast.success("Slots generated successfully.");
        setGeneratedSchedules(response.data);
      } else {
        toast.error(response.message || "Failed to generate slots");
      }
    } catch (err: unknown) {
      let errorMessage = "An error occurred while submitting schedule";

      if (err instanceof Error) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
      console.error("Preview error", err);
    } finally {
      setLoading(false);
    }
  };

  //final slot creation section

  const handleFinalSubmit = async () => {
    if (!doctorId) {
      toast.error("Doctor ID not found");
      return;
    }

    try {
      setSubmitting(true);

      const formData = getValues(); // from react-hook-form
      const response = await createMultiDaySchedule({ ...formData, doctorId });

      if (response.success) {
        toast.success("Recurring schedule created successfully!");
        setGeneratedSchedules([]);
        reset();
        onClose();
      } else {
        toast.error(response.message || "Failed to create schedule");
      }
    } catch (err) {
      let errorMessage = "An error occurred while submitting schedule";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
      console.error("Submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const onCloseModal = () => {
    reset();
    setGeneratedSchedules([]);
    onClose();
  };

  console.log("***Generated slots ", generatedSchedules);

  if (!isOpen) return null;

  return (
    <Dialog
      as="div"
      className="fixed inset-0 z-50 overflow-y-auto"
      open={isOpen}
      onClose={onCloseModal}
    >
      <div
        className="fixed inset-0 bg-black bg-opacity-30"
        aria-hidden="true"
      />
      <div className="min-h-screen px-4 text-center">
        <span className="inline-block h-screen align-middle" aria-hidden="true">
          &#8203;
        </span>
        <Dialog.Panel className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex justify-between items-center">
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900"
            >
              Create Recurring Schedule
            </Dialog.Title>
            <button
              onClick={onCloseModal}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onPreview)} className="mt-4 space-y-4">
            {/* Date pickers */}
            {["startDate", "endDate"].map((fieldName) => (
              <div key={fieldName}>
                <label
                  htmlFor={fieldName}
                  className="block text-sm font-medium text-gray-700"
                >
                  {fieldName === "startDate" ? "Start Date" : "End Date"}
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <Controller
                    name={fieldName as "startDate" | "endDate"}
                    control={control}
                    rules={{ required: `${fieldName} is required` }}
                    render={({ field }) => (
                      <input
                        type="date"
                        className={`pl-10 pr-3 py-2 w-full border rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                          errors[fieldName as keyof RecurringScheduleForm]
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>
            ))}

            {/* Service */}
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
                    className={`w-full border px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.service ? "border-red-300" : "border-gray-300"
                    }`}
                    {...field}
                  >
                    <option value="">Select service</option>
                    {services.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Slot Duration (minutes)
              </label>
              <Controller
                name="duration"
                control={control}
                rules={{ required: "Duration is required", min: 5 }}
                render={({ field }) => (
                  <input
                    type="number"
                    min={5}
                    className={`w-full border px-3 py-2 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      errors.duration ? "border-red-300" : "border-gray-300"
                    }`}
                    {...field}
                  />
                )}
              />
            </div>

            {/* Time Blocks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Blocks
              </label>
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-3 items-center mb-2">
                  <Controller
                    name={`timeBlocks.${index}.start_time`}
                    control={control}
                    rules={{ required: "Start time required" }}
                    render={({ field }) => (
                      <input
                        type="time"
                        {...field}
                        className="border rounded-md px-2 py-1 text-sm w-full"
                      />
                    )}
                  />
                  <Controller
                    name={`timeBlocks.${index}.end_time`}
                    control={control}
                    rules={{ required: "End time required" }}
                    render={({ field }) => (
                      <input
                        type="time"
                        {...field}
                        className="border rounded-md px-2 py-1 text-sm w-full"
                      />
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => append({ start_time: "", end_time: "" })}
                className="flex items-center text-sm text-blue-600 hover:underline"
              >
                <PlusIcon className="h-4 w-4 mr-1" /> Add Time Block
              </button>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#03045e] hover:bg-[#020344] text-white font-medium py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? "Generating..." : "Preview Slots"}
              </button>
            </div>
          </form>

          {/* Preview Generated Slots */}
          {generatedSchedules.length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 mb-3">
                Generated Slots
              </h4>
              {generatedSchedules.map((schedule, idx) => {
                const dateString = new Date(schedule.date).toLocaleDateString(
                  "en-IN",
                  {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                );

                return (
                  <div
                    key={idx}
                    className="mb-4 border border-gray-200 rounded-lg p-3 bg-gray-50"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-sm text-gray-800">
                        {dateString} — {schedule.slots.length} slots
                      </span>
                      {schedule.conflict && (
                        <span className="text-sm text-red-500 font-semibold">
                          Conflict Detected
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {schedule.slots.map((slot: GeneratedSlot) => {
                        const start = new Date(
                          slot.start_time
                        ).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                          timeZone: "UTC",
                        });
                        const end = new Date(slot.end_time).toLocaleTimeString(
                          "en-IN",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                            timeZone: "UTC",
                          }
                        );

                        return (
                          <div
                            key={slot.slot_id}
                            className={`p-2 border rounded text-sm ${
                              slot.is_break
                                ? "bg-gray-100 border-gray-300"
                                : "bg-white border-gray-200"
                            }`}
                          >
                            {start} - {end}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {generatedSchedules.length > 0 && (
            <div className="mt-4">
              <button
                onClick={handleFinalSubmit}
                disabled={submitting}
                className="w-full bg-[#03045e] hover:bg-[#020344] text-white font-medium py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {submitting ? "Submitting..." : "Submit Schedule"}
              </button>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
