import React from 'react';
import type { CardData } from '../types';
import CardBack from './CardBack';

interface User {
  id: string;
  name: string;
  vote: CardData | null;
}

interface VotingDisplayProps {
  users: User[];
}

const VotingDisplay: React.FC<VotingDisplayProps> = ({ users }) => {
  const votes = users.filter(u => u.vote);

  return (
    <div className="w-full">
        <h2 className="text-2xl font-semibold text-center text-slate-700 mb-2">Votes are in!</h2>
        <p className="text-slate-500 text-center mb-6">Waiting for the host to reveal the cards.</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {votes.map((user) => (
                <div key={user.id} className="flex flex-col items-center">
                    <CardBack size="small" />
                    <p className="mt-2 font-semibold text-slate-600">{user.name}</p>
                </div>
            ))}
        </div>
    </div>
  );
};

export default VotingDisplay;
