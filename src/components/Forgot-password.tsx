"use client";
import { forgotPasswordDoctor } from "@/services/doctor/authService";
import { forgotPassword } from "@/services/user/auth/authService";
import { getErrorMessage } from "@/utils/handleError";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

// Form schema validation
interface ForgotPasswordFormValues {
  email: string;
}

interface ForgotPasswordProps {
  title?: string;
  description?: string;
  buttonText?: string;
  emailPlaceholder?: string;
}

const ForgotPasswordComponent: React.FC<ForgotPasswordProps> = ({
 
  title = "Forgot Password",
  description = "Enter your email address and we'll send you a one-time password to reset your password.",
  buttonText = "Send OTP",
  emailPlaceholder = "Enter your registered email",
}) => {
  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const ref = searchParams.get("ref") ?? "";
    setRole(ref);
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>();

  const handleFormSubmit = async (data: ForgotPasswordFormValues) => {
    console.log("Form submitted with email:", data.email);
    setLoading(true);
    console.log("====>", data);

    try {
      let response;
      if (role === "patient") {
        response = await forgotPassword(data.email);
        console.log("API Response from patient:", response);
      } else {
        response = await forgotPasswordDoctor(data.email);
        console.log("API Response from doctor:", response);
      }

      if (response?.success) {
        toast.success(response.message || "OTP sent successfully!");

        sessionStorage.setItem("otpEmail", data.email)
        sessionStorage.setItem("otpRole", role);
        router.push("/forgot-password/forgot-password-otp");
      } else {
        toast.error(response.error || "Failed to send OTP");
      }
    } catch (error) {
      console.error("API Error:", error); 
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          {title}
        </h1>

        <p className="text-center text-gray-600 mb-6">{description}</p>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="mb-4">
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              placeholder={emailPlaceholder}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-medical-green"
              } focus:outline-none focus:ring-2`}
            />
            {errors.email && (
              <p className="mt-1 text-red-500 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading} // ✅ Button disabled while loading
            className={`w-full bg-medical-green text-white font-medium py-3 px-4 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-green ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-medical-green-light"
            }`}
          >
            {loading ? ( // 🔥 Show spinner when loading
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                Processing...
              </div>
            ) : (
              buttonText
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordComponent;
