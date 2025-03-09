import axiosInstanceAdmin from "@/utils/axiosInstanceAdmin"


export const createDepartment = async (name:string,icon:string)=>{
    try {

        const response = await axiosInstanceAdmin.post("/api/admin/adddepartment",{name,icon})
        console.log(response);
        return response
        
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
        
        const response = await axiosInstanceAdmin.put("/api/doctor/updatestatus",{doctorId:_id,status:newStatus})

        return response
        
    } catch (error) {
        
        console.error("Error doctor registration:", error);
        throw error;
    }
}

export const verifyDoctorApplication = async(_id:string,isVerified:boolean)=>{

    try {


        const response = await axiosInstanceAdmin.put("/api/doctor/verify-doctor",{doctorId:_id,isVerified})

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