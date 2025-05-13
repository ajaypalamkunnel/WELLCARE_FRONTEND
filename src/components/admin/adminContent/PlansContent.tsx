"use client"
import React, { useEffect, useState } from 'react';

import { Plus } from 'lucide-react';
import PlanCard from '../ui/PlanCard';
import NewPlanModal from '../ui/NewPlanModalForm';
import { getAllSubscriptionPlans } from '@/services/admin/adminServices';
import toast from 'react-hot-toast';

interface Feature {
  name: string;
  included: boolean;
}

interface Discount {
  amount: number;
  type: "percentage" | "amount";
}
interface IDuration {
  value: number;
  unit: string;
}
export interface Plan {
  _id?: string;
  planName: string;
  duration: IDuration;
  price: number;
  discount?: Discount;
  finalPrice: number;
  serviceLimit: number;
  status: boolean;
  features: Feature[];
}

const PlansContent: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);


  const openModal = (plan?: Plan) => {
    console.log("hi opene modal ");
    
    setSelectedPlan(plan || null); //  If editing, set the plan; else, set null
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setSelectedPlan(null); // Clear selected plan on close
    setIsModalOpen(false);
  };
  // Dummy data - will be replaced with actual data from API

  const fetchPlans = async ()=>{

    try {

      setIsLoading(true);

      const response = await getAllSubscriptionPlans()

      if(response?.status === 200){

        console.log(response.data);
        setPlans(response.data.data)
      }else{
        throw new Error("Failed to fetch subscription plans")
      }
      
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error("Failed to load subscription plans. Please try again."); //  Show toast error message
    
    }finally{
      setIsLoading(false);
    }

  }

  const handlePlanUpdate = (updatedPlan: Plan) => {
    setPlans((prevPlans) =>
      prevPlans.map((plan) =>
        plan._id === updatedPlan._id ? updatedPlan : plan
      )
    );
  };

  const handleNewPlan = (newPlan: Plan) => {
    setPlans((prevPlans) => [...prevPlans, newPlan]);
  };


  useEffect(() => {
    fetchPlans();
  }, []);
  

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Subscription Plans</h1>
          <p className="text-gray-400">Manage your subscription plans</p>
        </div>
        <button 
         onClick={() => openModal()}
          className="px-4 py-2 rounded-full bg-[#232429] hover:bg-gray-700 text-[#3ee6e9] border border-[#3ee6e9] flex items-center gap-2 transition-all"
        >
          <Plus size={18} />
          Add New Plan
        </button>
      </div>

      {isLoading ? (
        <p className="text-gray-400 text-center">Loading subscription plans...</p>
      ) : plans.length === 0 ? (
        <p className="text-gray-400 text-center">No subscription plans available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PlanCard key={plan._id} plan={plan} onEdit={openModal} onUpdate={handlePlanUpdate} />
          ))}
        </div>
      )}

<NewPlanModal isOpen={isModalOpen} onClose={closeModal} existingPlan={selectedPlan} onUpdate={handlePlanUpdate} onAdd={handleNewPlan} />
    
    </div>
  );
};

export default PlansContent;