"use client";
import React, { useState, useEffect } from "react";
import { Star, Search, Filter, ChevronLeft, ChevronRight, Calendar, Briefcase, MapPin, Award, UserCheck, Loader2, X, Sliders, Check } from "lucide-react";
import { getAllActiveDepartments, getAllSubscribedDoctors } from "@/services/user/auth/authService";
import { IDepartment } from "@/types/doctorFullDataType";
import IDoctor from "@/types/IDoctor";
import Header from '@/components/homeComponents/Header';

const DoctorListing = () => {
  // State for doctors & departments
  const [doctors, setDoctors] = useState<IDoctor[]>([]);
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for Filters & Pagination
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState({ gender: "", department: "", availability: "" });
  const [sortBy, setSortBy] = useState<string>("experience");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalDoctors, setTotalDoctors] = useState<number>(0);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const itemsPerPage = 6;

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(value => value !== "").length;

  //  Fetch Doctors & Departments from API
  useEffect(() => {
    const fetchDoctorsAndDepartments = async () => {
      try {
        setLoading(true);
        
        // Fetch doctors
        const doctorResponse = await getAllSubscribedDoctors({
          search: searchTerm,
          gender: filters.gender,
          departmentId: filters.department,
          availability: filters.availability,
          sortBy,
          page: currentPage,
          limit: itemsPerPage,
        });

        //  Correctly setting doctors, total, and totalPages
        setDoctors(doctorResponse.doctors);
        setTotalPages(doctorResponse.totalPages);
        setTotalDoctors(doctorResponse.total);

        // Fetch active departments
        const departmentResponse = await getAllActiveDepartments();
        setDepartments(departmentResponse.data);
      } catch (err) {
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorsAndDepartments();
  }, [searchTerm, filters, sortBy, currentPage]);

  //  Handlers for Filters & Sorting
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };
  
  const handleFilterChange = (name: string, value: string) => {
    setFilters({ ...filters, [name]: value });
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1); // Reset to first page on sort change
  };
  
  const handlePageChange = (page: number) => setCurrentPage(page);
  
  const clearFilters = () => {
    setFilters({ gender: "", department: "", availability: "" });
    setCurrentPage(1);
  };
  
  const toggleFilterModal = () => setShowFilterModal(!showFilterModal);

  // Render rating stars
  const renderStars = (rating = 4) => {
    return (
      <div className="flex">
        {Array(5).fill(0).map((_, index) => (
          <Star 
            key={index} 
            size={16} 
            className={index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
          />
        ))}
      </div>
    );
  };

  //  UI: Loading & Error Handling
  if (loading) {
    return (
      <>
        <Header/>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 text-medical-green animate-spin" />
          <p className="mt-4 text-gray-600">Loading doctors...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header/>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center p-10 bg-red-50 rounded-xl border border-red-100">
            <p className="text-red-600 font-medium text-lg">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header/>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Find Your Doctor</h1>
            <p className="text-gray-600">
              <span className="font-medium">{totalDoctors}</span> medical professionals available
            </p>
          </div>
          
          {/* Sort Dropdown (Desktop) */}
          <div className="hidden md:flex items-center mt-4 md:mt-0">
            <span className="text-gray-500 mr-2">Sort by:</span>
            <div className="relative">
              <select 
                value={sortBy} 
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg py-2 pl-4 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-medical-green focus:border-transparent"
              >
                <option value="experience">Experience</option>
                <option value="rating">Rating</option>
                <option value="name">Name (A-Z)</option>
                <option value="newest">Newest Doctors</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Panel (Desktop) */}
          <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 h-fit sticky top-4">
            <div className="p-4 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Filters</h3>
                {activeFilterCount > 0 && (
                  <button 
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    Clear all
                    <X size={14} className="ml-1" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Filter Groups */}
            <div className="p-4 border-b border-gray-100">
              <h4 className="font-medium text-gray-700 mb-3">Gender</h4>
              <div className="space-y-2">
                {[
                  { value: "", label: "All Genders" },
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" }
                ].map((option) => (
                  <label key={option.value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={filters.gender === option.value}
                      onChange={() => handleFilterChange("gender", option.value)}
                      className="w-4 h-4 text-medical-green"
                    />
                    <span className="ml-2 text-gray-600">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-b border-gray-100">
              <h4 className="font-medium text-gray-700 mb-3">Department</h4>
              <select
                name="department"
                value={filters.department}
                onChange={(e) => handleFilterChange("department", e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-green"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="p-4">
              <h4 className="font-medium text-gray-700 mb-3">Availability</h4>
              <div className="space-y-2">
                {[
                  { value: "", label: "Any Availability" },
                  { value: "Online", label: "Online" },
                  { value: "Offline", label: "Offline" }
                ].map((option) => (
                  <label key={option.value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="availability"
                      checked={filters.availability === option.value}
                      onChange={() => handleFilterChange("availability", option.value)}
                      className="w-4 h-4 text-medical-green"
                    />
                    <span className="ml-2 text-gray-600">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Search and Results Column */}
          <div className="lg:col-span-3">
            {/* Search and Mobile Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search doctors by name" 
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-medical-green focus:border-transparent" 
                  value={searchTerm} 
                  onChange={handleSearchChange}
                />
              </div>
              
              {/* Mobile Filter Button */}
              <button 
                onClick={toggleFilterModal}
                className="lg:hidden flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl py-3 px-4 shadow-sm hover:bg-gray-50 transition-colors"
              >
                <Sliders size={20} className="text-gray-600" />
                <span className="font-medium">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-medical-green text-white text-xs font-medium rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              
              {/* Mobile Sort Button */}
              <div className="md:hidden relative">
                <select 
                  value={sortBy} 
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none w-full bg-white border border-gray-200 rounded-xl py-3 pl-4 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-medical-green focus:border-transparent"
                >
                  <option value="experience">Sort by Experience</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="name">Sort by Name (A-Z)</option>
                  <option value="newest">Newest Doctors</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Active Filters Display */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.gender && (
                  <div className="inline-flex items-center bg-blue-50 text-blue-800 rounded-full px-3 py-1">
                    <span className="text-sm">Gender: {filters.gender}</span>
                    <button 
                      onClick={() => handleFilterChange("gender", "")}
                      className="ml-1 p-1 rounded-full hover:bg-blue-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                
                {filters.department && (
                  <div className="inline-flex items-center bg-purple-50 text-purple-800 rounded-full px-3 py-1">
                    <span className="text-sm">
                      Department: {departments.find(d => d._id === filters.department)?.name || "Selected"}
                    </span>
                    <button 
                      onClick={() => handleFilterChange("department", "")}
                      className="ml-1 p-1 rounded-full hover:bg-purple-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                
                {filters.availability && (
                  <div className="inline-flex items-center bg-green-50 text-green-800 rounded-full px-3 py-1">
                    <span className="text-sm">Availability: {filters.availability}</span>
                    <button 
                      onClick={() => handleFilterChange("availability", "")}
                      className="ml-1 p-1 rounded-full hover:bg-green-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                
                <button 
                  onClick={clearFilters}
                  className="inline-flex items-center bg-gray-100 text-gray-700 rounded-full px-3 py-1 hover:bg-gray-200 transition-colors"
                >
                  <span className="text-sm">Clear all</span>
                  <X size={14} className="ml-1" />
                </button>
              </div>
            )}

            {/* Doctor Cards */}
            {doctors.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Search size={24} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No doctors found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
                <button 
                  onClick={clearFilters}
                  className="bg-medical-green hover:bg-medical-green-dark text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {doctors.map((doctor) => (
                  <div 
                    key={doctor._id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col"
                  >
                    <div className="relative">
                      {/* Doctor Profile Image */}
                      <img 
                        src={doctor.profileImage || "/default-doctor.jpg"} 
                        alt={doctor.fullName || "Doctor"} 
                        className="w-full h-48 object-cover"
                      />
                      
                      {/* Availability Badge */}
                      <div className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${
                        doctor.availability?.includes("Online") 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {doctor.availability?.includes("Online") 
                          ? "Available Online" 
                          : "Available Offline"}
                      </div>

                      {/* Verified Badge */}
                      {doctor.isVerified && (
                        <div className="absolute top-3 right-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                          <UserCheck size={12} className="mr-1" />
                          Verified
                        </div>
                      )}
                    </div>
                    
                    <div className="p-5 flex-grow">
                      {/* Name, Department & Experience */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {doctor.gender === 'male' ? 'Dr. ' : 'Dr. '}
                            {doctor.fullName || "Doctor Name"}
                          </h3>
                          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                            {doctor.experience || 0}+ years
                          </span>
                        </div>
                        
                        <p className="text-gray-600">
                          {doctor.departmentId?.name || doctor.specialization || "Specialist"}
                        </p>
                      </div>
                      
                      {/* Ratings */}
                      <div className="flex items-center mb-4">
                        {renderStars(4)}
                        <span className="text-sm text-gray-600 ml-2">(4.0)</span>
                      </div>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {doctor.specialization && (
                          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs">
                            <Briefcase size={12} />
                            {doctor.specialization}
                          </span>
                        )}
                        
                        {doctor.education && doctor.education.length > 0 && (
                          <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs">
                            <Award size={12} />
                            {doctor.education[0].degree}
                          </span>
                        )}
                        
                        {doctor.clinicAddress && (
                          <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs">
                            <MapPin size={12} />
                            {doctor.clinicAddress.city}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Book Appointment Button */}
                    <div className="px-5 pb-5 mt-auto">
                      <button className="w-full bg-medical-green hover:bg-medical-green-dark text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                        Book Appointment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-1">
                  <button 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))} 
                    disabled={currentPage === 1} 
                    className={`p-2 rounded-lg ${
                      currentPage === 1 
                        ? "text-gray-400 cursor-not-allowed" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button 
                      key={page} 
                      onClick={() => handlePageChange(page)} 
                      className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                        currentPage === page 
                          ? "bg-medical-green text-white" 
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages} 
                    className={`p-2 rounded-lg ${
                      currentPage === totalPages 
                        ? "text-gray-400 cursor-not-allowed" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-end lg:hidden">
          <div className="bg-white rounded-t-xl w-full max-h-[90vh] overflow-auto animate-slide-up">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
              <button onClick={toggleFilterModal} className="p-2">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-4 border-b border-gray-100">
              <h4 className="font-medium text-gray-700 mb-3">Gender</h4>
              <div className="space-y-3">
                {[
                  { value: "", label: "All Genders" },
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" }
                ].map((option) => (
                  <label key={option.value} className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                    <div className={`w-5 h-5 rounded-full border ${
                      filters.gender === option.value 
                        ? "border-medical-green bg-medical-green" 
                        : "border-gray-300"
                    } flex items-center justify-center`}>
                      {filters.gender === option.value && <Check size={12} className="text-white" />}
                    </div>
                    <span className="ml-3 text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-b border-gray-100">
              <h4 className="font-medium text-gray-700 mb-3">Department</h4>
              <select
                name="department"
                value={filters.department}
                onChange={(e) => handleFilterChange("department", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-green"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="p-4 border-b border-gray-100">
              <h4 className="font-medium text-gray-700 mb-3">Availability</h4>
              <div className="space-y-3">
                {[
                  { value: "", label: "Any Availability" },
                  { value: "Online", label: "Online" },
                  { value: "Offline", label: "Offline" }
                ].map((option) => (
                  <label key={option.value} className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-50">
                    <div className={`w-5 h-5 rounded-full border ${
                      filters.availability === option.value 
                        ? "border-medical-green bg-medical-green" 
                        : "border-gray-300"
                    } flex items-center justify-center`}>
                      {filters.availability === option.value && <Check size={12} className="text-white" />}
                    </div>
                    <span className="ml-3 text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="p-4 flex gap-3">
              <button 
                onClick={clearFilters}
                className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
              <button 
                onClick={toggleFilterModal}
                className="flex-1 py-3 bg-medical-green hover:bg-medical-green-dark text-white font-medium rounded-xl transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorListing;