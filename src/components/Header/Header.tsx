import React from "react";

interface HeaderProps {
    searchPlaceholder?: string;
    onSearchChange?: (value: string) => void;
    actions?: React.ReactNode;
    avatarSrc?: string;
    className?: string;
}

export const Header: React.FC<HeaderProps> = ({
    searchPlaceholder = "Search here...",
    onSearchChange,
    actions,
    avatarSrc = "/ellipse-10.png",
    className = "",
}) => (
    <div className={`flex items-center justify-between w-full px-6 py-2 bg-transparent z-1000 ${className}`}>
        {/* Left: Logo + Search */}
        <div className="flex items-center gap-4">
            <div className="bg-[#E4E4E4] rounded-xl flex items-center px-3 py-2 min-w-[220px]">
                <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                    type="text"
                    placeholder={searchPlaceholder}
                    className=" font-Neue font-medium font-[16px] bg-transparent outline-none text-sm w-full"
                    onChange={e => onSearchChange?.(e.target.value)}
                />
            </div>
        </div>
        <div className="relative">
            <div className="flex justify-center items-center w-full h-full z-1">
                <div className="absolute top-1 ml-[128px]  translate-x-[-60px]"> 
                    <span className="font-satoshi text-[40px] font-semibold text-nowrap ">
                        Global Overview
                    </span>
                </div>
            </div>
        </div>
        {/* Right: Actions */}
        <div className="flex items-center gap-4">
            {actions ? actions : (
                <>
                    <button className="bg-gradient-to-r from-[#2D2B7C] to-[#E06FFF] text-white text-xs px-4 py-1 rounded-full font-semibold shadow">
                        Explore with AI Assistance
                    </button>
                    <button className="rounded-full border border-[#C3C3C3] shadow-[0_4px_24px_0_rgba(0,0,0,0.12)] p-1 bg-white">
                        <img src="/ai0.png" alt="icon" className="w-8 h-8 rounded-full" />
                    </button>
                    <button className="bg-[#F3F3F3] rounded-full p-2 shadow">
                        {/* Mail icon */}
                        <svg className="w-5 h-5" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24">
                            <rect x="3" y="5" width="18" height="14" rx="2" />
                            <polyline points="3 7 12 13 21 7" />
                        </svg>
                    </button>
                    <button className="bg-[#F3F3F3] rounded-full p-2 shadow">
                        {/* Notification icon */}
                        <svg className="w-5 h-5" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 01-3.46 0" />
                        </svg>
                    </button>
                    <button className="bg-[#F3F3F3] rounded-fullshadow">
                        {/* User/avatar icon */}
                        <img src={avatarSrc} alt="icon" className="w-8 h-8 rounded-full" />
                    </button>
                </>
            )}
        </div>
    </div>
);

export default Header; 