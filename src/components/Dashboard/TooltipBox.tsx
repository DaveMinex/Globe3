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
}) => {

  return (
    <div
      className={`absolute bg-white dark:bg-[#232323] rounded-[18.44px] shadow-lg px-4 py-2 flex flex-col items-center  justify-center w-[183px] h-[98px] ${className}`}
      style={style}
    >
      <div className="text-sfpro font-semibold text-nowrap text-[22.74px] text-black dark:text-white" style={{ letterSpacing: '-0.03em' }}>{city}</div>
      <div className="text-sfpro font-semibold text-nowrap text-[19.89px] text-black dark:text-[#0071E3]" style={{ letterSpacing: '-0.03em' }}>{typeof users === 'number' ? users.toLocaleString() : users}</div>
      <div className="text-sfpro font-medium font-[17.05px] text-[#0A1844]/50 dark:text-[#0071E3]/50" style={{ letterSpacing: '-0.03em' }}>Active Users</div>
    </div>
  );
}