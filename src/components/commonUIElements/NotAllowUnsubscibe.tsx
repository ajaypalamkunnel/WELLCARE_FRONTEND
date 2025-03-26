import React from 'react';
import { Shield, Lock, Check } from 'lucide-react';

const SubscriptionPrompt: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl border-2 border-[#03045e] p-8 text-center">
        <div className="mb-6">
          <Shield color="#03045e" size={64} className="mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-[#03045e]">Unlock Full Access</h2>
        </div>
        
        <p className="text-gray-600 mb-6">
          To access advanced service management features, please complete your subscription.
        </p>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-center">
            <Check color="#03045e" className="mr-3" />
            <span className="text-gray-700">Full Service Listings</span>
          </div>
          <div className="flex items-center">
            <Check color="#03045e" className="mr-3" />
            <span className="text-gray-700">Advanced Management Tools</span>
          </div>
          <div className="flex items-center">
            <Check color="#03045e" className="mr-3" />
            <span className="text-gray-700">Unlimited Access</span>
          </div>
        </div>
        
        <button 
          className="w-full py-3 bg-[#03045e] text-white rounded-lg hover:bg-opacity-90 transition-colors duration-300 flex items-center justify-center"
        >
          <Lock className="mr-2" size={20} />
          Subscribe Now
        </button>
        
        <p className="text-sm text-gray-500 mt-4">
          Unlock your full potential with our premium subscription
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPrompt;