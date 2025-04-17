"use client"
import ChatWrapper from "@/components/chatComponets/ChatWrapper";
import { useParams } from "next/navigation"


const ChatWithDoctor = ()=>{
    const params = useParams()
    const doctorId = params?.doctorId as string;

    console.log("hollll",doctorId);
    

    return <ChatWrapper doctorId={doctorId}/>
}

export default ChatWithDoctor