import React from 'react';
import type { Deck } from '../types';
import { Layers, ChevronDown } from 'lucide-react';

interface DeckSelectorProps {
  decks: Record<string, Deck>;
  currentDeckId: string;
  onChange: (deckId: string) => void;
  isDisabled: boolean;
}

const DeckSelector: React.FC<DeckSelectorProps> = ({ decks, currentDeckId, onChange, isDisabled }) => {
  return (
    <div className="mb-4">
      <label htmlFor="deck-selector" className="flex items-center gap-2 text-sm font-bold text-slate-600 mb-2">
        <Layers size={16} />
        Card Deck
      </label>
      <div className="relative">
        <select
          id="deck-selector"
          value={currentDeckId}
          onChange={(e) => onChange(e.target.value)}
          disabled={isDisabled}
          className="w-full px-3 py-2 pr-8 border border-slate-300 rounded-md bg-white text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-slate-200 disabled:cursor-not-allowed appearance-none"
        >
          {Object.values(decks).map(deck => (
            <option key={deck.id} value={deck.id}>
              {deck.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
            <ChevronDown size={16} />
        </div>
      </div>
      {isDisabled && (
         <p className="text-xs text-slate-500 mt-1">Cannot change deck while a vote is in progress.</p>
      )}
    </div>
  );
};

export default DeckSelector;