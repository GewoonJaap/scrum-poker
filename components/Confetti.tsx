import React from 'react';

const CONFETTI_COUNT = 120; // Slightly reduced for performance with more complex paths
const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef'];

interface ConfettiPieceProps {
  corner: 'left' | 'right';
}

const ConfettiPiece: React.FC<ConfettiPieceProps> = ({ corner }) => {
    const isLeft = corner === 'left';

    // Trajectory: from a bottom corner, upwards and towards the opposite side.
    // X-axis: move towards the opposite side of the screen.
    const xEnd = isLeft 
        ? `${Math.random() * 50 + 40}vw`  // Move right 40-90vw
        : `${(Math.random() * -50) - 40}vw`; // Move left 40-90vw
    
    // Y-axis: move up, most will go off-screen at the top.
    const yEnd = `${(Math.random() * -80) - 30}vh`; // Move up 30-110vh

    // Fix: Cast style object to allow for custom CSS properties (e.g., --x-end), which are not in React.CSSProperties.
    const style = {
        '--x-end': xEnd,
        '--y-end': yEnd,
        '--rotation-start': `${Math.random() * 360}deg`,
        '--rotation-end': `${Math.random() * 1080 + 720}deg`, // More spin for a burst effect
        animationName: 'confetti-burst',
        animationDuration: `${Math.random() * 1.5 + 2.5}s`, // 2.5s to 4s duration
        animationDelay: `${Math.random() * 0.2}s`, // Staggered start
        animationTimingFunction: 'cubic-bezier(0.17, 0.88, 0.32, 1.28)', // A fun, overshooting ease
        animationFillMode: 'forwards',
        backgroundColor: COLORS[Math.floor(Math.random() * COLORS.length)],
        position: 'absolute',
        ...(isLeft ? { left: '5%' } : { right: '5%' }),
        bottom: '-10%', // Start from just below the viewport
        width: `${Math.floor(Math.random() * 10) + 8}px`,
        height: `${Math.floor(Math.random() * 6) + 5}px`,
        opacity: 0, // Starts transparent, animation brings it to life
    } as any;

    return <div style={style} />;
};


const Confetti: React.FC = () => {
    return (
        <div className="fixed inset-0 w-full h-full pointer-events-none z-50 overflow-hidden">
            {Array.from({ length: CONFETTI_COUNT / 2 }).map((_, index) => (
                <ConfettiPiece key={`left-${index}`} corner="left" />
            ))}
            {Array.from({ length: CONFETTI_COUNT / 2 }).map((_, index) => (
                <ConfettiPiece key={`right-${index}`} corner="right" />
            ))}
        </div>
    );
};

export default Confetti;
