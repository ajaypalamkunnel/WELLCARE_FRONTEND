"use client";

import React, { useState } from "react";
import { useAdminStore } from "@/store/admin/adminStore";
import { useRouter } from "next/navigation";
import DoctorsList from "@/components/admin/adminContent/Doctors";
import {
  LayoutDashboard,
  Users,
  FileText,
  User,
  Calendar,
  CreditCard,
  Building2,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { logoutAdmin } from "@/services/admin/authServices";
import toast from "react-hot-toast";
import DashboardContent from "@/components/admin/adminContent/DashboardContent";
import ApplicationsContent from "@/components/admin/adminContent/ApplicationsContent";
import PatientsContent from "@/components/admin/adminContent/PatientsContent";
import PlansContent from "@/components/admin/adminContent/PlansContent";
import DepartmentsContent from "@/components/admin/adminContent/DepartmentsContent";
import AppointmentsContent from "@/components/admin/adminContent/AppointmentsContent ";

// Define the navigation item type
interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

// Main AdminDashboard component
const AdminDashboard: React.FC = () => {
  // State to track the active navigation item
  const logoutStoreAdmin = useAdminStore((state) => state.logout);
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<string>("dashboard");
  // State to control dropdown visibility
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  // Navigation items configuration
  const navItems: NavItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { id: "doctors", label: "Doctors", icon: <Users size={20} /> },
    { id: "applications", label: "Applications", icon: <FileText size={20} /> },
    { id: "patients", label: "Patients", icon: <User size={20} /> },
    { id: "appointments", label: "Appointments", icon: <Calendar size={20} /> },
    { id: "plans", label: "Plans", icon: <CreditCard size={20} /> },
    { id: "departments", label: "Departments", icon: <Building2 size={20} /> },
  ];

  // Handle navigation item clicks
  const handleNavClick = (id: string) => {
    setActiveNav(id);
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Handle logout action
  const handleLogout = async () => {
    try {
      const response = await logoutAdmin();
      console.log(response);
      logoutStoreAdmin();

      toast.success("Logging out...");

      setTimeout(() => {
        router.push("/admin/login");
      }, 200);
    } catch (error) {
      toast.error("Logour failed");
      console.error("Logout failed:", error);
    }
  };

  // Render dynamic content based on active navigation
  const renderContent = () => {
    switch (activeNav) {
      case "dashboard":
        return <DashboardContent />;
      case "doctors":
        return <DoctorsList />;
      case "applications":
        return <ApplicationsContent />;
      case "patients":
        return <PatientsContent />;
      case "appointments":
        return <AppointmentsContent />;
      case "plans":
        return <PlansContent />;
      case "departments":
        return <DepartmentsContent />;
      default:return (
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {activeNav.charAt(0).toUpperCase() + activeNav.slice(1)}
          </h2>
          <p>Content not found for this section.</p>
        </div>
      );
  }
};

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Left Sidebar Navigation */}
      <div className="w-full md:w-64 bg-[#1f232e] text-white flex flex-col">
        {/* Dashboard Title */}
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>

        {/* Navigation Items */}
        <nav className="flex-grow py-4">
          <ul>
            {navItems.map((item) => (
              <li key={item.id} className="mb-1">
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center w-full px-4 py-3 text-left transition-colors ${
                    activeNav === item.id ? "bg-gray-700" : "hover:bg-gray-700"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow bg-[#191c25] text-white">
        {/* Header */}
        <header className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">
            {activeNav.charAt(0).toUpperCase() + activeNav.slice(1)}
          </h2>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-700">
              <Bell size={20} />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-700">
              <Settings size={20} />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-700"
              >
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-800">
                  A
                </div>
                <span>Admin</span>
                <ChevronDown size={16} />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1f232e] rounded-md shadow-lg py-1 z-10">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-700"
                  >
                    <LogOut size={16} className="mr-2" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="p-4 h-[calc(100vh-64px)] overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
