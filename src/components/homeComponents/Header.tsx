"use client";
import React, { useEffect, useState } from "react";
import {
  Menu,
  Search,
  Video,
  Info,
  User,
  Home,
  X,
  LogIn,
  Hospital,
  MessageCircle,
  BellIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/user/authStore";
import { logout } from "@/services/user/auth/authService";
import toast from "react-hot-toast";
import Link from "next/link";
import { connectSocket, getSocket } from "@/utils/socket";
import NotificationModal from "../commonUIElements/NotificationModal";
import Image from "next/image";

interface HeaderProps {
  profileImageUrl?: string;
}

const Header: React.FC<HeaderProps> = ({ profileImageUrl }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const router = useRouter();
  const logoutstore = useAuthStore((state) => state.logout);
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore();
  const isLoggedIn = !!accessToken;
  const userId = user.user?.id;
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (userId) {
      connectSocket(userId);
    }
  }, [userId]);

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      const socket = getSocket();
      if (socket) {
        socket.disconnect();
      }
      await logout();
      logoutstore();
      // useAuthStore.getState().logout()
      toast.success("Logging out...");
      router.push("/login");
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout failed:", error);
    }
  };

  return (
    <header
      className="w-full py-5 px-4 md:px-6 shadow-sm"
      style={{ background: "linear-gradient(to right, #e9daf3, #d8f4ea)" }}
    >
      <div className="container mx-auto">
        <nav className="flex items-center justify-between">
          {/* Logo and Name */}
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/images/cropedLogo.png"
                alt="willcarelogo"
                width={40}
                height={40}
                className="object-contain"
              />
            </Link>

            <h1
              className="text-2xl font-bold"
              style={{
                background: "linear-gradient(to right, #18A2C6, #02C03B)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              WellCare
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 text-gray-600">
            <Link href="/" className="flex items-center hover:text-gray-900">
              <Home size={18} className="mr-1" />
              <span>Home</span>
            </Link>

            <Link
              href="/user/doctors"
              className="flex items-center hover:text-gray-900"
            >
              <Search size={18} className="mr-1" />
              <span>Find Doctor</span>
            </Link>

            <Link
              href="/user/departments"
              className="flex items-center hover:text-gray-900"
            >
              <Hospital size={18} className="mr-1" />
              <span>Departments</span>
            </Link>

            <Link
              href="/user/chat"
              className="flex items-center hover:text-gray-900"
            >
              <MessageCircle size={18} className="mr-1" />
              <span>Messages</span>
            </Link>
            <>
              <button
                onClick={() => setOpen(true)}
                className="flex items-center"
              >
                <BellIcon size={18} className="mr-1" />
                <span className="ml-2">Notifications</span>
              </button>

              <NotificationModal
                isOpen={open}
                onClose={() => setOpen(false)}
                isDoctor={false}
              />
            </>
          </div>

          {/* Profile Section */}

          {isLoggedIn ? (
            <div className="relative">
              <button
                className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200"
                onClick={toggleProfileDropdown}
              >
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <User size={20} className="text-gray-600" />
                )}
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link
                    href="/user/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 bg-medical-green text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              <LogIn size={20} />
              <span>Login</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600 hover:text-gray-900"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-2 border-t border-gray-200">
            <Link
              href="/"
              className="block py-2 px-1 text-gray-600 hover:text-gray-900"
            >
              <div className="flex items-center">
                <Home size={18} className="mr-2" />
                <span>Home</span>
              </div>
            </Link>
            <Link
              href="/user/doctors"
              className="block py-2 px-1 text-gray-600 hover:text-gray-900"
            >
              <div className="flex items-center">
                <Search size={18} className="mr-2" />
                <span>Find Doctor</span>
              </div>
            </Link>
            <Link
              href="/user/departments"
              className="block py-2 px-1 text-gray-600 hover:text-gray-900"
            >
              <div className="flex items-center">
                <Hospital size={18} className="mr-1" />
                <span>Departments</span>
              </div>
            </Link>
            <Link
              href="#"
              className="block py-2 px-1 text-gray-600 hover:text-gray-900"
            >
              <div className="flex items-center">
                <Video size={18} className="mr-2" />
                <span>Video Consultation</span>
              </div>
            </Link>
            <Link
              href="#"
              className="block py-2 px-1 text-gray-600 hover:text-gray-900"
            >
              <div className="flex items-center">
                <Info size={18} className="mr-2" />
                <span>About Us</span>
              </div>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
