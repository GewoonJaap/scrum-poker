import React from 'react';
import type { CardData } from '../types';
import { CheckCircle, Circle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  vote: CardData | null;
}

interface PlayerListProps {
  users: User[];
  revealed: boolean;
}

const PlayerList: React.FC<PlayerListProps> = ({ users, revealed }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-slate-700 mb-4">Players ({users.length})</h3>
      <ul className="space-y-3">
        {users.map((user) => (
          <li key={user.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-md">
            <span className="font-semibold text-slate-600">{user.name}</span>
            <div className="flex items-center gap-2">
                {revealed && user.vote && (
                    <span className={`font-bold text-lg px-2 py-1 rounded-md text-white ${user.vote.color}`}>
                        {user.vote.value}
                    </span>
                )}
                {user.vote ? (
                    <CheckCircle className="text-green-500" />
                ) : (
                    <Circle className="text-slate-400" />
                )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;
