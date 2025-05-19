"use client";
import { updateDoctorProfile } from "@/services/doctor/doctorService";
import IDoctorProfileDataType from "@/types/doctorFullDataType";
import axios from "axios";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export interface DoctorProfileUpdateForm {
  _id?: string;
  fullName: string;
  mobile: string;
  experience: number;
  specialization: string;
  profileImage?: string;
}
interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorData: IDoctorProfileDataType;
  onProfileUpdate: (updatedData: IDoctorProfileDataType) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  doctorData,
  onProfileUpdate,
}) => {
  // console.log(">>>>>>>>",doctorData);

  const [imagePreview, setImagePreview] = useState<string | null>(
    doctorData.profileImage || null
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DoctorProfileUpdateForm>({
    defaultValues: {
      fullName: doctorData.fullName,
      mobile: doctorData.mobile,
      experience: doctorData.experience,
      specialization: doctorData.specialization,
      profileImage: doctorData.profileImage,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        fullName: doctorData.fullName,
        mobile: doctorData.mobile,
        experience: doctorData.experience,
        specialization: doctorData.specialization,
        profileImage: doctorData.profileImage,
      });
      setImagePreview(doctorData.profileImage || null);
      setSelectedImage(null);
    }
  }, [isOpen, doctorData, reset]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToCloudinary = async (
    file: string | File
  ): Promise<string | null> => {
    if (typeof file === "string") {
      return file;
    }

    if (!(file instanceof File)) {
      console.error("Invalid file format for Cloudinary upload.");
      toast.error("Invalid file format.");
      return null;
    }
    console.log("File Type:", file.type);

    const CLOUDINARY_UPLOAD_URL =
      "https://api.cloudinary.com/v1_1/dy3yrxbmg/upload";
    const CLOUDINARY_UPLOAD_PRESET = "doctor-documents";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const respose = await axios.post(CLOUDINARY_UPLOAD_URL, formData);
      return respose.data.secure_url;
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      toast.error("Failed to upload image.");
      return null;
    }
  };

  const onSubmit = async (formData: DoctorProfileUpdateForm) => {
    try {
      let imageUrl: string | null = doctorData?.profileImage ?? null;

      if (selectedImage) {
        imageUrl = await uploadToCloudinary(selectedImage);
        if (!imageUrl) {
          toast.error("Image upload failed.");
          return;
        }
      }

      const updatedData = { ...formData, profileImage: imageUrl! };

      const response = await updateDoctorProfile(doctorData._id!, updatedData!);

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        onProfileUpdate(updatedData); //
        setTimeout(() => {
          onClose(); //
        }, 100);
      } else {
        throw new Error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Error updating profile. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            <X size={24} />
          </button>
        </div>

        {/* Profile Image Upload */}
        <div className="flex justify-center mb-6">
          <label className="cursor-pointer flex flex-col items-center">
            <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-gray-300">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Profile"
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <ImagePlus size={32} className="text-gray-500" />
                </div>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <span className="mt-2 text-sm text-gray-500">
              Upload New Picture
            </span>
          </label>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="text-gray-700 font-medium">Full Name</label>
            <input
              type="text"
              {...register("fullName", { required: "Full Name is required" })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName.message}</p>
            )}
          </div>

          {/* Mobile */}
          <div>
            <label className="text-gray-700 font-medium">Mobile</label>
            <input
              type="text"
              {...register("mobile", {
                required: "Mobile is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Enter a valid 10-digit mobile number",
                },
              })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm">{errors.mobile.message}</p>
            )}
          </div>

          {/* Experience */}
          <div>
            <label className="text-gray-700 font-medium">
              Experience (Years)
            </label>
            <input
              type="number"
              {...register("experience", {
                required: "Experience is required",
                min: { value: 1, message: "Must be at least 1 year" },
              })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            />
            {errors.experience && (
              <p className="text-red-500 text-sm">
                {errors.experience.message}
              </p>
            )}
          </div>

          {/* Specialization */}
          <div>
            <label className="text-gray-700 font-medium">Specialization</label>
            <input
              type="text"
              {...register("specialization", {
                required: "Specialization is required",
              })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            />
            {errors.specialization && (
              <p className="text-red-500 text-sm">
                {errors.specialization.message}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
