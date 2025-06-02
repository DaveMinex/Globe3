import React from "react";
import { DashboardStatCard } from "./DashboardStatCard";

interface StatCardsSectionProps {
    className?: string;
}

export const StatCardsSection: React.FC<StatCardsSectionProps> = ({ className = "" }) => {
    return (
        <div className={`bg-[#e4e4e4] w-full p-8overflow-hidden px-4 py-4 ${className}`}>
            {/* Header Section */}
            <div className="flex flex-row justify-between items-center ">

                <div className="flex flex-col gap-1.5 items-start justify-start w-[403px]">
                    <div className="text-[#000000] text-left font-['SfProDisplay-Bold',_sans-serif] text-[28px] font-bold relative self-stretch">
                        Overall Details{" "}
                    </div>
                    <div className="text-[rgba(0,0,0,0.60)] text-left text-nowrap font-['PpNeueMontreal-Medium',_sans-serif] text-base text-sm relative self-stretch">
                        This is all over platform for Company, Clients and Bet Logs.{" "}
                    </div>

                </div>
                {/* Add New Button */}
                <button className="bg-[#0a1844] hover:bg-[#0a1844]/80 rounded-2xl border-2 border-solid pt-[15px] pr-2.5 pb-[15px] pl-2.5 flex flex-row gap-2.5 items-center justify-center">
                    <div className="text-ui-colors-white text-left px-4 text-white font-['SfProDisplay-Medium',_sans-serif] text-lg text-sm relative">
                        + Add New{" "}
                    </div>
                </button>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 px-5 pt-6">
                <DashboardStatCard
                    title="Total Registered Companies"
                    value={128}
                    subtitle="+500 vs last month"
                    delta="-1.3%"
                    deltaIcon="frame0.svg"
                    icon="frame1.svg"
                    className="w-full h-[143px]"
                />
                <DashboardStatCard
                    title="Active API Tokens"
                    value={112}
                    subtitle="Inactive API for 1 mon"
                    delta="25"
                    deltaIcon="frame2.svg"
                    icon="frame3.svg"
                    className="w-full h-[143px]"
                />
                <DashboardStatCard
                    title="Registered IPs"
                    value={356}
                    subtitle="Newly Added"
                    delta="15+"
                    deltaIcon="frame4.svg"
                    icon="frame5.svg"
                    className="w-full h-[143px]"
                />
                <DashboardStatCard
                    title="Token Expiry Warnings"
                    value={15}
                    subtitle="Validate Timer"
                    delta="01:00 hrs"
                    deltaIcon="frame6.svg"
                    icon="frame7.svg"
                    className="w-full h-[143px]"
                />
            </div>


        </div>
    );
}; 