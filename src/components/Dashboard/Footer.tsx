import React from "react";
import { ThemeToggle } from "./ThemeToggle";

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
}) => (
  <div className="flex flex-row items-center justify-between w-full px-0 mt-auto z-0">
    {/* Left: 3D/2D Toggle */}
    <div className="flex justify-center">
      <div className="flex w-[140px] h-10 rounded-full border border-gray-200 overflow-hidden shadow">
        <button
          onClick={() => setViewMode('3D')}
          className={`flex-1 flex items-center justify-center gap-2 transition
            ${viewMode === '3D' ? 'bg-black text-white' : 'bg-gray-100 text-black'}
            font-bold text-base`}
        >
          {/* 3D icon (replace with your SVG) */}
          <svg className="w-5 h-5" fill="none" stroke={viewMode === '3D' ? 'white' : 'black'} strokeWidth="2" viewBox="0 0 24 24">
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
          className={`flex-1 flex items-center justify-center gap-2 transition
            ${viewMode === '2D' ? 'bg-black text-white' : 'bg-gray-100 text-black'}
            font-bold text-base`}
        >
          {/* 2D icon (replace with your SVG) */}
          <svg className="w-5 h-5" fill="none" stroke={viewMode === '2D' ? 'white' : 'black'} strokeWidth="2" viewBox="0 0 24 24">
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
        <span className="text-satoshi font-medium text-[18px] text-black/60" style={{ letterSpacing: '-0.03em' }}>Zoom</span>
        <button className="w-8 h-8 bg-white rounded-full shadow-md">
          <img src="zoom-in.svg" alt="Up arrow" className="w-4 h-4 mr-0.5 inline" />
        </button>
        <button className="w-8 h-8 bg-white rounded-full shadow-md">
          <img src="zoom-out.svg" alt="Up arrow" className="w-4 h-4 mr-0.5 inline" />
        </button>
        <button className="flex justify-center items-center rounded-full bg-black p-2 w-8 h-8">
          <img src="full-view.svg" alt="Up arrow" className="w-4 h-4 mr-0.5 inline" />
        </button>
      </div>
    </div>
  </div>
);

export default Footer; 