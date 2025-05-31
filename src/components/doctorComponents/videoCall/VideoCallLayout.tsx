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
  callDuration?: string;
  networkQuality?: number;
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
  callDuration,
  networkQuality,
}) => {
  const [remoteConnected, setRemoteConnected] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const hasStream =
        remoteStreamRef.current?.srcObject instanceof MediaStream;
      setRemoteConnected(hasStream);
    }, 500);

    return () => clearInterval(interval);
  }, [remoteStreamRef]);

  const getNetworkQualityLabel = (quality: number | undefined) => {
    switch (quality) {
      case 1:
        return "🟢 Excellent";
      case 2:
        return "🟢 Good";
      case 3:
        return "🟡 Poor";
      case 4:
        return "🔴 Bad";
      case 5:
        return "🔴 Very Bad";
      case 6:
        return "❌ Disconnected";
      default:
        return "⚪ Unknown";
    }
  };

  const showPrescriptionPanel = isDoctor && !!prescriptionForm;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white overflow-hidden">
      {/* Video Area */}
      <div
        className={`relative w-full ${
          showPrescriptionPanel ? "md:w-7/12" : "md:w-full"
        } bg-black`}
      >
        <div className="relative w-full h-[65vh] md:h-full">
          {/* Remote video */}
          <video
            ref={remoteStreamRef}
            autoPlay
            playsInline
            className="h-full w-full object-cover"
          />

          {/* Fallback if remote stream not connected */}
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

          {/* Local PiP */}
          <div className="absolute bottom-4 right-4 w-24 h-20 sm:w-32 sm:h-24 md:w-48 md:h-36 bg-gray-800 rounded-lg overflow-hidden shadow-lg z-20">
            <video
              ref={localStreamRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-1 left-1 text-xs text-white">You</div>
          </div>

          {/* Remote name */}
          <div className="absolute top-4 left-4 z-20 text-white text-sm">
            {remoteUserName}
          </div>

          {/* Call Duration */}
          {callDuration && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 px-4 py-1 rounded-md text-white text-sm z-20">
              ⏱️ {callDuration}
            </div>
          )}

          {/* Network Quality */}
          {networkQuality !== undefined && (
            <div className="absolute top-4 right-4 bg-black bg-opacity-60 px-3 py-1 rounded-md text-white text-sm z-20">
              {getNetworkQualityLabel(networkQuality)}
            </div>
          )}

          {/* Controls */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 z-20">
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

      {/* Prescription Panel */}
      {showPrescriptionPanel && (
        <div className="w-full md:w-5/12 bg-gray-800 p-4 h-full overflow-y-auto">
          {prescriptionForm || <PrescriptionForm />}
        </div>
      )}
    </div>
  );
};

export default VideoCallLayout;
