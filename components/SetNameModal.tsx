import React, { useState, useEffect } from 'react';
import { AVATAR_STYLES, NAME_COLORS } from '../constants';
import PlayerName from './PlayerName';

interface SetNameModalProps {
    isOpen: boolean;
    onSave: (name: string, avatarId: string, colorId: string) => void;
}

const SetNameModal: React.FC<SetNameModalProps> = ({ isOpen, onSave }) => {
    const [name, setName] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_STYLES[0].id);
    const [selectedColorId, setSelectedColorId] = useState(NAME_COLORS[0].id);

    useEffect(() => {
        if (isOpen) {
            const savedName = localStorage.getItem('userName') || '';
            const savedAvatar = localStorage.getItem('userAvatar') || AVATAR_STYLES[0].id;
            const savedColor = localStorage.getItem('userColor') || NAME_COLORS[0].id;
            setName(savedName);
            setSelectedAvatar(savedAvatar);
            setSelectedColorId(savedColor);
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleSave = () => {
        if (name.trim() && selectedAvatar && selectedColorId) {
            onSave(name.trim(), selectedAvatar, selectedColorId);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-sm">
                <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4">Your Profile</h2>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white text-slate-900 placeholder-slate-400 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400"
                    placeholder="e.g., Jane Doe"
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                />

                <h3 className="text-lg font-bold text-slate-600 dark:text-slate-300 mt-6 mb-3">Choose an Avatar Style</h3>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                    {AVATAR_STYLES.map(avatar => {
                        const isSelected = selectedAvatar === avatar.id;
                        // The seed is now dynamic based on the name input for a live preview.
                        const seed = encodeURIComponent(name.trim() || 'default-user');
                        const previewUrl = `https://api.dicebear.com/8.x/${avatar.id}/svg?seed=${seed}&size=64`;
                        return (
                            <button
                                key={avatar.id}
                                onClick={() => setSelectedAvatar(avatar.id)}
                                className={`
                                    p-1 rounded-full transition-all duration-200 aspect-square
                                    ${isSelected ? 'ring-2 ring-offset-2 ring-sky-500 bg-sky-100 dark:bg-sky-900/[.5]' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}
                                `}
                                aria-label={`Select ${avatar.id} avatar`}
                            >
                                <img src={previewUrl} alt={`${avatar.id} avatar preview`} className="w-full h-full rounded-full" />
                            </button>
                        )
                    })}
                </div>

                 <h3 className="text-lg font-bold text-slate-600 dark:text-slate-300 mt-6 mb-3">Name Color</h3>
                 <div className="bg-slate-100 dark:bg-slate-700/[.5] p-4 rounded-lg text-center mb-4">
                     <PlayerName name={name.trim() || 'Your Name'} colorId={selectedColorId} className="text-2xl" />
                 </div>
                 <div className="grid grid-cols-5 gap-3">
                     {NAME_COLORS.map(color => {
                         const isSelected = selectedColorId === color.id;
                         return (
                            <button
                                key={color.id}
                                onClick={() => setSelectedColorId(color.id)}
                                className={`w-full aspect-square rounded-full transition-all duration-200 ${color.swatchClassName} ${isSelected ? 'ring-2 ring-offset-2 ring-sky-500' : 'hover:scale-110'}`}
                                aria-label={`Select color ${color.name}`}
                                title={color.name}
                                style={{ background: color.swatchClassName.includes('bg-gradient') ? undefined : 'currentColor' }}
                            >
                                {color.id === 'default' && <span className="text-sm font-bold mix-blend-overlay">Aa</span>}
                            </button>
                         )
                     })}
                 </div>

                <button
                    onClick={handleSave}
                    className="w-full mt-8 px-4 py-2 bg-sky-600 text-white font-bold rounded-md hover:bg-sky-700 transition-colors disabled:bg-slate-400"
                    disabled={!name.trim()}
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default SetNameModal;