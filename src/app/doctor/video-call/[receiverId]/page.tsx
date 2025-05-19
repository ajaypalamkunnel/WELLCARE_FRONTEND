"use client";

import PrescriptionForm from "@/components/doctorComponents/videoCall/PrescriptionForm";
import VideoCallLayout from "@/components/doctorComponents/videoCall/VideoCallLayout";
import { useCallStore } from "@/store/call/callStore";
import { useAuthStoreDoctor } from "@/store/doctor/authStore";
import { getSocket } from "@/utils/socket";
import {
  addIceCandidate,
  addLocalTrack,
  closeConnection,
  createOffer,
  createPeerConnection,
  setRemoteDescription,
} from "@/utils/webrtc";
import { Dialog } from "@headlessui/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const DoctorVideoCallPage = () => {
  const { receiverId } = useParams(); // Patient ID
  const localStreamRef = useRef<HTMLVideoElement>(null);
  const remoteStreamRef = useRef<HTMLVideoElement>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [showEndCallWarning, setShowEndCallWarning] = useState(false);

  const router = useRouter();
  const { user } = useAuthStoreDoctor();
  const doctorId = user?.id;
  const doctorName = user?.fullName;

  const remoteUserName = useCallStore((state) => state.remoteUserName);
  const prescriptionSubmitted = useCallStore((state) => state.prescriptionSubmitted);

  useEffect(() => {
    const socket = getSocket();
    console.log("✅ [Doctor] Connected to socket:", socket?.id);
    console.log("🧑‍⚕️ Receiver (Patient) ID:", receiverId);

    let localStream: MediaStream;

    // Register all socket listeners first
    socket?.on("webrtc-answer", async ({ answer }) => {
      console.log("📩 [Doctor] Received WebRTC answer from patient");
      await setRemoteDescription(answer);
    });

    socket?.on("webrtc-candidate", async ({ candidate }) => {
      console.log("📥 [Doctor] Received ICE candidate:", candidate);
      await addIceCandidate(candidate);
    });

    const startCall = async () => {
      try {
        // Get local stream
        localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        console.log("🎤 [Doctor] Got local stream tracks:", localStream.getTracks());

        if (localStreamRef.current) {
          localStreamRef.current.srcObject = localStream;
        }

        // Create peer connection
        createPeerConnection({
          onIceCandidate: (candidate) => {
            console.log("📡 [Doctor] Sending ICE candidate:", candidate);
            socket?.emit("webrtc-candidate", {
              targetId: receiverId,
              candidate,
            });
          },
          onTrack: (remoteStream) => {
            console.log("👀 [Doctor] Got remote stream:", remoteStream.getTracks());
            if (remoteStreamRef.current) {
              remoteStreamRef.current.srcObject = remoteStream;
            } else {
              console.warn("⚠️ remoteStreamRef is null");
            }
          },
        });

        // Add local tracks before creating offer
        addLocalTrack(localStream);

        const offer = await createOffer();
        console.log("🎥 [Doctor] Created offer:", offer);

        // Notify the backend about the call
        socket?.emit("start-call", {
          callerId: doctorId,
          receiverId,
          callerName: doctorName,
        });

        socket?.emit("webrtc-offer", {
          targetId: receiverId,
          offer,
        });
      } catch (error) {
        console.error("❌ [Doctor] Failed to start call:", error);
      }
    };

    startCall();

    return () => {
      socket?.off("webrtc-answer");
      socket?.off("webrtc-candidate");
    };
  }, [receiverId,doctorId,doctorName]);//updated added 'doctorId' and 'doctorName' in dependency array eslint error

  const handleEndCall = () => {
    const socket = getSocket();

    if (!prescriptionSubmitted) {
      setShowEndCallWarning(true);
      return;
    }

    socket?.emit("end-call", {
      to: receiverId,
    });

    const stream = localStreamRef.current?.srcObject as MediaStream;
    if (stream) {
        stream.getTracks().forEach((track) => track.stop());
    }
    if (localStreamRef.current) {
        localStreamRef.current.srcObject = null;
    }
    if (remoteStreamRef.current) {
        const remoteStream = remoteStreamRef.current.srcObject as MediaStream;
        if (remoteStream) {
            remoteStream.getTracks().forEach((track) => track.stop());
        }
        remoteStreamRef.current.srcObject = null;
    }
    closeConnection();
    useCallStore.getState().clearCall();

    router.push("/doctordashboard/home");
  };

  const handleToggleMic = () => {
    const stream = localStreamRef.current?.srcObject as MediaStream;
    stream?.getAudioTracks().forEach((track) => {
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
    <>
      <VideoCallLayout
        isDoctor={true}
        remoteUserName={remoteUserName!}
        prescriptionForm={<PrescriptionForm />}
        localStreamRef={localStreamRef}
        remoteStreamRef={remoteStreamRef}
        micEnabled={micEnabled}
        cameraEnabled={cameraEnabled}
        onEndCall={handleEndCall}
        onToggleMic={handleToggleMic}
        onToggleCamera={handleToggleCamera}
      />

      <Dialog
        open={showEndCallWarning}
        onClose={() => setShowEndCallWarning(false)}
        className="fixed z-50 inset-0"
      >
        <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <Dialog.Title className="text-lg font-semibold text-red-600">
              Cannot End Call
            </Dialog.Title>
            <p className="mt-2 text-gray-700">
              Please submit the prescription before ending the call.
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowEndCallWarning(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default DoctorVideoCallPage;

// ---------------------------------------------------------------
