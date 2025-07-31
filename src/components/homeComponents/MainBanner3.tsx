"use client"
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Clock, Star, Users, Shield } from "lucide-react";

const MainBanner3 = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const features = [
    {
      icon: Search,
      title: "Find Nearest Doctors",
      description: "Locate healthcare professionals in your area with our advanced search system"
    },
    {
      icon: Clock,
      title: "Instant Booking",
      description: "Schedule appointments in real-time with immediate confirmation"
    },
    {
      icon: Shield,
      title: "Verified Professionals",
      description: "All doctors are thoroughly vetted and certified"
    }
  ];

  return (
    <section className="w-full min-h-screen relative overflow-hidden">
      {/* Background with animated gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)"
        }}
      >
        {/* Animated background elements */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            background: "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)"
          }}
        />
        
        {/* Floating particles */}
        <motion.div
          className="absolute top-20 left-20 w-4 h-4 bg-white/30 rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-32 w-3 h-3 bg-white/40 rounded-full"
          animate={{
            y: [0, 15, 0],
            opacity: [0.4, 0.9, 0.4],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-32 left-1/3 w-2 h-2 bg-white/50 rounded-full"
          animate={{
            y: [0, -10, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between min-h-screen">
        {/* Left content */}
        <motion.div 
          className="md:w-1/2 text-white mb-10 md:mb-0"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
              <Star size={16} />
              <span>Trusted by 10,000+ Patients</span>
            </div>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            Find Your Nearest
            <span className="block bg-gradient-to-r from-blue-200 to-teal-200 bg-clip-text text-transparent">
              Doctor & Book
            </span>
            <span className="block bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
              Appointments
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed"
          >
            Experience seamless healthcare booking with our intuitive platform. 
            Connect with verified medical professionals instantly.
          </motion.p>

          {/* Features */}
          <motion.div 
            variants={itemVariants}
            className="space-y-4 mb-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <feature.icon size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="text-white/80 text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-3 gap-6"
          >
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-white/80 text-sm">Expert Doctors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">50+</div>
              <div className="text-white/80 text-sm">Specialties</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-white/80 text-sm">Support</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right image */}
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="md:w-1/2 flex justify-center md:justify-end"
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-teal-400/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="relative z-10"
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
            >
              <Image
                src="/images/banner3.png"
                alt="Medical heart and stethoscope illustration"
                width={500}
                height={500}
                className="object-contain drop-shadow-2xl"
                priority
              />
            </motion.div>
            
            {/* Floating elements around the image */}
            <motion.div
              className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Users size={20} className="text-white" />
            </motion.div>
            
            <motion.div
              className="absolute -bottom-4 -left-4 bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20"
              animate={{
                y: [0, 10, 0],
                rotate: [0, -5, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <MapPin size={20} className="text-white" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MainBanner3;
