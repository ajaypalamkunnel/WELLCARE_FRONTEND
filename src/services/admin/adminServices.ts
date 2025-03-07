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