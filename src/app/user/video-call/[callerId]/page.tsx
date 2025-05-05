"use client"
import VideoCallLayout from "@/components/doctorComponents/videoCall/VideoCallLayout";
import { getSocket } from "@/utils/socket";
import {
  addIceCandidate,
  addLocalTrack,
  closeConnection,
  createAnswer,
  createPeerConnection,
  setRemoteDescription,
} from "@/utils/webrtc";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const UserVideoCallPage = () => {
  const { callerId } = useParams(); // doctor ID
  const localStreamRef = useRef<HTMLVideoElement>(null);
  const remoteStreamRef = useRef<HTMLVideoElement>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const router = useRouter();

  console.log("caller id😌",callerId);
  
  useEffect(() => {
    const socket = getSocket();
    console.log("--->",socket);
    
    let localStream: MediaStream;


    const setUpConnection = async () => {
       localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      console.log("✅ Patient local stream tracks:", localStream.getTracks());
      if (localStreamRef.current) {
        localStreamRef.current.srcObject = localStream;
        console.log("🎥 Patient video element assigned local stream");
      }

      createPeerConnection({
        onIceCandidate: (candidate) => {
          console.log("-----",candidate);
          socket?.emit("webrtc-candidate", {
            targetId: callerId,
            candidate,
          });
        },
        onTrack: (remoteStream) => {
          console.log("👀 Got remote stream");
          if (remoteStreamRef.current) {
            remoteStreamRef.current.srcObject = remoteStream;
          }
        },
      });

      addLocalTrack(localStream);
    };

    setUpConnection();

    socket?.on("webrtc-offer", async ({ offer }) => {
      console.log("Received offer:", offer);
    
      await setRemoteDescription(offer); // Step 1
    
    
    
      const answer = await createAnswer(); // Step 3
    
      socket.emit("webrtc-answer", {
        targetId: callerId,
        answer,
      });
    });
    
    

    socket?.on("webrtc-candidate", async ({ candidate }) => {
      console.log("Received ICE candidate:", candidate);
      await addIceCandidate(candidate);
    });

    socket?.on("end-call", () => {
      console.log("📴 Doctor ended the call");
      handleEndCall(true);
    });

    return () => {
      socket?.off("webrtc-offer");
      socket?.off("webrtc-candidate");
      socket?.off("end-call");
    };
  }, [callerId]);

  const handleEndCall = (remoteEnded = false) => {
    const socket = getSocket();

    if (!remoteEnded) {
      socket?.emit("end-call", { to: callerId });
    }

    // Stop local stream
    const stream = localStreamRef.current?.srcObject as MediaStream;

    stream?.getTracks().forEach((track) => track.stop());

    // Clean up video refs
    if (localStreamRef.current) localStreamRef.current.srcObject = null;
    if (remoteStreamRef.current) remoteStreamRef.current.srcObject = null;

    // Close WebRTC
    closeConnection();

    // Redirect
    router.push("/");
  };

  const handleToggleMic = () => {
    const stream = localStreamRef.current?.srcObject as MediaStream;

    stream.getAudioTracks().forEach((track) => {
      track.enabled = !micEnabled;
    });

    setMicEnabled((prev) => !prev);
  };

  const handleToggleCamera = () => {
    const stream = localStreamRef.current?.srcObject as MediaStream;

    stream?.getVideoTracks().forEach((track) => {
      track.enabled = !cameraEnabled;
    });
    setCameraEnabled((prev) => !prev);
  };

  return (
    <VideoCallLayout
      isDoctor={false}
      remoteUserName={"Doctor"}
      localStreamRef={localStreamRef}
      remoteStreamRef={remoteStreamRef}
      micEnabled={micEnabled}
      cameraEnabled={cameraEnabled}
      onEndCall={handleEndCall}
      onToggleMic={handleToggleMic}
      onToggleCamera={handleToggleCamera}
    />
  );
};

export default UserVideoCallPage;
