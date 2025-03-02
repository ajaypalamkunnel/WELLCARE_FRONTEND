import React from 'react';
import { MapPin, Calendar, Stethoscope } from 'lucide-react';

const MainBanner5 = () => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-12 text-purple-900" style={{ color: '#44337A' }}>
          Why Choose WellCare?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: 'rgba(79, 209, 197, 0.1)' }}>
              <MapPin size={28} style={{ color: '#4FD1C5' }} />
            </div>
            <h3 className="text-xl font-semibold mb-4" style={{ color: '#44337A' }}>Find Nearest Doctors</h3>
            <p className="text-gray-600" style={{ color: '#4A5568' }}>Locate the best doctors near you with ease.</p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: 'rgba(79, 209, 197, 0.1)' }}>
              <Calendar size={28} style={{ color: '#4FD1C5' }} />
            </div>
            <h3 className="text-xl font-semibold mb-4" style={{ color: '#44337A' }}>Book Appointments Online & Offline</h3>
            <p className="text-gray-600" style={{ color: '#4A5568' }}>Seamlessly schedule visits or video consultations.</p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-white rounded-lg  shadow-md p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: 'rgba(79, 209, 197, 0.1)' }}>
              <Stethoscope size={28} style={{ color: '#4FD1C5' }} />
            </div>
            <h3 className="text-xl font-semibold mb-4" style={{ color: '#44337A' }}>Top Specialists Across Diverse Fields</h3>
            <p className="text-gray-600" style={{ color: '#4A5568' }}>Get expert care from highly qualified doctors.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainBanner5;