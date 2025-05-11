"use client"
import { useCallStore } from "@/store/call/callStore";
import { useAuthStore } from "@/store/user/authStore";
import { getSocket } from "@/utils/socket";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";

const IncomingCallModal = () => {

 
  

    const {incomingCallFrom, showCallModal, clearCall,callerName } = useCallStore()
    const user = useAuthStore()
    const userId = user.user?.id
    const router = useRouter()
    const ringtoneRef = useRef<HTMLAudioElement|null>(null)


    useEffect(()=>{
      if(showCallModal){
        ringtoneRef.current = new Audio("/music/ringtone.mp3")
        ringtoneRef.current.loop=true
        ringtoneRef.current.play().catch((err)=>
          console.warn("🔕 Ringtone play failed:", err)
        )
      }else{
        ringtoneRef.current?.pause();
        ringtoneRef.current = null;
      }

      return () =>{
        ringtoneRef.current?.pause();
        ringtoneRef.current = null;
      }
    },[showCallModal])

    const handleAccept = () =>{
        const socket = getSocket()

        socket?.emit("accept-call",{
             callerId:incomingCallFrom,
             receiverId:userId
        })

        clearCall();
        router.push(`/user/video-call/${incomingCallFrom}`)
    }

    const handleReject = () => {
        const socket = getSocket();
        socket?.emit("reject-call", {
          callerId: incomingCallFrom,
          receiverId: userId
        });
    
        clearCall();
      };
    
      if (!showCallModal) return null;




  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
        <h2 className="text-lg font-semibold mb-4">📞 Incoming Call</h2>
        <p>Doctor {callerName } is calling you</p>
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Accept
          </button>
          <button
            onClick={handleReject}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
