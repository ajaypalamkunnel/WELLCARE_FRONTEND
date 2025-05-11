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




// -------------------------------------------

// import React, { useEffect, useState } from "react";
// import { Mic, MicOff, Camera, CameraOff, Phone, User } from "lucide-react";
// import PrescriptionForm from "./PrescriptionForm";

// interface VideoCallLayoutProps {
//   isDoctor: boolean;
//   prescriptionForm?: React.ReactNode;
//   remoteUserName: string;
//   localStreamRef: React.RefObject<HTMLVideoElement | null>;
//   remoteStreamRef: React.RefObject<HTMLVideoElement | null>;
//   onEndCall: () => void;
//   onToggleMic: () => void;
//   onToggleCamera: () => void;
//   micEnabled: boolean;
//   cameraEnabled: boolean;
//   callStatus?: "connecting" | "connected" | "disconnected";
// }

// const VideoCallLayout: React.FC<VideoCallLayoutProps> = ({
//   isDoctor,
//   prescriptionForm,
//   remoteUserName,
//   localStreamRef,
//   remoteStreamRef,
//   onEndCall,
//   onToggleMic,
//   onToggleCamera,
//   micEnabled,
//   cameraEnabled,
//   callStatus = "connecting",
// }) => {
//   const [remoteVideoActive, setRemoteVideoActive] = useState(false);
//   const [localVideoActive, setLocalVideoActive] = useState(false);

//   // Monitor stream status
//   useEffect(() => {
//     const checkStreams = () => {
//       const remoteVideo = remoteStreamRef.current;
//       const localVideo = localStreamRef.current;

//       if (remoteVideo) {
//         const remoteActive = !!remoteVideo.srcObject && 
//           remoteVideo.srcObject instanceof MediaStream &&
//           remoteVideo.srcObject.getVideoTracks().some(t => t.readyState === 'live');
//         setRemoteVideoActive(remoteActive);
//       }

//       if (localVideo) {
//         const localActive = !!localVideo.srcObject && 
//           localVideo.srcObject instanceof MediaStream &&
//           localVideo.srcObject.getVideoTracks().some(t => t.readyState === 'live');
//         setLocalVideoActive(localActive);
//       }
//     };

//     const interval = setInterval(checkStreams, 1000);
//     return () => clearInterval(interval);
//   }, [remoteStreamRef, localStreamRef]);

//   // Handle call status changes
//   useEffect(() => {
//     if (callStatus === "disconnected") {
//       setRemoteVideoActive(false);
//     }
//   }, [callStatus]);

//   return (
//     <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white">
//       {/* Video Area */}
//       <div className={`relative h-full ${isDoctor ? "md:w-7/12" : "w-full"} bg-black`}>
//         <div className="h-full w-full relative">
//           {/* Remote video */}
//           <video
//             ref={remoteStreamRef}
//             autoPlay
//             playsInline
//             className="h-full w-full object-cover"
//             onCanPlay={() => setRemoteVideoActive(true)}
//             onStalled={() => setRemoteVideoActive(false)}
//           />

//           {/* Connection status overlay */}
//           {callStatus !== "connected" && (
//             <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10">
//               <div className="text-center p-4 rounded-lg bg-gray-800/90">
//                 <div className="animate-pulse flex flex-col items-center">
//                   <div className="h-16 w-16 mb-4 rounded-full bg-gray-700 flex items-center justify-center">
//                     <User size={32} />
//                   </div>
//                   <p className="text-lg font-medium">{remoteUserName}</p>
//                   <p className="text-sm mt-2">
//                     {callStatus === "connecting" ? "Connecting..." : "Call ended"}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Video not available overlay */}
//           {callStatus === "connected" && !remoteVideoActive && (
//             <div className="absolute inset-0 flex items-center justify-center bg-gray-800/80 z-10">
//               <div className="text-center">
//                 <div className="h-20 w-20 mx-auto rounded-full bg-gray-700 flex items-center justify-center">
//                   <User size={32} />
//                 </div>
//                 <p className="mt-2 text-lg">{remoteUserName}</p>
//                 <p className="text-sm text-gray-400">Camera is off</p>
//               </div>
//             </div>
//           )}

//           {/* Local Picture-in-Picture */}
//           {localVideoActive && (
//             <div className="absolute bottom-4 right-4 w-32 h-24 md:w-48 md:h-36 bg-gray-800 rounded-lg overflow-hidden shadow-lg z-20 border-2 border-gray-600">
//               <video
//                 ref={localStreamRef}
//                 autoPlay
//                 playsInline
//                 muted
//                 className="h-full w-full object-cover"
//               />
//               <div className="absolute bottom-1 left-1 text-xs text-white bg-black/50 px-1 rounded">
//                 You
//               </div>
//             </div>
//           )}

//           {/* Controls */}
//           <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 z-20 bg-gray-800/80 px-4 py-2 rounded-full">
//             <button
//               onClick={onToggleMic}
//               className={`rounded-full p-3 transition-colors ${micEnabled ? "bg-gray-600 hover:bg-gray-500" : "bg-red-500 hover:bg-red-600"}`}
//               aria-label={micEnabled ? "Mute microphone" : "Unmute microphone"}
//             >
//               {micEnabled ? (
//                 <Mic size={20} className="text-white" />
//               ) : (
//                 <MicOff size={20} className="text-white" />
//               )}
//             </button>

//             <button
//               onClick={onToggleCamera}
//               className={`rounded-full p-3 transition-colors ${cameraEnabled ? "bg-gray-600 hover:bg-gray-500" : "bg-red-500 hover:bg-red-600"}`}
//               aria-label={cameraEnabled ? "Turn off camera" : "Turn on camera"}
//             >
//               {cameraEnabled ? (
//                 <Camera size={20} className="text-white" />
//               ) : (
//                 <CameraOff size={20} className="text-white" />
//               )}
//             </button>

//             <button
//               onClick={onEndCall}
//               className="rounded-full p-3 bg-red-600 hover:bg-red-700 transition-colors"
//               aria-label="End call"
//             >
//               <Phone size={20} className="text-white" />
//             </button>
//           </div>

//           {/* Status indicators */}
//           <div className="absolute top-4 left-4 z-20 flex items-center space-x-2">
//             <div className={`h-3 w-3 rounded-full ${callStatus === "connected" ? "bg-green-500" : callStatus === "connecting" ? "bg-yellow-500 animate-pulse" : "bg-red-500"}`}></div>
//             <span className="text-sm">
//               {callStatus === "connected" ? "Connected" : callStatus === "connecting" ? "Connecting..." : "Disconnected"}
//             </span>
//           </div>

//           {/* Remote name */}
//           {callStatus === "connected" && (
//             <div className="absolute top-4 right-4 z-20 text-white text-sm bg-black/50 px-2 py-1 rounded">
//               {remoteUserName}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Prescription Panel (Doctor only) */}
//       {isDoctor && (
//         <div className="w-full md:w-5/12 bg-gray-800 p-4 overflow-y-auto">
//           <div className="h-full flex flex-col">
//             <h2 className="text-xl font-semibold mb-4">Patient Prescription</h2>
//             <div className="flex-1">
//               {prescriptionForm || <PrescriptionForm />}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VideoCallLayout;