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
    <div className={`flex items-center justify-between w-full px-6 py-2 bg-transparent  z-1000 transition-colors duration-300 ${className}`}>
        {/* Left: Logo + Search */}
        <div className="flex items-center gap-4">
            <div className="bg-[#E4E4E4] dark:bg-[#232323] rounded-xl flex items-center px-3 py-2 w-[254px] h-[48px] transition-colors duration-300">
                <svg className="w-6 h-6 text-white dark:text-white m-2" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                    type="text"
                    placeholder={searchPlaceholder}
                    className=" font-Neue font-medium text-[16px] bg-transparent outline-none w-full text-black dark:text-white"
                    onChange={e => onSearchChange?.(e.target.value)}
                />
            </div>
        </div>
        <div className="relative">
            <div className="flex justify-center items-center w-full h-full z-1">
                <div className="absolute top-1 ml-[128px]  translate-x-[-60px]">
                    <span className="font-satoshi text-[40px] font-semibold text-nowrap text-black dark:text-white">
                        Global Overview
                    </span>
                </div>
            </div>
        </div>
        {/* Right: Actions */}
        <div className="flex items-center gap-4 relative">
            {actions ? actions : (
                <>
                    <div className="relative">

                        <button className="bg-gradient-to-r from-[#2D2B7C] to-[#E06FFF] text-white mb-10 rounded-full font-sfpro font-medium text-[14px] shadow w-[168px] h-[25px] text-nowrap ">
                            <div className="">
                                <span className="text-nowrap">Explore with AI Assistance</span>
                            </div>
                        </button>
                    </div>
                    <button className="rounded-full shadow-[0_4px_24px_0_rgba(0,0,0,0.12)] p-1 bg-white dark:bg-[#232323] w-[48px] h-[48px] ">
                        <img src="/ai0.png" alt="icon" className="w-full h-full rounded-full" />
                    </button>
                    <button className="bg-[#F3F3F3] dark:bg-[#F3F3F3] rounded-full p-2 shadow  w-[48px] h-[48px] flex items-center justify-center">
                        {/* Mail icon */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 8.49874L9.94202 10.2381C11.6572 11.2522 12.3428 11.2522 14.058 10.2381L17 8.49874" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M2.01577 13.4743C2.08114 16.5398 2.11383 18.0726 3.24496 19.208C4.37609 20.3435 5.95034 20.383 9.09884 20.4621C11.0393 20.5109 12.9607 20.5109 14.9012 20.4621C18.0497 20.383 19.6239 20.3435 20.755 19.208C21.8862 18.0726 21.9189 16.5398 21.9842 13.4743C22.0053 12.4886 22.0053 11.5087 21.9842 10.5231C21.9189 7.45757 21.8862 5.9248 20.755 4.78937C19.6239 3.65394 18.0497 3.61439 14.9012 3.53528C12.9607 3.48652 11.0393 3.48652 9.09882 3.53527C5.95034 3.61437 4.37609 3.65392 3.24496 4.78936C2.11383 5.92479 2.08114 7.45756 2.01577 10.523C1.99474 11.5087 1.99474 12.4886 2.01577 13.4743Z" stroke="black" stroke-width="1.5" stroke-linejoin="round" />
                        </svg>

                    </button>
                    <button className="bg-[#F3F3F3] dark:bg-[#F3F3F3] rounded-full p-2 shadow  w-[48px] h-[48px] flex items-center justify-center">
                        {/* Notification icon */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.5 5.2956C12.8666 5.10247 12.1949 4.99874 11.5 4.99874C7.85617 4.99874 4.84988 7.85096 4.65837 11.4897C4.58489 12.8857 4.66936 14.3717 3.42213 15.3071C2.84164 15.7425 2.5 16.4257 2.5 17.1514C2.5 18.1495 3.2818 18.9987 4.3 18.9987H18.7C19.7182 18.9987 20.5 18.1495 20.5 17.1514C20.5 16.4257 20.1584 15.7425 19.5779 15.3071C19.5513 15.2872 19.5254 15.267 19.5 15.2466" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M10 3.12374C10 3.95217 10.6716 4.99874 11.5 4.99874C12.3284 4.99874 13 3.95217 13 3.12374C13 2.29531 12.3284 1.99874 11.5 1.99874C10.6716 1.99874 10 2.29531 10 3.12374Z" stroke="black" stroke-width="1.5" />
                            <path d="M14.5 18.9987C14.5 20.6556 13.1569 21.9987 11.5 21.9987C9.84315 21.9987 8.5 20.6556 8.5 18.9987" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M21.5 9.49874C21.5 7.56574 19.933 5.99874 18 5.99874C16.067 5.99874 14.5 7.56574 14.5 9.49874C14.5 11.4317 16.067 12.9987 18 12.9987C19.933 12.9987 21.5 11.4317 21.5 9.49874Z" fill="#FF1F1F" />
                        </svg>

                    </button>
                    <button className="bg-transparent rounded-fullshadow  w-[48px] h-[48px]">
                        {/* User/avatar icon */}
                        <img src={avatarSrc} alt="icon" className="w-full rounded-full" />
                    </button>
                </>
            )}
        </div>
    </div>
);

export default Header; 