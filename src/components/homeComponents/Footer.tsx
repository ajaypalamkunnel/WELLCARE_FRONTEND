import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

interface FooterProps {
  isDarkMode?: boolean;
}

const Footer: React.FC<FooterProps> = ({ isDarkMode = false }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full font-inter text-slate-900">
      {/* Main Footer */}
      <div 
        className="w-full px-6 py-12 md:px-10 md:py-16"
        style={{ 
          background: 'linear-gradient(135deg, #BBB7D0 0%, #AEEBC1 100%)',
        }}
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* Contact Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-6">Contact Us</h3>
              <div className="flex items-start space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p>123 Healthcare St, Medical City</p>
              </div>
              <div className="flex items-start space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <p>+1 234 567 8900</p>
              </div>
              <div className="flex items-start space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p>contact@wellcare.com</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li><a href="/" className="hover:text-purple-800 transition-colors">Home</a></li>
                <li><a href="/find-doctor" className="hover:text-purple-800 transition-colors">Find Doctor</a></li>
                <li><a href="/video-consultation" className="hover:text-purple-800 transition-colors">Video Consultation</a></li>
                <li><a href="/about-us" className="hover:text-purple-800 transition-colors">About Us</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-6">Legal</h3>
              <ul className="space-y-3">
                <li><a href="/terms" className="hover:text-purple-800 transition-colors">Terms & Conditions</a></li>
                <li><a href="/privacy" className="hover:text-purple-800 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Follow Us */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-6">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="https://facebook.com" aria-label="Facebook" className="text-slate-900 hover:text-purple-800 transition-colors">
                  <Facebook size={24} />
                </a>
                <a href="https://twitter.com" aria-label="Twitter" className="text-slate-900 hover:text-purple-800 transition-colors">
                  <Twitter size={24} />
                </a>
                <a href="https://instagram.com" aria-label="Instagram" className="text-slate-900 hover:text-purple-800 transition-colors">
                  <Instagram size={24} />
                </a>
                <a href="https://youtube.com" aria-label="YouTube" className="text-slate-900 hover:text-purple-800 transition-colors">
                  <Youtube size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section with dark purple background */}
      <div className="bg-[#553C9A] text-white py-8 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-semibold">Need immediate medical assistance?</h3>
              <p className="mt-2">Our medical professionals are available 24/7</p>
            </div>
            <a 
              href="/contact" 
              className="px-6 py-3 bg-white text-[#553C9A] rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Contact Us Now
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-100 dark:bg-gray-800 py-4 px-6">
        <div className="container mx-auto">
          <p className="text-center text-sm text-gray-600 dark:text-gray-300">
            © {currentYear} WellCare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;