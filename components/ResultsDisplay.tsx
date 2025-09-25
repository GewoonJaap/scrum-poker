import React, { useState, useEffect } from 'react';
import type { CardData } from '../types';
import PokerCard from './PokerCard';
import CardBack from './CardBack';
import Confetti from './Confetti';
import Avatar from './Avatar';
import PlayerName from './PlayerName';

interface User {
  id: string;
  name: string;
  vote: CardData | null;
  avatar?: string;
  colorId?: string;
}

interface ResultsDisplayProps {
  users: User[];
}

interface VoteGroup {
    card: CardData;
    users: User[];
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ users }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // --- Data Processing ---

  // 1. Group users by their vote
  const voteGroups = users.reduce((acc, user) => {
    if (user.vote) {
      const voteValue = user.vote.value;
      if (!acc[voteValue]) {
        acc[voteValue] = {
          card: user.vote,
          users: [],
        };
      }
      acc[voteValue].users.push(user);
    }
    return acc;
  }, {} as Record<string, VoteGroup>);

  // 2. Sort the groups for consistent display order
  const getSortableValue = (value: string): number => {
    if (value === '∞') return Infinity;
    if (['☕', '?'].includes(value)) return 1000;
    const num = parseInt(value, 10);
    return isNaN(num) ? 1001 : num;
  };

  // Fix: Explicitly type the arguments of the sort function to prevent them from being inferred as `unknown`.
  const sortedVoteGroups = Object.values(voteGroups).sort((a: VoteGroup, b: VoteGroup) => {
    return getSortableValue(a.card.value) - getSortableValue(b.card.value);
  });
  
  // 3. Check for unanimity
  const votesCast = users.filter(u => u.vote).length;
  const isUnanimous = sortedVoteGroups.length === 1 && votesCast > 1;

  // 4. Calculate the average of numeric votes
  const numericVotes = users
    .map(user => (user.vote ? parseInt(user.vote.value, 10) : NaN))
    .filter(value => !isNaN(value));
    
  const average = numericVotes.length > 0
    ? (numericVotes.reduce((sum, v) => sum + v, 0) / numericVotes.length).toFixed(1)
    : null;

  // --- Animation ---
  
  useEffect(() => {
    const timer = setTimeout(() => setIsFlipped(true), 100);
    return () => clearTimeout(timer);
  }, []);


  return (
    <div className="w-full">
      {isUnanimous && <Confetti />}
      
      <div className="text-center mb-8">
        {isUnanimous ? (
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-bounce">
            UNANIMOUS!
          </h2>
        ) : (
          <h2 className="text-3xl font-bold text-slate-700 dark:text-slate-200">Results</h2>
        )}
      </div>

      {average && !isUnanimous && (
        <div className="text-center mb-8 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md max-w-xs mx-auto">
            <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300">Average Estimate</h3>
            <p className="text-5xl font-bold text-sky-600 dark:text-sky-400 tracking-tight">{average}</p>
        </div>
      )}

      {votesCast > 0 ? (
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-8">
          {/* Fix: Explicitly type the `group` argument to prevent it from being inferred as `unknown`. */}
          {sortedVoteGroups.map((group: VoteGroup, index) => (
            <div key={group.card.value} className="flex flex-col items-center w-[160px]">
              <div className="w-full [perspective:1000px]">
                <div
                  className={`relative w-full transition-transform duration-700 ease-out [transform-style:preserve-3d] ${isFlipped ? '' : '[transform:rotateY(180deg)]'}`}
                  style={{ transitionDelay: `${index * 70}ms` }}
                >
                  <div className="[backface-visibility:hidden]">
                    <div className="relative">
                        <PokerCard card={group.card} isSelected={false} onClick={() => {}} size="small" />
                        <span className="absolute -top-3 -right-3 bg-sky-500 text-white text-base rounded-full h-8 w-8 flex items-center justify-center font-bold border-2 border-white shadow-md">
                            {group.users.length}
                        </span>
                    </div>
                  </div>
                  <div className="absolute top-0 left-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <CardBack size="small" />
                  </div>
                </div>
              </div>
              <div className="mt-3 w-full space-y-1">
                {group.users.map(u => (
                  <div key={u.id} className="flex items-center gap-2 px-2" title={u.name}>
                    <Avatar name={u.name} avatarId={u.avatar} size={20} />
                    <PlayerName name={u.name} colorId={u.colorId} className="text-sm flex-1 text-left" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-slate-500 dark:text-slate-400">No votes were cast.</p>
      )}
    </div>
  );
};

export default ResultsDisplay;