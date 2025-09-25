import React from 'react';
import type { CardData } from '../types';
import { Circle } from 'lucide-react';
import { CardCornerIcon } from '../constants';
import Avatar from './Avatar';

interface User {
  id: string;
  name: string;
  vote: CardData | null;
  avatar?: string;
}

interface PlayerListProps {
  users: User[];
  revealed: boolean;
}

const PlayerList: React.FC<PlayerListProps> = ({ users, revealed }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4">Players ({users.length})</h3>
      <ul className="space-y-3">
        {users.map((user, index) => (
          <li key={user.id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/[.5] rounded-md">
            <div className="flex items-center gap-3 overflow-hidden">
                <Avatar name={user.name} avatarId={user.avatar} size={32} />
                <div className="flex-grow overflow-hidden">
                    <p className="font-semibold text-slate-700 dark:text-slate-300 truncate" title={user.name}>{user.name}</p>
                    {index === 0 && (
                         <span className="text-xs font-bold text-amber-600 dark:text-amber-500">HOST</span>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2" style={{minWidth: '60px', justifyContent: 'flex-end'}}>
                {(() => {
                    if (revealed && user.vote) {
                        return (
                            <span className={`font-bold text-lg px-2 py-1 rounded-md text-white ${user.vote.color}`}>
                                {user.vote.value}
                            </span>
                        );
                    }
                    if (user.vote) { // Not revealed, but has voted
                        return (
                            <div className="w-8 h-10 bg-slate-700 dark:bg-slate-600 rounded-sm border-2 border-slate-300 dark:border-slate-500 flex items-center justify-center" title="Voted">
                                <CardCornerIcon className="w-4 h-4 text-slate-400 dark:text-slate-300" />
                            </div>
                        );
                    }
                    // Not revealed, has not voted OR revealed, has not voted
                    return <Circle className="text-slate-400 dark:text-slate-500" title="Waiting to vote" />;
                })()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;