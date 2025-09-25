import React, { useState, useEffect } from 'react';
import type { Reaction } from '../types';
import Avatar from './Avatar';
import PlayerName from './PlayerName';

interface EmojiReactionProps {
  reaction: Reaction;
}

const EmojiReaction: React.FC<EmojiReactionProps> = ({ reaction }) => {
  const [style, setStyle] = useState<React.CSSProperties>({});
  
  useEffect(() => {
    // Calculate a random position on the screen border
    const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    let top, left, right, bottom;

    switch (side) {
      case 0: // top
        top = `${Math.random() * 5 + 2}%`; // 2-7% from top
        left = `${Math.random() * 80 + 10}%`; // 10-90% from left
        break;
      case 1: // right
        top = `${Math.random() * 80 + 10}%`;
        right = `${Math.random() * 5 + 2}%`;
        break;
      case 2: // bottom
        bottom = `${Math.random() * 20 + 5}%`; // Avoid the card area
        left = `${Math.random() * 80 + 10}%`;
        break;
      case 3: // left
      default:
        top = `${Math.random() * 80 + 10}%`;
        left = `${Math.random() * 5 + 2}%`;
        break;
    }
    
    setStyle({ position: 'absolute', top, left, right, bottom });
  }, []);

  return (
    <div style={style} className="reaction-animate flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-2 rounded-full shadow-lg">
      <Avatar name={reaction.user.name} avatarId={reaction.user.avatar} size={28} />
      <span className="text-2xl">{reaction.emoji}</span>
      <PlayerName name={reaction.user.name} colorId={reaction.user.colorId} className="hidden sm:block" />
    </div>
  );
};

export default EmojiReaction;
