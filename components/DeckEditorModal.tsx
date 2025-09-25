import React, { useState, useEffect } from 'react';
import type { CardData, Deck } from '../types';
import { ICON_OPTIONS, CARD_COLORS, CARD_GRADIENTS } from '../constants';
import PokerCard from './PokerCard';
import { Plus, Trash2, X } from 'lucide-react';

interface DeckEditorModalProps {
    deck: Deck | null;
    onSave: (deck: Deck) => void;
    onClose: () => void;
}

const DeckEditorModal: React.FC<DeckEditorModalProps> = ({ deck, onSave, onClose }) => {
    const [deckName, setDeckName] = useState('');
    const [cards, setCards] = useState<CardData[]>([]);
    const [newCardValue, setNewCardValue] = useState('');
    const [newCardColor, setNewCardColor] = useState(CARD_COLORS[10]);
    const [newCardIconId, setNewCardIconId] = useState<string | null>(null);
    const [newCardEmojiIcon, setNewCardEmojiIcon] = useState('');

    useEffect(() => {
        if (deck) {
            setDeckName(deck.name);
            setCards(deck.cards);
        }
    }, [deck]);

    const handleAddCard = () => {
        if (!newCardValue.trim()) return;
        const newCard: CardData = {
            value: newCardValue.trim(),
            color: newCardColor,
            iconId: newCardIconId || undefined,
            emojiIcon: newCardEmojiIcon || undefined,
        };
        setCards([...cards, newCard]);
        setNewCardValue('');
        setNewCardIconId(null);
        setNewCardEmojiIcon('');
    };

    const handleRemoveCard = (index: number) => {
        setCards(cards.filter((_, i) => i !== index));
    };

    const handleSaveDeck = () => {
        if (!deckName.trim() || cards.length === 0) return;
        const newDeck: Deck = {
            id: deck ? deck.id : `custom-${crypto.randomUUID()}`,
            name: deckName.trim(),
            cards: cards,
        };
        onSave(newDeck);
    };

    const handleEmojiIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const emoji = e.target.value.slice(0, 2); // Limit to handle complex emojis
        setNewCardEmojiIcon(emoji);
        if (emoji) {
            setNewCardIconId(null); // Deselect lucide icon
        }
    };
    
    const handleIconSelect = (id: string | null) => {
        setNewCardIconId(id);
        if (id) {
            setNewCardEmojiIcon(''); // Deselect emoji icon
        }
    };

    const previewCard: CardData = {
        value: newCardValue.trim() || '?',
        color: newCardColor,
        icon: newCardIconId ? ICON_OPTIONS[newCardIconId] : undefined,
        emojiIcon: newCardEmojiIcon || undefined,
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">{deck ? 'Edit Deck' : 'Create New Deck'}</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"><X /></button>
                </div>
                
                <div className="overflow-y-auto pr-2 flex-grow">
                    {/* Deck Name */}
                    <div className="mb-6">
                        <label htmlFor="deck-name" className="block text-lg font-bold text-slate-600 dark:text-slate-300 mb-2">Deck Name</label>
                        <input
                            id="deck-name"
                            type="text"
                            value={deckName}
                            onChange={(e) => setDeckName(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-slate-700 dark:border-slate-600"
                            placeholder="e.g., My Team's Sizes"
                        />
                    </div>

                    {/* Cards List */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-600 dark:text-slate-300 mb-2">Cards in Deck ({cards.length})</h3>
                        <div className="space-y-2">
                            {cards.map((card, i) => (
                                <div key={i} className="flex items-center gap-3 bg-slate-100 dark:bg-slate-700 p-2 rounded-md">
                                    <div className={`w-8 h-10 rounded-sm flex items-center justify-center text-white font-bold text-lg ${card.color}`}>
                                        {card.emojiIcon ? <span>{card.emojiIcon}</span> : card.iconId ? <div className="w-5 h-5">{React.createElement(ICON_OPTIONS[card.iconId] || 'div')}</div> : card.value}
                                    </div>
                                    <span className="font-semibold flex-grow">{card.value}</span>
                                    <button onClick={() => handleRemoveCard(i)} className="p-1 text-slate-500 hover:text-rose-500"><Trash2 size={16} /></button>
                                </div>
                            ))}
                            {cards.length === 0 && <p className="text-slate-500 dark:text-slate-400">Add some cards below to get started.</p>}
                        </div>
                    </div>
                    
                    {/* Add Card Section */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                        <h3 className="text-lg font-bold text-slate-600 dark:text-slate-300 mb-3">Add a Card</h3>
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-grow">
                                <label htmlFor="card-value" className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">Value</label>
                                 <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Appears in corners. Also the default for the center.</p>
                                <input
                                    id="card-value"
                                    type="text"
                                    value={newCardValue}
                                    onChange={(e) => setNewCardValue(e.target.value)}
                                    placeholder="e.g., 8, XL, ☕"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md dark:bg-slate-700 dark:border-slate-600"
                                    onKeyDown={e => e.key === 'Enter' && handleAddCard()}
                                />

                                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-4 mb-1">Center Display (Optional)</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Overrides the value in the center. Pick an emoji OR an icon.</p>
                                
                                <label htmlFor="emoji-icon" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Emoji</label>
                                <input
                                    id="emoji-icon"
                                    type="text"
                                    value={newCardEmojiIcon}
                                    onChange={handleEmojiIconChange}
                                    placeholder="e.g., 🦄"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md dark:bg-slate-700 dark:border-slate-600"
                                    maxLength={2}
                                />
                                
                                <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mt-4 mb-2">Color</label>
                                <div className="grid grid-cols-9 gap-2">
                                    {CARD_COLORS.map(color => (
                                        <button key={color} onClick={() => setNewCardColor(color)} className={`w-full aspect-square rounded-full transition-transform hover:scale-110 ${color} ${newCardColor === color ? 'ring-2 ring-offset-2 ring-sky-500 dark:ring-offset-slate-800' : ''}`} />
                                    ))}
                                </div>
                                
                                <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mt-4 mb-2">Animated Gradients</label>
                                <div className="grid grid-cols-9 gap-2">
                                    {CARD_GRADIENTS.map(gradient => (
                                        <button 
                                            key={gradient.id} 
                                            onClick={() => setNewCardColor(gradient.classes)} 
                                            className={`w-full aspect-square rounded-full transition-transform hover:scale-110 ${gradient.classes} ${newCardColor === gradient.classes ? 'ring-2 ring-offset-2 ring-sky-500 dark:ring-offset-slate-800' : ''}`}
                                            title={gradient.name}
                                        />
                                    ))}
                                </div>
                                
                                <div className="mt-4">
                                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Icon</label>
                                    <div className="p-3 bg-slate-200 dark:bg-slate-700 rounded-md max-h-32 overflow-y-auto">
                                        <div className="grid grid-cols-8 gap-2">
                                             <button onClick={() => handleIconSelect(null)} className={`w-full aspect-square flex items-center justify-center rounded-md transition-colors ${!newCardIconId ? 'bg-sky-500 text-white' : 'bg-white dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500'}`}>
                                                <X size={18} />
                                            </button>
                                            {Object.entries(ICON_OPTIONS).map(([id, Icon]) => (
                                                <button key={id} onClick={() => handleIconSelect(id)} className={`w-full aspect-square flex items-center justify-center rounded-md transition-colors ${newCardIconId === id ? 'bg-sky-500 text-white' : 'bg-white dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500'}`}>
                                                    <Icon />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="flex flex-col items-center gap-4">
                                <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Live Preview</span>
                                <PokerCard card={previewCard} isSelected={false} onClick={() => {}} />
                                <button onClick={handleAddCard} disabled={!newCardValue.trim()} className="w-full px-4 py-2 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 disabled:bg-slate-400 flex items-center justify-center gap-2">
                                    <Plus size={18}/> Add Card
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500">Cancel</button>
                    <button onClick={handleSaveDeck} disabled={!deckName.trim() || cards.length === 0} className="px-4 py-2 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700 disabled:bg-slate-400">Save Deck</button>
                </div>
            </div>
        </div>
    );
};

export default DeckEditorModal;