// JSDoc type definitions for our data structures

/**
 * @typedef {object} CardData
 * @property {string} value
 * @property {string} color
 * @property {string} [iconId]
 */

/**
 * @typedef {object} Deck
 * @property {string} id
 * @property {string} name
 * @property {CardData[]} cards
 */

/**
 * @typedef {object} User
 * @property {string} id
 * @property {string} name
 * @property {CardData | null} vote
 * @property {string} [avatar]
 * @property {string} [colorId]
 * @property {boolean} [isSpectator]
 */

/**
 * @typedef {object} Session
 * @property {WebSocket} socket
 * @property {string} userId
 */

interface Env {
  POKER_ROOM: DurableObjectNamespace;
}

// A Durable Object's behavior is defined in an exported Javascript class
export class PokerRoom {
  /** @type {Session[]} */
  sessions;
  /** @type {Record<string, User>} */
  users;
  /** @type {string[]} */
  userList;
  /** @type {boolean} */
  revealed;
  /** @type {string} */
  deckId;
  /** @type {Deck | null} */
  activeCustomDeck;
  /** @type {DurableObjectState} */
  state;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.sessions = [];
    this.users = {};
    this.userList = [];
    this.revealed = false;
    this.deckId = 'fibonacci'; // Default deck
    this.activeCustomDeck = null; // Holds the host's selected custom deck
  }

  // The system will call fetch() whenever a client sends a request to this Object.
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const isSpectator = url.searchParams.get("isSpectator") === 'true';

    if (!userId) {
      console.error("Fetch request missing userId");
      return new Response("userId is required", { status: 400 });
    }

    const upgradeHeader = request.headers.get('Upgrade');
    if (!upgradeHeader || upgradeHeader !== 'websocket') {
      return new Response('Expected Upgrade: websocket', { status: 426 });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    await this.handleSession(server, userId, isSpectator);

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  async handleSession(socket: WebSocket, userId: string, isSpectator: boolean): Promise<void> {
    socket.accept();
    this.sessions.push({ socket, userId });
    console.log(`[${this.state.id.toString()}] Accepted WebSocket connection for user: ${userId}${isSpectator ? ' as SPECTATOR' : ''}`);
    
    // Initialize user if not present and add them to the ordered list
    if (!this.users[userId]) {
        this.users[userId] = { id: userId, name: `User ${userId.substring(0, 4)}`, vote: null, avatar: undefined, colorId: 'default', isSpectator };
        this.userList.push(userId);
        console.log(`[${this.state.id.toString()}] Initialized new user: ${JSON.stringify(this.users[userId])}`);
    }

    // Broadcast the current state to all users
    this.broadcastState();

    socket.addEventListener("message", async (msg) => {
        try {
            const data = JSON.parse(msg.data);
            console.log(`[${this.state.id.toString()}] Received message from ${userId}:`, JSON.stringify(data));

            const user = this.users[userId];
            if (!user) {
                console.warn(`[${this.state.id.toString()}] Received message from disconnected user ${userId}. Ignoring.`);
                return;
            }
            
            const hostId = this.userList.find(id => this.users[id] && !this.users[id].isSpectator);
            const isHost = hostId === userId;

            switch (data.type) {
                case 'vote':
                    if (user.isSpectator) {
                        console.warn(`[${this.state.id.toString()}] Spectator user ${userId} attempted to vote. Ignoring.`);
                        return;
                    }
                    user.vote = data.card;
                    this.broadcastState();
                    break;
                case 'reveal':
                    if (isHost) {
                        this.revealed = true;
                        this.broadcastState();
                    } else {
                        console.warn(`[${this.state.id.toString()}] Non-host user ${userId} attempted to reveal.`);
                    }
                    break;
                case 'reset':
                    if (isHost) {
                        this.revealed = false;
                        for (const u of Object.values(this.users)) {
                            u.vote = null;
                        }
                        this.broadcastState();
                    } else {
                        console.warn(`[${this.state.id.toString()}] Non-host user ${userId} attempted to reset.`);
                    }
                    break;
                case 'setProfile':
                    if (data.name) {
                        user.name = data.name;
                    }
                    if ('avatar' in data) {
                        user.avatar = data.avatar || undefined;
                    }
                    if ('colorId' in data) {
                        user.colorId = data.colorId || 'default';
                    }
                    this.broadcastState();
                    break;
                case 'setDeck':
                    if (isHost) {
                        this.deckId = data.deckId;
                        this.activeCustomDeck = null; // A standard deck was chosen, so clear the custom one.
                        // Changing the deck implies a new round.
                        this.revealed = false;
                        for (const u of Object.values(this.users)) {
                            u.vote = null;
                        }
                        this.broadcastState();
                    } else {
                         console.warn(`[${this.state.id.toString()}] Non-host user ${userId} attempted to set deck.`);
                    }
                    break;
                case 'setCustomDeck':
                    if (isHost) {
                        const deck = data.deck;
                        if (deck && deck.id && deck.name && Array.isArray(deck.cards)) {
                            this.activeCustomDeck = deck;
                            this.deckId = deck.id;
                            // Changing the deck implies a new round.
                            this.revealed = false;
                            for (const u of Object.values(this.users)) {
                                u.vote = null;
                            }
                            this.broadcastState();
                        } else {
                             console.warn(`[${this.state.id.toString()}] Invalid custom deck format from host ${userId}.`);
                        }
                    } else {
                        console.warn(`[${this.state.id.toString()}] Non-host user ${userId} attempted to set a custom deck.`);
                    }
                    break;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            console.error(`[${this.state.id.toString()}] Error parsing message or handling event for user ${userId}:`, errorMessage, err);
            socket.send(JSON.stringify({ error: errorMessage }));
        }
    });

    socket.addEventListener("close", (event) => {
        console.log(`[${this.state.id.toString()}] Socket closed for user ${userId}. Code: ${event.code}, Reason: ${event.reason}`);
        this.sessions = this.sessions.filter(s => s.socket !== socket);
        // Only remove user if they have no other open sessions
        if (!this.sessions.some(s => s.userId === userId)) {
          delete this.users[userId];
          this.userList = this.userList.filter(id => id !== userId);
        }
        this.broadcastState();
    });

    socket.addEventListener("error", (event) => {
        console.error(`[${this.state.id.toString()}] Socket error for user ${userId}:`, event);
    });
  }

  broadcastState(message?: string) {
    if (!message) {
      const state = {
        type: 'state',
        // Use the ordered list to build the users array
        users: this.userList.map(id => this.users[id]).filter(Boolean),
        revealed: this.revealed,
        deckId: this.deckId,
        activeCustomDeck: this.activeCustomDeck, // Broadcast the active custom deck
      };
      message = JSON.stringify(state);
    }

    console.log(`[${this.state.id.toString()}] Broadcasting state to ${this.sessions.length} clients`);
    
    const deadSessions: Session[] = [];
    this.sessions.forEach(session => {
      try {
        session.socket.send(message!);
      } catch (e) {
        console.error(`[${this.state.id.toString()}] Failed to send to user ${session.userId}, marking session for removal.`, e);
        deadSessions.push(session);
      }
    });

    if (deadSessions.length > 0) {
      this.sessions = this.sessions.filter(s => !deadSessions.includes(s));
      deadSessions.forEach(s => {
        // Only delete the user if no other active sessions for that user exist.
        const userHasOtherSessions = this.sessions.some(active => active.userId === s.userId);
        if (!userHasOtherSessions) {
          console.log(`[${this.state.id.toString()}] Removing user ${s.userId} due to dead socket.`);
          delete this.users[s.userId];
          this.userList = this.userList.filter(id => id !== s.userId);
        }
      });

      // Since the user list changed, we must broadcast the new state to the remaining clients.
      console.log(`[${this.state.id.toString()}] ${deadSessions.length} sessions were disconnected. Re-broadcasting state.`);
      this.broadcastState(); // Re-call to create and broadcast a fresh state message.
    }
  }
}


export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    const match = path.match(/^\/room\/([a-zA-Z0-9]+)$/);

    if (!match) {
        return new Response("Not Found. Expected URL format: /room/<ROOM_CODE>", { status: 404 });
    }

    const roomCode = match[1].toUpperCase();
    const id = env.POKER_ROOM.idFromName(roomCode);
    const stub = env.POKER_ROOM.get(id);

    return await stub.fetch(request);
  },
} satisfies ExportedHandler<Env>;