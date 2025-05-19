"use client";
import React, { useEffect, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { getAllActiveDepartments } from "@/services/user/auth/authService";
import { IDepartment } from "@/components/homeComponents/MainBanner2";
import Header from "@/components/homeComponents/Header";
import Image from "next/image";
import { useRouter } from "next/navigation";

const DepartmentsList: React.FC = () => {
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<IDepartment[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter()

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setIsLoading(true);
        const response = await getAllActiveDepartments();

        console.log("==>", response.data);

        setDepartments(response.data || []);
        setFilteredDepartments(response.data || []);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch departments. Please try again later.");
        setIsLoading(false);
        console.error("Error fetching departments:", err);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDepartments(departments);
    } else {
      const filtered = departments.filter((dept) =>
        dept.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDepartments(filtered);
    }
  }, [searchQuery, departments]);

  const handleDepartmentClick = (departmentId: string | undefined) => {
    if (departmentId) {
      router.push(`/user/doctors?department=${departmentId}`)
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 text-medical-green animate-spin" />
        <p className="mt-4 text-gray-600">Loading departments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Oops!</p>
          <p className="mt-2">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-medical-green text-white rounded-md hover:bg-medical-green-light transition-colors"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Explore Medical Departments
          </h1>
          <p className="text-gray-600 mt-2">
            Discover our specialized departments dedicated to providing
            exceptional healthcare services
          </p>
        </div>

        {/* Search Box */}
        <div className="relative max-w-md mx-auto mb-8">
          <div className="flex items-center border border-gray-300 rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-medical-green">
            <div className="pl-4">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search departments..."
              className="w-full py-3 px-4 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Departments Grid */}
        {filteredDepartments.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>No departments found matching {searchQuery}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredDepartments.map((department) => (
              <div
                key={department._id}
                className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:bg-gray-50 border-2 border-transparent hover:border-medical-green"
                onClick={() => handleDepartmentClick(department._id)}
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden mb-4 relative">
                    <Image
                      src={department.icon || "/images/default-icon.png"} // fallback if needed
                      alt={department.name}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 80px, 64px"
                      priority
                    />
                  </div>
                  <h3 className="text-center font-medium text-gray-800">
                    {department.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default DepartmentsList;
