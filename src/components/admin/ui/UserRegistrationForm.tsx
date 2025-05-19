import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { User, Phone, Droplet, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { userCompleteRegistration } from "@/services/user/auth/authService";
import { AxiosError } from "axios";
// Adjust the import path as needed

// Existing interfaces (kept the same)
export interface IPersonalInfo {
  age: number;
  gender: "male" | "female" | "other";
  blood_group: string;
  allergies: string;
  chronic_disease: string;
}

export interface IAddress {
  houseName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IUserDetails {
  mobile: string;
  personalInfo: IPersonalInfo;
  address: IAddress;
}

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const PatientInformationForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<IUserDetails>();

  const onSubmit = async (data: IUserDetails) => {
    setIsSubmitting(true);
    try {
      // Perform validation before submission
      const requiredFields = [
        data.mobile,
        data.personalInfo.age,
        data.personalInfo.gender,
        data.personalInfo.blood_group,
        data.address.houseName,
        data.address.street,
        data.address.city,
        data.address.state,
        data.address.country,
        data.address.postalCode,
      ];

      if (requiredFields.some((field) => !field)) {
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      // API Call
      await userCompleteRegistration(data);

      // Success Handling
      toast.success("Patient Information Submitted Successfully!", {
        duration: 4000,
        position: "top-right",
      });

      reset();
    } catch (error: unknown) {
      // Error Handling

      let errorMessage = "Submission Failed. Please try again.";

      if (
        typeof error === "object" &&
        error !== null &&
        (error as AxiosError).isAxiosError
      ) {
        const axiosError = error as AxiosError<{ message: string }>;
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      }

      toast.error(errorMessage, {
        duration: 4000,
        position: "top-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-6">
      <Toaster />
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-3xl border border-gray-100">
        <h2 className="text-3xl font-extrabold mb-6 text-blue-600 flex items-center">
          <User className="mr-4 w-10 h-10" /> Patient Registration
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information Section */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-600 mb-4">
              Personal Details
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Age Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  placeholder="Enter your age"
                  {...register("personalInfo.age", {
                    required: "Age is required",
                    min: { value: 0, message: "Age must be positive" },
                    max: { value: 120, message: "Age seems unrealistic" },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
                {errors.personalInfo?.age && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.personalInfo.age.message}
                  </p>
                )}
              </div>

              {/* Mobile Number Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                  <input
                    type="tel"
                    {...register("mobile", {
                      required: "Mobile number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Please enter a valid 10-digit mobile number",
                      },
                    })}
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    placeholder="Enter 10-digit mobile number"
                  />
                </div>
                {errors.mobile && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.mobile.message}
                  </p>
                )}
              </div>
            </div>

            {/* Gender and Blood Group */}
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              {/* Gender Radio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <Controller
                  name="personalInfo.gender"
                  control={control}
                  rules={{ required: "Gender is required" }}
                  render={({ field }) => (
                    <div className="flex space-x-4">
                      {["male", "female", "other"].map((gender) => (
                        <label
                          key={gender}
                          className="inline-flex items-center"
                        >
                          <input
                            type="radio"
                            {...field}
                            value={gender}
                            checked={field.value === gender}
                            className="text-blue-500 focus:ring-blue-500"
                          />
                          <span className="ml-2 capitalize">{gender}</span>
                        </label>
                      ))}
                    </div>
                  )}
                />
                {errors.personalInfo?.gender && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.personalInfo.gender.message}
                  </p>
                )}
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Group
                </label>
                <div className="relative">
                  <Droplet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                  <Controller
                    name="personalInfo.blood_group"
                    control={control}
                    rules={{ required: "Blood group is required" }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                      >
                        <option value="">Select Blood Group</option>
                        {bloodGroups.map((group) => (
                          <option key={group} value={group}>
                            {group}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </div>
                {errors.personalInfo?.blood_group && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.personalInfo.blood_group.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-600 mb-4">
              Address Details
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {/* House Name, Street, City, State, Country, Postal Code inputs similar to previous design */}
              {/* ... (keep the existing input fields with updated styling) */}
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full 
                                       transition duration-300 ease-in-out transform hover:scale-105 
                                       focus:outline-none focus:ring-2 focus:ring-blue-500
                                       disabled:opacity-50 disabled:cursor-not-allowed 
                                       flex items-center justify-center mx-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Patient Information"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientInformationForm;
