import React, { useRef } from 'react';
import type { CardData } from '../types';
import { CardCornerIcon } from '../constants';

interface PokerCardProps {
  card: CardData;
  isSelected: boolean;
  onClick: (card: CardData, element: HTMLDivElement) => void;
  size?: 'small' | 'large';
}

const PokerCard: React.FC<PokerCardProps> = ({ card, isSelected, onClick, size = 'small' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { value, color, icon: Icon, display } = card;

  const sizeClasses = {
    small: {
      container: 'aspect-[3/4] min-h-[140px]',
      mainText: 'text-6xl',
      cornerText: 'text-xl',
      logo: 'w-8 h-8',
      icon: 'w-16 h-16',
    },
    large: {
      container: 'w-64 h-80',
      mainText: 'text-8xl',
      cornerText: 'text-3xl',
      logo: 'w-12 h-12',
      icon: 'w-24 h-24',
    }
  };

  const currentSize = sizeClasses[size];
  
  const clickHandler = () => {
      if (!isSelected && cardRef.current) {
        onClick(card, cardRef.current);
      }
  };

  return (
    <div
      ref={cardRef}
      className={`
        ${color} 
        ${currentSize.container}
        p-2 rounded-lg shadow-lg text-white font-black
        flex flex-col relative
        transition-all duration-300 ease-in-out transform
        ${!isSelected ? 'cursor-pointer hover:scale-105 hover:-translate-y-1 hover:shadow-xl' : 'opacity-80'}
        ${isSelected ? 'ring-4 ring-offset-2 ring-yellow-400 scale-105 ring-offset-slate-100 dark:ring-offset-slate-900' : ''}
      `}
      onClick={clickHandler}
      aria-label={`Planning Poker card with value ${card.value}`}
      role="button"
      tabIndex={isSelected ? -1 : 0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && clickHandler()}
    >
      {/* Top Left Value */}
      <div className={`absolute top-2 left-3 ${currentSize.cornerText}`}>
        {value}
      </div>
      
      {/* Top Right Logo */}
      <div className="absolute top-2 right-2">
        <CardCornerIcon className={`${currentSize.logo} text-white/70`} strokeWidth={2.5} />
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center">
        {display ? (
          React.cloneElement(display as React.ReactElement<{ className?: string; size?: 'small' | 'large' }>, { 
            className: 'w-full',
            size: size
          })
        ) : Icon ? (
          <Icon className={currentSize.icon} strokeWidth={1.5} />
        ) : (
          <span className={currentSize.mainText}>{value}</span>
        )}
      </div>

      {/* Bottom Left Logo */}
      <div className="absolute bottom-2 left-2 transform rotate-180">
        <CardCornerIcon className={`${currentSize.logo} text-white/70`} strokeWidth={2.5} />
      </div>
      
      {/* Bottom Right Value */}
      <div className={`absolute bottom-2 right-3 transform rotate-180 ${currentSize.cornerText}`}>
        {value}
      </div>
    </div>
  );
};

export default PokerCard;