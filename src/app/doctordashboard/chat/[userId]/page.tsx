"use client"

import DoctorChatWrapper from "@/components/chatComponets/DoctorChatWrapper"
import { useParams } from "next/navigation"



 const DoctorChatWithUser = () =>{
    const {userId} = useParams()
    console.log("DoctorChatWithUser user id : ",userId);
    
    return <DoctorChatWrapper userId={userId as string}/>
 }

 export default DoctorChatWithUser