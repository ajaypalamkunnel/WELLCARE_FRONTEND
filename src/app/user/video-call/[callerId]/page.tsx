"use client";

import VideoCallLayout from "@/components/doctorComponents/videoCall/VideoCallLayout";
import { useCallerTimer } from "@/hooks/useCallTimer";
import { getAgoraClient, joinCall, leaveCall } from "@/utils/agora";
import { getSocket } from "@/utils/socket";
import { IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";
// import {
//   addIceCandidate,
//   addLocalTrack,
//   closeConnection,
//   createAnswer,
//   createPeerConnection,
//   setRemoteDescription,
// } from "@/utils/webrtc";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URI || "http://localhost:5000";

const UserVideoCallPage = () => {
  const { callerId } = useParams(); // Doctor ID
  const localStreamRef = useRef<HTMLVideoElement>(null);
  const remoteStreamRef = useRef<HTMLVideoElement>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const router = useRouter();
  const hasJoined = useRef(false);
  const { formatted: callDuration, start, stop, reset } = useCallerTimer();
  const [networkQuality, setNetworkQuality] = useState<number | null>(null);

  useEffect(() => {
    const socket = getSocket();
    console.log("✅ [Patient] Connected to socket:", socket?.id);
    console.log("🩺 Caller (Doctor) ID:", callerId);

    let channelName = `doctor-${callerId}-patient`;
    let uid = `patient-${Math.floor(Math.random() * 100000)}`;

    const handleIncommingCall = async () => {
      if (hasJoined.current) {
        console.warn("⏳ Patient already joined — skipping");
        return;
      }

      try {
        const tokenResponse = await fetch(`${API_BASE_URL}/api/agora/token`, {
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

        const { token } = await tokenResponse.json();

        await joinCall({
          channelName,
          uid,
          token,
          localVideoEl: localStreamRef.current!,
          onRemoteTrack: (user) => {
            if (user.videoTrack) {
              user.videoTrack.play(remoteStreamRef.current!);
            }

            if (user.audioTrack) {
              user.audioTrack.play();
            }
          },
          onNetworkQuality: (uplink, downlink) => {
            const avg = Math.max(uplink, downlink);
            setNetworkQuality(avg);
          },
        });

        socket?.emit("accept-call", {
          callerId,
          receiverId: uid,
        });
        start();
        hasJoined.current = true;
        console.log("📞 Patient joined the Agora channel");
      } catch (error) {
        console.error("❌ Failed to join call:", error);
      }
    };

    // Listen for doctor’s invitation
    socket?.on("call-request", async ({ callerId }) => {
      console.log("📩 Incoming call from doctor:", callerId);
      await handleIncommingCall();
    });

    socket?.on("end-call", () => {
      console.log("📴 Doctor ended the call");
      handleEndCall(true);
    });

    handleIncommingCall();

    return () => {
      socket?.off("call-request");
      socket?.off("end-call");
    };
  }, [callerId]);

  const handleEndCall = async (remoteEnded = false) => {
    const socket = getSocket();

    if (!remoteEnded) {
      socket?.emit("end-call", { to: callerId });
    }
    hasJoined.current = false;
    stop();
    reset();
    await leaveCall();

    // Clean up video elements
    if (localStreamRef.current) localStreamRef.current.srcObject = null;
    if (remoteStreamRef.current) remoteStreamRef.current.srcObject = null;

    router.push("/");
  };

  const handleToggleMic = () => {
    const client = getAgoraClient();

    const localAudio = client?.localTracks?.find(
      (track) => track?.trackMediaType === "audio"
    );

    if (localAudio) {
      const isEnabled = (localAudio as IMicrophoneAudioTrack).enabled;

      (localAudio as IMicrophoneAudioTrack).setEnabled(!isEnabled);
      setMicEnabled(!isEnabled);
    }
  };

  const handleToggleCamera = () => {
    const video = localStreamRef.current?.srcObject as MediaStream;
    if (video) {
      video
        .getVideoTracks()
        .forEach((track) => (track.enabled = !cameraEnabled));
      setCameraEnabled((prev) => !prev);
    }
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
      callDuration={callDuration}
      networkQuality={networkQuality!}
    />
  );
};

export default UserVideoCallPage;

// ----------------------------
