import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "../../context/ThemeContext";

interface FooterProps {
  viewMode: '3D' | '2D';
  setViewMode: (mode: '3D' | '2D') => void;
  lightIcon?: string;
  darkIcon?: string;
  iconSize?: number;
  lightLabel?: string;
  darkLabel?: string;
  animationDuration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Footer: React.FC<FooterProps> = ({
  viewMode,
  setViewMode,
  lightIcon = "/theme-toggle-light.svg",
  darkIcon = "/theme-toggle-dark.svg",
  iconSize = 20,
  lightLabel = "Light",
  darkLabel = "Dark",
  animationDuration = 300,
  className = "my-4",
  style = { border: '2px solid #eee' },
}) => {
  const { theme, toggleTheme, setTheme } = useTheme();
  return (
    <div className="flex flex-row items-center justify-between w-full px-0 mt-auto z-0 bg-transparent dark:bg-transparent    transition-colors duration-300">
      {/* Left: 3D/2D Toggle */}
      <div className="flex justify-center pl-10">
        <div className="flex w-[181px] h-[48px] pl rounded-[60px] overflow-hidden shadow bg-gray-100 dark:bg-[#232323]">
          <button
            onClick={() => setViewMode('3D')}
            className={`flex-1 flex items-center justify-center gap-1 transition
              ${viewMode === '3D' ? 'bg-black text-white dark:bg-[#1C1C1C]' : 'bg-[#F3F3F3] text-black dark:bg-[#535353] dark:text-white'}
              font-bold text-base`}
          >
            {/* 3D icon (replace with your SVG) */}
            <svg className="w-5 h-5" fill="none" stroke={
              theme === 'dark'
                ? (viewMode === '3D' ? 'white' : 'white')  // If 3D mode
                : (viewMode === '3D' ? 'white' : 'black') // If 2D mode
            } strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="4" />
              <path d="M7 7l5 3 5-3" />
              <path d="M7 17V7" />
              <path d="M17 17V7" />
              <path d="M7 17l5-3 5 3" />
            </svg>
            3D
          </button>
          <button
            onClick={() => setViewMode('2D')}
            className={`flex-1 flex items-center justify-center gap-1 transition
              ${viewMode === '2D' ? 'bg-black text-white dark:bg-[#1C1C1C]' : 'bg-[#F3F3F3] text-black dark:bg-[#535353] dark:text-white'}
              font-bold text-base`}
          >
            {/* 2D icon (replace with your SVG) */}
            <svg className="w-5 h-5" fill="none" stroke={
              theme === 'dark'
                ? (viewMode === '2D' ? 'white' : 'white')  // If 2D mode
                : (viewMode === '2D' ? 'white' : 'black') // If 2D mode
            } strokeWidth="2" viewBox="0 0 24 24">
              <rect x="5" y="5" width="14" height="14" rx="2" />
              <circle cx="12" cy="12" r="3" />
              <circle cx="7" cy="7" r="1" />
              <circle cx="17" cy="7" r="1" />
              <circle cx="7" cy="17" r="1" />
              <circle cx="17" cy="17" r="1" />
            </svg>
            2D
          </button>
        </div>
      </div>
      {/* Right: Zoom controls and Theme Toggle */}
      <div className="relative">
        <div className="absolute" style={{ top: '-100px', right: '20px' }}>
          <ThemeToggle
            onToggle={toggleTheme}
            lightIcon={lightIcon}
            darkIcon={darkIcon}
            iconSize={iconSize}
            lightLabel={lightLabel}
            darkLabel={darkLabel}
            animationDuration={animationDuration}
            className={className}
            style={style}
          />
        </div>
        <div className="flex items-center gap-4 pr-2">
          <span className="text-satoshi font-medium text-[18px] text-black/60 dark:text-white/60" style={{ letterSpacing: '-0.03em' }}>Zoom</span>
          <button className="w-8 h-8 bg-[#eeeeee] dark:bg-white rounded-full shadow-md">
            <img src="zoom-in.svg" alt="Up arrow" className="w-4 h-4 mr-0.5 inline" />
          </button>
          <button className="w-8 h-8 bg-[#eeeeee] dark:bg-white rounded-full shadow-md">
            <img src="zoom-out.svg" alt="Up arrow" className="w-4 h-4 mr-0.5 inline" />
          </button>
          <button className="flex justify-center items-center rounded-full bg-black p-2 w-8 h-8 dark:bg-[#232323] dark:text-white">
            <img src="full-view.svg" alt="Up arrow" className="w-4 h-4 mr-0.5 inline" />
          </button>
        </div>
      </div>
    </div >
  )
};

export default Footer; 