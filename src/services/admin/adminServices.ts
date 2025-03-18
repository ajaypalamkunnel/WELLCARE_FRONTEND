import { PlanFormData } from "@/components/admin/ui/NewPlanModalForm";
import axiosInstanceAdmin from "@/utils/axiosInstanceAdmin"


export const createDepartment = async (name:string,icon:string)=>{
    try {

        const response = await axiosInstanceAdmin.post("/api/admin/adddepartment",{name,icon})
        console.log(response);
        return response.data
        
    } catch (error) {
        console.error("Error creating department", error);
        throw new Error("Error creating department")
    }
}

export const featchAllDepartments = async ()=>{
    try {
        const response = await axiosInstanceAdmin.get("/api/admin/getalldepartments")

        return response.data
    } catch (error) {
        console.error("Error fetching departments:", error);
        throw error;
    }
}



export const updateDoctorStatus = async (_id: string, newStatus: number)=>{
    try {
        console.log("updated servicee");
        
        const response = await axiosInstanceAdmin.put("/api/admin/update-doctor-status",{doctorId:_id,status:newStatus})

        return response
        
    } catch (error) {
        
        console.error("Error doctor status update:", error);
        throw error;
    }
}

export const verifyDoctorApplication = async(_id:string,isVerified:boolean,reason?:string)=>{

    try {


        const response = await axiosInstanceAdmin.put("/api/doctor/verify-doctor",{doctorId:_id,isVerified,reason})

        return response

    } catch (error) {

        console.error("Error doctor registration:", error);
        throw error
    
    }

}

export const fetchAllPatients = async(currentPage:number,limit:number)=>{
    try {

        const response = await axiosInstanceAdmin.get(`/api/admin/users?page=${currentPage}&limit=${limit}`)

        return response.data
        
    } catch (error) {

        console.error("Error fetching patients:", error);
        throw error;
        
    }
}


export const updateUserStatus = async(userId:string,status:number)=>{
    try {
        console.log(">>>>",userId,">>>",status);
        
        const response = await axiosInstanceAdmin.put("/api/admin/updateStatus",{userId,status})
        return response
    } catch (error) {
        console.error("Error user update:", error);
        throw error;
    }
}


export const updateDepartmentStatus = async(deptId:string,status:boolean)=>{
    try {

        const response = await axiosInstanceAdmin.put("/api/admin//update-department-status",{deptId,status})
        return response
    } catch (error) {
        console.error("Error updating department status:", error);
        throw error;
    }
}


export const createNewPlan = async(data:PlanFormData)=>{
    try {

        const response = await axiosInstanceAdmin.post("/api/admin//create-subscription-plan",{subscriptionData:data})
        return response
        
    } catch (error) {

        console.error("Error while creating plan");
        throw error
        
        
    }
}

export const getAllSubscriptionPlans = async()=>{
    try {

        const response = await axiosInstanceAdmin.get("/api/admin/get-subscription-plans")
        return response
    } catch (error) {
        console.error("Error fetching subscription plans:", error);
        throw error;
        
    }
}


export const updateSubscriptionPlanStatus = async(planId:string)=>{
    try {
        const response = await axiosInstanceAdmin.put("/api/admin/toggle-subscription-status",{planId})
        return response
    } catch (error) {
        console.error("Error updating subscription plan status:", error);
        throw error;
    }
}