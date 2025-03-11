"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Camera, User, Mail, Phone, Briefcase, Calendar } from 'lucide-react';

import toast from 'react-hot-toast';
import { featchAllDepartments } from '@/services/doctor/doctorService';
import { useAuthStoreDoctor } from '@/store/doctor/authStore';

interface Step1ProfileProps {
  register: any;
  errors: any;
  watch: any;
  setValue: any;
}
interface Department {
  _id: string;
  name: string;
  icon: string;
}
interface ClinicAddress {
  clinicName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}
const Step1Profile: React.FC<Step1ProfileProps> = ({ register, errors, watch, setValue }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [departments,setDepartments] = useState<Department[]>([]);
  const doctor = useAuthStoreDoctor((state)=>state.user)

  const availability = watch("availability") || [];
  const isOfflineSelected = availability.includes("Offline");


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check if file is jpg
      if (file.type !== 'image/jpeg') {
        alert('Please upload a JPG image');
        return;
      }
      
      setValue('profileImage', file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdatePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(()=>{
    const fetchDepartments = async () => {
      try {
        const respose = await featchAllDepartments()

        setDepartments(respose.data)

      } catch (error) {
        toast.error("Failed to fetch departments")
      }
    }
    fetchDepartments()
  },[])

  return (
    <div className="animate-fade-in">
      <h2 className="step-title mb-6">Doctor Profile Information</h2>
      
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            {previewImage ? (
              <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-16 h-16 text-gray-400" />
            )}
          </div>
          <button 
            type="button"
            onClick={handleUpdatePhoto}
            className="absolute bottom-0 right-0 bg-deep-blue text-white p-2 rounded-full shadow-lg hover:bg-opacity-90 transition-all duration-200"
          >
            <Camera className="w-5 h-5" />
          </button>
          <input 
            type="file"
            id="profileImage"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
            accept=".jpg,image/jpeg"
          />
          {errors.profileImage && (
            <p className="error-text text-center mt-2">{errors.profileImage.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fullName" className="form-label">Full Name</label>
            <div className="relative">
              <input
                id="fullName"
                type="text"
                disabled
                value={doctor?.fullName || ""}
                className="form-input pl-10"
                placeholder="Dr. John Doe"
                {...register('fullName', { required: 'Full name is required' })}
              />
              <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            {errors.fullName && <p className="error-text">{errors.fullName.message}</p>}
          </div>
          
          <div>
            <label className="form-label">Gender</label>
            <div className="flex space-x-4 mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="Male"
                  className="w-4 h-4 text-deep-blue"
                  {...register('gender', { required: 'Gender is required' })}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Male</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="Female"
                  className="w-4 h-4 text-deep-blue"
                  {...register('gender', { required: 'Gender is required' })}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Female</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="Other"
                  className="w-4 h-4 text-deep-blue"
                  {...register('gender', { required: 'Gender is required' })}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Other</span>
              </label>
            </div>
            {errors.gender && <p className="error-text">{errors.gender.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="form-label">Email</label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={doctor?.email || ""}
                disabled
                className="form-input pl-10"
                placeholder="doctor@example.com"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            {errors.email && <p className="error-text">{errors.email.message}</p>}
          </div>
          
          <div>
            <label htmlFor="mobile" className="form-label">Phone Number</label>
            <div className="relative">
              <input
                id="mobile"
                type="tel"
                className="form-input pl-10"
                placeholder="+1 (555) 123-4567"
                {...register('mobile', { 
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                    message: 'Invalid phone number'
                  }
                })}
              />
              <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            {errors.mobile && <p className="error-text">{errors.mobile.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="departmentId" className="form-label">Department</label>
            <div className="relative">
              <select
                id="departmentId"
                className="form-input pl-10 appearance-none"
                {...register('departmentId', { required: 'Department is required' })}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>{dept.name}</option>
                ))}
              </select>
              <Briefcase className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </div>
            </div>
            {errors.department && <p className="error-text">{errors.department.message}</p>}
          </div>
          
          <div>
            <label htmlFor="experience" className="form-label">Years of Experience</label>
            <div className="relative">
              <input
                id="experience"
                type="number"
                min="0"
                max="70"
                className="form-input pl-10"
                placeholder="10"
                {...register('experience', { 
                  required: 'Years of experience is required',
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: 'Experience cannot be negative'
                  },
                  max: {
                    value: 70,
                    message: 'Experience cannot exceed 70 years'
                  }
                })}
              />
              <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            {errors.experience && <p className="error-text">{errors.experience.message}</p>}
          </div>

           {/* New Specialization Field */}
        <div>
          <label htmlFor="specialization" className="form-label">
            Specialization (Optional)
          </label>
          <div className="relative">
            <input
              id="specialization"
              type="text"
              className="form-input pl-10"
              placeholder="e.g., Pediatric Surgeon, Transplant Surgeon"
              {...register("specialization")}
            />
            <Briefcase className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>
          {errors.specialization && (
            <p className="error-text">{errors.specialization.message}</p>
          )}
        </div>

          <div className="mb-6">
        <label className="form-label">Availability</label>
        <div className="flex space-x-4 mt-2">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              value="Online"
              className="w-4 h-4 text-deep-blue"
              {...register("availability")}
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Online</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              value="Offline"
              className="w-4 h-4 text-deep-blue"
              {...register("availability")}
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">Offline</span>
          </label>
        </div>
      </div>
      {isOfflineSelected && (
        <div className="space-y-6">
          <h3 className="text-lg text-white font-semibold">Clinic Address</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Clinic Name */}
            <div>
              <label htmlFor="clinicName" className="form-label">
                Clinic Name
              </label>
              <input
                id="clinicName"
                type="text"
                className="form-input"
                placeholder="Clinic Name"
                {...register("clinicAddress.clinicName", { required: "Clinic name is required" })}
              />
              {errors.clinicAddress?.clinicName && (
                <p className="error-text">{errors.clinicAddress.clinicName.message}</p>
              )}
            </div>

            {/* Street */}
            <div>
              <label htmlFor="street" className="form-label">
                Street
              </label>
              <input
                id="street"
                type="text"
                className="form-input"
                placeholder="123 Main St"
                {...register("clinicAddress.street", { required: "Street is required" })}
              />
              {errors.clinicAddress?.street && (
                <p className="error-text">{errors.clinicAddress.street.message}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="form-label">
                City
              </label>
              <input
                id="city"
                type="text"
                className="form-input"
                placeholder="City"
                {...register("clinicAddress.city", { required: "City is required" })}
              />
            </div>

            {/* State */}
            <div>
              <label htmlFor="state" className="form-label">
                State
              </label>
              <input
                id="state"
                type="text"
                className="form-input"
                placeholder="State"
                {...register("clinicAddress.state", { required: "State is required" })}
              />
            </div>

            {/* Postal Code */}
            <div>
              <label htmlFor="postalCode" className="form-label">
                Postal Code
              </label>
              <input
                id="postalCode"
                type="text"
                className="form-input"
                placeholder="Postal Code"
                {...register("clinicAddress.postalCode", { required: "Postal code is required" })}
              />
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="form-label">
                Country
              </label>
              <input
                id="country"
                type="text"
                className="form-input"
                placeholder="Country"
                {...register("clinicAddress.country", { required: "Country is required" })}
              />
            </div>
          </div>
        </div>
      )}

          
        </div>
      </div>
    </div>
  );
};

export default Step1Profile;
