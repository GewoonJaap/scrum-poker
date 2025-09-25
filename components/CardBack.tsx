import React from 'react';
import { CardCornerIcon } from '../constants';

interface CardBackProps {
    size?: 'small' | 'large';
}

const CardBack: React.FC<CardBackProps> = ({ size = 'small' }) => {
    const sizeClasses = {
        small: {
          container: 'aspect-[3/4] min-h-[140px]',
          logo: 'w-16 h-16',
        },
        large: {
          container: 'w-64 h-80',
          logo: 'w-24 h-24',
        }
    };
    const currentSize = sizeClasses[size];

    return (
        <div
            className={`
                ${currentSize.container}
                w-full h-full
                p-4 rounded-lg shadow-lg
                flex items-center justify-center relative
                bg-slate-700 border-4 border-slate-300
            `}
        >
            <CardCornerIcon className={`${currentSize.logo} text-slate-400 opacity-50`} strokeWidth={2} />
        </div>
    );
};

export default CardBack;
