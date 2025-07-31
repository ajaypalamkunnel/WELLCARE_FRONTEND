"use client";
import React, { useEffect, useState } from "react";
import {
  Menu,
  Search,
  User,
  Home,
  X,
  LogIn,
  Hospital,
  MessageCircle,
  BellIcon,
  BadgeInfo,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/user/authStore";
import { logout } from "@/services/user/auth/authService";
import toast from "react-hot-toast";
import Link from "next/link";
import { connectSocket, getSocket } from "@/utils/socket";
import NotificationModal from "../commonUIElements/NotificationModal";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  profileImageUrl?: string;
}

const Header: React.FC<HeaderProps> = ({ profileImageUrl }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const logoutstore = useAuthStore((state) => state.logout);
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore();
  const isLoggedIn = !!accessToken;
  const userId = user.user?.id;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (userId) {
      connectSocket(userId);
    }
  }, [userId]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
      toast.success("Logging out...");
      router.push("/login");
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/user/doctors", icon: Search, label: "Find Doctor" },
    { href: "/user/departments", icon: Hospital, label: "Departments" },
    { href: "/user/chat", icon: MessageCircle, label: "Messages" },
    { href: "user/about", icon: BadgeInfo, label: "About us" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`w-full py-4 px-4 md:px-8 transition-all duration-300 fixed top-0 z-50 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-blue-100' 
          : 'bg-gradient-to-r from-blue-50 via-teal-50 to-indigo-50'
      }`}
    >
      <div className="container mx-auto">
        <nav className="flex items-center justify-between">
          {/* Logo and Name */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative">
                <Image
                  src="/images/cropedLogo.png"
                  alt="WellCare Logo"
                  width={45}
                  height={45}
                  className="object-contain drop-shadow-sm"
                />
                <motion.div
                  className="absolute inset-0 bg-blue-400 rounded-full opacity-20"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-teal-600 to-indigo-600 bg-clip-text text-transparent">
                WellCare
              </h1>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 group"
                >
                  <item.icon size={18} className="group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </motion.div>
            ))}
            
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              onClick={() => setOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 group relative"
            >
              <BellIcon size={18} className="group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Notifications</span>
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.button>

            <NotificationModal
              isOpen={open}
              onClose={() => setOpen(false)}
              isDoctor={false}
            />
          </div>

          {/* Profile Section */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 shadow-lg transition-all duration-300"
                  onClick={toggleProfileDropdown}
                >
                  {profileImageUrl ? (
                    <Image
                      width={48}
                      height={48}
                      src={profileImageUrl}
                      alt="Profile"
                      className="h-10 w-10 rounded-full object-cover border-2 border-white"
                    />
                  ) : (
                    <User size={20} className="text-white" />
                  )}
                </button>

                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100"
                    >
                      <Link
                        href="/user/profile"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                      >
                        <User size={16} className="mr-3" />
                        Profile
                      </Link>
                      <div className="border-t border-gray-100 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                      >
                        <LogIn size={16} className="mr-3" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <Link
                  href="/login"
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <LogIn size={20} />
                  <span className="font-medium">Login</span>
                </Link>
              </motion.div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
              onClick={toggleMenu}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-4 py-4 border-t border-gray-200 bg-white/95 backdrop-blur-sm rounded-lg"
            >
              <div className="space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon size={18} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  onClick={() => {
                    setOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 w-full"
                >
                  <BellIcon size={18} />
                  <span className="font-medium">Notifications</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
