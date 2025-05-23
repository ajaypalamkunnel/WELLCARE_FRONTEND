'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { Heart, ArrowLeft, Activity } from 'lucide-react';

// Not Found Page Component for Healthcare Application
export default function NotFound() {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  const [pulseHearts, setPulseHearts] = useState(false);

  // Animation control for heartbeat effect
  useEffect(() => {
    const heartbeatInterval = setInterval(() => {
      setPulseHearts(prev => !prev);
    }, 1200);

    return () => clearInterval(heartbeatInterval);
  }, []);

  // Handle go back button click
  const handleGoBack = () => {
    setIsAnimating(true);
    setTimeout(() => {
      router.push('/');
    }, 400);
  };

  // Generate random floating hearts in background
  const floatingHearts = Array(8).fill(0).map((_, idx) => {
    const size = Math.floor(Math.random() * 10) + 10;
    const animDuration = Math.floor(Math.random() * 10) + 20;
    const delay = Math.floor(Math.random() * 10);
    const leftPos = Math.floor(Math.random() * 90);

    return (
      <div 
        key={idx} 
        className={`absolute opacity-10 text-primary-600 animate-float`}
        style={{
          left: `${leftPos}%`,
          animationDuration: `${animDuration}s`,
          animationDelay: `${delay}s`
        }}
      >
        <Heart size={size} className="text-pink-400" fill="#F472B6" />
      </div>
    );
  });

  return (
    <div className={`min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col items-center justify-center p-4 overflow-hidden relative transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100'}`}>
      {/* Background floating elements */}
      {floatingHearts}

      {/* ECG Line Animation at top */}
      <div className="w-full max-w-lg h-16 mb-8 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-pulse-ecg">
            <svg width="600" height="60" viewBox="0 0 600 60">
              <path 
                d="M0,30 L100,30 L120,10 L140,50 L160,10 L180,50 L200,30 L600,30" 
                fill="none" 
                stroke="#3B82F6" 
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="1000"
                strokeDashoffset="1000"
                className="animate-ecg-draw"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden z-10">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        
        {/* Error Code */}
        <div className="flex justify-center items-center mb-6">
          <span className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">404</span>
        </div>
        
        {/* Animated Icon */}
        <div className="flex justify-center mb-6">
          <div className={`transition-transform duration-1000 ${pulseHearts ? 'scale-110' : 'scale-100'}`}>
            <div className="relative">
              <Activity size={60} className="text-blue-500" />
              <Heart 
                size={24} 
                className={`absolute top-4 left-4 text-pink-500 transition-all duration-500 ${pulseHearts ? 'scale-125 opacity-100' : 'scale-100 opacity-70'}`}
                fill="#EC4899"
              />
            </div>
          </div>
        </div>
        
        {/* Error Message */}
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 text-center mb-2">Page Not Found</h1>
        <p className="text-gray-600 text-center mb-8">
         {" The page you're looking for doesn't exist or has been moved."}
        </p>
        
        {/* Button */}
        <div className="flex justify-center">
          <button
            onClick={handleGoBack}
            className="group flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Return to Home</span>
          </button>
        </div>
      </div>
      
      {/* Footer */}
      <p className="text-gray-500 mt-8 text-sm">
        {"Need assistance? Contact our "}<span className="text-blue-600">Support Team</span>
      </p>
    </div>
  );
}