import React, { useState, useRef, useEffect } from 'react';
import { Smile } from 'lucide-react';

interface EmojiReactionPickerProps {
    onEmojiSelect: (emoji: string) => void;
}

const EMOJIS = ['👍', '❤️', '😂', '🎉', '🤔', '👀', '👏', '😢'];

const EmojiReactionPicker: React.FC<EmojiReactionPickerProps> = ({ onEmojiSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

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
    
    const handleSelect = (emoji: string) => {
        onEmojiSelect(emoji);
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className="relative">
            {isOpen && (
                <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-slate-700 p-1 rounded-full shadow-xl flex items-center gap-1">
                    {EMOJIS.map(emoji => (
                        <button
                            key={emoji}
                            onClick={() => handleSelect(emoji)}
                            className="text-2xl p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                            aria-label={`Send ${emoji} reaction`}
                        >
                            {emoji}
                        </button>
                    ))}
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