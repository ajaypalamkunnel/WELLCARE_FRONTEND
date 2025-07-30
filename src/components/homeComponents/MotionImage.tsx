"use client";

import { motion } from "framer-motion";
import React from "react";

const MotionImage = () => {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 1.2, 
        ease: "easeOut",
        delay: 0.3
      }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-teal-400/30 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.img
        src="/images/banner1.png"
        alt="Healthcare professionals"
        className="relative z-10 object-contain h-72 md:h-96 lg:h-[500px] drop-shadow-2xl"
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.3 }
        }}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full opacity-20 blur-xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

export default MotionImage;
