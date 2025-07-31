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
    console.log(response);
    
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="md:flex">
            <div className="md:w-1/2 p-8 lg:p-12 animate-fade-in-up">
              <div className="text-center mb-10">
                <Image
                  width={100}
                  height={100}
                  src="/images/logo.png"
                  alt="WellCare Logo"
                  className="h-28 mx-auto mb-6 transition-transform duration-300 hover:scale-105"
                />
                <h2 className="text-3xl font-bold text-slate-800 mb-3">
                  Create Your Account
                </h2>
                <p className="text-slate-600 text-lg">
                  Join WellCare as a {role === "patient" ? "Patient" : "Doctor"}
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 max-w-[480px] mx-auto"
              >
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    {...register("fullName", {
                      required: "Full name is required",
                    })}
                    type="text"
                    id="fullName"
                    className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 placeholder:text-slate-400 hover:border-slate-300"
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-shake">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-slate-700 mb-2"
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
                    className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 placeholder:text-slate-400 hover:border-slate-300"
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-shake">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative group">
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
                      className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 placeholder:text-slate-400 hover:border-slate-300 pr-12"
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-shake">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <input
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === watch("password") ||
                          "Passwords do not match",
                      })}
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      placeholder="Confirm your password"
                      className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-all duration-300 placeholder:text-slate-400 hover:border-slate-300 pr-12"
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-shake">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-300 transform ${
                    isLoading
                      ? "bg-slate-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>

                <div className="text-center pt-4">
                  <p className="text-slate-600">
                    Already have an account?{" "}
                    <a
                      href="/login"
                      className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 hover:underline"
                    >
                      Sign In
                    </a>
                  </p>
                </div>
              </form>
            </div>
            
            <div className="hidden md:flex md:flex-col md:w-1/2 bg-gradient-to-br from-blue-500/5 to-teal-500/5 p-8 lg:p-12 justify-center items-center relative animate-slide-in-right">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-3xl blur-3xl"></div>
              <div className="relative z-10 text-center">
                <Image
                  width={400}
                  height={400}
                  src="/images/signupImg1.png"
                  alt="Medical Illustration"
                  className="w-full max-w-md object-contain transition-transform duration-500 hover:scale-105"
                />

                {role === "patient" && (
                  <div className="mt-12 space-y-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-transparent text-slate-500">Or continue with</span>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={handleGoogleAuth}
                      disabled={isLoading}
                      className="w-full max-w-sm mx-auto border border-slate-200 py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 hover:bg-white/50 transition-all duration-300 hover:border-slate-300 hover:shadow-md bg-white/30 backdrop-blur-sm"
                    >
                      <Image
                        width={20}
                        height={20}
                        src="https://www.google.com/favicon.ico"
                        alt="Google"
                        className="w-5 h-5"
                      />
                      <span className="text-slate-700 font-medium">Sign up with Google</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupComponent;
