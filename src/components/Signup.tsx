"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/user/authStore";
import { useAuthStoreDoctor } from "../store/doctor/authStore";
import {
  googleAuth,
  registerBasicDetails,
} from "@/services/user/auth/authService";
import { registerBasicDetailsDoctor } from "@/services/doctor/authService";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface signupFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface signupFormProps {
  role: "patient" | "doctor";
}

const SignupComponent: React.FC<signupFormProps> = ({ role }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setEmail } = useAuthStore();
  const { setEmailDoctor } = useAuthStoreDoctor();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<signupFormData>();

  const onSubmit = async (data: signupFormData) => {
    console.log(data);
    setIsLoading(true);

    try {
      if (role === "patient") {
        const response = await registerBasicDetails({ ...data });
        console.log(response);

        toast.success("OTP sent! Redirecting...");
        setEmail(response.email);
        router.push("/otppage");
      } else {
        const response = await registerBasicDetailsDoctor({ ...data });
        toast.success("OTP sent! Redirecting...");
        setEmailDoctor(response.email);
        router.push("/doctor/otppage");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    const response = googleAuth(role);
    console.log("=======>>>", response);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-4 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-b from-green-50 to-green-100 rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-8">
              <div className="text-center mb-8">
                <Image
                  width={100}
                  height={100}
                  src="/images/logo.png"
                  alt="WellCare Logo"
                  className="h-24 mx-auto mb-4"
                />
                <h2 className="text-2xl font-bold text-gray-900">
                  Create Account for {role === "patient" ? "Patient" : "Doctor"}
                </h2>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-3 max-w-[448px]"
              >
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    {...register("fullName", {
                      required: "Full name is required",
                    })}
                    type="text"
                    id="fullName"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-green focus:border-transparent"
                    placeholder="John Doe"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-green focus:border-transparent"
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                        validate: {
                          hasUpperCase: (value) =>
                            /[A-Z]/.test(value) ||
                            "Must contain at least one uppercase letter",
                          hasLowerCase: (value) =>
                            /[a-z]/.test(value) ||
                            "Must contain at least one lowercase letter",
                          hasNumber: (value) =>
                            /[0-9]/.test(value) ||
                            "Must contain at least one number",
                          hasSpecialChar: (value) =>
                            /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                            "Must contain at least one special character",
                        },
                      })}
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-green focus:border-transparent pr-10"
                      placeholder="Enter a strong password"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === watch("password") ||
                          "Passwords do not match",
                      })}
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      placeholder="Enter a strong password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-green focus:border-transparent pr-10"
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading} // 🔹 NEW: Disable button when loading
                  className={`w-full py-2 rounded-lg transition-all ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed" // 🔹 NEW: Disabled state
                      : "bg-medical-green text-white hover:bg-opacity-90"
                  }`}
                >
                  {isLoading ? "Signing up..." : "Sign up"}{" "}
                  {/* 🔹 NEW: Show loading text */}
                </button>

                <p className="text-center text-sm text-gray-600 mt-4">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-medical-green hover:underline"
                  >
                    Login
                  </a>
                </p>
              </form>
            </div>
            <div className="hidden md:flex md:flex-col md:w-1/2 cbg-medical-green/5 p-8 justify-center">
              <Image
                width={400}
                height={400}
                src="/images/signupImg1.png"
                alt="Medical Illustration"
                className="w-full object-contain"
              />

              {role === "patient" ? (
                <div className="text-center mt-20">
                  <p className="text-sm text-gray-600 ">Or continue with</p>
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    className="w-full border border-gray-300 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Image
                      width={90}
                      height={90}
                      src="https://www.google.com/favicon.ico"
                      alt="Google"
                      className="w-5 h-5"
                    />
                    <span>Sign in with Google</span>
                  </button>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupComponent;
