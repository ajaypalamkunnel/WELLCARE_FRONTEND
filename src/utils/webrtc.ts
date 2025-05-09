type SignalingCallbacks = {
    onIceCandidate: (candidate: RTCIceCandidate) => void;
    onTrack: (stream: MediaStream) => void
}

let peerConnection: RTCPeerConnection | null = null
let remoteMediaStream: MediaStream | null = null;


export const getPeerConnection = () => peerConnection

export const createPeerConnection = (callback: SignalingCallbacks) => {


    if (peerConnection) {
        // console.error(" PeerConnection already exists. Reusing the same connection.");
        return peerConnection;
    }

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
    remoteMediaStream = new MediaStream();

    peerConnection.oniceconnectionstatechange = () => {
        console.log("❄️ ICE State:", peerConnection?.iceConnectionState);
    };

    peerConnection.onconnectionstatechange = () => {
        console.log("🔗 Connection State:", peerConnection?.connectionState);
    };



    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            console.log("📡 Sending ICE candidate");
            callback.onIceCandidate(event.candidate)
        }
    }




    peerConnection.ontrack = (event) => {
        console.log("✅ ontrack fired:", event.track.kind);

        if (!remoteMediaStream) {
            remoteMediaStream = new MediaStream();
        }

        remoteMediaStream.addTrack(event.track);

        callback.onTrack(remoteMediaStream); // Call only once full stream is built
    };

    return peerConnection;
}

export const addLocalTrack = (stream: MediaStream) => {
    if (!peerConnection) {
        console.error("❌ No peer connection when trying to add local tracks");
        return;
    }


    console.log("📤 Adding local tracks. Current senders:", peerConnection.getSenders());

    stream.getTracks().forEach((track) => {

        console.log("🎤 Adding local track:", track.kind);
        peerConnection!.addTrack(track, stream)
    })
}

export const createOffer = async () => {
    if (!peerConnection) {
        console.error("❌ Cannot create offer — no peer connection");
        return null;
    }
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer)
    return offer
}

export const createAnswer = async () => {

    if (!peerConnection) {
        console.error("❌ Cannot create answer — no peer connection");
        return;
      }

    const answer = await peerConnection.createAnswer();

    await peerConnection.setLocalDescription(answer)
    return answer

}


export const setRemoteDescription = async (sdp: RTCSessionDescriptionInit) => {
    if (!peerConnection) {
        console.error("❌ No peer connection to set remote description");
        return;
      }
    await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
}

export const addIceCandidate = async (candidate: RTCIceCandidate) => {

    if (!peerConnection) {
        console.error("❌ Cannot add ICE candidate — no peer connection");
        return;
      }
    
    try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        console.log("🧊 ICE candidate added");
    } catch (err) {
        console.error("⚠️ Failed to add ICE candidate:", err);
    }
};

export const closeConnection = () => {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    remoteMediaStream = null
};