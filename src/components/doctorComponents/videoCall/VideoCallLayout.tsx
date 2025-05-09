import React, { useEffect, useState } from "react";
import { Mic, MicOff, Camera, CameraOff, Phone } from "lucide-react";
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
  const [remoteConnected, setRemoteConnected] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const hasStream = remoteStreamRef.current?.srcObject instanceof MediaStream;
      setRemoteConnected(hasStream);
    }, 500);

    return () => clearInterval(interval);
  }, [remoteStreamRef]);

  console.log("--->",remoteConnected);
  

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white">
      {/* Video Area */}
      <div className={`relative h-full ${isDoctor ? "md:w-7/10" : "w-full"} bg-black`}>
        <div className="h-full w-full relative">
          {/* Remote video */}
          <video
            ref={remoteStreamRef}
            autoPlay
            playsInline
            className="h-full w-full object-cover"
          />

          {/* Show fallback only if no remote stream */}
          {!remoteConnected && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 opacity-80 z-10">
              <div className="text-center">
                <div className="h-20 w-20 mx-auto rounded-full bg-gray-700 flex items-center justify-center text-2xl font-bold">
                  {/* {remoteUserName[0]?.toUpperCase() || "?"} */}
                </div>
                <p className="mt-2">{remoteUserName}</p>
              </div>
            </div>
          )}

          {/* Local Picture-in-Picture */}
          <div className="absolute bottom-4 right-4 w-32 h-24 md:w-48 md:h-36 bg-gray-800 rounded-lg overflow-hidden shadow-lg z-20">
            <video
              ref={localStreamRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-1 left-1 text-xs text-white">You</div>
          </div>

          {/* Remote name overlay */}
          <div className="absolute top-4 left-4 z-20 text-white text-sm">
            {remoteUserName}
          </div>

          {/* Controls */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 z-20">
            <button
              onClick={onToggleMic}
              className={`rounded-full p-3 ${micEnabled ? "bg-gray-700" : "bg-red-500"}`}
              aria-label={micEnabled ? "Mute microphone" : "Unmute microphone"}
            >
              {micEnabled ? <Mic size={24} /> : <MicOff size={24} />}
            </button>

            <button
              onClick={onToggleCamera}
              className={`rounded-full p-3 ${cameraEnabled ? "bg-gray-700" : "bg-red-500"}`}
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

      {/* Prescription Panel */}
      {isDoctor && (
        <div className="w-full md:w-3/10 bg-gray-800 p-4 hidden md:block">
          {prescriptionForm || <PrescriptionForm />}
        </div>
      )}
    </div>
  );
};

export default VideoCallLayout;
