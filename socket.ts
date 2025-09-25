
let ws: WebSocket | null = null;
let userId: string | null = null;

const connectWebSocket = (currentUserId: string, roomCode: string) => {
    userId = currentUserId;
    const pathname = `/room/${roomCode}`;
    const workerHost = 'scrum-poker.gewoonjaap.workers.dev';
    const wsUrl = `wss://${workerHost}${pathname}?userId=${userId}`;

    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        console.log('WebSocket connected');
        const userName = localStorage.getItem('userName');
        if (userName) {
            sendMessage({ type: 'setName', name: userName });
        }
    };

    ws.onclose = () => {
        console.log('WebSocket disconnected. Reconnecting...');
        setTimeout(() => connectWebSocket(currentUserId, roomCode), 1000);
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        ws?.close();
    };
};

export const socket = {
    connect: (currentUserId: string, roomCode: string) => {
        if (!ws || ws.readyState === WebSocket.CLOSED) {
            connectWebSocket(currentUserId, roomCode);
        }
    },
    disconnect: () => {
        if (ws) {
            ws.onclose = null; // prevent reconnecting
            ws.close();
            ws = null;
        }
    },
    getWebSocket: () => ws,
};

export const sendMessage = (message: object) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
    } else {
        console.error('WebSocket is not connected.');
    }
};
