"use client"
import React, { useState, useRef, MouseEvent } from 'react';

// Define the Department type
interface Department {
  id: number;
  name: string;
  iconUrl: string;
}

// Sample department data
const departmentData: Department[] = [
  {
    id: 1,
    name: "Cardiology",
    iconUrl: "/api/placeholder/200/200" // Replace with actual URL later
  },
  {
    id: 2,
    name: "Pediatrics",
    iconUrl: "/api/placeholder/200/200"
  },
  {
    id: 3,
    name: "Gynecology",
    iconUrl: "/api/placeholder/200/200"
  },
  {
    id: 4,
    name: "Dermatology",
    iconUrl: "/api/placeholder/200/200"
  },
  {
    id: 5,
    name: "Neurology",
    iconUrl: "/api/placeholder/200/200"
  },
  {
    id: 6,
    name: "Orthopedics",
    iconUrl: "/api/placeholder/200/200"
  },
  {
    id: 7,
    name: "Oncology",
    iconUrl: "/api/placeholder/200/200"
  }
];

const DepartmentSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Handle mouse down for drag scrolling
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = 'grabbing';
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
      scrollContainerRef.current.style.cursor = 'grab';
    }
  };

  // Handle department card click
  const handleDepartmentClick = (departmentId: number) => {
    console.log(`Navigating to department ${departmentId}`);
    // Navigation logic will be added later
  };

  // Handle scroll to previous departments
  const scrollToPrevious = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  // Handle scroll to next departments
  const scrollToNext = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-indigo-900 mb-12">
          Explore Our Specialties
        </h2>

        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={scrollToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black text-white rounded-full p-3 shadow-lg hover:bg-gray-800 transition-all"
            aria-label="Previous departments"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={scrollToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black text-white rounded-full p-3 shadow-lg hover:bg-gray-800 transition-all"
            aria-label="Next departments"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide gap-6 py-6 px-10"
            style={{ 
              cursor: 'grab',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {departmentData.map((department) => (
              <div
                key={department.id}
                className={`flex-shrink-0 w-64 bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ${
                  department.name === 'Pediatrics' ? 'bg-green-100' : ''
                }`}
                onClick={() => handleDepartmentClick(department.id)}
              >
                <div className="p-6 flex flex-col items-center">
                  <div className="w-40 h-40 rounded-full bg-gray-200 overflow-hidden mb-4">
                    <img
                      src="/images/dpt.png"
                      alt={`${department.name} icon`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-center text-indigo-900 mt-2">
                    {department.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
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