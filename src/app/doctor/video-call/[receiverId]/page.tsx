// File: src/app/doctor/video-call/[receiverId]/page.tsx
// Purpose: Doctor initiates video call using Agora SDK

"use client";

import PrescriptionForm from "@/components/doctorComponents/videoCall/PrescriptionForm";
import VideoCallLayout from "@/components/doctorComponents/videoCall/VideoCallLayout";
import { useCallStore } from "@/store/call/callStore";
import { useAuthStoreDoctor } from "@/store/doctor/authStore";
import { getSocket } from "@/utils/socket";
import { joinCall, leaveCall } from "@/utils/agora";
import { Dialog } from "@headlessui/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "@/app/user/video-call/[callerId]/page";

const DoctorVideoCallPage = () => {
  const { receiverId } = useParams(); // Patient ID
  const localStreamRef = useRef<HTMLVideoElement>(null);
  const remoteStreamRef = useRef<HTMLVideoElement>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [showEndCallWarning, setShowEndCallWarning] = useState(false);
  const hasJoined = useRef(false);

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

    const uid = `doctor-${doctorId}`;
    const channelName = `doctor-${doctorId}-patient`;

    const startAgoraCall = async () => {
      try {
        // Step 1: Notify backend of call request
        socket?.emit("start-call", {
          callerId: doctorId,
          receiverId,
          callerName: doctorName,
        });

        // Step 2: Wait for patient to accept, then proceed
        socket?.on("call-accepted", async () => {
           if (hasJoined.current) {
          console.warn("⏳ Doctor already joined — skipping");
          return;
        }


          console.log("✅ Patient accepted call, proceeding with Agora join");

          // Step 3: Get Agora token from backend
          const tokenRes = await fetch(`${API_BASE_URL}/api/agora/token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              channelName,
              uid,
              role: "host",
            }),
          });

          const { token } = await tokenRes.json();

          // Step 4: Join Agora and publish local tracks
          await joinCall({
            channelName,
            uid,
            token,
            localVideoEl: localStreamRef.current!,
            onRemoteTrack: (user) => {
              if (user.videoTrack) {
                user.videoTrack.play(remoteStreamRef.current!);
              }
            },
          });
          hasJoined.current = true;
          console.log("📡 Doctor published local tracks and joined Agora");
        });

        // Listen for patient hang-up
        socket?.on("end-call", () => {
          console.log("📴 Patient ended the call");
          handleEndCall(true);
        });
      } catch (error) {
        console.error("❌ Failed to start call:", error);
      }
    };

    startAgoraCall();

    return () => {
      socket?.off("call-accepted");
      socket?.off("end-call");
    };
  }, [receiverId, doctorId, doctorName]);

  const handleEndCall = async (remoteEnded = false) => {
    const socket = getSocket();

    if (!remoteEnded) {
      if (!prescriptionSubmitted) {
        setShowEndCallWarning(true);
        return;
      }

      socket?.emit("end-call", {
        to: receiverId,
      });
    }

    await leaveCall();

    // Clean up video elements
    if (localStreamRef.current) localStreamRef.current.srcObject = null;
    if (remoteStreamRef.current) remoteStreamRef.current.srcObject = null;
    hasJoined.current = false;
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
