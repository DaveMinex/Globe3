import React from "react";

interface CircularProgressChartProps {
    value: number; // 0 to 1
    label: string;
    subLabel?: string;
    subSubLabel?: string;
    size?: number;
    strokeWidth?: number;
    gradientFrom?: string;
    gradientTo?: string;
    bgColor?: string;
}

export const CircularProgressChart: React.FC<CircularProgressChartProps> = ({
    value,
    label,
    subLabel,
    subSubLabel,
    size = 180,
    strokeWidth = 14,
    gradientFrom = "#0a1844",
    gradientTo = "#bfc5d1",
    bgColor = "#f3f3f3",
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - value);
    const center = size / 2;

    return (
        <svg width={size} height={size} className="block mx-auto" style={{ display: "block" }}>
            <defs>
                <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2={size} gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={gradientFrom} />
                    <stop offset="100%" stopColor={gradientTo} />
                </linearGradient>
            </defs>
            {/* Background ring */}
            <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={bgColor}
                strokeWidth={strokeWidth}
            />
            {/* Foreground arc */}
            <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="url(#chart-gradient)"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.5s" }}
                transform={`rotate(-90 ${center} ${center})`}
            />
            {/* Centered labels */}
            <g>
                <text
                    x="50%"
                    y="48%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="'SfProDisplay-Semibold', sans-serif"
                    fontSize={size * 0.23}
                    fontWeight="bold"
                    fill="#111"
                >
                    {label}
                </text>
                {subLabel && (
                    <text
                        x="50%"
                        y="68%"
                        textAnchor="middle"
                        fontFamily="'SfProDisplay-Medium', sans-serif"
                        fontSize={size * 0.11}
                        fill="#666"
                    >
                        {subLabel}
                    </text>
                )}
                {subSubLabel && (
                    <text
                        x="50%"
                        y="78%"
                        textAnchor="middle"
                        fontFamily="'SfProDisplay-Medium', sans-serif"
                        fontSize={size * 0.09}
                        fill="#888"
                        letterSpacing="2"
                    >
                        {subSubLabel}
                    </text>
                )}
            </g>
        </svg>
    );
}; 