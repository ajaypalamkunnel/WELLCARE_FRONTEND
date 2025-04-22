"use client"
import React, { useEffect, useState } from 'react';
import { Calendar, Clock, FileText, CheckCircle, CreditCard, LogOut, User,KeyIcon, Loader2, Droplet, ShowerHead, Expand, ExpandIcon, ShrinkIcon } from 'lucide-react';
import IUser from '@/types/user';
import { fetchPatientProfile, userCompleteRegistration, userProfileEdit } from '@/services/user/auth/authService';
import toast from 'react-hot-toast';
import ForgotPasswordComponent from '@/components/Forgot-password';
import PasswordChangeComponent from '@/components/commonUIElements/PasswordChangeComponent';
import { Controller, useForm } from "react-hook-form";
import {  
  MapPin, 
  Mail, 
  Phone, 
  Edit, 
  X, 
  Heart, 
  ArrowRight 
} from 'lucide-react';
import { UserProfileData, UserProfileFormData } from '@/types/userProfileData';
import UserAppointmentsList from '@/components/userComponents/AppoinmentsList';
import Wallet from '@/components/userComponents/Wallet';
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
    { id: 'wallet', label: 'wallet', icon: <CreditCard size={20} /> },
    { id: 'Change-Password', label: 'Change Password', icon: <KeyIcon size={20} /> },
    { id: 'logout', label: 'Logout', icon: <LogOut size={20} /> },
  ];
  
  // Function to handle navigation item click
  const handleNavClick = (id: string) => {
    setActiveSection(id);
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin bg-medical-green h-12 w-12" />
      </div>
    );
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
      
      
        
        <div className="flex-grow bg-white p-6 rounded-lg shadow-md">
        
        {activeSection === 'profile' && <ProfileSection user={user!}  />}

        {activeSection === 'appointments' && <UserAppointmentsList/>}
        {activeSection === 'records' && <SectionContent title="Medical Records" />}
        {activeSection === 'Change-Password' && <PasswordChangeComponent id={user?._id!} userType='patient'/>}
        {activeSection === 'wallet' && <Wallet/>}

        
      </div>
    
    </div>
  );
};

interface ProfileSectionProps {
  user: UserProfileData | IUser;
  onEditProfile: (updatedUser: IUser) => void;
}

const ProfileSection: React.FC<UserProfileData> = ({ user, onEditProfile }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      fullName: user.fullName,
      mobile: user.mobile || '',
      age: user.personalInfo?.age ?? undefined,
      gender: user.personalInfo?.gender || '',
      blood_group: user.personalInfo?.blood_group || '',
      allergies: user.personalInfo?.allergies || '',
      chronic_disease: user.personalInfo?.chronic_disease || '',
      city: user.address?.city || '',
      country: user.address?.country || '',
      houseName: user.address?.houseName || '',
      postalCode: user.address?.postalCode || '',
      state: user.address?.state || '',
      street: user.address?.street || ''
    }
  });
  const handleEditProfile = async (data: UserProfileFormData) => {
    try {
      console.log("handleEdit");
      console.log(onEditProfile);
      
      
        
            // Convert flat form data to `UserProfileData` structure
            const formattedData: Partial<UserProfileData> = {
                user: {
                    fullName: data.fullName,
                    address: {
                      city: data.city,
                      country: data.country,
                      houseName: data.houseName,
                      postalCode: data.postalCode,
                      state: data.state,
                      street: data.street,
                    },
                    mobile: data.mobile,
                    email:user.email,
                    personalInfo: {
                        age: data.age ? Number(data.age) : undefined,
                        gender: data.gender,
                        blood_group: data.blood_group,
                        allergies: data.allergies,
                        chronic_disease: data.chronic_disease,
                    },
                },
            };

           const response = await userProfileEdit(formattedData)
            
           if(response?.data){
            onEditProfile?.(response.data)
            setTimeout(()=>{
              window.location.reload()

            },200)
            toast.success("Profile updated successfully!");
           }else{
              throw Error("data not recived")
           }
           
            setIsEditModalOpen(false);
            
       
    } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile. Please try again.");
    }
};


  if (!user) {
    return (
      <div className="text-center text-red-500 flex items-center justify-center h-full">
        <User size={48} className="mr-2" />
        No profile data available
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Profile Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <User size={24} className="mr-2" /> Profile
          </h2>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Edit size={20} />
          </button>
        </div>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <div className="w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              <User size={52} className="text-gray-400" />
            </div>
            <div className="absolute bottom-0 right-0 bg-green-500 p-2 rounded-full">
              <User size={16} className="text-white" />
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-800">{user.fullName}</h3>
          <p className="text-gray-600 flex items-center">
            <Mail size={16} className="mr-2" /> {user.email}
          </p>
        </div>

        {/* Basic Contact Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-100 p-4 rounded-md flex items-center">
            <Phone size={24} className="mr-3 text-gray-600" />
            <div>
              <h4 className="font-semibold text-gray-800">Mobile</h4>
              <p className="text-gray-600">{user.mobile || 'N/A'}</p>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-md flex items-center">
            <MapPin size={24} className="mr-3 text-gray-600" />
            <div>
              <h4 className="font-semibold text-gray-800">Location</h4>
              <p className="text-gray-600">
                {user.address?.city ? `${user.address.city}, ${user.address.country}` : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* View Details Button */}
        <button 
          onClick={() => setShowDetails(!showDetails)} 
          className="w-full bg-green-500 text-white py-2 rounded-md flex items-center justify-center hover:bg-green-600 transition-colors"
        >
          {showDetails ? 'Hide Details' : 'View Details'}
          {
            showDetails ? <ShrinkIcon size={20} className="ml-2" /> : <ExpandIcon size={20} className="ml-2" />
          }
          
        </button>

        {/* Edit Profile Modal */}
        {isEditModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-y-auto">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 border border-gray-100 relative">
      {/* Modal Header - Fixed at top */}
      <div className="sticky top-0 bg-white p-5 border-b border-gray-100 rounded-t-2xl z-10">
        <div className="flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-bold text-medical-green flex items-center">
            <User className="mr-2 w-5 h-5 md:w-6 md:h-6" /> Edit Profile
          </h2>
          <button 
            onClick={() => setIsEditModalOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition duration-200"
            aria-label="Close modal"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      {/* Modal Body - Scrollable */}
      <div className="p-5 max-h-[70vh] overflow-y-auto">
        <form onSubmit={handleSubmit(handleEditProfile)} className="space-y-5">
          {/* Personal Information Section */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-md md:text-lg font-semibold text-medical-green mb-3">Personal Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input 
                  {...register('fullName', { required: 'Full Name is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-green-light transition duration-200"
                  placeholder="Enter your full name"
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medicalring-medical-green-light" />
                  <input 
                    {...register('mobile')}
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-green-light transition duration-200"
                    placeholder="Enter your mobile number"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input 
                  type="number"
                  {...register('age')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-green-light transition duration-200"
                  placeholder="Your age"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  {...register('gender')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-green-light transition duration-200"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Group
                </label>
                <div className="relative">
                  <Droplet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medicalring-medical-green-light" />
                  <select
                    {...register('blood_group')}
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-green-light transition duration-200"
                  >
                    <option value="">Select Blood Group</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Medical Information Section */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-md md:text-lg font-semibold text-medical-green mb-3">Medical Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allergies
                </label>
                <textarea
                  {...register('allergies')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-green-light transition duration-200"
                  placeholder="List any allergies (if applicable)"
                  rows={2}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chronic Disease
                </label>
                <textarea 
                  {...register('chronic_disease')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-green-light transition duration-200"
                  placeholder="List any chronic diseases (if applicable)"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-md md:text-lg font-semibold text-medical-green mb-3">
              <MapPin className="inline mr-2" /> Address Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  House Name/Number
                </label>
                <input 
                  {...register('houseName')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-green-light transition duration-200"
                  placeholder="House name or number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street
                </label>
                <input 
                  {...register('street')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-green-light transition duration-200"
                  placeholder="Street name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input 
                  {...register('city')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-green-light transition duration-200"
                  placeholder="City"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input 
                  {...register('state')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-green-light transition duration-200"
                  placeholder="State/Province"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <input 
                  {...register('postalCode')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-green-light transition duration-200"
                  placeholder="Postal/ZIP code"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                {...register('country')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-medical-green-light transition duration-200"
              >
                <option value="">Select Country</option>
                {['United States', 'Canada', 'United Kingdom', 'Australia', 'India', 
                  'Germany', 'France', 'Japan', 'Brazil', 'Other'].map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Modal Footer - Fixed at bottom */}
      <div className="sticky bottom-0 bg-white p-5 border-t border-gray-100 rounded-b-2xl">
        <div className="flex justify-end space-x-3">
          <button 
            type="button" 
            onClick={() => setIsEditModalOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-100 transition duration-200 font-medium text-sm"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit(handleEditProfile)}
            className="px-4 py-2 bg-medical-green hover:bg-medical-green-light text-white rounded-full transition duration-300 font-medium text-sm flex items-center"
          >
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  </div>
)}
        {/* Detailed User Information */}
        {showDetails && (
          <div className="mt-6 space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-bold mb-2 flex items-center">
                <Heart size={20} className="mr-2 text-red-500" /> Personal Information
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <p><strong>Age:</strong> {user.personalInfo?.age || 'N/A'}</p>
                <p><strong>Gender:</strong> {user.personalInfo?.gender || 'N/A'}</p>
                <p><strong>Blood Group:</strong> {user.personalInfo?.blood_group || 'N/A'}</p>
                <p><strong>Allergies:</strong> {user.personalInfo?.allergies || 'N/A'}</p>
                <p><strong>Chronic Disease:</strong> {user.personalInfo?.chronic_disease || 'N/A'}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-bold mb-2 flex items-center">
                <MapPin size={20} className="mr-2 text-medicalring-medical-green-light" /> Address Details
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <p><strong>House Name:</strong> {user.address?.houseName || 'N/A'}</p>
                <p><strong>Street:</strong> {user.address?.street || 'N/A'}</p>
                <p><strong>City:</strong> {user.address?.city || 'N/A'}</p>
                <p><strong>State:</strong> {user.address?.state || 'N/A'}</p>
                <p><strong>Postal Code:</strong> {user.address?.postalCode || 'N/A'}</p>
                <p><strong>Country:</strong> {user.address?.country || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}
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

