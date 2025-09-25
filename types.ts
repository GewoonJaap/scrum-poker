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