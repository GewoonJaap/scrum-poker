import React, { useState } from 'react';

interface SetNameModalProps {
    isOpen: boolean;
    onSave: (name: string) => void;
}

const SetNameModal: React.FC<SetNameModalProps> = ({ isOpen, onSave }) => {
    const [name, setName] = useState('');

    if (!isOpen) {
        return null;
    }

    const handleSave = () => {
        if (name.trim()) {
            onSave(name.trim());
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
                <h2 className="text-2xl font-bold text-slate-700 mb-4">Enter Your Name</h2>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    placeholder="e.g., Jane Doe"
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                />
                <button
                    onClick={handleSave}
                    className="w-full mt-4 px-4 py-2 bg-sky-600 text-white font-bold rounded-md hover:bg-sky-700 transition-colors"
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default SetNameModal;
