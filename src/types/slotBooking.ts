// Types for the API response
export interface Slot {
    slot_id?: string;
    start_time: string;
    end_time: string;
    status?: 'available' | 'booked';
    is_break?: boolean;
  }
  
  export interface Service {
    _id?: string;
    name: string;
    fee: number;
    mode: 'Online' | 'Offline';
  }
  
  export interface Schedule {
    _id: string;
    doctorId: string;
    serviceId: Service;
    date: string;
    start_time: string;
    end_time: string;
    duration: number;
    availability: Slot[];
  }
  
  export interface ScheduleResponse {
    success: boolean;
    message: string;
    data: Schedule[];
  }

  // Function to format date as YYYY-MM-DD
export const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };


export interface InitiateBookingPayload {
  patientId: string;
  doctorScheduleId: string;
  slotId: string;
}


export interface VerifyBookingPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  patientId: string;
  doctorScheduleId: string;
  slotId: string;
  departmentId: string;
  doctorId: string;
  serviceId: string;
  appointmentDate: string;
}



export interface IInitiateBookingResponse {
  orderId: string;
  amount: number;
  currency: string;
}

export interface IVerifyBookingResponse {
  bookingId: string;
  status: string;
}


export interface Doctor {
  fullName: string;
  experience: number;
  specialization: string;
  profileImage: string;
}

export interface Department {
  name: string;
}


export interface BookingDetails {
  doctorId: Doctor;
  departmentId: Department;
  serviceId: Service;
  appointmentDate: string;
  selectdSlot: Slot;
  status: string;
  paymentStatus: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: BookingDetails;
}



export interface AppointmentListItemDTO {
  _id: string;
  appointmentDate: Date;
  status: "booked" | "pending" | "rescheduled" | "completed" | "cancelled";
  slot:{
    start_time: Date;
  }
  doctor: {
    _id: string;
    fullName: string;
    specialization: string;
    profileImage: string;
  };
}




export interface AppointmentDetailDTO {
  _id: string;
  appointmentDate: Date;
  status: string;
  paymentStatus?: string;
  slot: {
    start_time: Date;
    end_time: Date;
  };
  doctor: {
    fullName: string;
    specialization: string;
    experience: number;
    profileImage: string;
    clinicAddress?: {
      clinicName: string;
      street: string;
      city: string;
      state: string;
      country: string;
    };
  };
  prescription?: {
    _id: string;
    fileUrl: string;
    diagnosis: string;
  };

  service: {
    name: string;
    mode: "Online" | "In-Person" | "Both";
    fee: number;
    description: string;
  }
  
}



export interface CancelAppointmentResponseDTO {
  message: string;
  refund: {
    status: "eligible" | "not_eligible";
    amount: number;
  };
}

