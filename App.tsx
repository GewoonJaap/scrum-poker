import React, { useState, useEffect, useRef } from 'react';
import { DECKS, ICON_OPTIONS } from './constants';
import type { CardData, Deck, User, Reaction } from './types';
import { socket, sendMessage } from './socket';
import PlayerList from './components/PlayerList';
import ResultsDisplay from './components/ResultsDisplay';
import SetNameModal from './components/SetNameModal';
import { ArrowLeft, Eye } from 'lucide-react';
import VotingDisplay from './components/VotingDisplay';
import AnimatingCard from './components/AnimatingCard';
import DeckSelector from './components/DeckSelector';
import ThemeSwitcher from './components/ThemeSwitcher';
import BuyMeACoffee from './components/BuyMeACoffee';
import DeckBuilder from './components/DeckBuilder';
import PokerCard from './components/PokerCard';
import EmojiReactionPicker from './components/EmojiReactionPicker';
import EmojiReaction from './components/EmojiReaction';

type Theme = 'light' | 'dark' | 'system';
type Page = 'landing' | 'room' | 'deckBuilder';

// --- Landing Page Component ---

interface LandingPageProps {
    onNavigateToRoom: (code: string, isSpectator: boolean) => void;
    onNavigateToDeckBuilder: () => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToRoom, onNavigateToDeckBuilder, theme, setTheme }) => {
    const [roomCode, setRoomCode] = useState('');
    const [isSpectator, setIsSpectator] = useState(false);

    const generateRoomCode = () => {
        // Generates a 6-character code from a specific set to avoid ambiguous characters (e.g., O/0).
        const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    const handleCreateRoom = () => {
        const newRoomCode = generateRoomCode();
        onNavigateToRoom(newRoomCode, isSpectator);
    };

    const handleJoinRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (roomCode.trim()) {
            onNavigateToRoom(roomCode.trim().toUpperCase(), isSpectator);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col items-center justify-center p-4 font-sans relative">
            <div className="absolute top-4 right-4 z-10">
                <ThemeSwitcher theme={theme} setTheme={setTheme} />
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-md text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-slate-700 dark:text-slate-100 mb-4">Planning Poker</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8">Estimate tasks with your team, in real-time.</p>

                <div className="space-y-4">
                    <button
                        onClick={handleCreateRoom}
                        className="w-full px-4 py-3 bg-sky-600 text-white font-bold rounded-lg shadow-md hover:bg-sky-700 transition-colors text-lg"
                    >
                        Create a New Room
                    </button>
                     <button
                        onClick={onNavigateToDeckBuilder}
                        className="w-full px-4 py-3 bg-slate-600 text-white font-bold rounded-lg shadow-md hover:bg-slate-700 transition-colors text-lg"
                    >
                        Custom Decks
                    </button>
                </div>

                <div className="flex items-center my-6">
                    <hr className="flex-grow border-t border-slate-300 dark:border-slate-600" />
                    <span className="px-4 text-slate-500 dark:text-slate-400 font-semibold">OR</span>
                    <hr className="flex-grow border-t border-slate-300 dark:border-slate-600" />
                </div>

                <form onSubmit={handleJoinRoom}>
                    <label htmlFor="room-code" className="sr-only">Enter Room Code</label>
                    <input
                        id="room-code"
                        type="text"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-center uppercase tracking-widest text-lg dark:bg-slate-700 dark:border-slate-500 dark:text-white dark:placeholder-slate-400"
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
                 <div className="mt-6">
                    <label htmlFor="spectator-checkbox" className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300 cursor-pointer">
                        <input
                            type="checkbox"
                            id="spectator-checkbox"
                            checked={isSpectator}
                            onChange={(e) => setIsSpectator(e.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                        />
                        Join as Spectator
                    </label>
                </div>
            </div>
             <footer className="w-full max-w-5xl mx-auto text-center mt-12 text-slate-500 dark:text-slate-400 text-sm flex flex-col items-center gap-4">
                <p>Built with React, Cloudflare Workers, and Durable Objects.</p>
                <BuyMeACoffee />
            </footer>
        </div>
    );
};


// --- Poker Room Component ---

interface ServerState {
    type: 'state';
    users: User[];
    revealed: boolean;
    deckId: string;
    activeCustomDeck?: Deck | null;
}

interface ServerReaction {
    type: 'reaction';
    emoji: string;
    user: User;
}

type ServerMessage = ServerState | ServerReaction;

interface PokerRoomProps {
    roomCode: string;
    onLeave: () => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const PokerRoom: React.FC<PokerRoomProps> = ({ roomCode, onLeave, theme, setTheme }) => {
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [deckId, setDeckId] = useState('fibonacci');
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [animatingCard, setAnimatingCard] = useState<{ card: CardData; rect: DOMRect } | null>(null);
  const [copied, setCopied] = useState(false);
  const [allDecks, setAllDecks] = useState<Record<string, Deck>>(DECKS);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const messageHandlerRef = useRef<(event: MessageEvent) => void>();


  useEffect(() => {
    // This effect runs once to load custom decks from localStorage.
    try {
        const customDecksJSON = localStorage.getItem('customDecks');
        if (customDecksJSON) {
            const customDecks: Deck[] = JSON.parse(customDecksJSON);
            const customDecksRecord: Record<string, Deck> = {};
            customDecks.forEach(deck => {
                // Rehydrate icon components from their stored string IDs.
                const rehydratedCards = deck.cards.map(card => ({
                    ...card,
                    icon: card.iconId ? ICON_OPTIONS[card.iconId] : undefined
                }));
                customDecksRecord[deck.id] = { ...deck, cards: rehydratedCards };
            });
            // Merge default decks with custom decks.
            setAllDecks(prevDecks => ({ ...prevDecks, ...customDecksRecord }));
        }
    } catch (error) {
        console.error("Failed to load or parse custom decks:", error);
    }
  }, []);

  useEffect(() => {
    // This effect gets the user's ID and name on component mount.
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
  }, []);

  // On every render, we update the ref with the latest handler function.
  // This new function will have the latest state in its closure.
  messageHandlerRef.current = (event: MessageEvent) => {
    const data: ServerMessage = JSON.parse(event.data);
    
    if (data.type === 'state') {
        let currentDeckCards: CardData[] = [];
        let deckToUse: Deck | undefined;

        if (data.activeCustomDeck) {
            const rehydratedDeck: Deck = {
                ...data.activeCustomDeck,
                cards: data.activeCustomDeck.cards.map(card => ({
                    ...card,
                    icon: card.iconId ? ICON_OPTIONS[card.iconId] : undefined
                }))
            };
            setAllDecks(prev => ({ ...prev, [rehydratedDeck.id]: rehydratedDeck }));
            deckToUse = rehydratedDeck;
        } else {
            deckToUse = allDecks[data.deckId];
        }

        currentDeckCards = deckToUse?.cards || DECKS.fibonacci.cards;
      
        const rehydratedUsers = data.users.map((user: User) => {
            if (user.vote) {
                const originalCard = currentDeckCards.find(c => c.value === user.vote?.value);
                return { ...user, vote: originalCard || null };
            }
            return user;
        });
        setUsers(rehydratedUsers);
        setRevealed(data.revealed);
        setDeckId(data.deckId);
    } else if (data.type === 'reaction') {
        const newReaction: Reaction = {
            id: crypto.randomUUID(),
            emoji: data.emoji,
            user: data.user,
        };
        setReactions(currentReactions => [...currentReactions, newReaction]);
        // Remove the reaction after its animation finishes
        setTimeout(() => {
            setReactions(currentReactions => currentReactions.filter(r => r.id !== newReaction.id));
        }, 4000); // Must match CSS animation duration
    }
  };


  useEffect(() => {
    // This effect manages the WebSocket connection lifecycle.
    if (!userId) return;
    
    const isSpectator = localStorage.getItem('isSpectator') === 'true';

    const handleSocketMessage = (event: MessageEvent) => {
        messageHandlerRef.current?.(event);
    };

    socket.connect(userId, roomCode, isSpectator);
    socket.subscribe(handleSocketMessage);

    return () => {
      socket.unsubscribe(handleSocketMessage);
      socket.disconnect();
    };
  }, [roomCode, userId]);
  
  const handleSaveProfile = (name: string, avatarId: string, colorId: string) => {
      localStorage.setItem('userName', name);
      localStorage.setItem('userAvatar', avatarId);
      localStorage.setItem('userColor', colorId);
      sendMessage({ type: 'setProfile', name, avatar: avatarId, colorId });
      setIsNameModalOpen(false);
  }

  const handleCardSelect = (card: CardData, element: HTMLElement) => {
    if (animatingCard) return;
    const rect = element.getBoundingClientRect();
    setAnimatingCard({ card, rect });
    sendMessage({ type: 'vote', card });
  };
  
  const handleDeckChange = (newDeckId: string) => {
    const selectedDeck = allDecks[newDeckId];
    if (selectedDeck && selectedDeck.id.startsWith('custom-')) {
        const transportableDeck = {
            ...selectedDeck,
            cards: selectedDeck.cards.map(({ icon, ...rest }) => rest)
        };
        sendMessage({ type: 'setCustomDeck', deck: transportableDeck });
    } else {
        sendMessage({ type: 'setDeck', deckId: newDeckId });
    }
  };

  const handleReveal = () => sendMessage({ type: 'reveal' });
  const handleReset = () => sendMessage({ type: 'reset' });
  const handleAnimationEnd = () => setAnimatingCard(null);
  const handleEmojiSelect = (emoji: string) => sendMessage({ type: 'reaction', emoji });

  const handleCopyCode = () => {
      navigator.clipboard.writeText(roomCode).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      }).catch(err => {
          console.error('Failed to copy room code: ', err);
      });
  };
  
  const currentUser = users.find(u => u.id === userId);
  const players = users.filter(u => !u.isSpectator);
  const host = users.find(u => !u.isSpectator);
  const isHost = host ? host.id === userId : false;
  const hasVotes = players.some(user => user.vote !== null);
  const cardsToDisplay = allDecks[deckId]?.cards || DECKS.fibonacci.cards;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col items-center p-4 sm:p-8 font-sans">
      <SetNameModal isOpen={isNameModalOpen} onSave={handleSaveProfile} />
       {animatingCard && (
          <AnimatingCard
            card={animatingCard.card}
            startRect={animatingCard.rect}
            onAnimationEnd={handleAnimationEnd}
          />
       )}
      <div className="fixed inset-0 pointer-events-none z-[60]">
        {reactions.map(reaction => (
          <EmojiReaction key={reaction.id} reaction={reaction} />
        ))}
      </div>
      <header className="w-full max-w-6xl mx-auto text-center mb-4 relative">
        <button 
          onClick={onLeave} 
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label="Leave Room"
        >
            <ArrowLeft className="h-6 w-6 text-slate-600 dark:text-slate-400" />
        </button>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-700 dark:text-slate-100">Planning Poker</h1>
        <p className="text-slate-500 dark:text-slate-400">
            Room:
            <button 
                onClick={handleCopyCode}
                className="font-mono bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded ml-2 transition-colors hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
                title="Click to copy room code"
            >
                {copied ? 'Copied!' : roomCode}
            </button>
        </p>
         <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <ThemeSwitcher theme={theme} setTheme={setTheme} />
        </div>
      </header>
       {currentUser?.isSpectator && (
          <div className="w-full max-w-6xl mx-auto mb-4 p-3 bg-sky-100 dark:bg-sky-900/50 border border-sky-200 dark:border-sky-800 rounded-lg text-center flex items-center justify-center gap-2">
              <Eye className="h-5 w-5 text-sky-600 dark:text-sky-300" />
              <p className="font-semibold text-sky-700 dark:text-sky-300">You are in spectator mode. You can watch but not vote.</p>
          </div>
       )}

      <main className="w-full max-w-6xl mx-auto flex-grow flex flex-col items-center relative">
        <div className="w-full flex flex-col md:flex-row gap-8">
            <aside className="md:w-1/4">
                <PlayerList users={users} revealed={revealed} />
                <div className="mt-4 flex flex-col space-y-2">
                    {isHost && (
                        <DeckSelector
                          decks={allDecks}
                          currentDeckId={deckId}
                          onChange={handleDeckChange}
                          isDisabled={hasVotes && !revealed}
                        />
                    )}
                   <button
                        onClick={() => setIsNameModalOpen(true)}
                        className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg shadow-sm hover:bg-slate-300 transition-colors w-full dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                    >
                        Edit Profile
                    </button>
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
                    <ResultsDisplay users={players} />
                ) : hasVotes ? (
                    <VotingDisplay users={players} />
                ) : (
                    <div className="text-center text-slate-500 dark:text-slate-400">
                        <h2 className="text-2xl font-semibold dark:text-slate-200">
                            {currentUser?.isSpectator ? "Waiting for players to vote..." : "Select your card"}
                        </h2>
                        <p>Votes will be revealed by the host.</p>
                    </div>
                )}
            </section>
        </div>

        {!currentUser?.isSpectator && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 sm:gap-6 w-full mt-12">
            {cardsToDisplay.map((card) => (
                <PokerCard
                key={card.value}
                card={card}
                isSelected={currentUser?.vote?.value === card.value}
                onClick={handleCardSelect}
                />
            ))}
            </div>
        )}
        <div className="fixed bottom-8 right-8 z-40">
            <EmojiReactionPicker onEmojiSelect={handleEmojiSelect} />
        </div>
      </main>

      <footer className="w-full max-w-5xl mx-auto text-center mt-12 text-slate-500 dark:text-slate-400 text-sm flex flex-col items-center gap-4">
        <p>Built with React, Cloudflare Workers, and Durable Objects.</p>
        <BuyMeACoffee />
      </footer>
    </div>
  );
};


// --- Main App Component (Router) ---

const App: React.FC = () => {
    const [page, setPage] = useState<Page>('landing');
    const [roomCode, setRoomCode] = useState<string | null>(null);
    const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'system');

    useEffect(() => {
        const root = window.document.documentElement;
        const isDark =
            theme === 'dark' ||
            (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

        root.classList.toggle('dark', isDark);
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    // Listen for system theme changes to update instantly if 'system' is selected
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                const root = window.document.documentElement;
                root.classList.toggle('dark', mediaQuery.matches);
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    // This effect handles potential legacy URLs on first load
    useEffect(() => {
        const path = window.location.pathname;
        const setRoomFromCode = (code: string) => {
            setRoomCode(code.toUpperCase());
            setPage('room');
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

    const handleNavigateToRoom = (code: string, isSpectator: boolean) => {
        localStorage.setItem('isSpectator', isSpectator ? 'true' : 'false');
        setRoomCode(code.toUpperCase());
        setPage('room');
    };

    const handleLeaveRoom = () => {
        setRoomCode(null);
        setPage('landing');
    };
    
    const handleNavigateToDeckBuilder = () => {
        setPage('deckBuilder');
    };

    const handleLeaveDeckBuilder = () => {
        setPage('landing');
    };

    if (page === 'room' && roomCode) {
        return <PokerRoom roomCode={roomCode} onLeave={handleLeaveRoom} theme={theme} setTheme={setTheme} />;
    }
    
    if (page === 'deckBuilder') {
        return <DeckBuilder onLeave={handleLeaveDeckBuilder} theme={theme} setTheme={setTheme} />;
    }
    
    return <LandingPage onNavigateToRoom={handleNavigateToRoom} onNavigateToDeckBuilder={handleNavigateToDeckBuilder} theme={theme} setTheme={setTheme} />;
};

export default App;