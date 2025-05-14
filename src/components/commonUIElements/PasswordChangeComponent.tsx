import React, { useState } from "react";
import { Eye, EyeOff, Lock,} from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { changePassword } from "@/services/doctor/doctorService";
import { changeUserPassword } from "@/services/user/auth/authService";
interface PasswordChangeFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordChangeComponentProps {
  id: string;
  userType: "doctor" | "patient";
  // onSuccess?: () => void;
  // onError?: (error: string) => void;
}

const PasswordChangeComponent: React.FC<PasswordChangeComponentProps> = ({
  id,
  userType = "patient",
  // onSuccess,
  // onError,
}) => {
  // Define color classes based on user type
  const themeColorClasses =
    userType === "doctor"
      ? "text-[#02045e] border-[#02045e] bg-[#02045e] ring-[#02045e]/30"
      : "text-[#04bf3e] border-[#04bf3e] bg-[#04bf3e] ring-[#04bf3e]/30";

  const [colorText, colorBorder, colorBg, colorRing] =
    themeColorClasses.split(" ");

  // Password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<PasswordChangeFormData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Watch new password for confirmation validation
  const newPassword = watch("newPassword");

  // Handle form submission
  const onFormSubmit = async (data: PasswordChangeFormData) => {
    try {
      setIsSubmitting(true);
      const {...passwordData } = data;

      if (userType === "doctor") {
        const response = await changePassword(
          id,
          passwordData.currentPassword,
          passwordData.newPassword
        );

        if (response.status === 200) {
          toast.success("Password updated successfully!");
          setTimeout(() => {
            reset();
          }, 300);
        } else {
          throw new Error("Failed to change password");
        }
      } else if (userType === "patient") {
        const response = await changeUserPassword(
          id,
          passwordData.currentPassword,
          passwordData.newPassword
        );

        if (response.status === 200) {
          toast.success("password updated successfully");
          setTimeout(() => {
            reset();
          }, 300);
        } else {
          throw new Error("Failed to change user password");
        }
      }
    } catch (error) {
      // Handle error
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update password";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simulate API call - replace with actual API implementation

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <h2 className={`text-2xl font-bold ${colorText}`}>Reset Password</h2>
        <p className="text-gray-600 text-sm mt-1">
          Enter your current password and choose a new one
        </p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {/* Current Password Field */}
        <div className="space-y-1">
          <label
            htmlFor="currentPassword"
            className={`block text-sm font-medium ${colorText}`}
          >
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              id="currentPassword"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.currentPassword
                  ? "border-red-300 focus:ring-red-200"
                  : `border-gray-300 focus:${colorBorder} focus:${colorRing}`
              }`}
              {...register("currentPassword", {
                required: "Current password is required",
              })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? (
                <EyeOff size={18} className="text-gray-500" />
              ) : (
                <Eye size={18} className="text-gray-500" />
              )}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* New Password Field */}
        <div className="space-y-1">
          <label
            htmlFor="newPassword"
            className={`block text-sm font-medium ${colorText}`}
          >
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.newPassword
                  ? "border-red-300 focus:ring-red-200"
                  : `border-gray-300 focus:${colorBorder} focus:${colorRing}`
              }`}
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                validate: (value) =>
                  value !== watch("currentPassword") ||
                  "New password must be different from current password",
              })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <EyeOff size={18} className="text-gray-500" />
              ) : (
                <Eye size={18} className="text-gray-500" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Confirm New Password Field */}
        <div className="space-y-1">
          <label
            htmlFor="confirmPassword"
            className={`block text-sm font-medium ${colorText}`}
          >
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.confirmPassword
                  ? "border-red-300 focus:ring-red-200"
                  : `border-gray-300 focus:${colorBorder} focus:${colorRing}`
              }`}
              {...register("confirmPassword", {
                required: "Please confirm your new password",
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff size={18} className="text-gray-500" />
              ) : (
                <Eye size={18} className="text-gray-500" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 transition-colors ${colorBg} focus:${colorRing} ${
            isSubmitting ? "opacity-70" : "opacity-100"
          }`}
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          ) : (
            <Lock size={18} className="mr-2" />
          )}
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default PasswordChangeComponent;
