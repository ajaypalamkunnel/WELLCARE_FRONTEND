import React from 'react';
import { Check } from 'lucide-react';

interface Feature {
  name: string;
  included: boolean;
}

interface Discount {
  amount: number;
  type: "percentage" | "amount";
}

interface PlanProps {
  plan: {
    id?: string;
    planName: string;
    duration: number;
    finalPrice: number;
    discountPrice?: number;
    discount?: Discount;
    status: "active" | "inactive";
    features: Feature[];
    serviceLimit: number;
    durationUnit?: string;
  };
  onSubscribe: (planId: string | undefined) => void;
}

const DoctorPlanCard: React.FC<PlanProps> = ({ plan, onSubscribe }) => {
  // Format discount text
  const getDiscountText = () => {
    if (!plan.discount) return null;
    
    if (plan.discount.type === "percentage") {
      return `${plan.discount.amount}% off`;
    } else {
      return `₹${plan.discount.amount} off`;
    }
  };

  
  

  const isActive = plan.status === "active";
  const durationUnit = plan.durationUnit || 'days';

  return (
    <div className={`bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 h-full flex flex-col ${!isActive ? 'opacity-70' : ''}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
        <h2 className="text-2xl font-bold text-blue-900">{plan.planName}</h2>
        <p className="text-sm text-blue-600 mt-1">{plan.duration} {durationUnit} subscription</p>
      </div>
      
      {/* Pricing */}
      <div className="p-6 bg-white">
        <div className="flex items-end mb-4">
          <span className="text-4xl font-bold text-blue-900">₹{plan.finalPrice}</span>
          <span className="text-sm text-gray-500 ml-2">/{plan.duration} {durationUnit}</span>
        </div>
        
        {plan.discountPrice && plan.discountPrice > plan.finalPrice && (
          <div className="mb-4 flex items-center">
            <span className="text-gray-500 line-through mr-2">₹{plan.discountPrice}</span>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
              {getDiscountText()}
            </span>
          </div>
        )}
        
        {/* Service Limit */}
        <div className="mb-6 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800">Service Limit</span>
            <span className="text-sm font-bold text-blue-900">{plan.serviceLimit}</span>
          </div>
        </div>
        
        {/* Features */}
        
        
        <div className="space-y-3 mb-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Features Included:</h3>
          {plan.features.filter(feature => feature).map((feature, index) => (
            <div key={index} className="flex items-start">
              <div className="bg-blue-100 p-1 rounded-full mr-3 flex-shrink-0">
                <Check size={16} className="text-blue-600" />
              </div>
              <span className="text-sm text-gray-700">{String(feature)}</span>
            </div>
          ))} 
        </div>
      </div>
      
      {/* Subscribe Button */}
      <div className="mt-auto p-6 pt-0">
        <button 
          onClick={() => onSubscribe(plan.id)}
          disabled={!isActive}
          className={`w-full py-3 px-4 font-medium rounded-lg transition-colors duration-200 flex items-center justify-center
            ${isActive 
              ? 'bg-blue-900 hover:bg-blue-800 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          {isActive ? 'Subscribe Now' : 'Currently Unavailable'}
        </button>
      </div>
    </div>
  );
};

export default DoctorPlanCard;