import ForgotPasswordComponent from "@/components/Forgot-password";
import React from "react";
import { forgotPassword } from "../../../services/user/auth/authService";
const ForgotPassword = () => {
  return (
    <ForgotPasswordComponent
      
      isLoading={false}
      title="Forgot Password"
      description="Enter your email address and we'll send you a one-time password to reset your password."
      buttonText="Send OTP"
      emailPlaceholder="Enter your registered email"
    />
  );
};

export default ForgotPassword;
