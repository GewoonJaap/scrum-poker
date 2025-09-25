import React, { useState } from 'react';
import { ArrowLeft, Edit, PlusCircle, Trash2 } from 'lucide-react';
import type { Deck } from '../types';
import ThemeSwitcher from './ThemeSwitcher';
import { useDecks } from '../hooks/useDecks';
import DeckEditorModal from './DeckEditorModal';
import NewDeckTemplatePicker from './NewDeckTemplatePicker'; // Import the new component
import { ICON_OPTIONS, DECKS } from '../constants'; // Import default DECKS

type Theme = 'light' | 'dark' | 'system';

interface DeckBuilderProps {
  onLeave: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const DeckBuilder: React.FC<DeckBuilderProps> = ({ onLeave, theme, setTheme }) => {
    const [decks, addDeck, updateDeck, deleteDeck] = useDecks();
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false); // New state for template picker
    const [editingDeck, setEditingDeck] = useState<Deck | null>(null);

    const handleOpenEditorForNew = () => {
        setIsTemplatePickerOpen(true); // Open the template picker instead of the editor directly
    };

    const handleOpenEditorForEdit = (deck: Deck) => {
        setEditingDeck(deck);
        setIsEditorOpen(true);
    };

    const handleTemplateSelected = (template?: Deck) => {
        if (template) {
            // Create a copy of the template deck with a new ID and modified name
            const newDeck: Deck = {
                ...template,
                id: `custom-${crypto.randomUUID()}`,
                name: `${template.name} (Copy)`,
            };
            setEditingDeck(newDeck);
        } else {
            // User selected "Start from Blank"
            setEditingDeck(null);
        }
        setIsTemplatePickerOpen(false); // Close template picker
        setIsEditorOpen(true);         // Open editor
    };

    const handleSaveDeck = (deck: Deck) => {
        if (editingDeck && decks.some(d => d.id === editingDeck.id)) {
            updateDeck(deck);
        } else {
            addDeck(deck);
        }
        setIsEditorOpen(false);
    };

    const handleDeleteDeck = (deckId: string) => {
        if (window.confirm('Are you sure you want to delete this deck?')) {
            deleteDeck(deckId);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col items-center p-4 sm:p-8 font-sans">
            {isTemplatePickerOpen && (
                <NewDeckTemplatePicker
                    isOpen={isTemplatePickerOpen}
                    onClose={() => setIsTemplatePickerOpen(false)}
                    onSelectTemplate={handleTemplateSelected}
                    templateDecks={DECKS}
                />
            )}
            {isEditorOpen && (
                <DeckEditorModal
                    deck={editingDeck}
                    onSave={handleSaveDeck}
                    onClose={() => setIsEditorOpen(false)}
                />
            )}
            <header className="w-full max-w-4xl mx-auto text-center mb-8 relative">
                <button
                    onClick={onLeave}
                    className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    aria-label="Go back"
                >
                    <ArrowLeft className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                </button>
                <h1 className="text-4xl sm:text-5xl font-bold text-slate-700 dark:text-slate-100">Custom Decks</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Create and manage your own card decks.</p>
                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                    <ThemeSwitcher theme={theme} setTheme={setTheme} />
                </div>
            </header>

            <main className="w-full max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {decks.map(deck => (
                        <div key={deck.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md flex flex-col justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 truncate">{deck.name}</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{deck.cards.length} cards</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {deck.cards.slice(0, 7).map((card, i) => (
                                        <div key={i} className={`w-6 h-6 rounded-sm flex items-center justify-center text-white font-bold text-xs ${card.color}`}>
                                            {card.emojiIcon ? <span className="text-xs">{card.emojiIcon}</span> : card.iconId ? <div className="w-3 h-3">{React.createElement(ICON_OPTIONS[card.iconId] || 'div')}</div> : card.value.charAt(0)}
                                        </div>
                                    ))}
                                    {deck.cards.length > 7 && <div className="w-6 h-6 rounded-sm bg-slate-200 dark:bg-slate-700 text-slate-500 text-xs flex items-center justify-center">...</div>}
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-2">
                                <button onClick={() => handleOpenEditorForEdit(deck)} className="p-2 text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><Edit size={18} /></button>
                                <button onClick={() => handleDeleteDeck(deck.id)} className="p-2 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    ))}
                     <button
                        onClick={handleOpenEditorForNew}
                        className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:border-solid hover:border-sky-500 dark:hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-400 transition-all aspect-square sm:aspect-auto"
                    >
                        <PlusCircle size={32} className="mb-2" />
                        <span className="font-bold">Create New Deck</span>
                    </button>
                </div>
                {decks.length === 0 && (
                     <div className="text-center py-16">
                        <h2 className="text-2xl font-semibold text-slate-600 dark:text-slate-300">No custom decks yet!</h2>
                        <p className="text-slate-500 dark:text-slate-400">Click "Create New Deck" to get started.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default DeckBuilder;