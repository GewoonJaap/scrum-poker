import React from 'react';
import type { Deck } from '../types';
import { PlusCircle, X } from 'lucide-react';
import { ICON_OPTIONS } from '../constants';

interface NewDeckTemplatePickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectTemplate: (deck?: Deck) => void;
    templateDecks: Record<string, Deck>;
}

const NewDeckTemplatePicker: React.FC<NewDeckTemplatePickerProps> = ({ isOpen, onClose, onSelectTemplate, templateDecks }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-2xl">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">Start a New Deck</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"><X /></button>
                </div>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Start with a blank slate or copy a template to get going faster.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Blank Deck Option */}
                    <button
                        onClick={() => onSelectTemplate()}
                        className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:border-solid hover:border-sky-500 dark:hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-400 transition-all h-full"
                    >
                        <PlusCircle size={32} className="mb-2" />
                        <span className="font-bold">Start from Blank</span>
                    </button>
                    
                    {/* Template Deck Options */}
                    {/* Fix: Explicitly type the 'deck' argument to prevent it from being inferred as 'unknown'. */}
                    {Object.values(templateDecks).map((deck: Deck) => (
                        <button 
                            key={deck.id}
                            onClick={() => onSelectTemplate(deck)}
                            className="bg-slate-50 dark:bg-slate-700/[.5] p-4 rounded-lg text-left hover:ring-2 hover:ring-sky-500 transition-all"
                        >
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 truncate">{deck.name}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{deck.cards.length} cards</p>
                            <div className="flex flex-wrap gap-2">
                                {deck.cards.slice(0, 7).map((card, i) => (
                                    <div key={i} className={`w-6 h-6 rounded-sm flex items-center justify-center text-white font-bold text-xs ${card.color}`}>
                                        {card.emojiIcon ? <span className="text-xs">{card.emojiIcon}</span> : card.iconId ? <div className="w-3 h-3">{React.createElement(ICON_OPTIONS[card.iconId] || 'div')}</div> : card.value.charAt(0)}
                                    </div>
                                ))}
                                {deck.cards.length > 7 && <div className="w-6 h-6 rounded-sm bg-slate-200 dark:bg-slate-700 text-slate-500 text-xs flex items-center justify-center">...</div>}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewDeckTemplatePicker;