type SignalingCallbacks = {
    onIceCandidate: (candidate: RTCIceCandidate) => void;
    onTrack: (stream: MediaStream) => void
}

let peerConnection: RTCPeerConnection | null = null


export const getPeerConnection = () => peerConnection


export const createPeerConnection = (callback: SignalingCallbacks) => {
    const config: RTCConfiguration = {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          {
            urls: "turn:relay.metered.ca:80",
            username: "demo",
            credential: "demo"
          }
        ]
      };


    peerConnection = new RTCPeerConnection(config)



    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            console.log("📡 Sending ICE candidate");
            callback.onIceCandidate(event.candidate)
        }
    }


    let remoteMediaStream = new MediaStream(); // 🔥 Persistent stream outside the handler

    peerConnection.ontrack = (event) => {
        console.log("✅ ontrack fired:", event.track.kind);

        // Add only the new track to the existing stream
        remoteMediaStream.addTrack(event.track); // 🔥 Append instead of replace

        callback.onTrack(remoteMediaStream); // Call only once full stream is built
    };

    return peerConnection;
}

export const addLocalTrack = (stream: MediaStream) => {
    if (!peerConnection) return;

    const senders = peerConnection.getSenders();
  console.log("📤 Adding local tracks. Current senders:", senders);

    stream.getTracks().forEach((track) => {

        console.log("🎤 Adding local track:", track.kind);
        peerConnection!.addTrack(track, stream)
    })
}

export const createOffer = async () => {
    if (!peerConnection) return null
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer)
    return offer
}

export const createAnswer = async () => {

    if (!peerConnection) return

    const answer = await peerConnection.createAnswer();

    await peerConnection.setLocalDescription(answer)
    return answer

}


export const setRemoteDescription = async (sdp: RTCSessionDescriptionInit) => {
    if (!peerConnection) return
    await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
}

export const addIceCandidate = async (candidate: RTCIceCandidate) => {
    if (!peerConnection) return;
    try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        console.log("🧊 ICE candidate added");
    } catch (err) {
        console.warn("⚠️ Failed to add ICE candidate:", err);
    }
};

export const closeConnection = () => {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
};