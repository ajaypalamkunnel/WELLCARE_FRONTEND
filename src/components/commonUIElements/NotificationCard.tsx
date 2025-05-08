"use client";

import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimes, FaInfoCircle } from "react-icons/fa";
import { motion } from "framer-motion";

type NotificationType = "success" | "info" | "error";

interface NotificationCardProps {
  title: string;
  message: string;
  type?: NotificationType;
  onClose: () => void;
}

const iconMap = {
  success: <FaCheckCircle className="text-green-400" />,
  info: <FaInfoCircle className="text-blue-400" />,
  error: <FaTimes className="text-red-400" />,
};

const NotificationCard: React.FC<NotificationCardProps> = ({
  title,
  message,
  type = "info",
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 5000); // auto-close in 5 sec
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="max-w-sm w-full bg-[#1e222d] text-white rounded-lg shadow-lg p-4 flex items-start gap-3 border border-gray-700"
    >
      <div className="text-xl">{iconMap[type]}</div>
      <div className="flex-1">
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-gray-300">{message}</p>
      </div>
      <button onClick={() => setVisible(false)} className="text-gray-400 hover:text-white">
        <FaTimes size={16} />
      </button>
    </motion.div>
  );
};

export default NotificationCard;
