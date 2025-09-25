import React, { useState, useEffect } from 'react';
import { CARD_DATA } from './constants';
import PokerCard from './components/PokerCard';
import type { CardData } from './types';
import { socket, sendMessage } from './socket';
import PlayerList from './components/PlayerList';
import ResultsDisplay from './components/ResultsDisplay';
import SetNameModal from './components/SetNameModal';
import { ArrowLeft } from 'lucide-react';
import VotingDisplay from './components/VotingDisplay';
import AnimatingCard from './components/AnimatingCard';

// --- Landing Page Component ---

interface LandingPageProps {
    onNavigateToRoom: (code: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToRoom }) => {
    const [roomCode, setRoomCode] = useState('');

    const generateRoomCode = () => {
        // Generates a 6-character alphanumeric code.
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    const handleCreateRoom = () => {
        const newRoomCode = generateRoomCode();
        onNavigateToRoom(newRoomCode);
    };

    const handleJoinRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (roomCode.trim()) {
            onNavigateToRoom(roomCode.trim().toUpperCase());
        }
    };

    return (
        <div className="min-h-screen bg-[#e0f7fa] flex flex-col items-center justify-center p-4 font-sans">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-slate-700 mb-4">Planning Poker</h1>
                <p className="text-slate-500 mb-8">Estimate tasks with your team, in real-time.</p>

                <button
                    onClick={handleCreateRoom}
                    className="w-full px-4 py-3 bg-sky-600 text-white font-bold rounded-lg shadow-md hover:bg-sky-700 transition-colors text-lg"
                >
                    Create a New Room
                </button>

                <div className="flex items-center my-6">
                    <hr className="flex-grow border-t border-slate-300" />
                    <span className="px-4 text-slate-500 font-semibold">OR</span>
                    <hr className="flex-grow border-t border-slate-300" />
                </div>

                <form onSubmit={handleJoinRoom}>
                    <label htmlFor="room-code" className="sr-only">Enter Room Code</label>
                    <input
                        id="room-code"
                        type="text"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-center uppercase tracking-widest text-lg"
                        placeholder="ENTER CODE"
                        maxLength={6}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full mt-4 px-4 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-colors text-lg"
                    >
                        Join Room
                    </button>
                </form>
            </div>
             <footer className="w-full max-w-5xl mx-auto text-center mt-12 text-slate-500 text-sm">
                <p>Built with React, Cloudflare Workers, and Durable Objects.</p>
            </footer>
        </div>
    );
};


// --- Poker Room Component ---

interface User {
  id: string;
  name: string;
  vote: CardData | null;
}

interface PokerRoomProps {
    roomCode: string;
    onLeave: () => void;
}

const PokerRoom: React.FC<PokerRoomProps> = ({ roomCode, onLeave }) => {
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [animatingCard, setAnimatingCard] = useState<{ card: CardData; rect: DOMRect } | null>(null);

  useEffect(() => {
    let currentUserId = localStorage.getItem('userId');
    if (!currentUserId) {
      currentUserId = crypto.randomUUID();
      localStorage.setItem('userId', currentUserId);
    }
    setUserId(currentUserId);
    
    const name = localStorage.getItem('userName');
    if (!name) {
      setIsNameModalOpen(true);
    }

    socket.connect(currentUserId, roomCode);

    const handleSocketMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === 'state') {
        // Rehydrate user votes with full card data, including the icon component,
        // which is lost during JSON serialization over the WebSocket.
        const rehydratedUsers = data.users.map((user: User) => {
            if (user.vote) {
                const originalCard = CARD_DATA.find(c => c.value === user.vote?.value);
                return { ...user, vote: originalCard || null };
            }
            return user;
        });
        setUsers(rehydratedUsers);
        setRevealed(data.revealed);
      }
    };

    const ws = socket.getWebSocket();
    if (ws) {
      const onOpenHandler = () => {
         ws.addEventListener('message', handleSocketMessage);
      };
      if (ws.readyState === WebSocket.OPEN) {
        onOpenHandler();
      } else {
        ws.addEventListener('open', onOpenHandler);
      }
    }

    return () => {
      if (ws) {
        ws.removeEventListener('message', handleSocketMessage);
      }
      socket.disconnect();
    };
  }, [roomCode]);
  
  const handleSetName = (name: string) => {
      localStorage.setItem('userName', name);
      sendMessage({ type: 'setName', name });
      setIsNameModalOpen(false);
  }

  const handleCardSelect = (card: CardData, element: HTMLElement) => {
    // Prevent starting a new animation while one is in progress
    if (animatingCard) return;

    const rect = element.getBoundingClientRect();
    setAnimatingCard({ card, rect });
    sendMessage({ type: 'vote', card });
  };

  const handleReveal = () => {
    sendMessage({ type: 'reveal' });
  };

  const handleReset = () => {
    sendMessage({ type: 'reset' });
  };

  const handleAnimationEnd = () => {
    setAnimatingCard(null);
  }
  
  const currentUser = users.find(u => u.id === userId);
  const isHost = users.length > 0 && users[0].id === userId;
  const hasVotes = users.some(user => user.vote !== null);

  return (
    <div className="min-h-screen bg-[#e0f7fa] flex flex-col items-center p-4 sm:p-8 font-sans">
      <SetNameModal isOpen={isNameModalOpen} onSave={handleSetName} />
       {animatingCard && (
          <AnimatingCard
            card={animatingCard.card}
            startRect={animatingCard.rect}
            onAnimationEnd={handleAnimationEnd}
          />
       )}
      <header className="w-full max-w-6xl mx-auto text-center mb-8 relative">
        <button 
          onClick={onLeave} 
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-slate-200 transition-colors"
          aria-label="Leave Room"
        >
            <ArrowLeft className="h-6 w-6 text-slate-600" />
        </button>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-700">Planning Poker</h1>
        <p className="text-slate-500">Room: <span className="font-mono bg-slate-200 px-2 py-1 rounded">{roomCode}</span></p>
      </header>

      <main className="w-full max-w-6xl mx-auto flex-grow flex flex-col items-center">
        <div className="w-full flex flex-col md:flex-row gap-8">
            <aside className="md:w-1/4">
                <PlayerList users={users} revealed={revealed} />
                <div className="mt-4 flex flex-col space-y-2">
                   {isHost && (
                       revealed ? (
                           <button onClick={handleReset} className="px-4 py-2 bg-rose-500 text-white font-bold rounded-lg shadow-md hover:bg-rose-600 transition-colors w-full">
                               New Round
                           </button>
                       ) : (
                           <button
                               onClick={handleReveal}
                               disabled={!hasVotes}
                               className="px-4 py-2 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-colors w-full disabled:bg-slate-400 disabled:cursor-not-allowed"
                           >
                               Show Cards
                           </button>
                       )
                   )}
                </div>
            </aside>
            <section className="flex-grow md:w-3/4 min-h-[420px] w-full flex items-center justify-center">
                {revealed ? (
                    <ResultsDisplay users={users} />
                ) : hasVotes ? (
                    <VotingDisplay users={users} />
                ) : (
                    <div className="text-center text-slate-500">
                        <h2 className="text-2xl font-semibold">Select your card</h2>
                        <p>Votes will be revealed by the host.</p>
                    </div>
                )}
            </section>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 sm:gap-6 w-full mt-12">
          {CARD_DATA.map((card) => (
            <PokerCard
              key={card.value}
              card={card}
              isSelected={currentUser?.vote?.value === card.value}
              onClick={handleCardSelect}
            />
          ))}
        </div>
      </main>

      <footer className="w-full max-w-5xl mx-auto text-center mt-12 text-slate-500 text-sm">
        <p>Built with React, Cloudflare Workers, and Durable Objects.</p>
      </footer>
    </div>
  );
};


// --- Main App Component (Router) ---

const App: React.FC = () => {
    const [roomCode, setRoomCode] = useState<string | null>(null);

    // This effect handles potential legacy URLs on first load
    useEffect(() => {
        const path = window.location.pathname;
        const setRoomFromCode = (code: string) => {
            setRoomCode(code.toUpperCase());
            window.history.replaceState({}, '', '/');
        }

        const roomMatch = path.match(/^\/room\/([a-zA-Z0-9]+)/);
        if (roomMatch) {
            setRoomFromCode(roomMatch[1]);
            return;
        }

        const legacyMatch = path.match(/^\/([a-zA-Z0-9-]{6,})$/);
         if (legacyMatch && legacyMatch[1].length >=6 && !path.startsWith('/room/')) {
            setRoomFromCode(legacyMatch[1]);
        }
    }, []);

    const handleNavigateToRoom = (code: string) => {
        setRoomCode(code.toUpperCase());
    };

    const handleLeaveRoom = () => {
        setRoomCode(null);
    };

    if (roomCode) {
        return <PokerRoom roomCode={roomCode} onLeave={handleLeaveRoom} />;
    }
    
    return <LandingPage onNavigateToRoom={handleNavigateToRoom} />;
};

export default App;