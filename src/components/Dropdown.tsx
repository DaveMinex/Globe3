import React, { useState, useRef, useEffect } from "react";

interface DropdownOption {
    label: string;
    value: string;
}

interface DropdownProps {
    options: DropdownOption[];
    value: DropdownOption;
    onChange: (option: DropdownOption) => void;
    className?: string;
    buttonClassName?: string;
    dropdownClassName?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
    options,
    value,
    onChange,
    className = "",
    buttonClassName = "",
    dropdownClassName = "",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`relative select-none ${className}`} ref={dropdownRef}>
            <div
                className={`text-white text-left font-['SfProDisplay-Regular',_sans-serif] text-base font-normal relative cursor-pointer flex items-center gap-1 ${buttonClassName}`}
                onClick={() => setIsOpen((open) => !open)}
            >
                {value.label}
                <svg 
                    className={`w-4 h-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="#fff" 
                    strokeWidth="2" 
                    viewBox="0 0 24 24"
                >
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            {isOpen && (
                <div className={`absolute top-full left-0 mt-1 w-32 bg-[#0a1844] rounded-[9px] shadow-lg z-10 flex flex-col border border-[#1a2a5c] ${dropdownClassName}`}>
                    {options.map((option) => (
                        <button
                            key={option.value}
                            className={`text-left px-4 py-2 text-sm font-medium font-['PpNeueMontreal-Medium',_sans-serif] text-white hover:bg-[#1a2a5c] transition-colors ${value.value === option.value ? 'bg-[#1a2a5c]' : ''}`}
                            onClick={() => {
                                onChange(option);
                                setIsOpen(false);
                            }}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}; 