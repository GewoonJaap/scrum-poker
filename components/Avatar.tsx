import React from 'react';

// A simple hashing function to get a number from a string.
const hashCode = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// A curated list of pleasant, non-jarring colors.
const AVATAR_COLORS = [
  '#ef4444', // red-500
  '#f97316', // orange-500
  '#eab308', // yellow-500
  '#84cc16', // lime-500
  '#22c55e', // green-500
  '#14b8a6', // teal-500
  '#06b6d4', // cyan-500
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#d946ef', // fuchsia-500
];

interface AvatarProps {
  name: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ name, size = 32 }) => {
  if (!name) {
    // Return a placeholder or default avatar if name is not provided
    return (
      <div
        className="rounded-full bg-slate-300 flex items-center justify-center flex-shrink-0"
        style={{ width: size, height: size }}
        aria-label="User Avatar"
      >
      </div>
    );
  }
  
  const initial = name.charAt(0).toUpperCase();
  const colorIndex = hashCode(name) % AVATAR_COLORS.length;
  const backgroundColor = AVATAR_COLORS[colorIndex];
  
  return (
    <div
        className="rounded-full flex items-center justify-center flex-shrink-0"
        style={{ width: size, height: size, backgroundColor }}
        title={name}
        aria-label={`Avatar for ${name}`}
    >
      <span
        className="text-white font-bold"
        style={{ fontSize: size * 0.5 }}
      >
        {initial}
      </span>
    </div>
  );
};

export default Avatar;
