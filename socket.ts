let ws: WebSocket | null = null;
let reconnectTimer: number | null = null;
const listeners: ((event: MessageEvent) => void)[] = [];

const connectWebSocket = (currentUserId: string, roomCode: string) => {
    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }
    
    const pathname = `/room/${roomCode}`;
    const workerHost = 'scrum-poker.gewoonjaap.workers.dev';
    const wsUrl = `wss://${workerHost}${pathname}?userId=${currentUserId}`;

    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        console.log('WebSocket connected');
        const userName = localStorage.getItem('userName');
        const userAvatar = localStorage.getItem('userAvatar');
        if (userName) {
            sendMessage({ type: 'setProfile', name: userName, avatar: userAvatar });
        }
    };

    ws.onmessage = (event) => {
        // Forward message to all registered listeners
        listeners.forEach(listener => listener(event));
    };

    ws.onclose = () => {
        console.log('WebSocket disconnected. Reconnecting...');
        ws = null; // Clear the old socket
        reconnectTimer = window.setTimeout(() => connectWebSocket(currentUserId, roomCode), 1500); // Increased delay
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        ws?.close(); // This will trigger onclose and the reconnect logic
    };
};

export const socket = {
    connect: (currentUserId: string, roomCode: string) => {
        if (!ws && !reconnectTimer) { // Only connect if not already connected or attempting to reconnect
            connectWebSocket(currentUserId, roomCode);
        }
    },
    disconnect: () => {
        if (reconnectTimer) {
            clearTimeout(reconnectTimer);
            reconnectTimer = null;
        }
        if (ws) {
            ws.onclose = null; // prevent reconnecting
            ws.close();
            ws = null;
        }
        // Also clear any listeners to prevent memory leaks on disconnect
        listeners.length = 0;
    },
    subscribe: (callback: (event: MessageEvent) => void) => {
        listeners.push(callback);
    },
    unsubscribe: (callback: (event: MessageEvent) => void) => {
        const index = listeners.indexOf(callback);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    },
};

export const sendMessage = (message: object) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
    } else if (ws && ws.readyState === WebSocket.CONNECTING) {
        // Queue the message to be sent once the connection is open
        ws.addEventListener('open', () => {
            ws?.send(JSON.stringify(message));
        }, { once: true });
    }
    else {
        console.error('WebSocket is not connected. Message could not be sent.');
    }
};
