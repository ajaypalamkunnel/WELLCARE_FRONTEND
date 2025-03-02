
import React from 'react';
import { Search } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import MotionImage from './HomeBanner';
const MainBanner1 = () => {
  return (
    <div className="w-full h-full min-h-screen flex flex-col" style={{
      background: "linear-gradient(to right, #b7f4e8, #b895f4)"
    }}>
      <div className="container mx-auto mt-8 px-4 py-12 flex flex-col md:flex-row items-center justify-between">
        {/* Left side content */}
        <div className="ml-20 md:w-1/2 text-left mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-4 font-inter">
            Your Health, Our Priority
          </h1>
          <p className="text-gray-700 mb-8 text-lg">
            Book an Appointment with Trusted Doctors Instantly!
          </p>
          <button 
            className="flex items-center space-x-2 px-6 py-3 rounded text-white font-medium"
            style={{ backgroundColor: "#4dd1c6" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Book Appointment</span>
          </button>
        </div>
        
        {/* Right side image */}
        {/* <motion.div
          initial={{ opacity: 0, x: 100 }} // Start from right and fade in
          animate={{ opacity: 1, x: 0 }}   // Move to original position
          transition={{ duration: 1, ease: "easeOut" }} // Animation timing
          className="md:w-1/2 flex justify-start"
        >
          <img 
            src="/images/banner1.png" 
            alt="Healthcare professionals"
            className="object-contain h-72 md:h-96 lg:h-112" 
          />
        </motion.div> */}
        <MotionImage/>
      </div>
      
      {/* Search bar section */}
      <div className="container mx-auto px-4 mb-12">
        <div className="bg-white rounded-lg shadow-lg p-4 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row">
            <div className="flex items-center border-b md:border-b-0 md:border-r border-gray-300 p-2 md:w-1/2">
              <MapPin className="text-gray-400 mr-2" size={20} />
              <input 
                type="text" 
                placeholder="Enter your city or area" 
                className="w-full outline-none text-gray-700"
              />
            </div>
            <div className="flex items-center p-2 md:w-1/2">
              <Search className="text-gray-400 mr-2" size={20} />
              <input 
                type="text" 
                placeholder="Search for a doctor or specialty" 
                className="w-full outline-none text-gray-700"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainBanner1;