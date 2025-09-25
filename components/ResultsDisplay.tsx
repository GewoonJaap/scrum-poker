import React, { useState, useEffect } from 'react';
import type { CardData } from '../types';
import PokerCard from './PokerCard';
import CardBack from './CardBack';

interface User {
  id: string;
  name: string;
  vote: CardData | null;
}

interface ResultsDisplayProps {
  users: User[];
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ users }) => {
  const votes = users.filter(u => u.vote);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    // Add a small delay to ensure the transition is visible on mount
    const timer = setTimeout(() => {
      setIsFlipped(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full">
        <h2 className="text-2xl font-semibold text-center text-slate-700 mb-6">Results</h2>
        {votes.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {votes.map((user, index) => (
                    user.vote && (
                        <div key={user.id} className="flex flex-col items-center">
                            <div className="w-full [perspective:1000px]">
                                <div
                                    className={`relative w-full transition-transform duration-700 ease-out [transform-style:preserve-3d] ${isFlipped ? '' : '[transform:rotateY(180deg)]'}`}
                                    style={{ transitionDelay: `${index * 50}ms` }}
                                >
                                    <div className="[backface-visibility:hidden]">
                                        <PokerCard card={user.vote} isSelected={false} onClick={() => {}} size="small" />
                                    </div>
                                    <div
                                        className="absolute top-0 left-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]"
                                    >
                                        <CardBack size="small" />
                                    </div>
                                </div>
                            </div>
                            <p className="mt-2 font-semibold text-slate-600">{user.name}</p>
                        </div>
                    )
                ))}
            </div>
        ) : (
            <p className="text-center text-slate-500">No votes were cast.</p>
        )}
    </div>
  );
};

export default ResultsDisplay;
