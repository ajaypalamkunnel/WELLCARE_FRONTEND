"use client";
import React, { useEffect, useRef, useState } from "react";
import { BellIcon, ChevronDown, LogIn, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStoreDoctor } from "@/store/doctor/authStore";
import { logoutDoctor } from "@/services/doctor/authService";
import toast from "react-hot-toast";
import { connectSocket, getSocket } from "@/utils/socket";
import NotificationModal from "../commonUIElements/NotificationModal";

interface HeaderProps {
  userImage?: string;
}

const Header: React.FC<HeaderProps> = ({ userImage }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const logoutstoreDoctor = useAuthStoreDoctor((state) => state.logout);
  const accessToken = useAuthStoreDoctor((state) => state.accessTokenDoctor);
  const isVerified = useAuthStoreDoctor((state) => state.isVerified);
  const user = useAuthStoreDoctor((state) => state.user);
console.log("====>",user?.isVerified);

  const profileRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false);


  const isLoggedIn = !!accessToken;

  const doctorId = user?.id
  useEffect(()=>{
    if(doctorId){
      connectSocket(doctorId)
    }
  },[user])


  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  


  const handleLogout = async () => {
    try {

      const socket = getSocket()

      if(socket){
        socket.disconnect()
      }


      await logoutDoctor();

      toast.success("Logging out...");
      logoutstoreDoctor();

      router.push("/login");
    } catch (error) {
      toast.error("Logour failed");
      console.error("Logout failed:", error);
    }
  };

  useEffect(()=>{
    const handleClickOutSide = (event:MouseEvent)=>{
      if(profileRef.current && !profileRef.current.contains(event.target as Node)){
        setIsProfileOpen(false)
      }
    }

    document.addEventListener("mousedown",handleClickOutSide)
    return ()=> document.removeEventListener("mousedown",handleClickOutSide)

  },[]);

  return (
    <header className="bg-[#03045e] text-white w-full py-4 px-6">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div className="text-2xl font-bold">
            <div className="flex items-center">
              <div className="h-10 w-10 mr-2 hover:">
                <img src="/images/cropedLogo.png" alt="wellcare logo" />
              </div>
              <div className="ml-2">
                <div className="text-lg font-bold text-white">WellCare</div>
                <div className="text-xs text-green-400">Doctor</div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="/doctordashboard/home"
            className="flex items-center hover:text-green-300 transition"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              ></path>
            </svg>
            Home
          </a>
          {/* <a
            href="/appointments"
            className="flex items-center hover:text-green-300 transition"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            Appointments
          </a> */}
          <a
            href="/doctordashboard/chat"
            className="flex items-center hover:text-green-300 transition"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              ></path>
            </svg>
            Messages
          </a>
          <>
      <button onClick={() => setOpen(true)} className="flex items-center">
        <BellIcon size={18} className="mr-1"/>
        <span className="ml-2">Notifications</span>
      </button>

      <NotificationModal isOpen={open} onClose={() => setOpen(false)} isDoctor={true} />
    </>
        </nav>

        {/* Profile Dropdown */}

        {isLoggedIn ? (
          <div className="relative">
            <button
              onClick={toggleProfileDropdown}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
                {userImage ? (
                  <img
                    src={userImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-gray-600" />
                )}
              </div>
              <ChevronDown className="w-4 h-4 hidden md:block" />
            </button>

            {/* Dropdown Menu */}

          
            
              
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10" ref={profileRef}>
                {user?.isVerified ? (
                  <Link
                    href="/doctordashboard/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                ):<></>}
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-blue-700 transition duration-300"
          >
            <LogIn size={20} />
            <span>Login</span>
          </Link>
        )}
        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden focus:outline-none"
          aria-label="Toggle mobile menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="md:hidden mt-4 space-y-3">
          <a
            href="/"
            className="flex items-center py-2 hover:text-green-300 transition"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              ></path>
            </svg>
            Home
          </a>
          <a
            href="/appointments"
            className="flex items-center py-2 hover:text-green-300 transition"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            Appointments
          </a>
          <a
            href="/messages"
            className="flex items-center py-2 hover:text-green-300 transition"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              ></path>
            </svg>
            Messages
          </a>
          <a
            href="/notifications"
            className="flex items-center py-2 hover:text-green-300 transition"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              ></path>
            </svg>
            Notifications
          </a>
        </nav>
      )}
    </header>
  );
};

export default Header;
