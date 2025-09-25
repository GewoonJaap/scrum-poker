import React, { useState, useEffect } from 'react';
import PokerCard from './PokerCard';
import CardBack from './CardBack';
import type { CardData } from '../types';

interface AnimatingCardProps {
    card: CardData;
    startRect: DOMRect;
    onAnimationEnd: () => void;
}

const AnimatingCard: React.FC<AnimatingCardProps> = ({ card, startRect, onAnimationEnd }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    // This useEffect hook triggers the animation shortly after the component mounts.
    useEffect(() => {
        const animationTimer = setTimeout(() => {
            setIsAnimating(true);
        }, 20);

        // This timer calls the onAnimationEnd callback to unmount the component
        // when the CSS transition is expected to be complete.
        const endTimer = setTimeout(onAnimationEnd, 700); // Must match transition duration

        return () => {
            clearTimeout(animationTimer);
            clearTimeout(endTimer);
        };
    }, [onAnimationEnd]);
    
    // Base style for the card at its starting position
    const initialStyle: React.CSSProperties = {
        position: 'fixed',
        left: startRect.left,
        top: startRect.top,
        width: startRect.width,
        height: startRect.height,
        zIndex: 100,
        transition: 'all 0.7s cubic-bezier(0.45, 0.05, 0.55, 0.95)',
    };
    
    // Style for the card at its destination
    const targetStyle: React.CSSProperties = {
        left: `calc(50vw - ${(startRect.width * 0.6) / 2}px)`, // Horizontally centered
        top: '35vh', // Vertically centered in the voting area
        transform: 'scale(0.6)',
        opacity: 1,
    };

    // Apply the target style when isAnimating is true
    const currentStyle = isAnimating ? { ...initialStyle, ...targetStyle } : initialStyle;

    return (
        <div style={currentStyle} className="[perspective:1000px]">
            <div
                className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d]"
                style={{ transform: isAnimating ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            >
                {/* Front of the card */}
                <div className="absolute w-full h-full [backface-visibility:hidden]">
                    <PokerCard card={card} isSelected={false} onClick={() => {}} />
                </div>
                {/* Back of the card */}
                <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <CardBack />
                </div>
            </div>
        </div>
    );
};

export default AnimatingCard;
