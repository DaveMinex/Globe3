import React from "react";
import { TooltipBox } from "./TooltipBox";

interface GlowingRippleDotProps {
  size?: number | string; // e.g. 30 or "30px"
  className?: string;
  style?: React.CSSProperties;
  top?: string | number;
  left?: string | number;
  right?: string | number;
  bottom?: string | number;
  tooltipCity?: string;
  tooltipUsers?: number | string;
  tooltipClassName?: string;
  tooltipStyle?: React.CSSProperties;
}

export const GlowingRippleDot: React.FC<GlowingRippleDotProps> = ({
  size = 30,
  className = "",
  style = {},
  top,
  left,
  right,
  bottom,
  tooltipCity,
  tooltipUsers,
  tooltipClassName = "",
  tooltipStyle = {},
}) => {
  const sizePx = typeof size === "number" ? `${size}px` : size;
  const hasPosition = top !== undefined || left !== undefined || right !== undefined || bottom !== undefined;
  const positionStyle: React.CSSProperties = {
    width: sizePx,
    height: sizePx,
    position: hasPosition ? "absolute" : "relative",
    ...style,
    ...(top !== undefined ? { top } : {}),
    ...(left !== undefined ? { left } : {}),
    ...(right !== undefined ? { right } : {}),
    ...(bottom !== undefined ? { bottom } : {}),
  };
  // 3 ripples, each animates once per pulse, staggered
  const rippleDelays = [0, 1, 2];
  return (
    <div className={`relative ${className}`} style={positionStyle}>
      <span className="relative block w-1/2 h-1/2 rounded-full bg-[#ffff00] animate-glow">
        {/* 3 Ripple waves, each animates once per pulse, staggered */}
        {rippleDelays.map((delay, i) => (
          <span
            key={i}
            className="absolute inset-0 rounded-full border-2 border-yellow-400 animate-rippleOnce pointer-events-none"
            style={{ animationDelay: `${delay}s`, animationIterationCount: 'infinite' }}
          ></span>
        ))}
      </span>
      {tooltipCity && tooltipUsers !== undefined && (
        <TooltipBox
          city={tooltipCity}
          users={tooltipUsers}
          className={`absolute -left-20 top-[-120px] ${tooltipClassName}`}
          style={tooltipStyle}
        />
      )}
    </div>
  );
}; 