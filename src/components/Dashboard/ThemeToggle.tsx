import React, { useState } from "react";

interface ThemeToggleProps {
    theme?: 'light' | 'dark'; // controlled mode
    initialTheme?: 'light' | 'dark'; // uncontrolled mode
    onToggle?: (theme: 'light' | 'dark') => void;
    lightIcon?: string;
    darkIcon?: string;
    iconSize?: number | string;
    lightLabel?: string;
    darkLabel?: string;
    className?: string;
    style?: React.CSSProperties;
    animationDuration?: number; // ms
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
    theme: controlledTheme,
    initialTheme = 'light',
    onToggle,
    lightIcon = "theme-toggle-light.svg",
    darkIcon = "theme-toggle-dark.svg",
    iconSize = 32,
    lightLabel = "LIGHT",
    darkLabel = "DARK",
    className = "",
    style = {},
    animationDuration = 300,
}) => {
    const [internalTheme, setInternalTheme] = useState<'light' | 'dark'>(initialTheme);
    const [moveAnim, setMoveAnim] = useState<'left' | 'right' | null>(null);

    const theme = controlledTheme ?? internalTheme;

    const handleToggle = () => {
        setMoveAnim(theme === 'light' ? 'right' : 'left');
        setTimeout(() => {
            const newTheme = theme === 'light' ? 'dark' : 'light';
            if (!controlledTheme) setInternalTheme(newTheme);
            setMoveAnim(null);
            if (onToggle) onToggle(newTheme);
        }, animationDuration);
    };

    return (
        <button
            onClick={handleToggle}
            className={`
                flex items-center justify-between w-[90px] h-[42px] rounded-full
                transition-colors
                ${theme === 'light' ? 'bg-gray-200' : 'bg-[#161616]'}
                focus:outline-none
                px-1
                ${className}
            `}
            style={{
                ...style,
                transitionDuration: `${animationDuration}ms`
            }}
        >
            {theme === 'light' ? (
                <>
                    <div className="bg-black rounded-full w-[32px] h-[32px] flex items-center justify-center"    >
                        <img
                            src={lightIcon}
                            alt="Light mode"
                            style={{ width: iconSize, height: iconSize }}
                            className={`${moveAnim === 'right' ? 'animate-move-right' : ''}`}
                        />
                    </div>
                    <span className="text-base font-sfpro font-medium text-black pr-1">{lightLabel}</span>
                </>
            ) : (
                <>
                    <span className="p-1 text-base font-sfpro font-medium text-white">{darkLabel}</span>
                    <div className="bg-black rounded-full w-[32px] h-[32px] flex items-center justify-center"    >
                        <img
                            src={darkIcon}
                            alt="Dark mode"
                            style={{ width: iconSize, height: iconSize }}
                            className={`${moveAnim === 'left' ? 'animate-move-left' : ''}`}
                        />
                    </div>
                </>
            )}
        </button>
    );
}; 