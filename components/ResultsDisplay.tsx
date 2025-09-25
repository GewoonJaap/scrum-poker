import React from 'react';
import type { CardData } from '../types';
import PokerCard from './PokerCard';

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

  return (
    <div className="w-full">
        <h2 className="text-2xl font-semibold text-center text-slate-700 mb-6">Results</h2>
        {votes.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {votes.map((user) => (
                    user.vote && (
                        <div key={user.id} className="flex flex-col items-center">
                            <PokerCard card={user.vote} isSelected={false} onClick={() => {}} size="small" />
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
