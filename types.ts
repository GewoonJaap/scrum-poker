import type React from 'react';

export interface CardData {
  value: string;
  color: string;
  textColor?: string;
  // Fix: Widened the type for `icon` to include `strokeWidth` to support props from lucide-react icons.
  icon?: React.FC<{ className?: string; strokeWidth?: number; }>;
  iconId?: string;
  emojiIcon?: string;
  display?: React.ReactNode;
}

export interface Deck {
  id: string;
  name: string;
  cards: CardData[];
}

export interface User {
  id: string;
  name: string;
  vote: CardData | null;
  avatar?: string;
  colorId?: string;
  isSpectator?: boolean;
}

export interface Reaction {
  id: string;
  emoji: string;
  user: User;
}