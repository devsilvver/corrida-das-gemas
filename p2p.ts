export type P2PMessage = {
    type: string;
    payload?: any;
};

let peerConnection: RTCPeerConnection | null = null;
let dataChannel: RTCDataChannel | null = null;
let onMessageCallback: ((message: P2PMessage) => void) | null = null;
let onConnectionStateChangeCallback: ((state: 'open' | 'closed') => void) | null = null;

const configuration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

export const p2pService = {
    isHost: false,

    async createLobby(): Promise<string> {
        this.isHost = true;
        peerConnection = new RTCPeerConnection(configuration);

        dataChannel = peerConnection.createDataChannel('gameDataChannel');
        this._setupDataChannel();

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        return new Promise<string>((resolve) => {
            peerConnection!.onicegatheringstatechange = () => {
                if (peerConnection!.iceGatheringState === 'complete') {
                    resolve(JSON.stringify(peerConnection!.localDescription));
                }
            };
            if (peerConnection!.iceGatheringState === 'complete') {
                resolve(JSON.stringify(peerConnection!.localDescription));
            }
        });
    },

    async joinLobby(offerString: string): Promise<string> {
        this.isHost = false;
        peerConnection = new RTCPeerConnection(configuration);

        peerConnection.ondatachannel = event => {
            dataChannel = event.channel;
            this._setupDataChannel();
        };

        const offer = JSON.parse(offerString);
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        
        return new Promise<string>((resolve) => {
            peerConnection!.onicegatheringstatechange = () => {
                if (peerConnection!.iceGatheringState === 'complete') {
                    resolve(JSON.stringify(peerConnection!.localDescription));
                }
            };
             if (peerConnection!.iceGatheringState === 'complete') {
                resolve(JSON.stringify(peerConnection!.localDescription));
            }
        });
    },

    async acceptAnswer(answerString: string) {
        if (!peerConnection) return;
        const answer = JSON.parse(answerString);
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    },

    _setupDataChannel() {
        if (!dataChannel) return;
        dataChannel.onopen = () => {
            console.log('Data channel is open');
            onConnectionStateChangeCallback?.('open');
        };
        dataChannel.onclose = () => {
            console.log('Data channel is closed');
            onConnectionStateChangeCallback?.('closed');
        };
        dataChannel.onmessage = event => {
            if (onMessageCallback) {
                try {
                    const message = JSON.parse(event.data);
                    onMessageCallback(message);
                } catch (e) {
                    console.error("Failed to parse message", e);
                }
            }
        };
    },

    sendMessage(message: P2PMessage) {
        if (dataChannel?.readyState === 'open') {
            dataChannel.send(JSON.stringify(message));
        } else {
            console.warn('Cannot send message, data channel is not open.');
        }
    },

    onMessage(callback: (message: P2PMessage) => void) {
        onMessageCallback = callback;
    },

    onConnectionStateChange(callback: (state: 'open' | 'closed') => void) {
        onConnectionStateChangeCallback = callback;
    },
    
    closeConnection() {
        dataChannel?.close();
        peerConnection?.close();
        peerConnection = null;
        dataChannel = null;
        onMessageCallback = null;
        onConnectionStateChangeCallback = null;
        this.isHost = false;
    }
};
