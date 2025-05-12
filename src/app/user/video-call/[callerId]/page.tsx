"use client";

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
  const { callerId } = useParams(); // Doctor ID
  const localStreamRef = useRef<HTMLVideoElement>(null);
  const remoteStreamRef = useRef<HTMLVideoElement>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const socket = getSocket();
    console.log("✅ [Patient] Connected to socket:", socket?.id);
    console.log("🩺 Caller (Doctor) ID:", callerId);

    let localStream: MediaStream;
    let peerConnectionInitialized = false;

    // 👇 Setup listeners BEFORE creating media or peer connection
    socket?.on("webrtc-offer", async ({ offer }) => {
      console.log("📩 [Patient] Received WebRTC offer:", offer);

      await setRemoteDescription(offer);

      if (localStream) {
        addLocalTrack(localStream);
        console.log(
          "📤 [Patient] Added local tracks after setting remote description"
        );
      }

      const answer = await createAnswer();

      socket.emit("webrtc-answer", {
        targetId: callerId,
        answer,
      });

      console.log("📨 [Patient] Sent WebRTC answer to doctor");
    });

    socket?.on("webrtc-candidate", async ({ candidate }) => {
      console.log("📥 [Patient] Received ICE candidate:", candidate);
      await addIceCandidate(candidate);
    });

    socket?.on("end-call", () => {
      console.log("📴 Doctor ended the call");
      handleEndCall(true);
    });

    const setUpConnection = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        console.log(
          "🎤 [Patient] Got local media tracks:",
          localStream.getTracks()
        );

        if (localStreamRef.current) {
          localStreamRef.current.srcObject = localStream;
          console.log("🎥 [Patient] Set local video element stream");
        }

        createPeerConnection({
          onIceCandidate: (candidate) => {
            console.log("📡 [Patient] Sending ICE candidate:", candidate);
            socket?.emit("webrtc-candidate", {
              targetId: callerId,
              candidate,
            });
          },
          onTrack: (remoteStream) => {
            console.log(
              "👀 [Patient] Received remote stream:",
              remoteStream.getTracks()
            );

             if (remoteStreamRef.current) {
              remoteStreamRef.current.srcObject = remoteStream;
              console.log("✅ Remote stream set to video element");
            }

          },
        });

        addLocalTrack(localStream)
        peerConnectionInitialized = true;
          console.log("🔄 [Patient] Local tracks added to peer connection");
      } catch (error) {
        console.error("❌ [Patient] Failed to get user media:", error);
      }
    };

    // Setup listeners
    socket?.on("webrtc-offer", async ({ offer }) => {
      console.log("📩 [Patient] Received WebRTC offer");

      if (!peerConnectionInitialized) {
        console.log("⚠️ Peer connection not ready, initializing now");
        await setUpConnection();
      }

      try {
        await setRemoteDescription(offer);
        console.log("📥 [Patient] Remote description set");

        const answer = await createAnswer();
        console.log("📨 [Patient] Created answer");

        socket.emit("webrtc-answer", {
          targetId: callerId,
          answer,
        });
      } catch (err) {
        console.error("❌ Failed to handle offer:", err);
      }
    });

    socket?.on("webrtc-candidate", async ({ candidate }) => {
      console.log("📥 [Patient] Received ICE candidate");
      try {
        if (candidate) {
          await addIceCandidate(candidate);
        }
      } catch (err) {
        console.error("❌ Failed to add ICE candidate:", err);
      }
    });

    socket?.on("end-call", () => {
      console.log("📴 Doctor ended the call");
      handleEndCall(true);
    });

    setUpConnection();

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

    // Clean up local stream
    const localStream = localStreamRef.current?.srcObject as MediaStream;
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    // Clean up remote stream
    const remoteStream = remoteStreamRef.current?.srcObject as MediaStream;
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
    }

    // Clear video elements
    if (localStreamRef.current) localStreamRef.current.srcObject = null;
    if (remoteStreamRef.current) remoteStreamRef.current.srcObject = null;

    // Close connection
    closeConnection();

    // Navigate away
    router.push("/");
  };

  const handleToggleMic = () => {
     const stream = localStreamRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setMicEnabled(!micEnabled);
    }
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
      remoteUserName="Doctor"
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

// ----------------------------
