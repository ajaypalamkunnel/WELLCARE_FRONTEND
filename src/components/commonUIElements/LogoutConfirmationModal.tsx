"use client";
import React from "react";
import { LogOut, X, AlertTriangle } from "lucide-react";
import { useAuthStoreDoctor } from "@/store/doctor/authStore";
import { logoutDoctor } from "@/services/doctor/authService";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getSocket } from "@/utils/socket";
import { logout } from "@/services/user/auth/authService";
import { useAuthStore } from "@/store/user/authStore";

interface LogoutModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  // onConfirm?: () => void;
  userType: "doctor" | "patient";
}

const LogoutConfirmationModal: React.FC<LogoutModalProps> = ({
  isOpen = false,
  onClose,
  // onConfirm,
  userType,
}) => {
  const router = useRouter();
  const logoutstoreDoctor = useAuthStoreDoctor((state) => state.logout);
  const logoutstore = useAuthStore((state) => state.logout);
  // Return null if modal is not open
  // if (!isOpen) return null;
  const handleLogout = async () => {
    try {
      if (userType === "doctor") {
        await logoutDoctor();

        toast.success("Logging out...");
        logoutstoreDoctor();
      } else {
        const socket = getSocket();
        if (socket) {
          socket.disconnect();
        }
        await logout();
        logoutstore();
      }

      router.push("/login");

      if (onClose) onClose();
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout faled:", error);
    }
  };

  if (!isOpen) return null;
  // Define color classes based on user type
  const themeColorClasses =
    userType === "doctor"
      ? "text-[#02045e] border-[#02045e] bg-[#02045e] ring-[#02045e]/30 bg-[#02045e]/10 focus:ring-[#02045e]/30"
      : "text-[#04bf3e] border-[#04bf3e] bg-[#04bf3e] ring-[#04bf3e]/30 bg-[#04bf3e]/10 focus:ring-[#04bf3e]/30";

  const [
    colorText,
    colorBg,
    colorBgLight,
    colorFocusRing,
  ] = themeColorClasses.split(" ");

  return (
    // Modal backdrop
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Modal container */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden animate-fadeIn">
        {/* Modal header */}
        <div
          className={`px-6 py-4 flex items-center justify-between ${colorBgLight}`}
        >
          <div className="flex items-center">
            <AlertTriangle className={`mr-2 ${colorText}`} size={20} />
            <h3 className={`font-semibold ${colorText}`}>Confirm Logout</h3>
          </div>
          <button
            onClick={() => {
              if (onClose) onClose(); // Ensure the modal closes properly
            }}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Modal body */}
        <div className="px-6 py-4">
          <p className="text-gray-700">
            Are you sure you want to log out? You will need to sign in again to
            access your account.
          </p>
        </div>

        {/* Modal footer */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={() => {
              if (onClose) {
                onClose();
              }
              // Ensure the modal closes properly
            }}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={handleLogout}
            className={`px-4 py-2 rounded-md text-white flex items-center transition-colors focus:outline-none focus:ring-2 ${colorBg} ${colorFocusRing} hover:opacity-90`}
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;
