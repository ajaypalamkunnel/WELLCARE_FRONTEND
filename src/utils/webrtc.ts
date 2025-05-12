type SignalingCallbacks = {
    onIceCandidate: (candidate: RTCIceCandidate) => void;
    onTrack: (stream: MediaStream) => void
}

let peerConnection: RTCPeerConnection | null = null
let remoteMediaStream: MediaStream | null = null;


export const getPeerConnection = () => peerConnection



export const createPeerConnection = (callback: SignalingCallbacks) => {


      if (peerConnection) {
        console.log(" PeerConnection already exists. Reusing the same connection.");
        return peerConnection;
    }




    const config: RTCConfiguration = {
        iceServers: [
            {
                urls: "stun:stun.relay.metered.ca:80",
            },
            {
                urls: "turn:global.relay.metered.ca:80",
                username: "c47357ce3cd90de0a853d5b9",
                credential: "uuKVKOaioPRl3wQ3",
            },

        ],
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
        console.log("✅ ontrack fired:", event.track.kind, event.streams);

        if (!remoteMediaStream) {
            remoteMediaStream = new MediaStream();
        }

        remoteMediaStream.addTrack(event.track);
        console.log("👀 Remote media stream updated:", remoteMediaStream.getTracks());


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

        const existingSender = peerConnection?.getSenders().find(
            (sender) => sender.track === track
        );
        if (!existingSender) {
            console.log("🎤 Adding local track:", track.kind);
            peerConnection!.addTrack(track, stream);
        } else {
            console.log("⚠️ Track already added:", track.kind);
        }
    })
}

export const createOffer = async () => {
    if (!peerConnection) {
        console.error("❌ Cannot create offer — no peer connection");
        return null;
    }
    const offer = await peerConnection.createOffer();

    await peerConnection.setLocalDescription(offer)
    console.log("📜 SDP Offer:", offer.sdp);
    return offer
}

export const createAnswer = async () => {

    if (!peerConnection) {
        console.error("❌ Cannot create answer — no peer connection");
        return;
    }

    const answer = await peerConnection.createAnswer();

    await peerConnection.setLocalDescription(answer)
    console.log("📜 SDP Answer:", answer.sdp);
    return answer

}


export const setRemoteDescription = async (sdp: RTCSessionDescriptionInit) => {
    if (!peerConnection) {
        console.error("❌ No peer connection to set remote description");
        return;
    }
    await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
    console.log("📥 Remote description set:", sdp);
    processIceCandidateQueue()
}


const iceCandidateQueue: RTCIceCandidate[] = [];

const addIceCandidateInternal = async (candidate: RTCIceCandidate): Promise<void> => {
    if (!peerConnection || !peerConnection.remoteDescription) {
        iceCandidateQueue.push(candidate);
        console.log("Queued ICE candidate:", candidate);
        return;
    }

    try {
        await peerConnection.addIceCandidate(candidate);
        console.log("🧊 ICE candidate added", candidate);
    } catch (err) {
        console.error("⚠️ Failed to add ICE candidate:", err);
    }
};

export const addIceCandidate = addIceCandidateInternal;

// Process queued candidates after setting the remote description
export const processIceCandidateQueue = () => {
    while (iceCandidateQueue.length > 0) {
        const candidate = iceCandidateQueue.shift();
        addIceCandidate(candidate!);
    }
};


export const closeConnection = () => {


    console.log("🔌 Closing peer connection");
    if (peerConnection) {

        // Remove all event listeners
        peerConnection.oniceconnectionstatechange = null;
        peerConnection.onconnectionstatechange = null;
        peerConnection.onicecandidate = null;
        peerConnection.ontrack = null;


        // Stop all senders' tracks
        peerConnection.getSenders().forEach((sender) => {
            if (sender.track) {
                console.log("🛑 Stopping track:", sender.track.kind);
                sender.track.stop();
            }
        });
        peerConnection.close();
        peerConnection = null;
    }

    if (remoteMediaStream) {
        console.log("🧹 Cleaning up remote media stream");
        remoteMediaStream.getTracks().forEach((track) => {
            console.log("🛑 Stopping remote track:", track.kind);
            track.stop();
        });
        remoteMediaStream = null;
    }
};



// ----------------------------------------

