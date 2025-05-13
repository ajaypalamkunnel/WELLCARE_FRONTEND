"use client"; // This ensures Framer Motion runs only on the client

import { motion } from "framer-motion";
import React from "react";

const MotionImage = () => {
  return (
    <motion.img
  src="/images/banner1.png"
  alt="Healthcare professionals"
  initial={{ opacity: 0, y: 100 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1, ease: "easeOut" }}
  className="object-contain h-72 md:h-96 lg:h-112"
/>

  );
};

export default MotionImage;
