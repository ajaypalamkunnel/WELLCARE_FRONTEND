import React, { useState } from "react";
import { Edit, Trash2, Check, Ban, Loader } from "lucide-react";
import { PlanFormData } from "./NewPlanModalForm";
import { Plan } from "../adminContent/PlansContent";
import { updateSubscriptionPlanStatus } from "@/services/admin/adminServices";
import toast from "react-hot-toast";

interface PlanProps {
  plan: Plan;
  onEdit: (plan: Plan) => void;
  onUpdate:(udatePlane:Plan)=>void
}

const PlanCard: React.FC<PlanProps> = ({ plan,onEdit,onUpdate }) => {

  const [isLoading, setIsLoading] = useState(false);

  const handleToggleStatus = async () =>{
    try {
      
      console.log("hiiiiii");
      
      setIsLoading(true)

      const response = await updateSubscriptionPlanStatus(plan._id!);
      
      const updatedStatus = response.data.data.status;
      onUpdate({...plan,status:updatedStatus})
      toast.success(
        `Subscription plan ${updatedStatus ? "unblocked" : "blocked"} successfully!`
      );
      
    } catch (error) {
      console.error("Error updating subscription plan status:", error);
      toast.error("Failed to update subscription status. Try again!");
    } finally {
      setIsLoading(false);
    }
  }
 

  return (
    <div className="bg-[#232429] rounded-lg overflow-hidden shadow-lg border border-gray-700 hover:border-[#3ee6e9] transition-all">
      <div className="p-5 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">{plan.planName}</h2>
        <div className="flex gap-2">
        <button className="p-1 rounded hover:bg-gray-700 transition-all" onClick={() => onEdit(plan)}>
            <Edit size={18} className="text-gray-400" />
          </button>
          <button
            onClick={handleToggleStatus}
            disabled={isLoading}
            className={`p-1 rounded transition-all ${
              plan.status ? "hover:bg-red-500/20 text-red-400" : "hover:bg-[#04bf3e]/20 text-[#04bf3e]"
            }`}
          >
            {isLoading ? <Loader size={18} className="animate-spin" /> : plan.status ? <Ban size={18} /> : <Check size={18} />}
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-end mb-4">
          <span className="text-3xl font-bold text-white">
            ₹{plan.finalPrice}
          </span>
          <span className="text-sm text-gray-400 ml-2">
            /{`${plan.duration.value}  ${plan.duration.unit}`}{" "}
          </span>
        </div>

        {plan.discount && plan.discount.amount > 0 && (
          <div className="mb-4 flex items-center">
            {/* Show original price with strike-through */}
            <span className="text-gray-400 line-through mr-2">
              ₹{plan.price}
            </span>

            {/* Show discounted price badge */}
            <span className="bg-[#04bf3e] text-white text-xs px-2 py-1 rounded">
              {plan.discount.type === "percentage"
                ? `-${plan.discount.amount}%`
                : `-₹${plan.discount.amount}`}
            </span>
          </div>
        )}

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Status</span>
            <span
              className={`text-sm px-2 py-1 rounded ${
                plan.status
                  ? "bg-[#04bf3e]/20 text-[#04bf3e]"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {plan.status ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Service Limit</span>
            <span className="text-sm text-white">{plan.serviceLimit}</span>
          </div>
        </div>

        <div className="space-y-2">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <Check size={18} className="text-[#3ee6e9] mr-2 flex-shrink-0" />
              <span className="text-sm text-gray-300">{String(feature)}</span>
            </div>
          ))}
        </div>
      </div>  
    </div>
  );
};

export default PlanCard;
