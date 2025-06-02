import React from "react";

interface GameMonitoringSectionProps {
    className?: string;
}

export const GameMonitoringSection: React.FC<GameMonitoringSectionProps> = ({ className = "" }) => {
    return (
        <div className={`bg-[#e4e4e4] w-full h-[637px] overflow-hidden ${className}`} style={{ backdropFilter: "blur(30px)" }}>
            {/* Header */}
            <div className="flex flex-row gap-[400px] items-end justify-start absolute left-5 top-5">
                <div className="text-[#000000] text-left font-['PpNeueMontreal-Medium',_sans-serif] text-lg font-medium relative" style={{ letterSpacing: "-0.03em" }}>
                    Game Monitoring Overview{" "}
                </div>
                <div className="flex flex-row gap-3 items-center justify-start shrink-0 relative">
                    <div className="text-[rgba(0,0,0,0.70)] text-left font-['PpNeueMontreal-Medium',_sans-serif] text-lg font-medium relative" style={{ letterSpacing: "-0.03em" }}>
                        Latest Updates: Just Now{" "}
                    </div>
                    <div className="bg-[#0a1844] rounded-[9px] pt-1.5 pr-2.5 pb-1.5 pl-2.5 flex flex-row gap-[5px] items-center justify-center shrink-0 relative">
                        <div className="text-[#ffffff] text-left font-['PpNeueMontreal-Medium',_sans-serif] text-[15px] font-medium relative" style={{ letterSpacing: "-0.03em" }}>
                            Today{" "}
                        </div>
                        <img className="shrink-0 w-[22px] h-[22px] relative overflow-visible" style={{ aspectRatio: "1" }} src="frame10.svg" />
                    </div>
                </div>
            </div>

            {/* Stats Cards Row */}
            <div className="flex flex-row gap-5 items-center justify-start absolute left-3.5 top-[74px]">
                {/* Total Online Players */}
                <div className="bg-[#ffffff] rounded-[23px] shrink-0 w-[255px] h-[126px] relative overflow-hidden" style={{ backdropFilter: "blur(20px)" }}>
                    <div className="flex flex-row gap-[21px] items-center justify-start absolute left-[50%] top-[50%]" style={{ translate: "-50% -50%" }}>
                        <div className="bg-[#0a1844] rounded-[27px] p-2 flex flex-row gap-2 items-center justify-center shrink-0 w-[54px] h-[54px] relative" style={{ boxShadow: "0px 2px 4px 0px rgba(115, 115, 115, 0.20), 2px 7px 7px 0px rgba(115, 115, 115, 0.17), 4px 16px 10px 0px rgba(115, 115, 115, 0.10), 8px 28px 12px 0px rgba(115, 115, 115, 0.03), 12px 44px 13px 0px rgba(115, 115, 115, 0.00)" }}>
                            <img className="shrink-0 w-[30px] h-[30px] relative overflow-visible" style={{ aspectRatio: "1" }} src="frame11.svg" />
                        </div>
                        <div className="flex flex-col gap-0.5 items-start justify-start shrink-0 w-32 relative">
                            <div className="text-[#000000] text-left font-['PpNeueMontreal-Medium',_sans-serif] text-[40px] font-medium relative self-stretch" style={{ letterSpacing: "-0.03em" }}>
                                5,124{" "}
                            </div>
                            <div className="text-[rgba(0,0,0,0.60)] text-left font-['SfProDisplay-Medium',_sans-serif] text-base font-medium relative self-stretch" style={{ letterSpacing: "-0.03em" }}>
                                Total Online Players{" "}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Total Gaming Time */}
                <div className="bg-[#ffffff] rounded-[23px] shrink-0 w-[253px] h-[126px] relative overflow-hidden" style={{ backdropFilter: "blur(20px)" }}>
                    <div className="flex flex-row gap-2.5 items-center justify-center absolute left-[50%] top-[50%]" style={{ translate: "-50% -50%" }}>
                        <div className="bg-[#0a1844] rounded-[27px] p-2 flex flex-row gap-2 items-center justify-center shrink-0 w-[54px] h-[54px] relative" style={{ boxShadow: "0px 2px 4px 0px rgba(115, 115, 115, 0.20), 2px 7px 7px 0px rgba(115, 115, 115, 0.17), 4px 16px 10px 0px rgba(115, 115, 115, 0.10), 8px 28px 12px 0px rgba(115, 115, 115, 0.03), 12px 44px 13px 0px rgba(115, 115, 115, 0.00)" }}>
                            <img className="shrink-0 w-[30px] h-[30px] relative overflow-visible" style={{ aspectRatio: "1" }} src="frame12.svg" />
                        </div>
                        <div className="flex flex-col gap-0.5 items-start justify-start shrink-0 relative">
                            <div className="text-[#000000] text-left font-['PpNeueMontreal-Medium',_sans-serif] text-[40px] font-medium relative" style={{ letterSpacing: "-0.03em" }}>
                                37h 20m{" "}
                            </div>
                            <div className="text-[rgba(0,0,0,0.60)] text-left font-['SfProDisplay-Medium',_sans-serif] text-base font-medium relative self-stretch" style={{ letterSpacing: "-0.03em" }}>
                                Total Gaming Time{" "}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Total Bet Amount */}
                <div className="bg-[#ffffff] rounded-[23px] shrink-0 w-[253px] h-[126px] relative overflow-hidden" style={{ backdropFilter: "blur(20px)" }}>
                    <div className="flex flex-row gap-2.5 items-center justify-center absolute left-[50%] top-[50%]" style={{ translate: "-50% -50%" }}>
                        <div className="bg-[#0a1844] rounded-[27px] p-2 flex flex-row gap-2 items-center justify-center shrink-0 w-[54px] h-[54px] relative" style={{ boxShadow: "0px 2px 4px 0px rgba(115, 115, 115, 0.20), 2px 7px 7px 0px rgba(115, 115, 115, 0.17), 4px 16px 10px 0px rgba(115, 115, 115, 0.10), 8px 28px 12px 0px rgba(115, 115, 115, 0.03), 12px 44px 13px 0px rgba(115, 115, 115, 0.00)" }}>
                            <img className="shrink-0 w-[30px] h-[30px] relative overflow-visible" style={{ aspectRatio: "1" }} src="frame13.svg" />
                        </div>
                        <div className="flex flex-col gap-0.5 items-start justify-start shrink-0 relative">
                            <div className="text-[#000000] text-left font-['PpNeueMontreal-Medium',_sans-serif] text-[40px] font-medium relative" style={{ letterSpacing: "-0.03em" }}>
                                $827,950{" "}
                            </div>
                            <div className="text-[rgba(0,0,0,0.60)] text-left font-['SfProDisplay-Medium',_sans-serif] text-base font-medium relative self-stretch" style={{ letterSpacing: "-0.03em" }}>
                                Total Bet Amount{" "}
                            </div>
                        </div>
                    </div>
                </div>

                {/* More Button */}
                <div className="bg-[#ffffff] rounded-[23px] shrink-0 w-[71px] h-[126px] relative overflow-hidden" style={{ backdropFilter: "blur(20px)" }}>
                    <div className="bg-[#0a1844] rounded-[27px] p-2 flex flex-row gap-2 items-center justify-center w-12 h-12 absolute left-[50%] top-[50%]" style={{ translate: "-50% -50%", boxShadow: "0px 2px 4px 0px rgba(115, 115, 115, 0.20), 2px 7px 7px 0px rgba(115, 115, 115, 0.17), 4px 16px 10px 0px rgba(115, 115, 115, 0.10), 8px 28px 12px 0px rgba(115, 115, 115, 0.03), 12px 44px 13px 0px rgba(115, 115, 115, 0.00)", aspectRatio: "1" }}>
                        <img className="shrink-0 w-7 h-7 relative overflow-visible" src="frame14.svg" />
                    </div>
                </div>
            </div>

            {/* Rest of the content (Game Being Played, User Registration, etc.) */}
            {/* ... Add the remaining sections here ... */}
        </div>
    );
}; 