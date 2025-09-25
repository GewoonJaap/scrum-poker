import React, { useState, useRef, useEffect } from 'react';
import { Smile, PlusCircle, CornerDownLeft } from 'lucide-react';

interface EmojiReactionPickerProps {
    onEmojiSelect: (emoji: string) => void;
}

const EMOJIS = ['👍', '❤️', '😂', '🎉', '🤔', '👀', '👏', '😢'];

const EmojiReactionPicker: React.FC<EmojiReactionPickerProps> = ({ onEmojiSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<'picker' | 'input'>('picker');
    const [customEmoji, setCustomEmoji] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Close picker when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);
    
     // Focus input when it becomes visible
    useEffect(() => {
        if (view === 'input' && inputRef.current) {
            inputRef.current.focus();
        }
    }, [view]);

    // Reset view when picker is closed
    useEffect(() => {
        if (!isOpen) {
            setView('picker');
            setCustomEmoji('');
        }
    }, [isOpen]);

    const handleSelect = (emoji: string) => {
        onEmojiSelect(emoji);
        setIsOpen(false);
    };

    const handleCustomSubmit = () => {
        if (customEmoji.trim()) {
            onEmojiSelect(customEmoji.trim());
            setIsOpen(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleCustomSubmit();
        }
    };

    return (
        <div ref={wrapperRef} className="relative">
            {isOpen && (
                <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-slate-700 rounded-full shadow-xl flex items-center transition-all duration-200">
                    {view === 'picker' ? (
                        <div className="flex items-center gap-1 p-1">
                            {EMOJIS.map(emoji => (
                                <button
                                    key={emoji}
                                    onClick={() => handleSelect(emoji)}
                                    className="text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                    aria-label={`Send ${emoji} reaction`}
                                >
                                    {emoji}
                                </button>
                            ))}
                             <button
                                onClick={() => setView('input')}
                                className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                aria-label="Send custom emoji"
                                title="Send custom emoji"
                            >
                                <PlusCircle size={24} />
                            </button>
                        </div>
                    ) : (
                         <div className="flex items-center p-1 pl-4 pr-2 h-12 w-40">
                            <input
                                ref={inputRef}
                                type="text"
                                value={customEmoji}
                                onChange={(e) => setCustomEmoji(e.target.value.slice(0, 2))}
                                onKeyDown={handleKeyDown}
                                placeholder="Emoji..."
                                maxLength={2}
                                className="flex-grow bg-transparent focus:outline-none text-center text-lg dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            />
                            <button
                                onClick={handleCustomSubmit}
                                className="p-2 rounded-full text-slate-500 hover:text-sky-500 dark:text-slate-400 dark:hover:text-sky-400 transition-colors"
                                aria-label="Submit custom emoji"
                            >
                                <CornerDownLeft size={20} />
                            </button>
                        </div>
                    )}
                </div>
            )}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-white dark:bg-slate-700 rounded-full shadow-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
                aria-label="Send a reaction"
                title="Send a reaction"
            >
                <Smile size={28} />
            </button>
        </div>
    );
};

export default EmojiReactionPicker;