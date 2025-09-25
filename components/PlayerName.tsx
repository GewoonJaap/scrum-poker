import React from 'react';
import { NAME_COLORS } from '../constants';

interface PlayerNameProps {
  name: string;
  colorId?: string | null;
  className?: string;
}

const PlayerName: React.FC<PlayerNameProps> = ({ name, colorId, className }) => {
  const color = NAME_COLORS.find(c => c.id === colorId) || NAME_COLORS[0];
  
  return (
    <p
      className={`font-semibold truncate ${color.textClassName} ${className || ''}`}
      title={name}
    >
      {name}
    </p>
  );
};

export default PlayerName;