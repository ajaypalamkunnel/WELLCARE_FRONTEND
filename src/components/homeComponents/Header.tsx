"use client"
import React, { useState } from 'react';
import { Menu, Search, Video, Info, User, Home, X } from 'lucide-react'
import { useRouter } from "next/navigation";
import { useAuthStore } from '@/store/user/authStore';
import { logout } from '@/services/user/auth/authService';
import toast from 'react-hot-toast';
interface HeaderProps {
  profileImageUrl?: string;
}

const Header: React.FC<HeaderProps> = ({ profileImageUrl }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const router = useRouter()
  const logoutstore = useAuthStore((state)=>state.logout)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = async () =>{
    try {

      await logout()
      logoutstore()
      // useAuthStore.getState().logout()
      toast.success("Logging out...")
      router.push("/login");

    } catch (error) {
      toast.error("Logout failed")
      console.error("Logout failed:", error);
    }

  }



  return (
    <header className="w-full py-5 px-4 md:px-6 shadow-sm" style={{ background: 'linear-gradient(to right, #e9daf3, #d8f4ea)' }}>
      <div className="container mx-auto">
        <nav className="flex items-center justify-between">
          {/* Logo and Name */}
          <div className="flex items-center">
            <div className="h-10 w-10 mr-2 hover:">
                <a href="/home">
              <img src="/images/cropedLogo.png" alt="willcarelogo" />
              </a>
            </div>
            <h1 
              className="text-2xl font-bold" 
              style={{ 
                background: 'linear-gradient(to right, #18A2C6, #02C03B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              WellCare
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 text-gray-600">
            <a href="#" className="flex items-center hover:text-gray-900">
              <Home size={18} className="mr-1" />
              <span>Home</span>
            </a>
            <a href="#" className="flex items-center hover:text-gray-900">
              <Search size={18} className="mr-1" />
              <span>Find Doctor</span>
            </a>
            <a href="#" className="flex items-center hover:text-gray-900">
              <Video size={18} className="mr-1" />
              <span>Video Consultation</span>
            </a>
            <a href="#" className="flex items-center hover:text-gray-900">
              <Info size={18} className="mr-1" />
              <span>About Us</span>
            </a>
          </div>

          {/* Profile Section */}
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
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Profile
                </a>
                
                <button onClick={handleLogout} className="w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Logout
                </button>
                
              </div>
            )}
          </div>

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
            <a href="#" className="block py-2 px-1 text-gray-600 hover:text-gray-900">
              <div className="flex items-center">
                <Home size={18} className="mr-2" />
                <span>Home</span>
              </div>
            </a>
            <a href="#" className="block py-2 px-1 text-gray-600 hover:text-gray-900">
              <div className="flex items-center">
                <Search size={18} className="mr-2" />
                <span>Find Doctor</span>
              </div>
            </a>
            <a href="#" className="block py-2 px-1 text-gray-600 hover:text-gray-900">
              <div className="flex items-center">
                <Video size={18} className="mr-2" />
                <span>Video Consultation</span>
              </div>
            </a>
            <a href="#" className="block py-2 px-1 text-gray-600 hover:text-gray-900">
              <div className="flex items-center">
                <Info size={18} className="mr-2" />
                <span>About Us</span>
              </div>
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;