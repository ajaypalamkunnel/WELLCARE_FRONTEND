/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ArrowUpDown,
  Calendar,
  Users,
  Award,
} from "lucide-react";
import DoctorPlanCard from "./PlanCard";
import {
  createSubscriptionOrder,
  getAllSubscriptionPlans,
  verifyPayment,
} from "@/services/doctor/doctorService";
import { useAuthStoreDoctor } from "@/store/doctor/authStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
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
export interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
declare global {
  interface Window {
    Razorpay: any; // Ideally, install the official Razorpay SDK types
  }
}

const Subscription = () => {
  // State management
  const [plans, setPlans] = useState<Plan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);
  const [sortOption, setSortOption] = useState<string>("recommended");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [durationFilter, setDurationFilter] = useState<number[]>([]);
  
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 1000,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const doctor = useAuthStoreDoctor((state) => state.user);
  const router = useRouter()
  const setSubscription = useAuthStoreDoctor((state)=>state.setSubscription)

  const doctorId = doctor?.id;

  const handleSubscribe = async (planId: string | undefined) => {
    if (!planId || !doctorId) {
      toast.error("Doctor ID or Plan ID is missing");
      return;
    }

    try {
      const orderResponse = await createSubscriptionOrder(doctorId!, planId);
      

      if (!orderResponse.success) {
        toast.error(`${orderResponse.message}`);
        return;
      }

      const { orderId, amount, currency, key } = orderResponse.data;

      const razorpayScript = document.createElement("script");
      razorpayScript.src = "https://checkout.razorpay.com/v1/checkout.js";
      razorpayScript.async = true;
      document.body.appendChild(razorpayScript);

      razorpayScript.onload = () => {
        const options = {
          key: key,
          amount: amount,
          currency: currency,
          name: "Doctor Subscription",
          description: "Subscribe to a plan",
          order_id: orderId,
          handler: async (response: RazorpayPaymentResponse) => {
         
            try {
              const verifyResponse = await verifyPayment(response);

              if (verifyResponse.success) {
                toast.success("Subscription activated successfully!");
                setTimeout(()=>{
                  setSubscription(true)
                  router.push(`/doctordashboard/subscriptionsuccess?order_id=${orderId}`)

                },100)

              } else {
                toast.error("Payment failed. Please try again.");
              }
            } catch (error) {
              console.error("Payment verification failed:", error);
              toast.error("Payment verification failed. Please try again.");
            }
          },
          prefill: {
            email: doctor?.email || "",
            Contact: doctor?.fullName || "",
          },
          theme: {
            color: "#528FF0",
          },
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
      };
    } catch (error) {
      console.error("Error during subscription:", error);
      toast.error("Error during subscription. Please try again.");
    }
  };

  // Get unique duration values from plans for filter options
  const getDurationOptions = () => {
    if (!plans.length) return [];
    const uniqueDurations = [
      ...new Set(plans.map((plan) => plan.duration.value)),
    ];
    return uniqueDurations.sort((a, b) => a - b);
  };

  // Get min and max price from plans for price range filter
  useEffect(() => {
    if (plans.length > 0) {
      const prices = plans.map((plan) => plan.finalPrice);
      const minPrice = Math.floor(Math.min(...prices));
      const maxPrice = Math.ceil(Math.max(...prices));
      setPriceRange({ min: minPrice, max: maxPrice });
    }
  }, [plans]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await getAllSubscriptionPlans(); // API call
       

        setPlans(response.data);
        setFilteredPlans(response.data);
      } catch (err) {

        console.log("Failed to fetch subscription plans. Please try again.",err);
        setError("Failed to fetch subscription plans. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [doctorId]);

  // Filter and sort plans
  useEffect(() => {
    let result = [...plans];

    // Apply search filter
    if (searchQuery) {
      result = result.filter((plan) =>
        plan.planName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply duration filter
    if (durationFilter.length > 0) {
      result = result.filter((plan) =>
        durationFilter.includes(plan.duration.value)
      );
    }

    // Apply price range filter
    result = result.filter(
      (plan) =>
        plan.finalPrice >= priceRange.min && plan.finalPrice <= priceRange.max
    );

    // Apply sorting
    switch (sortOption) {
      case "price-low":
        result.sort((a, b) => a.finalPrice - b.finalPrice);
        break;
      case "price-high":
        result.sort((a, b) => b.finalPrice - a.finalPrice);
        break;
      case "duration":
        result.sort((a, b) => b.duration.value - a.duration.value);
        break;
      case "recommended":
      default:
        // Custom recommendation logic based on value (serviceLimit / finalPrice)
        result.sort((a, b) => {
          const aValue = a.serviceLimit / a.finalPrice;
          const bValue = b.serviceLimit / b.finalPrice;
          return bValue - aValue;
        });
    }

    setFilteredPlans(result);
  }, [plans, sortOption, searchQuery, durationFilter, priceRange]);

  // Toggle duration filter
  const toggleDurationFilter = (duration: number) => {
    if (durationFilter.includes(duration)) {
      setDurationFilter(durationFilter.filter((d) => d !== duration));
    } else {
      setDurationFilter([...durationFilter, duration]);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-red-600 text-2xl">!</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
        <p className="text-gray-500 mb-6">{error}</p>
        <button
          className="text-blue-600 font-medium"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  const durationOptions = getDurationOptions();

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            Doctor Subscription Plans
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose the perfect subscription plan to enhance your medical
            practice and provide exceptional care for your patients.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search plans..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <label
                  htmlFor="sort"
                  className="pl-3 text-sm text-gray-600 hidden md:block"
                >
                  Sort by:
                </label>
                <select
                  id="sort"
                  className="block w-full md:w-auto py-2 pl-3 pr-10 text-sm border-0 focus:outline-none focus:ring-0 rounded-lg"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="duration">Duration</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center justify-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-lg transition-colors"
            >
              <SlidersHorizontal size={16} />
              <span>Filters</span>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                {durationFilter.length > 0 ? durationFilter.length : ""}
              </span>
            </button>
          </div>

          {/* Expanded Filters */}
          {filterOpen && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Duration Filter */}
              <div>
                <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                  <Calendar size={16} className="mr-2" />
                  Duration
                </h3>
                <div className="space-y-2">
                  {durationOptions.map((duration) => (
                    <label key={duration} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-blue-600 focus:ring-blue-500 mr-2"
                        checked={durationFilter.includes(duration)}
                        onChange={() => toggleDurationFilter(duration)}
                      />
                      <span className="text-sm text-gray-600">
                        {duration}{" "}
                        {plans.find((p) => p.duration.value === duration)
                          ?.duration.unit || "days"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                  <Award size={16} className="mr-2" />
                  Price Range
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>₹{priceRange.min}</span>
                    <span>₹{priceRange.max}</span>
                  </div>
                  <input
                    type="range"
                    min={
                      plans.length
                        ? Math.min(...plans.map((p) => p.finalPrice))
                        : 0
                    }
                    max={
                      plans.length
                        ? Math.max(...plans.map((p) => p.finalPrice))
                        : 1000
                    }
                    step="10"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange({
                        ...priceRange,
                        max: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filter Tags */}
        {durationFilter.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {durationFilter.map((duration) => (
              <div
                key={`duration-${duration}`}
                className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full flex items-center"
              >
                <span>
                  {duration}{" "}
                  {plans.find((p) => p.duration.value === duration)?.duration
                    .unit || "days"}
                </span>
                <button
                  className="ml-2 focus:outline-none"
                  onClick={() => toggleDurationFilter(duration)}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              className="text-xs text-gray-600 underline"
              onClick={() => {
                setDurationFilter([]);
                const maxPrice = plans.length
                  ? Math.max(...plans.map((p) => p.finalPrice))
                  : 1000;
                setPriceRange({ min: 0, max: maxPrice });
              }}
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{filteredPlans.length}</span>{" "}
            plans
          </p>
          <div className="flex items-center text-sm text-gray-600">
            <Users size={16} className="mr-2" />
            <span>For individual doctors & practices</span>
          </div>
        </div>

        {/* Plan Cards Grid */}
        {filteredPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => (
              <div key={plan._id} className={plan.status ? "" : "opacity-60"}>
                <DoctorPlanCard
                  plan={{
                    id: plan._id,
                    planName: plan.planName,
                    duration: plan.duration.value,
                    finalPrice: plan.finalPrice,
                    discountPrice: plan.price,
                    discount: plan.discount,
                    status: plan.status ? "active" : "inactive",
                    features: plan.features,
                    serviceLimit: plan.serviceLimit,
                    durationUnit: plan.duration.unit,
                  }}
                  onSubscribe={handleSubscribe}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No plans found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              className="text-blue-600 font-medium flex items-center justify-center mx-auto"
              onClick={() => {
                setSearchQuery("");
                setDurationFilter([]);
                const maxPrice = plans.length
                  ? Math.max(...plans.map((p) => p.finalPrice))
                  : 1000;
                setPriceRange({ min: 0, max: maxPrice });
              }}
            >
              <ArrowUpDown size={16} className="mr-2" />
              Reset all filters
            </button>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-16 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            <div>
              <h3 className="text-lg font-medium text-blue-800 mb-2">
                How do I choose the right plan?
              </h3>
              <p className="text-gray-600">
                Consider the size of your practice, number of patients, and the
                features you need most. Our Professional plan is popular among
                growing practices.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-blue-800 mb-2">
                Can I upgrade my plan later?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. The
                price difference will be prorated based on your remaining
                subscription period.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-blue-800 mb-2">
                What payment methods are accepted?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and bank transfers for
                annual subscriptions.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            Need help choosing?
          </h2>
          <p className="text-gray-600 mb-6">
            Our team is ready to help you find the perfect plan for your medical
            practice
          </p>
          <button className="bg-blue-900 hover:bg-blue-800 text-white font-medium py-3 px-6 rounded-lg transition-colors">
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
