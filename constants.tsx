import React from 'react';
import type { CardData, Deck } from './types';
import {
    MessageSquare,
    Sprout,
    Bird,
    Target,
    Clover,
    Infinity as InfinityIcon, // Alias to avoid keyword conflict
    Coffee,
    HelpCircle,
    Award,
    Sparkles,
    Shirt,
    Zap,
} from 'lucide-react';

// --- Icon Components ---

const CardCornerIcon = Award;

// --- Avatar Data ---
// Using styles from DiceBear v8: https://www.dicebear.com/styles
export const AVATAR_STYLES = [
  { id: 'micah' },
  { id: 'adventurer' },
  { id: 'bottts' },
  { id: 'lorelei' },
  { id: 'fun-emoji' },
  { id: 'identicon' },
  { id: 'thumbs' },
  { id: 'notionists' },
];


// --- Card Deck Data ---

export const DECKS: Record<string, Deck> = {
  fibonacci: {
    id: 'fibonacci',
    name: 'Fibonacci',
    cards: [
      { value: '1', color: 'bg-red-500', icon: MessageSquare },
      { value: '2', color: 'bg-amber-800', icon: Sprout },
      { value: '3', color: 'bg-orange-500', icon: Bird },
      { value: '5', color: 'bg-yellow-500', icon: Target },
      { value: '8', color: 'bg-lime-500', icon: Sparkles },
      { value: '13', color: 'bg-green-500', icon: Clover },
      { value: '20', color: 'bg-rose-500' },
      { value: '40', color: 'bg-fuchsia-600' },
      { value: '100', color: 'bg-purple-600' },
      { value: '∞', color: 'bg-teal-500', icon: InfinityIcon },
      { value: '☕', color: 'bg-sky-600', icon: Coffee },
      { value: '?', color: 'bg-slate-700', icon: HelpCircle },
    ]
  },
  tshirt: {
    id: 'tshirt',
    name: 'T-Shirt Sizes',
    cards: [
        { value: 'XS', color: 'bg-cyan-500', icon: Shirt },
        { value: 'S', color: 'bg-teal-500', icon: Shirt },
        { value: 'M', color: 'bg-green-500', icon: Shirt },
        { value: 'L', color: 'bg-lime-600', icon: Shirt },
        { value: 'XL', color: 'bg-yellow-500', icon: Shirt },
        { value: '?', color: 'bg-slate-700', icon: HelpCircle },
    ]
  },
  caffeine: {
    id: 'caffeine',
    name: 'Caffeine Scale',
    cards: [
        { value: 'Decaf', color: 'bg-stone-500', icon: Coffee },
        { value: 'Tea', color: 'bg-emerald-500', icon: Coffee },
        { value: 'Latte', color: 'bg-amber-700', icon: Coffee },
        { value: 'Espresso', color: 'bg-yellow-500', icon: Zap },
        { value: 'Double', color: 'bg-red-500', icon: Zap },
        { value: '?', color: 'bg-slate-700', icon: HelpCircle },
    ]
  }
};


export { CardCornerIcon };
