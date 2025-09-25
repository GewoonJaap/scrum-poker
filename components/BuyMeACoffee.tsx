import React from 'react';
import { Coffee } from 'lucide-react';

const BuyMeACoffee: React.FC = () => {
    return (
        <a
            href="https://buymeacoffee.com/mrproper"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-slate-800 font-bold rounded-lg shadow-md hover:bg-yellow-500 transition-all duration-200 transform hover:scale-105"
            aria-label="Support the developer by buying them a coffee"
        >
            <Coffee className="w-5 h-5" />
            <span>Buy me a coffee</span>
        </a>
    );
};

export default BuyMeACoffee;
