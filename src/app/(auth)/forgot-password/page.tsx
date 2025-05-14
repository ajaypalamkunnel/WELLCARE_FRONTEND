import ForgotPasswordComponent from "@/components/Forgot-password";
import React from "react";
const ForgotPassword = () => {
  return (
    <ForgotPasswordComponent
      title="Forgot Password"
      description="Enter your email address and we'll send you a one-time password to reset your password."
      buttonText="Send OTP"
      emailPlaceholder="Enter your registered email"
    />
  );
};

export default ForgotPassword;
