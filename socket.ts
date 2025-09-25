let ws: WebSocket | null = null;
let userId: string | null = null;

const connectWebSocket = (currentUserId: string) => {
    userId = currentUserId;
    const { pathname } = window.location;
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
        setTimeout(() => connectWebSocket(currentUserId), 1000);
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        ws?.close();
    };
};

export const socket = {
    connect: (currentUserId: string) => {
        if (!ws || ws.readyState === WebSocket.CLOSED) {
            connectWebSocket(currentUserId);
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