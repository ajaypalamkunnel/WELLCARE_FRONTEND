'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Stethoscope, 
  Video, 
  ClipboardList, 
  Hospital, 
  Globe, 
  Heart,
  Users,
  Award,
  Clock,
  Shield,
  ArrowRight
} from 'lucide-react';
import Header from '@/components/homeComponents/Header';

const AboutUs = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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

  const services = [
    {
      icon: <Stethoscope className="w-8 h-8" />,
      title: "Doctor Appointments",
      description: "Book appointments with qualified doctors from top hospitals across various specialties."
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Video Consultations",
      description: "Connect with healthcare professionals from the comfort of your home through secure video calls."
    },
    {
      icon: <ClipboardList className="w-8 h-8" />,
      title: "Digital Prescriptions",
      description: "Receive and manage your prescriptions digitally with easy access and refill reminders."
    },
    {
      icon: <Hospital className="w-8 h-8" />,
      title: "Top Hospitals Network",
      description: "Access a curated network of doctors from renowned hospitals and medical institutions."
    }
  ];

  const features = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Accessibility",
      description: "Healthcare access from anywhere, anytime"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Your health data is protected with enterprise-grade security"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support for your healthcare needs"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Certified Doctors",
      description: "All doctors are verified and certified professionals"
    }
  ];

  const teamMembers = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Medical Officer",
      specialization: "Internal Medicine",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Dr. Michael Chen",
      role: "Head of Cardiology",
      specialization: "Cardiovascular Medicine",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Pediatric Specialist",
      specialization: "Child Healthcare",
      image: "https://images.unsplash.com/photo-1594824804582-0b21a2329ec3?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Dr. James Wilson",
      role: "Telemedicine Director",
      specialization: "Digital Health",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face"
    }
  ];

  return (
    <>
    <Header/>
    
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Hero Section */}
      <motion.section 
        className="relative py-20 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-[#b89cf3] via-[#b89cf3] to-[#7fb5db] bg-clip-text text-transparent"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              About WellCare
            </h1>
          </motion.div>
          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
          >
            Revolutionizing healthcare accessibility through innovative technology, 
            connecting patients with top-tier medical professionals worldwide.
          </motion.p>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section 
        className="py-20 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100"
          >
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gradient-to-r from-[#b89cf3] to-[#7fb5db] p-4 rounded-full">
                <Heart className="w-12 h-12 text-white" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-[#b89cf3] to-[#7fb5db] bg-clip-text text-transparent">
              Our Mission
            </h2>
            <p className="text-lg md:text-xl text-gray-600 text-center max-w-4xl mx-auto leading-relaxed">
              {`At WellCare, we believe healthcare should be accessible, convenient, and personalized. 
              Our mission is to bridge the gap between patients and quality healthcare by leveraging 
              cutting-edge technology and building a comprehensive network of trusted medical professionals. 
              We're committed to making healthcare more human, more accessible, and more effective for everyone.`}
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section 
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#b89cf3] to-[#7fb5db] bg-clip-text text-transparent"
          >
            What We Offer
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="bg-gradient-to-r from-[#b89cf3] to-[#7fb5db] p-3 rounded-full w-fit mb-6 text-white">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section 
        className="py-20 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#b89cf3] to-[#7fb5db] bg-clip-text text-transparent"
          >
            Why Choose WellCare?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300"
              >
                <div className="bg-gradient-to-r from-[#b89cf3] to-[#7fb5db] p-3 rounded-full w-fit mx-auto mb-4 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section 
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#b89cf3] to-[#7fb5db] bg-clip-text text-transparent"
          >
            Meet Our Team
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-2xl border border-gray-100 text-center hover:shadow-xl transition-all duration-300"
              >
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-[#b89cf3] to-[#7fb5db] p-2 rounded-full">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-800">{member.name}</h3>
                <p className="text-purple-600 font-medium mb-1">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.specialization}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-[#b89cf3] via-[#b89cf3] to-[#7fb5db] p-12 rounded-3xl shadow-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Healthcare Experience?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of patients who trust WellCare for their healthcare needs. 
              Start your journey to better health today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                Join WellCare
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300"
              >
                Explore Our Doctors
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
    </>
  );
};

export default AboutUs;