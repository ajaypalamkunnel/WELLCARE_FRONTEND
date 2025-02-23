"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OTPInput from "../components/otpPage/OTPInput";
import role from "@/types/role";
import { resentOTP, verifyOTP } from "@/services/user/auth/authService";
import { useAuthStore } from "@/store/user/authStore";
import toast from "react-hot-toast";
import { Timer } from "lucide-react";
const OTPVerificationComponent: React.FC<role> = ({ role }) => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [isDisabled, setIsDisabled] = useState(false);
  const { email } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!email) {
      toast.error("No email found, redirecting...");
      router.push("/signup");
    }
  }, [email, router]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    } else {
      setIsDisabled(false);
    }
  }, [timer]);

  const handleResendOTP = async () => {
    setOtp("");
    setTimer(30);
    setIsDisabled(true);
    if (!email) return;

    try {
      if (role === "patient") {
        const response = await resentOTP(email);

        if (response.success) {
          toast.success(response.message);
        } else {
          toast.error(response.error || "Failed to resend OTP");
        }
      } else {
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleVerifyOTP = async () => {
    console.log(otp);
    if (!email) return;

    try {
      if (role === "patient") {
        const response = await verifyOTP(email, otp);
        toast.success("");
        router.push("/login");
      } else {
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Enter OTP to Verify Your Account
        </h2>
        <p className="text-gray-600 mt-2">
          We've sent a verification code to your email
        </p>

        <div className="my-4">
          <OTPInput length={6} onChange={setOtp} />
        </div>
        <div className="flex gap-1 items-center justify-center">
          <Timer />
          <p className="text-black-600 font-bold text-sm mt-2">
            OTP expires in: {timer}s
          </p>
        </div>

        <button
          className={`w-full py-2 mt-4 text-white font-semibold rounded-md transition-all ${
            otp.length === 6
              ? "bg-medical-green-light hover:bg-medical-green"
              : "bg-green-300 cursor-not-allowed"
          }`}
          onClick={handleVerifyOTP}
          disabled={otp.length !== 6}
        >
          Verify OTP
        </button>

        <button
          className={`w-full py-2 mt-2 border-2 border-medical-green text-green-600 font-semibold rounded-md transition-all ${
            isDisabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-medical-green-light hover:text-white"
          }`}
          onClick={handleResendOTP}
          disabled={isDisabled}
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default OTPVerificationComponent;
