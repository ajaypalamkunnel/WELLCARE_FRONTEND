"use client"
import React, { useEffect } from 'react';
import { Check, Home, Package, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
const PaymentSuccessPage = () => {
  const searchParams = useSearchParams()
  const order_id = searchParams.get("order_id")
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  const router = useRouter()

  const handleHomeButton = ()=>{
    router.push("/doctordashboard/home")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Top Success Banner */}
        <div className="bg-emerald-500 p-6 text-white text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.2
            }}
            className="mx-auto bg-white rounded-full w-16 h-16 flex items-center justify-center mb-4"
          >
            <Check className="text-emerald-500" size={32} strokeWidth={3} />
          </motion.div>
          
          <motion.h1 
            className="text-2xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Payment Successful!
          </motion.h1>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <motion.div 
            className="space-y-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-gray-700 text-center">
              Thank you for your subscription! Your payment has been processed successfully.
            </p>
            
            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-medium">{order_id}</span>
              </div>
            </div>
            
            <motion.div 
              className="flex items-center justify-center space-x-2 text-emerald-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <span className="text-sm">Your subscription is now active</span>
              <motion.span
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              >
                <Check size={16} className="text-emerald-500" />
              </motion.span>
            </motion.div>
          </motion.div>
          
          {/* Buttons */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <motion.button
              onClick={handleHomeButton}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium transition hover:bg-gray-50 hover:border-gray-400"
            >
              <Home size={18} />
              <span>Go to Home</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 rounded-lg text-white font-medium transition hover:bg-emerald-700"
            >
              <Package size={18} />
              <span>View Services</span>
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              >
                <ArrowRight size={18} />
              </motion.div>
            </motion.button>
          </motion.div>
          
          {/* Confetti Animation */}
          <div className="relative overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  top: `-20px`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 8 + 4}px`,
                  height: `${Math.random() * 8 + 4}px`,
                  backgroundColor: ['#10B981', '#6366F1', '#F59E0B', '#EC4899'][Math.floor(Math.random() * 4)],
                  borderRadius: '50%',
                }}
                animate={{
                  y: ['0vh', '100vh'],
                  opacity: [1, 0],
                }}
                transition={{
                  duration: Math.random() * 2 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccessPage;