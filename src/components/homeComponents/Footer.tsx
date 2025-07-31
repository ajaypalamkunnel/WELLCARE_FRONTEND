"use client"
import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaLinkedin, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Shield, Award } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/user/doctors", label: "Find Doctor" },
    { href: "/user/departments", label: "Departments" },
    { href: "/user/chat", label: "Messages" },
    { href: "/user/about", label: "About Us" },
  ];

  const services = [
    { href: "/video-consultation", label: "Video Consultation" },
    { href: "/emergency-care", label: "Emergency Care" },
    { href: "/health-checkup", label: "Health Checkup" },
    { href: "/prescription", label: "Prescription" },
  ];

  const socialLinks = [
    { href: "https://facebook.com", icon: FaFacebook, label: "Facebook" },
    { href: "https://twitter.com", icon: FaTwitter, label: "Twitter" },
    { href: "https://instagram.com", icon: FaInstagram, label: "Instagram" },
    { href: "https://youtube.com", icon: FaYoutube, label: "YouTube" },
    { href: "https://linkedin.com", icon: FaLinkedin, label: "LinkedIn" },
  ];
  
  return (
    <footer className="w-full font-inter text-slate-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            background: "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.05) 0%, transparent 50%)"
          }}
        />
      </div>

      {/* Main Footer */}
      <motion.div 
        className="relative z-10 w-full px-6 py-16 md:px-10 md:py-20"
        style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
        }}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            {/* Contact Section */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Shield size={20} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">WellCare</h3>
              </div>
              <p className="text-white/90 leading-relaxed">
                Your trusted partner in healthcare. We connect you with expert medical professionals 
                for the best care experience.
              </p>
              
              <div className="space-y-4">
                <motion.div 
                  className="flex items-start space-x-3"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <MapPin className="text-white/80 mt-1" size={18} />
                  <p className="text-white/90">123 Healthcare St, Medical City, MC 12345</p>
                </motion.div>
                <motion.div 
                  className="flex items-start space-x-3"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Phone className="text-white/80 mt-1" size={18} />
                  <p className="text-white/90">+1 (234) 567-8900</p>
                </motion.div>
                <motion.div 
                  className="flex items-start space-x-3"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Mail className="text-white/80 mt-1" size={18} />
                  <p className="text-white/90">contact@wellcare.com</p>
                </motion.div>
                <motion.div 
                  className="flex items-start space-x-3"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Clock className="text-white/80 mt-1" size={18} />
                  <p className="text-white/90">24/7 Emergency Support</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h3 className="text-xl font-bold text-white mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link 
                      href={link.href} 
                      className="text-white/80 hover:text-white transition-colors duration-200 flex items-center space-x-2 group"
                    >
                      <div className="w-1 h-1 bg-white/60 rounded-full group-hover:bg-white transition-colors duration-200" />
                      <span>{link.label}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Services */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h3 className="text-xl font-bold text-white mb-6">Our Services</h3>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <motion.li
                    key={service.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link 
                      href={service.href} 
                      className="text-white/80 hover:text-white transition-colors duration-200 flex items-center space-x-2 group"
                    >
                      <div className="w-1 h-1 bg-white/60 rounded-full group-hover:bg-white transition-colors duration-200" />
                      <span>{service.label}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Follow Us */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h3 className="text-xl font-bold text-white mb-6">Connect With Us</h3>
              <p className="text-white/80 mb-6">
                Stay updated with the latest healthcare news and tips.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.div
                    key={social.label}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      href={social.href} 
                      aria-label={social.label} 
                      className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 border border-white/20"
                    >
                      <social.icon size={20} />
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3">
                  <Award size={20} className="text-white" />
                  <div>
                    <p className="text-white font-semibold">Certified Healthcare</p>
                    <p className="text-white/70 text-sm">ISO 9001:2015 Certified</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-12 px-6 relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              background: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)"
            }}
          />
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Need immediate medical assistance?
              </h3>
              <p className="text-white/90 text-lg">
                Our medical professionals are available 24/7 for emergency care
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/contact" 
                className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Phone size={20} />
                <span>Contact Us Now</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Copyright */}
      <motion.div 
        className="bg-gray-900 text-white py-6 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-center md:text-left text-gray-300 mb-4 md:mb-0">
              © {currentYear} WellCare. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-gray-300">
              <Link href="/privacy" className="hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <span>Made with</span>
                <FaHeart className="text-red-500 animate-pulse" size={12} />
                <span>for better healthcare</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;