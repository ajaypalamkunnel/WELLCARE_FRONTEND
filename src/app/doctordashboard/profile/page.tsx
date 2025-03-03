"use client";
import ProfileRenderNoDataMessage from "@/components/doctorComponents/ProfileNoData";
import RenderProfileSkeleton from "@/components/doctorComponents/RenderProfileSkelton";
import { fetchDoctorProfile } from "@/services/doctor/authService";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface DoctorProfile {
  fullName: string;
  department?: string;
  specialization?: string;
  experience?: string;
  licenseNumber?: string;
  email?: string;
  mobile?: string;
  avatar?: string;
}

const DoctorProfileDashboard: React.FC = () => {
  // Sample data, in real app this would come from API/backend
  const [doctorData, setDoctorData] = useState<DoctorProfile>({
    fullName: "Dr. Bony Johnson",
    department: "Cardiology",
    specialization: "Interventional Cardiology",
    experience: "15 Years Experience",
    licenseNumber: "MD12345789",
    email: "sarah.johnson@hospital.com",
    mobile: "+1 ( 555 ) 123-4567",
    avatar: "/doctor-avatar.png",
  });

  // State to track active navigation item
  const [activeNav, setActiveNav] = useState("Profile");
  const [loading, setLoading] = useState<boolean>(true);

  const [hasData,setHasData] = useState(true)

  //fetch doctor profile data
  useEffect(() => {
    const getDoctorProfile = async () => {
      try {
        setLoading(true)
        const doctorProfileData = await fetchDoctorProfile();

        if (doctorProfileData) {
            setDoctorData(doctorProfileData)
            setHasData(true)
        }else{
            toast.error("Failed to load doctor profile")
            setHasData(false)
        }
      } catch (error) {
        toast.error("Error fetching profile");
        console.error("Profile fetch error:", error);
      }finally{
        setLoading(false)
      }
    };

    getDoctorProfile()
  },[]);

  // Navigation items
  const navItems = [
    {
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      label: "Profile",
    },
    {
      icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
      label: "Dashboard",
    },
    {
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      label: "Service & Slots",
    },
    {
      icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
      label: "Subscriptions",
    },
    {
      icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
      label: "Qualifications",
    },
    {
      icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
      label: "Review and Ratings",
    },
    {
      icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z",
      label: "Password Change",
    },
    {
      icon: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
      label: "Logout",
    },
  ];

  // Render profile content
  const renderProfileContent = () => {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-3xl mx-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-yellow-400 overflow-hidden mb-4">
            <img
              src="/doctor-avatar.png"
              alt={doctorData.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            {doctorData.fullName}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {doctorData.email && (
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>{doctorData.email}</span>
            </div>
          )}

          {doctorData.mobile && (
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>{doctorData.mobile}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {doctorData.department && (
            <div className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-gray-500 mt-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">{doctorData.department}</p>
              </div>
            </div>
          )}

          {doctorData.specialization && (
            <div className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-gray-500 mt-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Specialization</p>
                <p className="font-medium">{doctorData.specialization}</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {doctorData.experience && (
            <div className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-gray-500 mt-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-500">Experience</p>
                <p className="font-medium">{doctorData.experience}</p>
              </div>
            </div>
          )}

          {doctorData.licenseNumber && (
            <div className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-gray-500 mt-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-500">License Number</p>
                <p className="font-medium">{doctorData.licenseNumber}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            className="px-4 py-2 bg-blue-900 text-white rounded-md flex items-center hover:bg-blue-800 transition duration-200"
            style={{ backgroundColor: "#03045e" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit Profile
          </button>
        </div>
      </div>
    );
  };



  const renderSidebarSkeleton = () => {
    return (
      <div className="p-4 border-b border-gray-200 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse mb-2"></div>
        <div className="h-5 w-32 bg-gray-200 animate-pulse rounded mb-1"></div>
        <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar for larger screens */}
      <div className="hidden md:flex md:w-64 bg-white border-r border-gray-200 flex-col">


        {
            loading ? (
                renderSidebarSkeleton()
            ):
           ( <div className="p-4 border-b border-gray-200 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden mb-2">
            <img
              src="/doctor-avatar.png"
              alt={doctorData.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-base font-semibold text-gray-800">
            {doctorData.fullName}
          </h2>
          {doctorData.department && (
            <p className="text-xs text-gray-500">{doctorData.department}</p>
          )}
        </div>)}

        <nav className="flex-1 p-4">
          <ul>
            {navItems.map((item) => (
              <li key={item.label} className="mb-2">
                <button
                  onClick={() => setActiveNav(item.label)}
                  className={`flex items-center w-full px-4 py-2 rounded-md text-left ${
                    activeNav === item.label
                      ? "text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  style={{
                    backgroundColor:
                      activeNav === item.label ? "#03045e" : "transparent",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={item.icon}
                    />
                  </svg>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden bg-white p-4 border-b border-gray-200 flex items-center justify-between">
        {
            loading ? (
                <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse mr-3"></div>
            <div>
              <div className="h-4 w-32 bg-gray-200 animate-pulse rounded mb-1"></div>
              <div className="h-3 w-24 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
            ):
           ( <div className="flex items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
            <img
              src="/doctor-avatar.png"
              alt={doctorData.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-800">
              {doctorData.fullName}
            </h2>
            {doctorData.department && (
              <p className="text-xs text-gray-500">{doctorData.department}</p>
            )}
          </div>
        </div>)
        }

        <button className="text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Content area with conditional rendering based on loading state and data availability */}
      <div className="flex-1 p-4 md:p-6">
        {activeNav === "Profile" && (
            <>
            {
                loading ? (
                    <RenderProfileSkeleton/>
                ): !hasData ?(
                    <ProfileRenderNoDataMessage/>
                ):(
                    renderProfileContent()
                )
            }
            </>
        )}
        {/* Other content sections would be conditionally rendered here */}
      </div>
    </div>
  );
};

export default DoctorProfileDashboard;
