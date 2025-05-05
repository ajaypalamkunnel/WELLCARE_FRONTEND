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
  const { receiverId } = useParams();
  const localStreamRef = useRef<HTMLVideoElement>(null);
  const remoteStreamRef = useRef<HTMLVideoElement>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [showEndCallWarning, setShowEndCallWarning] = useState(false);

  const router = useRouter();
  const { user } = useAuthStoreDoctor();
  const callStore = useCallStore();
  const doctorId = user?.id;
  const doctorName = user?.fullName;
  const prescriptionSubmitted = useCallStore(
    (state) => state.prescriptionSubmitted
  );

  // ------------------------------------
  useEffect(() => {
    const socket = getSocket();

    const startCall = async () => {
      try {
        //  Get local stream
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        //Display local video
        if (localStreamRef.current) {
          localStreamRef.current.srcObject = localStream;
        }

        //create peer connection

        createPeerConnection({
          onIceCandidate: (candidate) => {
            socket?.emit("webrtc-candidate", {
              targetId: receiverId,
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

        // . Add local tracks
        addLocalTrack(localStream);

        // offer creating
        const offer = await createOffer();
        console.log("🎥 Created offer:", offer);

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
        console.error("Failed to start call:", error);
      }
    };

    startCall();

    // --------------------------------------

    // Receive answer from patient
    socket?.on("webrtc-answer", async ({ answer }) => {
      console.log("Received answer from patient");
      await setRemoteDescription(answer);

      //  Make sure tracks are added after remote description
    });

    // Receive ICE candidate from patient
    socket?.on("webrtc-candidate", async ({ candidate }) => {
      console.log("Received ICE candidate from patient", candidate);
      await addIceCandidate(candidate);
    });

    return () => {
      socket?.off("webrtc-answer");
      socket?.off("webrtc-candidate");
    };
  }, [receiverId]);

  // --------------------- handle end call-------------------

  const handleEndCall = () => {
    const socket = getSocket();

    if (!prescriptionSubmitted) {
      setShowEndCallWarning(true);
      return;
    }

    socket?.emit("end-call", {
      to: receiverId,
    });

    // Stop local stream
    const localVideoEl = localStreamRef.current;
    if (localVideoEl?.srcObject) {
      const stream = localVideoEl.srcObject as MediaStream;

      stream.getTracks().forEach((track) => {
        track.stop(); //  This stops the camera and mic
      });
      localVideoEl.srcObject = null;
    }

    // Clear remote stream
    const remoteVideoEl = remoteStreamRef.current;
    if (remoteVideoEl?.srcObject) {
      remoteVideoEl.srcObject = null;
    }

    // Close WebRTC connection
    closeConnection();
    useCallStore.getState().clearCall();

    // Redirect
    router.push("/doctordashboard/home");
  };

  // --------------------mic handling------------------

  const handleToggleMic = () => {
    const stream = localStreamRef.current?.srcObject as MediaStream;

    stream?.getAudioTracks().forEach((track) => {
      track.enabled = !micEnabled;
    });

    setMicEnabled((prev) => !prev);
  };

  // -----------------------------camera handling--------------------
  const handleToggleCamera = () => {
    const stream = localStreamRef.current?.srcObject as MediaStream;
    stream?.getVideoTracks().forEach((track) => {
      track.enabled = !cameraEnabled;
    });
    setCameraEnabled((prev) => !prev);
  };
  const remoteUserName = useCallStore((state) => state.remoteUserName);

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
