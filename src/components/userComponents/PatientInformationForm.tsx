"use client";
export const dynamic = "force-dynamic";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { User, MapPin, Phone, Droplet, Loader2 } from "lucide-react";
import Header from "@/components/homeComponents/Header";
import { userCompleteRegistration } from "@/services/user/auth/authService";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/user/authStore";
import { useRouter, useSearchParams } from "next/navigation";

// Define the interfaces as specified

interface IPersonalInfo {
  age: number;
  gender: "male" | "female" | "other";
  blood_group: string;
  allergies: string;
  chronic_disease: string;
}

interface IAddress {
  houseName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface IUser {
  mobile: string;
  personalInfo: IPersonalInfo;
  address: IAddress;
}

interface Country {
  name: {
    common: string;
  };
}

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const PatientInformationForm: React.FC = () => {
  const [countries, setCountries] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const email = useAuthStore((state) => state.email);
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorId = searchParams.get("doctorId");
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<IUser>();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        if (!response.ok) throw new Error("Failed to fetch countries");

        const data = await response.json();

        const countryNames = data
          .map((country: Country) => country.name.common)
          .sort();
        setCountries(countryNames);
      } catch (error) {
        console.log("Error fetching country list", error);
      }
    };

    fetchCountries();
  }, []);

  const onSubmit = async (data: IUser) => {
    try {
      setIsSubmitting(true);
      const dataToSubmit = {
        ...data,
        email,
      };

      console.log("Form data to be sent: ", data);

      const response = await userCompleteRegistration(dataToSubmit);

      if (response.status === 200) {
        toast.success("User details submitted successfully");
        reset();
        router.push(`/user/booking?doctorId=${doctorId}`);
      } else {
        throw new Error(response.data?.message || "Unexpected error occurred");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "something went wrong";

      console.error("User registration error:", error);
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-6 text-medical-green flex items-center">
            <User className="mr-3" /> Patient Information Form
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information Section */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Age
                </label>
                <input
                  type="number"
                  {...register("personalInfo.age", {
                    required: "Age is required",
                    min: { value: 0, message: "Age must be positive" },
                    max: { value: 120, message: "Age seems unrealistic" },
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-green focus:ring focus:ring-medical-green-light"
                />
                {errors.personalInfo?.age && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.personalInfo.age.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <div className="flex items-center">
                  <Phone className="mr-2 text-medical-green" />
                  <input
                    type="tel"
                    {...register("mobile", {
                      required: "Mobile number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Please enter a valid 10-digit mobile number",
                      },
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-green focus:ring focus:ring-medical-green-light"
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

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <Controller
                  name="personalInfo.gender"
                  control={control}
                  rules={{ required: "Gender is required" }}
                  render={({ field }) => (
                    <div className="mt-1 flex space-x-4">
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
                            className="text-medical-green focus:ring-medical-green"
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

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Blood Group
                </label>
                <div className="flex items-center">
                  <Droplet className="mr-2 text-medical-green" />
                  <Controller
                    name="personalInfo.blood_group"
                    control={control}
                    rules={{ required: "Blood group is required" }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-green focus:ring focus:ring-medical-green-light"
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

            {/* Medical History Section */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Allergies
                </label>
                <textarea
                  {...register("personalInfo.allergies")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-green focus:ring focus:ring-medical-green-light"
                  placeholder="List any allergies"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Chronic Diseases
                </label>
                <textarea
                  {...register("personalInfo.chronic_disease")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-green focus:ring focus:ring-medical-green-light"
                  placeholder="List any chronic diseases"
                  rows={3}
                />
              </div>
            </div>

            {/* Address Information Section */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  House Name/Number
                </label>
                <div className="flex items-center">
                  <MapPin className="mr-2 text-medical-green" />
                  <input
                    type="text"
                    {...register("address.houseName", {
                      required: "House name is required",
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-green focus:ring focus:ring-medical-green-light"
                    placeholder="Enter house name/number"
                  />
                </div>
                {errors.address?.houseName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.address.houseName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Street
                </label>
                <input
                  type="text"
                  {...register("address.street", {
                    required: "Street is required",
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-green focus:ring focus:ring-medical-green-light"
                  placeholder="Enter street name"
                />
                {errors.address?.street && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.address.street.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  {...register("address.city", {
                    required: "City is required",
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-green focus:ring focus:ring-medical-green-light"
                  placeholder="Enter city"
                />
                {errors.address?.city && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.address.city.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  type="text"
                  {...register("address.state", {
                    required: "State is required",
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-green focus:ring focus:ring-medical-green-light"
                  placeholder="Enter state"
                />
                {errors.address?.state && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.address.state.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <select
                  {...register("address.country", {
                    required: "Country is required",
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-green focus:ring focus:ring-medical-green-light"
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                {errors.address?.country && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.address.country.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <input
                type="text"
                {...register("address.postalCode", {
                  required: "Postal code is required",
                  pattern: {
                    value: /^[0-9]{5,6}$/,
                    message: "Please enter a valid postal code",
                  },
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-medical-green focus:ring focus:ring-medical-green-light"
                placeholder="Enter postal code"
              />
              {errors.address?.postalCode && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.address.postalCode.message}
                </p>
              )}
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-medical-green hover:bg-medical-green-light text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-medical-green-light"
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
    </>
  );
};

export default PatientInformationForm;
