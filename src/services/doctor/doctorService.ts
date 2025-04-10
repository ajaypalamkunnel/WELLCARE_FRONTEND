import { DoctorProfileUpdateForm } from "@/components/doctorComponents/forms/modals/EditProfileModal";
import { FormValues, ScheduleCreationData } from "@/components/doctorComponents/ScheduleModal";
import { ServiceData } from "@/components/doctorComponents/ServiceComponent";
import IDoctorProfileDataType from "@/types/doctorFullDataType";
import axiosInstanceDoctor from "@/utils/axiosInstanceDoctor";
import { getErrorMessage } from "@/utils/handleError";
import axios, { AxiosError } from "axios";

export const featchAllDepartments = async () => {
    try {
        const response = await axiosInstanceDoctor.get("/api/admin/getalldepartments")

        return response.data
    } catch (error) {
        console.error("Error fetching departments:", error);
        throw error;
    }
}

export const doctorRegistration = async (doctorProfileData: IDoctorProfileDataType) => {

    try {

        console.log("doctorRegistration service ===>", doctorProfileData);

        const response = await axiosInstanceDoctor.post("/api/doctor/doctorregistration", doctorProfileData)
        setTimeout(() => {
            console.log("API from service====>", response);

        }, 1000)

        return response.data
    } catch (error) {

        console.error("Error doctor registration:", error);
        throw error;

    }

}


export const updateDoctorProfile = async (doctorId: string, data: DoctorProfileUpdateForm) => {

    try {

        const response = await axiosInstanceDoctor.put("/api/doctor/doctor-profile-update", { doctorId, updateData: data })
        return response

    } catch (error) {
        console.error("Error doctor registration:", error);
        throw error;

    }

}



export const changePassword = async (doctorId: string, oldPassword: string, newPassword: string) => {

    try {

        const response = await axiosInstanceDoctor.put("/api/doctor/change-password", { doctorId, oldPassword, newPassword })

        return response

    } catch (error) {
        console.error("Error doctor change-password:", error);
        throw error;
    }



}

export const getAllSubscriptionPlans = async () => {
    try {

        const response = await axiosInstanceDoctor.get("/api/doctor/subscription-plans")
        return response.data
    } catch (error) {
        console.error("Error fetching subscription plans:", error);
        throw error;

    }
}

export const createSubscriptionOrder = async (doctorId: string, planId: string) => {

    try {

        const response = await axiosInstanceDoctor.post("/api/doctor/create-order", { doctorId, planId })
        return response.data
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }

}

export const verifyPayment = async (paymentData: any) => {
    try {
        const response = await axiosInstanceDoctor.post("/api/doctor/verify-payment", paymentData);
        return response.data;
    } catch (error) {
        console.error("Error verifying payment:", error);
        throw error;
    }
};


export const createService = async (data: ServiceData) => {
    try {

        const response = await axiosInstanceDoctor.post("/api/doctor/create-service", data)
        return response.data

    } catch (error) {
        console.error("Error creating service:", error);
        throw error;
    }
}


export const getServices = async (doctorId: string) => {
    try {

        

        const response = await axiosInstanceDoctor.get("/api/doctor/get-services", {
            params: { doctorId }
        });

       

        return response.data


    } catch (error) {
        console.error("Error while featching services")
        throw error
    }
}



export const updateService = async (updatedData: ServiceData) => {

    try {
        console.log("--->", updatedData);

        const response = await axiosInstanceDoctor.put("/api/doctor/update-service", updatedData)
        return response.data

    } catch (error) {
        console.error("Error while Updating service");
        throw error

    }
}


export const getDoctorSubscription = async (subscriptionId:string) =>{
    try {

        const response = await axiosInstanceDoctor.get(`/api/doctor/get-my-subscription/${subscriptionId}`)

        return response.data
        
    } catch (error) {
        console.log("Error while get doctor subscription data");
        throw error
    }
}


export const validateSchedule = async (data: FormValues) => {
    try {
        const response = await axiosInstanceDoctor.post("/api/doctor/validate-schedule", data);
        console.log("validate schedule",response.data)
        
        return response.data;
        
    } catch (error:unknown) {
        if(axios.isAxiosError(error)){
            throw error
        }

        throw new Error(getErrorMessage(error))
    }
};

export const generateSlote = async (data:FormValues) =>{

    try {
        console.log("i am service==> ",data) ;
        

        const response = await axiosInstanceDoctor.post("/api/doctor/generate-slots",data)

        return response.data
        
    } catch (error:unknown) {
        console.error("Error while slot generation:", error);
        return {
            success: false,
            message: getErrorMessage(error)
        };
    }

}

export const createSchedule = async (data:ScheduleCreationData) =>{
    try {

        console.log("going data**",data);
        

        const response = await axiosInstanceDoctor.post("/api/doctor/create-schedule",data)

        console.log("avadannu vanne njan aane ===>",response);
        


        return response.data
    
    } catch (error:unknown) {
        console.error("Error while creating schedule:", error);
        return {
            success: false,
            message: getErrorMessage(error)
        };
    }
}

export const fetchSchedules = async (params:any) => {
    try {

        
      // Convert params object to URLSearchParams
      const queryParams = new URLSearchParams();

      console.log("service ==>", queryParams.toString());
      
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          // Handle Date objects by converting to ISO string and taking just the date part
          if (value instanceof Date) {
            queryParams.append(key, value.toISOString().split('T')[0]);
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
      
      const response = await axiosInstanceDoctor.get(`/api/doctor/fetch-schedules?${queryParams.toString()}`);

      console.log("Evade kitttitoo",response.data.data);
      

      return response.data.data;
    } catch (error) {
      console.error('Error fetching schedules:', error);
      throw error;
    }
  };