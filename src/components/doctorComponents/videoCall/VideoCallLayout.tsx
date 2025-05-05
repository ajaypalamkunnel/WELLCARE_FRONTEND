import React, { useState } from "react";
import { Mic, MicOff, Camera, CameraOff, Phone, Plus } from "lucide-react";
import PrescriptionForm from "./PrescriptionForm";

interface VideoCallLayoutProps {
  isDoctor: boolean;
  prescriptionForm?: React.ReactNode;
  remoteUserName: string;
  localStreamRef: React.RefObject<HTMLVideoElement | null>;
  remoteStreamRef: React.RefObject<HTMLVideoElement | null>;
  onEndCall: () => void;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  micEnabled: boolean;
  cameraEnabled: boolean;
}

const VideoCallLayout: React.FC<VideoCallLayoutProps> = ({
  isDoctor,
  prescriptionForm,
  remoteUserName,
  localStreamRef,
  remoteStreamRef,
  onEndCall,
  onToggleMic,
  onToggleCamera,
  micEnabled,
  cameraEnabled,
}) => {

  console.log("===>",remoteStreamRef);
  console.log("----->",remoteUserName);
  
  


  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white">
      {/* Main Video Call Area - Takes full width on mobile, 70% on desktop */}
      <div
        className={`relative h-full ${
          isDoctor ? "md:w-7/10" : "w-full"
        } bg-black`}
      >
        {/* Remote Video Stream */}
        <div className="h-full w-full relative">
          {/* Remote Video */}

          <video
            ref={remoteStreamRef}
            autoPlay
            playsInline
            className="h-full w-full object-cover"
          />

          {/* Fallback if remote video is not available */}
          {!remoteStreamRef.current?.srcObject && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 opacity-80">
              <div className="text-center">
                <div className="h-20 w-20 mx-auto rounded-full bg-gray-700 flex items-center justify-center text-2xl font-bold">
                  {remoteUserName}
                </div>
                <p className="mt-2">{remoteUserName}</p>
              </div>
            </div>
          )}

          {/* Local Video (Picture-in-Picture) */}
          <div className="absolute bottom-4 right-4 w-32 h-24 md:w-48 md:h-36 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <video
              ref={localStreamRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-1 left-1 text-xs">You</div>
          </div>

          {/* User Names */}
          <div className="absolute top-4 left-4">{remoteUserName}</div>

          {/* Control Bar */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
            <button
              onClick={onToggleMic}
              className={`rounded-full p-3 ${
                micEnabled ? "bg-gray-700" : "bg-red-500"
              }`}
              aria-label={micEnabled ? "Mute microphone" : "Unmute microphone"}
            >
              {micEnabled ? <Mic size={24} /> : <MicOff size={24} />}
            </button>

            <button
              onClick={onToggleCamera}
              className={`rounded-full p-3 ${
                cameraEnabled ? "bg-gray-700" : "bg-red-500"
              }`}
              aria-label={cameraEnabled ? "Turn off camera" : "Turn on camera"}
            >
              {cameraEnabled ? <Camera size={24} /> : <CameraOff size={24} />}
            </button>

            <button
              onClick={onEndCall}
              className="rounded-full p-3 bg-red-600"
              aria-label="End call"
            >
              <Phone size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Prescription Form - Only for doctors, hidden on mobile */}
      {isDoctor && (
        <div className="w-full md:w-3/10 bg-gray-800 p-4 hidden md:block">
          <PrescriptionForm />
        </div>
      )}
    </div>
  );
};

export default VideoCallLayout;
