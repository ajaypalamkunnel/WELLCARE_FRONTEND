"use client";
export const dynamic = "force-dynamic";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { 
  User, 
  MapPin, 
  Phone, 
  Droplet, 
  Loader2, 
  Heart,
  Home,
  Globe,
  Calendar,
  Users,
  AlertCircle,
  Activity
} from "lucide-react";
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
    official: string;
  };
  cca2: string;
}

interface State {
  name: string;
  state_code: string;
}

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const PatientInformationForm: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const email = useAuthStore((state) => state.email);
  const { setIsVerified } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorId = searchParams.get("doctorId");
  
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IUser>();

  const watchedCountry = watch("address.country");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoadingCountries(true);
        // Using a more reliable API
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2");
        if (!response.ok) throw new Error("Failed to fetch countries");

        const data: Country[] = await response.json();
        const sortedCountries = data.sort((a, b) => 
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);
      } catch (error) {
        console.log("Error fetching countries:", error);
        // Fallback to a basic list if API fails
        const fallbackCountries = [
          { name: { common: "United States", official: "United States of America" }, cca2: "US" },
          { name: { common: "Canada", official: "Canada" }, cca2: "CA" },
          { name: { common: "United Kingdom", official: "United Kingdom of Great Britain and Northern Ireland" }, cca2: "GB" },
          { name: { common: "India", official: "Republic of India" }, cca2: "IN" },
          { name: { common: "Australia", official: "Commonwealth of Australia" }, cca2: "AU" },
        ];
        setCountries(fallbackCountries);
      } finally {
        setIsLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchStates = async (countryCode: string) => {
      if (!countryCode) {
        setStates([]);
        return;
      }

      try {
        setIsLoadingStates(true);
        const response = await fetch(`https://api.countrystatecity.in/v1/countries/${countryCode}/states`, {
          headers: {
            'X-CSCAPI-KEY': 'NHhvOEcyWk50N2Vna3VFTE00bFp3MjFKR0ZEOUhkZlg4RTk1MlJlaA=='
          }
        });
        
        if (!response.ok) {
          // Fallback for common countries
          const fallbackStates: Record<string, State[]> = {
            US: [
              { name: "California", state_code: "CA" },
              { name: "New York", state_code: "NY" },
              { name: "Texas", state_code: "TX" },
              { name: "Florida", state_code: "FL" },
            ],
            IN: [
              { name: "Maharashtra", state_code: "MH" },
              { name: "Delhi", state_code: "DL" },
              { name: "Karnataka", state_code: "KA" },
              { name: "Tamil Nadu", state_code: "TN" },
            ]
          };
          setStates(fallbackStates[countryCode] || []);
          return;
        }

        const data: State[] = await response.json();
        setStates(data);
      } catch (error) {
        console.log("Error fetching states:", error);
        setStates([]);
      } finally {
        setIsLoadingStates(false);
      }
    };

    if (watchedCountry && selectedCountry !== watchedCountry) {
      const country = countries.find(c => c.name.common === watchedCountry);
      if (country) {
        setSelectedCountry(watchedCountry);
        setValue("address.state", "");
        fetchStates(country.cca2);
      }
    }
  }, [watchedCountry, countries, selectedCountry, setValue]);

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
        setIsVerified(true);
        router.push(`/user/booking?doctorId=${doctorId}`);
      } else {
        throw new Error(response.data?.message || "Unexpected error occurred");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "something went wrong";

      console.error("User registration error:", error);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Patient Information Form</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Please provide your detailed information to help us serve you better. All information is kept confidential and secure.
            </p>
          </div>

          {/* Main Form */}
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
              <h2 className="text-2xl font-semibold text-white flex items-center">
                <Heart className="mr-3 w-6 h-6" />
                Personal & Medical Details
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mr-4">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Age */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                      Age
                    </label>
                    <input
                      type="number"
                      {...register("personalInfo.age", {
                        required: "Age is required",
                        min: { value: 0, message: "Age must be positive" },
                        max: { value: 120, message: "Age seems unrealistic" },
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter your age"
                    />
                    {errors.personalInfo?.age && (
                      <p className="flex items-center text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.personalInfo.age.message}
                      </p>
                    )}
                  </div>

                  {/* Mobile Number */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <Phone className="w-4 h-4 mr-2 text-blue-500" />
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      {...register("mobile", {
                        required: "Mobile number is required",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "Please enter a valid 10-digit mobile number",
                        },
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter 10-digit mobile number"
                    />
                    {errors.mobile && (
                      <p className="flex items-center text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.mobile.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Gender */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <User className="w-4 h-4 mr-2 text-blue-500" />
                      Gender
                    </label>
                    <Controller
                      name="personalInfo.gender"
                      control={control}
                      rules={{ required: "Gender is required" }}
                      render={({ field }) => (
                        <div className="flex flex-wrap gap-4 p-3 bg-gray-50 rounded-lg">
                          {["male", "female", "other"].map((gender) => (
                            <label
                              key={gender}
                              className="flex items-center cursor-pointer"
                            >
                              <input
                                type="radio"
                                {...field}
                                value={gender}
                                checked={field.value === gender}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm font-medium text-gray-700 capitalize">
                                {gender}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    />
                    {errors.personalInfo?.gender && (
                      <p className="flex items-center text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.personalInfo.gender.message}
                      </p>
                    )}
                  </div>

                  {/* Blood Group */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <Droplet className="w-4 h-4 mr-2 text-red-500" />
                      Blood Group
                    </label>
                    <Controller
                      name="personalInfo.blood_group"
                      control={control}
                      rules={{ required: "Blood group is required" }}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50 focus:bg-white"
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
                    {errors.personalInfo?.blood_group && (
                      <p className="flex items-center text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.personalInfo.blood_group.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Medical History Section */}
              <div className="space-y-6 border-t pt-8">
                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mr-4">
                    <Activity className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Medical History</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Allergies */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <AlertCircle className="w-4 h-4 mr-2 text-orange-500" />
                      Allergies
                    </label>
                    <textarea
                      {...register("personalInfo.allergies")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50 focus:bg-white resize-none"
                      placeholder="List any allergies (optional)"
                      rows={4}
                    />
                  </div>

                  {/* Chronic Diseases */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <Heart className="w-4 h-4 mr-2 text-red-500" />
                      Chronic Diseases
                    </label>
                    <textarea
                      {...register("personalInfo.chronic_disease")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50 focus:bg-white resize-none"
                      placeholder="List any chronic diseases (optional)"
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              {/* Address Information Section */}
              <div className="space-y-6 border-t pt-8">
                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mr-4">
                    <Home className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Address Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* House Name/Number */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                      House Name/Number
                    </label>
                    <input
                      type="text"
                      {...register("address.houseName", {
                        required: "House name is required",
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter house name/number"
                    />
                    {errors.address?.houseName && (
                      <p className="flex items-center text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.address.houseName.message}
                      </p>
                    )}
                  </div>

                  {/* Street */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Street</label>
                    <input
                      type="text"
                      {...register("address.street", {
                        required: "Street is required",
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter street name"
                    />
                    {errors.address?.street && (
                      <p className="flex items-center text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.address.street.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* City */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      {...register("address.city", {
                        required: "City is required",
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter city"
                    />
                    {errors.address?.city && (
                      <p className="flex items-center text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.address.city.message}
                      </p>
                    )}
                  </div>

                  {/* Country */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <Globe className="w-4 h-4 mr-2 text-blue-500" />
                      Country
                    </label>
                    <select
                      {...register("address.country", {
                        required: "Country is required",
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50 focus:bg-white"
                      disabled={isLoadingCountries}
                    >
                      <option value="">
                        {isLoadingCountries ? "Loading countries..." : "Select Country"}
                      </option>
                      {countries.map((country) => (
                        <option key={country.cca2} value={country.name.common}>
                          {country.name.common}
                        </option>
                      ))}
                    </select>
                    {errors.address?.country && (
                      <p className="flex items-center text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.address.country.message}
                      </p>
                    )}
                  </div>

                  {/* State */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">State/Province</label>
                    <select
                      {...register("address.state", {
                        required: "State is required",
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50 focus:bg-white"
                      disabled={!watchedCountry || isLoadingStates}
                    >
                      <option value="">
                        {isLoadingStates 
                          ? "Loading states..." 
                          : !watchedCountry 
                          ? "Select country first" 
                          : "Select State/Province"
                        }
                      </option>
                      {states.map((state) => (
                        <option key={state.state_code} value={state.name}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                    {errors.address?.state && (
                      <p className="flex items-center text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.address.state.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Postal Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Postal Code</label>
                    <input
                      type="text"
                      {...register("address.postalCode", {
                        required: "Postal code is required",
                        pattern: {
                          value: /^[0-9A-Za-z\s-]{3,10}$/,
                          message: "Please enter a valid postal code",
                        },
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter postal code"
                    />
                    {errors.address?.postalCode && (
                      <p className="flex items-center text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.address.postalCode.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-8 border-t">
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <User className="w-5 h-5 mr-3" />
                        Submit Patient Information
                      </>
                    )}
                  </button>
                </div>
                <p className="text-center text-sm text-gray-500 mt-4">
                  Your information is encrypted and stored securely. We respect your privacy.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientInformationForm;