import React from "react";

export interface MiniStatCardProps {
  title: string;
  value: string | number;
  icon?: string; // right icon (could be emoji or SVG src)
  mainIcon: string; // left image src
  badgeText: string;
  badgeIcon: string; // badge image src
  className?: string;
}

export const MiniStatCard: React.FC<MiniStatCardProps> = ({
  title,
  value,
  icon,
  mainIcon,
  badgeText,
  badgeIcon,
  className = "",
}) => (
  <div className={`bg-[#ffffff] rounded-[23px] shrink-0 w-[284px] h-[148px] relative overflow-hidden ${className}`} style={{ backdropFilter: "blur(20px)" }}>
    <div className="flex flex-row items-center justify-between w-[235px] absolute left-3 top-3">
      <div className="text-[#000000] text-left font-['SfProDisplay-Medium',_sans-serif] text-lg font-medium relative" style={{ letterSpacing: "-0.03em" }}>
        {title}
      </div>
      <div className="text-[#000000] text-left font-['SfProDisplay-Medium',_sans-serif] text-lg font-medium relative" style={{ letterSpacing: "-0.03em" }}>
        {icon && (icon.endsWith('.svg') ? <img src={icon} alt="icon" className="inline w-5 h-5" /> : icon)}
      </div>
    </div>
    <div className="flex flex-row gap-[7px] items-center justify-start absolute left-3 top-[92px]">
      <img className="shrink-0 w-[38px] h-[38px] relative overflow-visible" style={{ aspectRatio: "1" }} src={mainIcon} />
      <div className="text-[#000000] text-left font-['SfProDisplay-Medium',_sans-serif] text-3xl font-medium relative" style={{ letterSpacing: "-0.03em" }}>
        {value}
      </div>
    </div>
    <div className="bg-[#0a1844] rounded-[13px] pt-2 pr-2.5 pb-2 pl-2.5 flex flex-row gap-1 items-center justify-center absolute left-3 top-[45px]">
      <div className="text-[#ffffff] text-left font-['SfProDisplay-Regular',_sans-serif] text-base font-normal relative" style={{ letterSpacing: "-0.03em" }}>
        {badgeText}
      </div>
      <img className="shrink-0 w-5 h-5 relative overflow-visible" style={{ aspectRatio: "1" }} src={badgeIcon} />
    </div>
  </div>
); 