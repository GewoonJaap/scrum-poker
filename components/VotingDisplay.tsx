import React from 'react';
import type { CardData } from '../types';
import CardBack from './CardBack';
import Avatar from './Avatar';

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
                    <div className="mt-2 flex items-center gap-2 w-full justify-center px-1" title={user.name}>
                        <Avatar name={user.name} size={24} />
                        <p className="font-semibold text-slate-600 truncate">{user.name}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default VotingDisplay;
