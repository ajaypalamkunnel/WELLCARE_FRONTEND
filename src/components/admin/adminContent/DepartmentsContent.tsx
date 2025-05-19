"use client";

import React, { useEffect, useState } from "react";
import { X, Plus, ImagePlus } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import {
  createDepartment,
  featchAllDepartments,
  updateDepartmentStatus,
} from "@/services/admin/adminServices";
import { capitalizeWords } from "@/utils/Capitalize";
import { DepartmentTpe } from "@/types/departmentType";

const DepartmentsContent: React.FC = () => {
  // State to manage departments and modal visibility
  const [departments, setDepartments] = useState<DepartmentTpe[]>([]);

  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State to manage new department input
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const respose = await featchAllDepartments();

        setDepartments(respose.data);
      } catch (error) {
        console.log(error);

        toast.error("Failed to fetch departments");
      }
    };
    fetchDepartments();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
  } = useForm<{ name: string; icon: File }>({
    defaultValues: {
      name: "",
      icon: undefined,
    },
  });

  // Handler to open the add department modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Handler to close the add department modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset new department state
    setIconPreview(null);
    reset();
  };

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const CLOUDINARY_UPLOAD_URL =
      "https://api.cloudinary.com/v1_1/dy3yrxbmg/upload";
    const CLOUDINARY_UPLOAD_PRESET = "department-icon";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData);
      return response.data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      toast.error("Image upload failed");
      return null;
    }
  };

  const handleIconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setValue("icon", file); // Store file for Cloudinary upload
    }
  };

  // Handler to block/unblock a department
  const handleBlockDepartment = async (id: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;

      const response = await updateDepartmentStatus(id, newStatus);

      if (response.status === 200) {
        setDepartments((prevDepartments) =>
          prevDepartments.map((dept) =>
            dept._id === id ? { ...dept, status: newStatus } : dept
          )
        );
        toast.success(
          `Department ${newStatus ? "Unblocked" : "Blocked"} successfully!`
        );
      } else {
        throw new Error("Failed to update department status.");
      }
    } catch (error) {
      console.error("Failed to update department status", error);
      toast.error("Error updating department status. Please try again.");
    }
  };

  const onSubmit = async (data: { name: string; icon: File }) => {
    setLoading(true);
    try {
      const uploadedImageUrl = await uploadToCloudinary(data.icon);
      console.log("image url", uploadedImageUrl);

      if (!uploadedImageUrl) {
        toast.error("Image upload failed");
        setLoading(false);
        return;
      }

      const newDepartment = await createDepartment(data.name, uploadedImageUrl);
      toast.success("Department created successfully");

      setDepartments((prevDepartments) => [
        ...prevDepartments,
        newDepartment.data,
      ]);

      handleCloseModal();
    } catch (error) {
      console.log("Failed to add department.:",error);
      toast.error("Failed to add department.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e10] p-6 text-white">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Departments</h1>
        <p className="text-gray-400 mb-4">Manage your hospital departments</p>

        {/* Departments Listing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {departments.map((dept) => (
            <div
              key={dept._id}
              className="bg-[#1f2937] rounded-lg p-3 md:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0"
            >
              <div className="flex items-center space-x-3 w-full sm:w-auto overflow-hidden">
                <img
                  src={dept.icon}
                  alt={`${dept.name} icon`}
                  className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex-shrink-0"
                />
                <span className="font-semibold text-sm lg:text-base truncate">
                  {capitalizeWords(dept.name)}
                </span>
              </div>
              <button
                onClick={() => handleBlockDepartment(dept._id, dept?.status)}
                className={`flex items-center px-2 py-1 md:px-3 md:py-2 rounded-md text-xs md:text-sm whitespace-nowrap transition-colors duration-200 
          ${
            dept.status
              ? "bg-red-600 text-white hover:bg-red-700" // Block Button
              : "bg-green-600 text-white hover:bg-green-700"
          }`} // Unblock Button
              >
                <X className="mr-1 md:mr-2" size={14} />
                {dept.status ? "Block" : "Unblock"}
              </button>
            </div>
          ))}
        </div>

        {/* Add New Department Button */}
        <div className="mt-6">
          <button
            onClick={handleOpenModal}
            className="bg-[#3b83f2] text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition"
          >
            <Plus className="mr-2" /> Add New Department
          </button>
        </div>

        {/* Add Department Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#101729] rounded-lg p-6 w-96">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Add New Department</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Department Icon Upload */}
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4 flex justify-center">
                  <label className="cursor-pointer flex flex-col items-center">
                    <div className="bg-[#1f2937] rounded-full w-24 h-24 flex items-center justify-center">
                      {iconPreview ? (
                        <img
                          src={iconPreview}
                          alt="Icon"
                          className="w-full h-full rounded-full"
                        />
                      ) : (
                        <ImagePlus size={40} className="text-gray-400" />
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleIconUpload}
                    />
                    <span className="mt-2 text-gray-400">Upload Icon</span>
                  </label>
                </div>

                {/* Department Name Input */}
                <div className="mb-6">
                  <label
                    htmlFor="departmentName"
                    className="block text-sm mb-2"
                  >
                    Department Name
                  </label>
                  <input
                    type="text"
                    {...register("name", { required: "Required" })}
                    placeholder="Department Name"
                    className="w-full bg-[#1f2937] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#3b83f2]"
                  />
                </div>

                {/* Add Department Button */}
                <button className="w-full bg-[#3b83f2] text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center">
                  {loading ? (
                    "saving..."
                  ) : (
                    <>
                      <Plus className="mr-2" />
                      Add Department
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentsContent;
