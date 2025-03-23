"use client"
import React, { useEffect, useState } from 'react';
import { Calendar, Clock, FileText, CheckCircle, CreditCard, LogOut, User,KeyIcon } from 'lucide-react';
import IUser from '@/types/user';
import { fetchPatientProfile } from '@/services/user/auth/authService';
import toast from 'react-hot-toast';
import ForgotPasswordComponent from '@/components/Forgot-password';
import PasswordChangeComponent from '@/components/commonUIElements/PasswordChangeComponent';

// Define the main layout component
const PatientPortal: React.FC = () => {
  // State to track the active section
  const [activeSection, setActiveSection] = useState<string>('profile');
  const [user,setUser] = useState<IUser|null>(null)
  const [loading,setLoading] = useState<boolean>(true)


useEffect(()=>{

    const getUserProfile = async () =>{
        try {
            setLoading(true)
            const profileData = await fetchPatientProfile()
            console.log(profileData);
            

            if(profileData){
                setUser(profileData)
            }else{
                toast.error("Failed to load profile")
            }
        } catch (error) {
            toast.error("Error fetching profile");
            console.error("Profile fetch error:", error);
        }finally{
            setLoading(false)
        }
    }
getUserProfile()
},[])
  // Define navigation items
  const navItems = [
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
    { id: 'appointments', label: 'My Appointments', icon: <Calendar size={20} /> },
    { id: 'records', label: 'Medical Records', icon: <FileText size={20} /> },
    { id: 'upcoming', label: 'Upcoming Appointments', icon: <Clock size={20} /> },
    { id: 'completed', label: 'Completed Appointments', icon: <CheckCircle size={20} /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard size={20} /> },
    { id: 'Change-Password', label: 'Change Password', icon: <KeyIcon size={20} /> },
    { id: 'logout', label: 'Logout', icon: <LogOut size={20} /> },
  ];
  
  // Function to handle navigation item click
  const handleNavClick = (id: string) => {
    setActiveSection(id);
  };
  if(loading){
    return <p className="text-center text-gray-600">Loading profile...</p>;
  }
  
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen font-sans mx-4 my-4 bg-gray-100">
      {/* Left Navigation */}
      <div className="w-full md:w-72 bg-white shadow-md rounded-lg mr-0 md:mr-4 mb-4 md:mb-0">
        {/* Portal Header */}
        <div className="flex items-center p-5 border-b">
          <div className="w-10 h-10 bg-[#03C03C] rounded-full flex items-center justify-center text-white">
            <User size={22} />
          </div>
          <h1 className="ml-3 text-xl font-bold text-gray-800">Patient Portal</h1>
        </div>
        
        {/* Navigation Items */}
        <nav className="py-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center p-4 text-left transition-colors ${
                activeSection === item.id 
                  ? 'bg-[#03C03C] text-white font-medium' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-[#03C03C]'
              }`}
            >
              <span className="mr-4">{item.icon}</span>
              <span className="text-base">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      
      {/* Right Content Area */}
      
      
        
        (<div className="flex-grow bg-white p-6 rounded-lg shadow-md">
        
        {activeSection === 'profile' && <ProfileSection user={user} />}

        {activeSection === 'appointments' && <SectionContent title="My Appointments" />}
        {activeSection === 'records' && <SectionContent title="Medical Records" />}
        {activeSection === 'upcoming' && <SectionContent title="Upcoming Appointments" />}
        {activeSection === 'completed' && <SectionContent title="Completed Appointments" />}
        {activeSection === 'Change-Password' && <PasswordChangeComponent id={user?._id!} userType='patient'/>}
        {activeSection === 'payments' && <SectionContent title="Payments" />}

        
      </div>)
    
    </div>
  );
};


interface ProfileProps{
    user:IUser|null
}
// Profile Section Component
const ProfileSection: React.FC<ProfileProps> = ({user}) => {
    if(!user){
        return <p className="text-center text-red-500">No profile data available</p>;
    }
  return (
    <div className="flex flex-co items-center">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 self-start">Profile</h2>
      
      <div className="w-full  max-w-2xl mx-auto">
        <div className=" p-6  rounded-md shadow-sm flex flex-col items-center">
          {/* Profile Image */}
          <div className="relative mb-5">
            <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 overflow-hidden">
              <User size={52} />
              <img src="/images/logo.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 right-0 bg-[#09db4b] p-2 rounded-full">
              <User size={16} className="text-white" />
            </div>
          </div>
          
          {/* Profile Details */}
          <h3 className="text-xl font-bold mb-2 text-gray-800">{user.fullName}</h3>
          <p className="text-gray-600 mb-1 text-base">{user.email}</p>
          <p className="text-gray-600 mb-5 text-base">{user.mobile||"N/A"}</p>
          
          <button className="bg-[#03C03C] hover:bg-[#09db4b] text-white py-3 px-5 rounded-md transition-colors w-full font-medium text-base">
            View Details &gt;&gt;
          </button>
        </div>
        
        
      </div>
    </div>
  );
};

// Generic Section Content Component
const SectionContent: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
      <div className="bg-gray-50 p-6 rounded-md shadow-sm">
        <p className="text-gray-600 text-base">This is the {title.toLowerCase()} section.</p>
      </div>
    </div>
  );
};

export default PatientPortal;



{/* <div className="mt-6 bg-gray-50 p-6 rounded-md shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Personal Information</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="text-base font-medium">Sarah Johnson</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email Address</p>
              <p className="text-base">sarah.johnson@example.com</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="text-base">+1 (555) 123-4567</p>
            </div>
          </div>
        </div> */}