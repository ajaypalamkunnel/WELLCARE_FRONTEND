import React from 'react';

const MainBanner3 = () => {
  return (
    <section className="w-full min-h-screen flex items-center" 
    style={{
      background: "linear-gradient(to right, #553C9A, #4FD1C5, #B794F4)"
    }}>
    <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between">
      {/* Left content */}
      <div className="md:w-1/2 text-white ml-6 mb-10 md:mb-0">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight font-inter">
          Find Your Nearest Doctor & Book Appointments Hassle-Free
        </h1>
        <p className="text-white text-lg mb-8 opacity-90">
          Experience seamless healthcare booking with our intuitive platform
        </p>
        <button className="bg-white text-purple-800 px-6 py-3 rounded-md font-medium hover:bg-opacity-90 transition duration-300">
          Learn More
        </button>
      </div>
      
      {/* Right image */}
      <div className="md:w-1/2 flex mr-11 justify-center md:justify-end">
        <img 
          src="/images/banner3.png" 
          alt="Medical heart and stethoscope illustration" 
          className="w-48 h-48 md:w-auto  md:h-auto max-w-full object-contain"
          style={{ maxHeight: "435px" }}
        />
      </div>
    </div>
  </section>
  );
};

export default MainBanner3;