"use client";
import { updatePasswordDoctor } from "@/services/doctor/authService";
import { updatePassword } from "@/services/user/auth/authService";
import { AxiosError } from "axios";
import { useRouter   } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export interface NewPasswordFormValues {
  password: string;
  confirmPassword: string;
}

interface NewPasswordProps {
  isLoading?: boolean;
  title?: string;
  description?: string;
  buttonText?: string;
  passwordPlaceholder?: string;
  confirmPasswordPlaceholder?: string;
  minPasswordLength?: number;
}

const NewPassword: React.FC<NewPasswordProps> = ({
  isLoading = false,
  title = "Create New Password",
  description = "Enter your new password below to reset your account",
  buttonText = "Update Password",
  passwordPlaceholder = "Enter new password",
  confirmPasswordPlaceholder = "Confirm new password",
  minPasswordLength = 8,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NewPasswordFormValues>();

  const password = watch("password", "");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading,setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("otpEmail") || "";
    const storedRole = sessionStorage.getItem("otpRole") || "";
    if (!storedEmail) {
      router.push("/forgot-password"); // Redirect if no email found
    }
    setEmail(storedEmail);
    setRole(storedRole);
  }, []);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (role === "patient" && !email) {
        toast.error("No email found, redirecting...");
        router.push("/signup");
      } else if (role === "doctor" && !email) {
        toast.error("No email found, redirecting...");
        router.push("/signup");
      }
    }, 500);
    return () => clearTimeout(timeOut);
  }, [email, role, router]);

  const handleFormSubmit = async (password:string) => {
    
    console.log(password);
    console.log(role)
    setLoading(true)
    try {
      if (role === "patient") {
        await updatePassword(email, password);
        toast.success("Password updated successfully");
        sessionStorage.removeItem("otpEmail");
        sessionStorage.removeItem("otpRole");
        router.push("/login");
      } else if (role === "doctor") {
        await updatePasswordDoctor(email,password)
        toast.success("Password updated successfully");
        sessionStorage.removeItem("otpEmail")
        sessionStorage.removeItem("otpRole")
        router.push("/login")
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
    setLoading(false)
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          {title}
        </h1>

        <p className="text-center text-gray-600 mb-6">{description}</p>

        <form onSubmit={handleSubmit(({password})=>handleFormSubmit(password))}>
          <div className="mb-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: minPasswordLength,
                    message: `Password must be at least ${minPasswordLength} characters`,
                  },
                })}
                placeholder={passwordPlaceholder}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-medical-green"
                } focus:outline-none focus:ring-2`}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-red-500 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                placeholder={confirmPasswordPlaceholder}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-medical-green"
                } focus:outline-none focus:ring-2`}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading} // 🔥 Disable button while loading
            className="w-full bg-medical-green hover:bg-medical-green-light text-white font-medium py-3 px-4 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-green"
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

export default NewPassword;

// Example usage:
// <NewPassword
//   onSubmit={(data) => console.log(data)}
//   isLoading={false}
//   title="Create New Password"
//   description="Enter your new password below to reset your account"
//   buttonText="Update Password"
//   passwordPlaceholder="Enter new password"
//   confirmPasswordPlaceholder="Confirm new password"
//   minPasswordLength={8}
// />
