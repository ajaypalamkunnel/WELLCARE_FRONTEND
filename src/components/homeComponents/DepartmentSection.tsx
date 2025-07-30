/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { getAllActiveDepartments } from "@/services/user/auth/authService";
import { capitalizeFirstLetter } from "@/utils/Naming";
import Image from "next/image";
import React, { useState, useRef, MouseEvent, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Stethoscope, Heart, Brain, Baby, Eye, Bone } from "lucide-react";

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
        console.log("Failed to load departments.Please try again :",error);
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

  const getDepartmentIcon = (name: string) => {
    const iconMap: { [key: string]: any } = {
      'cardiology': Heart,
      'neurology': Brain,
      'pediatrics': Baby,
      'ophthalmology': Eye,
      'dental': Bone,
      'orthopedics': Bone,
      'default': Stethoscope
    };
    
    const key = name.toLowerCase();
    return iconMap[key] || iconMap['default'];
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="w-full py-20 bg-gradient-to-br from-blue-50 via-white to-teal-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Explore Our
            <span className="block bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Medical Specialties
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Connect with expert healthcare professionals across diverse medical fields. 
            Find the right specialist for your health needs.
          </p>
        </motion.div>

        {loading && (
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-teal-600 rounded-full animate-spin" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div 
            className="text-center text-red-600 font-medium bg-red-50 p-4 rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {error}
          </motion.div>
        )}

        {!loading && !error && (
          <motion.div 
            className="relative"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Navigation Buttons */}
            <motion.button
              onClick={scrollToPrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white text-blue-600 rounded-full p-4 shadow-xl hover:shadow-2xl hover:bg-blue-50 transition-all duration-300 border border-blue-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Previous departments"
            >
              <ChevronLeft size={24} />
            </motion.button>

            <motion.button
              onClick={scrollToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white text-blue-600 rounded-full p-4 shadow-xl hover:shadow-2xl hover:bg-blue-50 transition-all duration-300 border border-blue-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Next departments"
            >
              <ChevronRight size={24} />
            </motion.button>

            {/* Scrollable Container */}
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto scrollbar-hide gap-8 py-8 px-12"
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
              {departments.map((department, index) => {
                const IconComponent = getDepartmentIcon(department.name);
                return (
                  <motion.div
                    key={department._id}
                    variants={cardVariants}
                    whileHover={{ 
                      scale: 1.05,
                      y: -10,
                      transition: { duration: 0.3 }
                    }}
                    className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden group"
                    onClick={() => handleDepartmentClick(department._id!)}
                  >
                    <div className="p-8 flex flex-col items-center text-center">
                      <motion.div 
                        className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center mb-6 group-hover:from-blue-200 group-hover:to-teal-200 transition-all duration-300 relative overflow-hidden"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-teal-400/20 rounded-full blur-xl"></div>
                        <div className="relative z-10">
                          <Image
                            src={department.icon || "/default-icon.png"}
                            alt={`${department.name} icon`}
                            width={80}
                            height={80}
                            className="object-cover rounded-full"
                          />
                        </div>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-full"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </motion.div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                        {capitalizeFirstLetter(department.name)}
                      </h3>
                      
                      <div className="flex items-center space-x-2 text-gray-600">
                        <IconComponent size={16} />
                        <span className="text-sm font-medium">Expert Specialists</span>
                      </div>
                      
                      <motion.div
                        className="mt-4 w-full h-1 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default DepartmentSection;
