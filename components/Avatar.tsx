import React from 'react';

interface AvatarProps {
  name: string;
  avatarId?: string | null;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ name, avatarId, size = 32 }) => {
  // Use the provided avatarId or a friendly default style
  const style = avatarId || 'micah';
  
  // Use the user's name as the seed for uniqueness.
  // Encode it to handle special characters.
  const seed = encodeURIComponent(name || 'default-user');
  
  // Request an image twice the display size for high-resolution (Retina) screens.
  const avatarUrl = `https://api.dicebear.com/8.x/${style}/svg?seed=${seed}&size=${size * 2}`;

  return (
    <div 
      className="rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-slate-200 dark:bg-slate-600"
      style={{ width: size, height: size }}
      title={name}
      aria-label={`Avatar for ${name}`}
    >
      <img
        src={avatarUrl}
        alt={`Avatar for ${name}`}
        width={size}
        height={size}
        className="w-full h-full"
      />
    </div>
  );
};

export default Avatar;