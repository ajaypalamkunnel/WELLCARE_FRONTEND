import ForgotPasswordComponent from "@/components/Forgot-password";
import React, { Suspense } from "react";
const ForgotPassword = () => {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading form...</div>}>
      <ForgotPasswordComponent
        title="Forgot Password"
        description="Enter your email address and we'll send you a one-time password to reset your password."
        buttonText="Send OTP"
        emailPlaceholder="Enter your registered email"
      />
    </Suspense>
  );
};

export default ForgotPassword;
