import { useState, useEffect, useCallback } from 'react';
import type { Deck } from '../types';

export function useDecks(): [Deck[], (deck: Deck) => void, (deck: Deck) => void, (deckId: string) => void] {
    const [decks, setDecks] = useState<Deck[]>([]);

    useEffect(() => {
        try {
            const storedDecks = localStorage.getItem('customDecks');
            if (storedDecks) {
                setDecks(JSON.parse(storedDecks));
            }
        } catch (e) {
            console.error("Failed to parse custom decks from localStorage", e);
            setDecks([]);
        }
    }, []);

    const saveDecks = useCallback((newDecks: Deck[]) => {
        localStorage.setItem('customDecks', JSON.stringify(newDecks));
        setDecks(newDecks);
    }, []);
    
    const addDeck = useCallback((deck: Deck) => {
        setDecks(prevDecks => {
            const newDecks = [...prevDecks, deck];
            localStorage.setItem('customDecks', JSON.stringify(newDecks));
            return newDecks;
        });
    }, []);

    const updateDeck = useCallback((updatedDeck: Deck) => {
        setDecks(prevDecks => {
            const newDecks = prevDecks.map(d => d.id === updatedDeck.id ? updatedDeck : d);
            localStorage.setItem('customDecks', JSON.stringify(newDecks));
            return newDecks;
        });
    }, []);

    const deleteDeck = useCallback((deckId: string) => {
        setDecks(prevDecks => {
            const newDecks = prevDecks.filter(d => d.id !== deckId);
            localStorage.setItem('customDecks', JSON.stringify(newDecks));
            return newDecks;
        });
    }, []);

    return [decks, addDeck, updateDeck, deleteDeck];
}