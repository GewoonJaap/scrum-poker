import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeSwitcherProps {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const THEME_OPTIONS: { value: Theme; label: string; icon: React.FC<any> }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
];

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, setTheme }) => {
    return (
        <div className="flex items-center p-1 bg-slate-200 dark:bg-slate-700 rounded-full" role="radiogroup" aria-label="Theme switcher">
            {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
                <button
                    key={value}
                    onClick={() => setTheme(value)}
                    className={`
                        flex items-center justify-center w-9 h-9 rounded-full transition-colors
                        ${theme === value 
                            ? 'bg-white dark:bg-slate-800 shadow text-sky-600 dark:text-sky-400' 
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                        }
                    `}
                    aria-label={`Switch to ${label} theme`}
                    title={`Switch to ${label} theme`}
                    role="radio"
                    aria-checked={theme === value}
                >
                    <Icon className="w-5 h-5" />
                </button>
            ))}
        </div>
    );
};

export default ThemeSwitcher;
