export interface Discount {
    amount: number;
    type: "amount" | "percentage";
  }
  
  export interface Duration {
    value: number;
    unit: "day" | "month" | "year";
  }
  
  export interface PlanDetails {
    _id: string;
    planName: string;
    price: number;
    finalPrice: number;
    discount?: Discount;
    duration: Duration;
    features: string[];
    serviceLimit: number;
    status: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface SubscriptionPlan {
    _id: string;
    doctorId: string;
    planId: PlanDetails;
    orderId: string;
    paymentStatus: "paid" | "pending" | "failed";
    startDate: string;
    endDate: string;
    status: "active" | "expired";
    createdAt: string;
    updatedAt: string;
  }
  