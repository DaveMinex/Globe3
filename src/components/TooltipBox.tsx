import React from "react";

interface TooltipBoxProps {
  city: string;
  users: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export const TooltipBox: React.FC<TooltipBoxProps> = ({
  city,
  users,
  className = "",
  style = {},
}) => (
  <div
    className={`absolute bg-white rounded-xl shadow-lg px-4 py-2 flex flex-col items-center min-w-[120px] ${className}`}
    style={style}
  >
    <div className="text-lg font-semibold text-nowrap">{city}</div>
    <div className="text-base font-bold">{typeof users === 'number' ? users.toLocaleString() : users}</div>
    <div className="text-xs text-gray-400">Active Users</div>
  </div>
); 