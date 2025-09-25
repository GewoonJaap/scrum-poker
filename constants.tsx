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
    Anchor,
    Bike,
    Bomb,
    Car,
    Diamond,
    Feather,
    Flag,
    Flame,
    Gift,
    Heart,
    Leaf,
    Moon,
    Rocket,
    Star,
    Sun,
    Trophy,
    Turtle,
    Umbrella,
    Wind,
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

// --- Name Color Presets ---
export const NAME_COLORS = [
  { id: 'default', name: 'Default', textClassName: 'text-slate-700 dark:text-slate-300', swatchClassName: 'text-slate-700 dark:text-slate-300' },
  { id: 'sky', name: 'Sky', textClassName: 'font-bold text-sky-600 dark:text-sky-400', swatchClassName: 'text-sky-600 dark:text-sky-400' },
  { id: 'lime', name: 'Lime', textClassName: 'font-bold text-lime-600 dark:text-lime-400', swatchClassName: 'text-lime-600 dark:text-lime-400' },
  { id: 'rose', name: 'Rose', textClassName: 'font-bold text-rose-600 dark:text-rose-400', swatchClassName: 'text-rose-600 dark:text-rose-400' },
  { id: 'amber', name: 'Amber', textClassName: 'font-bold text-amber-600 dark:text-amber-400', swatchClassName: 'text-amber-600 dark:text-amber-400' },
  { id: 'sunset', name: 'Sunset', textClassName: 'font-bold bg-gradient-to-r from-orange-500 to-rose-500 text-transparent bg-clip-text', swatchClassName: 'bg-gradient-to-r from-orange-500 to-rose-500' },
  { id: 'ocean', name: 'Ocean', textClassName: 'font-bold bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text', swatchClassName: 'bg-gradient-to-r from-cyan-500 to-blue-500' },
  { id: 'emerald', name: 'Emerald', textClassName: 'font-bold bg-gradient-to-r from-emerald-500 to-green-600 text-transparent bg-clip-text', swatchClassName: 'bg-gradient-to-r from-emerald-500 to-green-600' },
  { id: 'aurora', name: 'Aurora', textClassName: 'font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 background-animate text-transparent bg-clip-text', swatchClassName: 'bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 background-animate' },
  { id: 'rainbow', name: 'Rainbow', textClassName: 'font-bold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 background-animate text-transparent bg-clip-text', swatchClassName: 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 background-animate' },
];

// --- Icon Options for Deck Builder ---
export const ICON_OPTIONS: Record<string, React.FC<any>> = {
    'MessageSquare': MessageSquare,
    'Sprout': Sprout,
    'Bird': Bird,
    'Target': Target,
    'Clover': Clover,
    'Infinity': InfinityIcon,
    'Coffee': Coffee,
    'HelpCircle': HelpCircle,
    'Award': Award,
    'Sparkles': Sparkles,
    'Shirt': Shirt,
    'Zap': Zap,
    'Anchor': Anchor,
    'Bike': Bike,
    'Bomb': Bomb,
    'Car': Car,
    'Diamond': Diamond,
    'Feather': Feather,
    'Flag': Flag,
    'Flame': Flame,
    'Gift': Gift,
    'Heart': Heart,
    'Leaf': Leaf,
    'Moon': Moon,
    'Rocket': Rocket,
    'Star': Star,
    'Sun': Sun,
    'Trophy': Trophy,
    'Turtle': Turtle,
    'Umbrella': Umbrella,
    'Wind': Wind,
};

// --- Color Options for Deck Builder ---
export const CARD_COLORS = [
    'bg-slate-700', 'bg-red-500', 'bg-orange-500', 'bg-amber-800',
    'bg-yellow-500', 'bg-lime-500', 'bg-green-500', 'bg-emerald-500',
    'bg-teal-500', 'bg-cyan-500', 'bg-sky-600', 'bg-blue-600',
    'bg-indigo-600', 'bg-violet-600', 'bg-purple-600', 'bg-fuchsia-600',
    'bg-pink-600', 'bg-rose-500',
];

// --- Animated Gradient Options for Deck Builder ---
export const CARD_GRADIENTS = [
  { id: 'sunset', name: 'Sunset', classes: 'bg-gradient-to-r from-orange-500 to-rose-500 background-animate' },
  { id: 'ocean', name: 'Ocean', classes: 'bg-gradient-to-r from-cyan-500 to-blue-500 background-animate' },
  { id: 'emerald', name: 'Emerald', classes: 'bg-gradient-to-r from-emerald-500 to-green-600 background-animate' },
  { id: 'aurora', name: 'Aurora', classes: 'bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 background-animate' },
  { id: 'rainbow', name: 'Rainbow', classes: 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 background-animate' },
  { id: 'nebula', name: 'Nebula', classes: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 background-animate' },
  { id: 'sunrise', name: 'Sunrise', classes: 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 background-animate' },
  { id: 'passion', name: 'Passion', classes: 'bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 background-animate' },
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