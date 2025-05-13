"use client";
import { getAllActiveDepartments } from "@/services/user/auth/authService";
import { capitalizeFirstLetter } from "@/utils/Naming";
import Image from "next/image";
import React, { useState, useRef, MouseEvent, useEffect } from "react";

// Define the Department type

export interface IDepartment extends Document {
  _id?: string;
  name: string;
  icon: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const DepartmentSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getAllActiveDepartments();

        setDepartments(response.data);
      } catch (error) {
        console.log("Failed to load departments.Please try again");
        setError("Failed to load departments.Please try again");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // Handle mouse down for drag scrolling
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;

    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = "grabbing";
  };

  // Handle mouse move while dragging
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollContainerRef.current) return;

    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Handle end of dragging
  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = "grab";
    }
  };

  // Handle department card click
  const handleDepartmentClick = (departmentId: string) => {
    console.log(`Navigating to department ${departmentId}`);
    // Navigation logic will be added later
  };

  // Handle scroll to previous departments
  const scrollToPrevious = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  // Handle scroll to next departments
  const scrollToNext = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-indigo-900 mb-12">
          Explore Our Specialties
        </h2>

        {loading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-900"></div>
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 font-medium">{error}</div>
        )}
        {!loading && !error && (
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={scrollToPrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black text-white rounded-full p-3 shadow-lg hover:bg-gray-800 transition-all"
              aria-label="Previous departments"
            >
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={scrollToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black text-white rounded-full p-3 shadow-lg hover:bg-gray-800 transition-all"
              aria-label="Next departments"
            >
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Scrollable Container */}
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto scrollbar-hide gap-6 py-6 px-10"
              style={{
                cursor: "grab",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {departments.map((department) => (
                <div
                  key={department._id}
                  className={`flex-shrink-0 w-64 bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ${
                    department.name === "Pediatrics" ? "bg-green-100" : ""
                  }`}
                  onClick={() => handleDepartmentClick(department._id!)}
                >
                  <div className="p-6 flex flex-col items-center">
                    <div className="w-40 h-40 rounded-full bg-gray-200 overflow-hidden mb-4 relative">
                      <Image
                        src={department.icon || "/default-icon.png"}
                        alt={`${department.name} icon`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-center text-indigo-900 mt-2">
                      {capitalizeFirstLetter(department.name)}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentSection;

// CSS to hide scrollbar (add to your global CSS file)
/*
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
*/
