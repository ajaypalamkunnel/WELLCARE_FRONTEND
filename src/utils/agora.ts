import AgoraRTC, {
    IAgoraRTCClient,
    ICameraVideoTrack,
    IMicrophoneAudioTrack,
    IRemoteVideoTrack,
    IRemoteAudioTrack,
    IAgoraRTCRemoteUser
} from "agora-rtc-sdk-ng";

const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID || ""; // Set in .env.local'

// if (!APP_ID) {
//   console.warn("⚠️ Agora APP_ID is missing from environment variables.");
// }


let client: IAgoraRTCClient | null = null;
let localAudioTrack: IMicrophoneAudioTrack | null = null;
let localVideoTrack: ICameraVideoTrack | null = null;

let joined = false; // 🛠️ UPDATED: Guard against multiple joins
let joining = false; // 🛠️ UPDATED: Guard against race condition
const subscribedUsers = new Set<string | number>(); // 🛠️ UPDATED: Prevent duplicate subscriptions

//Initializes the Agora RTC client

export const createAgoraClient = () => {
    if (client) return client;

    client = AgoraRTC.createClient({
        mode: "rtc",
        codec: "vp8",
    });


    return client;
};


// Returns the existing Agora client instance

export const getAgoraClient = () => client;



//Creates and returns local audio and video tracks


export const createLocalTracks = async () => {
    if (localAudioTrack && localVideoTrack) {
        return {
            audioTrack: localAudioTrack,
            videoTrack: localVideoTrack,
        };
    }

    [localAudioTrack, localVideoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();

    return {
        audioTrack: localAudioTrack,
        videoTrack: localVideoTrack,
    };
};



export const joinCall = async ({
    channelName,
    uid,
    token,
    localVideoEl,
    onRemoteTrack,
    onNetworkQuality
}: {
    channelName: string;
    uid: string | number;
    token: string;
    localVideoEl: HTMLVideoElement;
    onRemoteTrack: (user: IAgoraRTCRemoteUser) => void;
    onNetworkQuality?: (uplink: number, downlink: number) => void;
}) => {
    if (!APP_ID) throw new Error("Agora APP_ID is missing");

    if (joined || joining) {
        console.warn("🚫 Already joined or joining Agora");
        return null;
    }
    joining = true;
    client = createAgoraClient();

    client.on("network-quality", (stats) => {
        if (onNetworkQuality) {
            onNetworkQuality(stats.uplinkNetworkQuality, stats.downlinkNetworkQuality);
        }
    });


    // Register remote track handler
    client.on("user-published", async (user, mediaType) => {
        if (subscribedUsers.has(user.uid)) return;

        const MAX_RETRIES = 3;
        for (let i = 0; i < MAX_RETRIES; i++) {
            try {
                await client?.subscribe(user, mediaType);
                subscribedUsers.add(user.uid);
                onRemoteTrack(user);
                console.log("✅ Subscribed to", user.uid);
                break;
            } catch (error) {
                console.warn(`❗ Retry ${i + 1} to subscribe ${user.uid} failed`, error);
                await new Promise((res) => setTimeout(res, 300));
            }
        }
    });

    client.on("user-unpublished", (user) => {
        console.log("🔌 Remote user unpublished:", user.uid);
        subscribedUsers.delete(user.uid);
    });


    await client.join(APP_ID, channelName, token, uid);

    const { audioTrack, videoTrack } = await createLocalTracks();

    // Play local video
    videoTrack.play(localVideoEl);
    // Publish local tracks to Agora
    if (client.localTracks.length === 0) {
        await client.publish([audioTrack, videoTrack]);
        console.log("📡 Published local tracks to Agora channel");
    }

    joined = true; // 🛠️ UPDATED
    joining = false; // 🛠️ UPDATED

    return { audioTrack, videoTrack };
};


export const leaveCall = async () => {
    if (client) {
        await client.unpublish(client.localTracks);
        await client.leave();
        client.removeAllListeners();
        client = null;
    }

    if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
        localAudioTrack = null;
    }

    if (localVideoTrack) {
        localVideoTrack.stop();
        localVideoTrack.close();
        localVideoTrack = null;
    }

    joined = false; // 🛠️ UPDATED
    joining = false; // 🛠️ UPDATED
    subscribedUsers.clear(); // 🛠️ UPDATED

    console.log("👋 Left Agora channel and cleaned up tracks");
};


















// //Stops and cleans up local tracks

// export const cleanupLocalTracks = () => {
//   localAudioTrack?.stop();
//   localAudioTrack?.close();
//   localAudioTrack = null;

//   localVideoTrack?.stop();
//   localVideoTrack?.close();
//   localVideoTrack = null;
// };


// // Destroys the Agora client instance


// export const destroyAgoraClient = async () => {
//   if (client) {
//     await client.leave();
//     client.removeAllListeners();
//     client = null;
//   }

//   cleanupLocalTracks();
// };