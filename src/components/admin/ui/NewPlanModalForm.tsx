import React, { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { X, Plus, AlertCircle, } from "lucide-react";
import {
  createNewPlan,
  updateSubscriptionPlan,
} from "@/services/admin/adminServices";
import toast from "react-hot-toast";
import { Plan } from "../adminContent/PlansContent";

// Define the form data structure
export interface PlanFormData {
  _id?: string;
  planName: string;
  duration: { value: number; unit: "day" | "month" | "year" };
  price: number;
  discount?: { amount: number; type: "percentage" | "amount" };
  serviceLimit: number;
  status: boolean;
  features: { name: string; included: boolean }[];
}

interface NewPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingPlan?: Plan | null;
  onUpdate?: (updatedPlan: Plan) => void;
  onAdd?: (newPlan: Plan) => void;
  //   onAddPlan: (data: PlanFormData) => void;
}

const NewPlanModal: React.FC<NewPlanModalProps> = ({
  isOpen,
  onClose,
  existingPlan,
  onUpdate,
  onAdd,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Initialize form with useForm hook

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    reset,
  } = useForm<PlanFormData>({
    defaultValues: {
      planName: "",
      duration: { value: 30, unit: "day" },
      price: 0,
      discount: { amount: 0, type: "percentage" },
      serviceLimit: 5,
      status: true,
      features: [{ name: "", included: true }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "features",
  });

  useEffect(() => {
    if (isOpen && existingPlan) {
      console.log("Existing Plan:", existingPlan);

      const features = existingPlan.features?.map((feature) => ({
        name: feature.name,
        included: feature.included,
      })) || [{ name: "", included: true }];
      console.log("Features:", features);

      reset(
        {
          planName: existingPlan.planName,
          duration: {
            value: existingPlan.duration.value,
            unit: existingPlan.duration.unit as "day" | "month" | "year",
          },
          price: existingPlan.price,
          discount: existingPlan.discount ?? { amount: 0, type: "percentage" },
          serviceLimit: existingPlan.serviceLimit,
          status: existingPlan.status,
          features: features,
        },
        { keepDefaultValues: false }
      );

      setTimeout(() => {
        replace(features);
      }, 0);
    } else {
      reset({
        planName: "",
        duration: { value: 30, unit: "day" },
        price: 0,
        discount: { amount: 0, type: "percentage" },
        serviceLimit: 0,
        status: true,
        features: [{ name: "", included: true }],
      });

      replace([{ name: "", included: true }]);
    }
  }, [isOpen, existingPlan, reset,replace]);

  // Setup field array for dynamic features

  // Watch feature fields to determine if we can add more
  const features = watch("features");
  const canAddFeature = features && features.length < 4;

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  // ------------------   Form submission handler -------------
  const onSubmit = async (data: PlanFormData) => {
    try {
      setIsSubmitting(true);

      const formattedData: PlanFormData = {
        ...data,
        features: data.features.filter((feature) => feature.name.trim() !== ""),
      };

      console.log("Form data to be sent:", formattedData);

      if (existingPlan) {
        console.log("formatted data===>",formattedData);
        
        const response = await updateSubscriptionPlan(
          existingPlan._id!,
          formattedData
        );
        if (response.status === 200) {
          toast.success("Plan updated successfully!");
          onUpdate?.(response.data.data);
        } else {
          throw new Error("Failed to update plan");
        }
      } else {
        const response = await createNewPlan(formattedData);
        if (response.status === 201) {
          toast.success("Plan created successfully!");
          onAdd?.(response.data.data);
        } else {
          throw new Error("Failed to create plan");
        }
      }

      reset();
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md p-6 mx-4 bg-[#232429] rounded-lg shadow-xl max-h-[90vh] overflow-y-auto scrollbar-hide">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {existingPlan ? "Edit Plan" : "Add New Plan"}{" "}
            {/*UPDATED: Dynamic title */}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-700 transition-all"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Plan Name */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-300">
                Plan Name
              </label>
              <input
                {...register("planName", { required: "Plan name is required" })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3ee6e9] text-white"
                placeholder="Enter plan name"
              />
              {errors.planName && (
                <p className="mt-1 text-xs text-red-400 flex items-center">
                  <AlertCircle size={12} className="mr-1" />
                  {errors.planName.message}
                </p>
              )}
            </div>

            {/* Duration and Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">
                  Duration
                </label>
                <input
                  type="number"
                  {...register("duration.value", {
                    required: "Duration is required",
                    min: { value: 1, message: "Minimum duration is 1" },
                  })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3ee6e9] text-white"
                  placeholder="Enter duration"
                />
                {errors.duration && (
                  <p className="mt-1 text-xs text-red-400 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.duration.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">
                  Duration Type
                </label>
                <select
                  {...register("duration.unit")}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3ee6e9] text-white"
                >
                  <option value="day">Day</option>
                  <option value="month">Month</option>
                  <option value="year">Year</option>
                </select>
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-300">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0, message: "Price must be positive" },
                })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3ee6e9] text-white"
                placeholder="Enter price"
              />
              {errors.price && (
                <p className="mt-1 text-xs text-red-400 flex items-center">
                  <AlertCircle size={12} className="mr-1" />
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Discount Value and Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">
                  Discount Value
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register("discount.amount", {
                    min: { value: 0, message: "Discount must be positive" },
                  })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3ee6e9] text-white"
                  placeholder="Enter discount value"
                />
                {errors.discount?.amount && (
                  <p className="mt-1 text-xs text-red-400 flex items-center">
                    <AlertCircle size={12} className="mr-1" />
                    {errors.discount.amount.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-300">
                  Discount Type
                </label>
                <select
                  {...register("discount.type")}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3ee6e9] text-white"
                >
                  <option value="percentage">Percentage</option>
                  <option value="amount">Amount</option>
                </select>
              </div>
            </div>

            {/* Service Limit */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-300">
                Service Limit
              </label>
              <input
                type="number"
                {...register("serviceLimit", {
                  required: "Service limit is required",
                  min: { value: 1, message: "Minimum service limit is 1" },
                })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3ee6e9] text-white"
                placeholder="Enter service limit"
              />
              {errors.serviceLimit && (
                <p className="mt-1 text-xs text-red-400 flex items-center">
                  <AlertCircle size={12} className="mr-1" />
                  {errors.serviceLimit.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-300">
                Status
              </label>
              <div className="flex items-center space-x-2">
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <div
                      onClick={() => field.onChange(!field.value)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        field.value ? "bg-[#04bf3e]" : "bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          field.value ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </div>
                  )}
                />
                <span className="text-gray-300">
                  {watch("status") ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Features */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">
                Features (maximum 4)
              </label>
              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <input
                      {...register(`features.${index}.name` as const, {
                        required: "Feature name is required",
                        maxLength: {
                          value: 25,
                          message: "Maximum 25 characters",
                        },
                      })}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3ee6e9] text-white"
                      placeholder="Enter feature"
                    />
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-gray-400 hover:bg-gray-700 hover:text-gray-200 rounded-md transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                {errors.features &&
                  errors.features[fields.length - 1]?.name && (
                    <p className="mt-1 text-xs text-red-400 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      {errors.features[fields.length - 1]?.name?.message}
                    </p>
                  )}
                {canAddFeature && (
                  <button
                    type="button"
                    onClick={() => append({ name: "", included: true })}
                    className="flex items-center text-sm text-[#3ee6e9] hover:text-[#3ee6e9]/80 transition-all"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Feature
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-all"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#232429] text-[#3ee6e9] border border-[#3ee6e9] rounded-md"
            >
              {isSubmitting
                ? "Saving..."
                : existingPlan
                ? "Update Plan"
                : "Add Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPlanModal;
