import React, { useState } from "react";
import { HomeIcon } from "../components/sidebar/HomeIcon";
import { DashboardIcon } from "../components/sidebar/DashboardIcon";
import { CompanyIcon } from "../components/sidebar/CompanyIcon";
import { KycIcon } from "../components/sidebar/KycIcon";
import { BetLogsIcon } from "../components/sidebar/BetLogsIcon";
import { ApiIcon } from "../components/sidebar/ApiIcon";
import { SettingsIcon } from "../components/sidebar/SettingsIcon";
import { LogoutIcon } from "../components/sidebar/LogoutIcon";
import { GlowingRippleDot } from "../components/GlowingRippleDot";
import { MainFrame } from "./MainFrame";

export interface IDashboardHomeProps {
    className?: string;
}

export const DashboardHome = ({
    className,
    ...props
}: IDashboardHomeProps): JSX.Element => {
    const [hovered, setHovered] = useState<string | null>(null);
    const [active, setActive] = useState<string>("Dashboard");
    const [viewMode, setViewMode] = useState<'3D' | '2D'>('3D');
    return (
        <div className="w-full bg-[#E4E4E4] ">
            <div className="max-w-[1440px] mx-auto bg-white ">
                <div className="flex flex-row bg-white m-4 gap-4 relative w-fi">
                    {/* Earth */}
                    <div className="absolute w-full ">
                        <div className="relative">
                            <div className="flex justify-center mt-10  w-full h-full z-1">
                                <span className="text-5xl font-semibold">
                                    Global Overview
                                </span>
                            </div>
                        </div>
                        <div className="relative top-[10px] -z-100 w-full h-full">
                            <div className="w-[calc(43vw)] h-[calc(43vw)] mx-auto">
                                <div className="earth relative w-full h-full">
                                    <GlowingRippleDot size="1.5vw" style={{ position: 'absolute', top: '25%', left: '25%' }} tooltipCity="San Diego" tooltipUsers={140867} />
                                    <GlowingRippleDot size="1.5vw" style={{ position: 'absolute', top: '48%', left: '39%' }} tooltipCity="New York City" tooltipUsers={3586} />
                                    <GlowingRippleDot size="1.5vw" style={{ position: 'absolute', top: '54%', left: '67%' }} tooltipCity="Houston" tooltipUsers={24980} />
                                    <GlowingRippleDot size="1.5vw" style={{ position: 'absolute', top: '77%', left: '52%' }} tooltipCity="Los Angeles" tooltipUsers={6354} />
                                    <GlowingRippleDot size="1.5vw" style={{ position: 'absolute', top: '75%', left: '79%' }} tooltipCity="Chicago" tooltipUsers={10756} />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Sidebar */}
                    <div className="h-[calc(100vh-40px)]  w-[98px] bg-[#E4E4E4] rounded-3xl flex flex-col items-center py-4 justify-between">
                        {/* Top: Logo + Home */}
                        <div className="flex flex-col items-center gap-8">
                            <img src="/logo.png" className="w-14 h-14 mb-2" alt="logo" />
                            <div className="flex flex-col items-center">
                                {/* Home Icon SVG */}
                                <button
                                    onClick={() => setActive("Home")}
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-150
                                     ${(active === "Home" || hovered === "Home") ? "bg-white shadow" : "bg-[#C4C4C4]"}
                                     hover:bg-white hover:shadow
                                 `}
                                >
                                    <HomeIcon />
                                </button>
                                <span className="text-xs mt-1 text-[#555]">Home</span>
                            </div>
                        </div>
                        {/* Middle: 5 Icon Buttons with Tooltips */}
                        <div className="flex flex-col items-center gap-4">
                            {/* Dashboard */}
                            <div className="relative" onMouseEnter={() => setHovered("Dashboard")} onMouseLeave={() => setHovered(null)}>
                                <button
                                    onClick={() => setActive("Dashboard")}
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-150
                                        ${(active === "Dashboard" || hovered === "Dashboard") ? "bg-white shadow" : "bg-[#C4C4C4]"}
                                        hover:bg-white hover:shadow
                                    `}
                                >
                                    <DashboardIcon />
                                </button>
                                {hovered === "Dashboard" && (
                                    <div className="absolute left-14 top-1/3 -translate-y-1/2 px-3 py-1 rounded-xl bg-black text-white text-xs whitespace-nowrap z-10 flex items-center">
                                        <span>Dashboard</span>
                                    </div>
                                )}
                            </div>
                            {/* Company Management */}
                            <div className="relative" onMouseEnter={() => setHovered("Company Management")} onMouseLeave={() => setHovered(null)}>
                                <button
                                    onClick={() => setActive("Company Management")}
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-150
                                        ${(active === "Company Management" || hovered === "Company Management") ? "bg-white shadow" : "bg-[#C4C4C4]"}
                                        hover:bg-white hover:shadow
                                    `}
                                >
                                    <CompanyIcon />
                                </button>
                                {hovered === "Company Management" && (
                                    <div className="absolute left-14 top-1/3 -translate-y-1/2 px-3 py-1 rounded-xl bg-black text-white text-xs whitespace-nowrap z-10 flex items-center">
                                        <span>Company Management</span>
                                    </div>
                                )}
                            </div>
                            {/* KYC Verifications */}
                            <div className="relative" onMouseEnter={() => setHovered("KYC Verifications")} onMouseLeave={() => setHovered(null)}>
                                <button
                                    onClick={() => setActive("KYC Verifications")}
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-150
                                        ${(active === "KYC Verifications" || hovered === "KYC Verifications") ? "bg-white shadow" : "bg-[#C4C4C4]"}
                                        hover:bg-white hover:shadow
                                    `}
                                >
                                    <KycIcon />
                                </button>
                                {hovered === "KYC Verifications" && (
                                    <div className="absolute left-14 top-1/3 -translate-y-1/2 px-3 py-1 rounded-xl bg-black text-white text-xs whitespace-nowrap z-10 flex items-center">
                                        <span>KYC Verifications</span>
                                    </div>
                                )}
                            </div>
                            {/* Bet Logs */}
                            <div className="relative" onMouseEnter={() => setHovered("Bet Logs")} onMouseLeave={() => setHovered(null)}>
                                <button
                                    onClick={() => setActive("Bet Logs")}
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-150
                                        ${(active === "Bet Logs" || hovered === "Bet Logs") ? "bg-white shadow" : "bg-[#C4C4C4]"}
                                        hover:bg-white hover:shadow
                                    `}
                                >
                                    <BetLogsIcon />
                                </button>
                                {hovered === "Bet Logs" && (
                                    <div className="absolute left-14 top-1/3 -translate-y-1/2 px-3 py-1 rounded-xl bg-black text-white text-xs whitespace-nowrap z-10 flex items-center">
                                        <span>Bet Logs</span>
                                    </div>
                                )}
                            </div>
                            {/* API Tokens */}
                            <div className="relative" onMouseEnter={() => setHovered("API Tokens")} onMouseLeave={() => setHovered(null)}>
                                <button
                                    onClick={() => setActive("API Tokens")}
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-150
                                        ${(active === "API Tokens" || hovered === "API Tokens") ? "bg-white shadow" : "bg-[#C4C4C4]"}
                                        hover:bg-white hover:shadow
                                    `}
                                >
                                    <ApiIcon />
                                </button>
                                {hovered === "API Tokens" && (
                                    <div className="absolute left-14 top-1/3 -translate-y-1/2 px-3 py-1 rounded-xl bg-black text-white text-xs whitespace-nowrap z-10 flex items-center">
                                        <span>API Tokens</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Bottom: Settings + Logout with Tooltips */}
                        <div className="flex flex-col items-center gap-4 mb-2">
                            {/* Settings */}
                            <div className="relative" onMouseEnter={() => setHovered("Settings")} onMouseLeave={() => setHovered(null)}>
                                <button
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-150
                                        bg-[#C4C4C4] ${hovered === "Settings" ? "bg-[#B0B0B0]" : ""}
                                        hover:bg-[#B0B0B0]`}
                                >
                                    <SettingsIcon />
                                </button>
                            </div>
                            {/* Logout */}
                            <div className="relative" onMouseEnter={() => setHovered("Logout")} onMouseLeave={() => setHovered(null)}>
                                <button
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-150
                                        bg-[#C4C4C4] ${hovered === "Logout" ? "bg-[#B0B0B0]" : ""}
                                        hover:bg-[#B0B0B0]`}
                                >
                                    <LogoutIcon />
                                </button>
                            </div>
                        </div>
                                </div>
                    {/* Main */}
                    <div className="w-full h-[calc(100vh-40px)] flex flex-col relative">
                        {/* Header */}
                        <div className="flex items-center justify-between w-full px-6 py-2 bg-transparent">
                            {/* Left: Logo + Search */}
                            <div className="flex items-center gap-4">

                                <div className="bg-[#E4E4E4] rounded-xl flex items-center px-3 py-2 min-w-[220px]">
                                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24">
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Search here..."
                                        className="bg-transparent outline-none text-sm w-full"
                                    />
                                </div>
                            </div>
                            {/* Right: Actions */}
                            <div className="flex items-center gap-4">
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
                                    {/* <svg className="w-5 h-5" fill="none" stroke="black" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 20c0-4 8-4 8-4s8 0 8 4" />
                              </svg> */}
                                    <img src="/ellipse-10.png" alt="icon" className="w-8 h-8 rounded-full" />
                                </button>
                            </div>
                        </div>
                        {/* description */}
                        <div className="flex flex-row mt-16 w-full relative">
                            <div className="flex flex-row justify-between w-full px-4">
                                <div className="flex flex-col gap-8">
                                <div>
                                        <span className="text-xl font-['SF Mono']">
                                            AI Powered  <br />
                                            User Dashboard
                                        </span>
                                </div>
                                <div>
                                        <span className="text-md ">
                                            Rotate The Globe <br />
                                            You'll See The World Over
                                        </span>
                                </div>
                                <div>
                                        <span className="text-xl">
                                            Active Users and <br />
                                            Their Details.
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="w-[180px]">
                                        <span className="text-3xl font-['SF Mono'] font-bold">
                                            Main  <br />
                                            Analytics
                                        </span>
                                    </div>
                                    <div className="mb-4">
                                        <div className="text-[16px] text-black/80 font-normal">Global Active Users</div>
                                        <div className="flex items-end gap-2">
                                            <span className="text-[28px] font-bold tracking-tight text-black">102,679</span>
                                            <span className="flex items-center text-green-500 text-xs font-semibold ml-1">
                                                {/* Up arrow icon (SVG) */}
                                                <svg className="w-4 h-4 mr-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 16 16">
                                                    <path d="M2 10l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                +34%
                                            </span>
                                        </div>
                                </div>
                                <div>
                                        <span className="text-md">
                                            Total No. Of Bet Amounts
                                            <br />
                                            <span className="text-xl ">$675,98,00 </span> ~ +64%
                                        </span>
                                </div>
                                <div>
                                        <span className="text-md">
                                            Total Withdrawal Requested
                                            <br />
                                            <span className="text-xl "> $975, 34,10</span> ~ +40%
                                        </span>
                                    </div>
                                </div>

                            </div>
                            {/* <div className="absolute bottom-0">
                                <div className="flex flex-row">
                                        <div>www</div>
                                </div>
                                <div className="">
                                </div>
                            </div> */}
                        </div>
                        {/* Footer */}
                        <div className="flex flex-row items-center justify-between w-full px-0 mt-auto">
                            {/* Left: 3D/2D Toggle */}
                            <div className="flex justify-center">
                                <div className="flex w-[140px] h-10 rounded-full border border-gray-200 overflow-hidden shadow">
                                    <button
                                        onClick={() => setViewMode('3D')}
                                        className={`flex-1 flex items-center justify-center gap-2 transition
                                  ${viewMode === '3D' ? 'bg-black text-white' : 'bg-gray-100 text-black'}
                                  font-bold text-base`}
                                    >
                                        {/* 3D icon (replace with your SVG) */}
                                        <svg className="w-5 h-5" fill="none" stroke={viewMode === '3D' ? 'white' : 'black'} strokeWidth="2" viewBox="0 0 24 24">
                                            <rect x="3" y="3" width="18" height="18" rx="4" />
                                            <path d="M7 7l5 3 5-3" />
                                            <path d="M7 17V7" />
                                            <path d="M17 17V7" />
                                            <path d="M7 17l5-3 5 3" />
                                        </svg>
                                        3D
                                    </button>
                                    <button
                                        onClick={() => setViewMode('2D')}
                                        className={`flex-1 flex items-center justify-center gap-2 transition
                                  ${viewMode === '2D' ? 'bg-black text-white' : 'bg-gray-100 text-black'}
                                  font-bold text-base`}
                                    >
                                        {/* 2D icon (replace with your SVG) */}
                                        <svg className="w-5 h-5" fill="none" stroke={viewMode === '2D' ? 'white' : 'black'} strokeWidth="2" viewBox="0 0 24 24">
                                            <rect x="5" y="5" width="14" height="14" rx="2" />
                                            <circle cx="12" cy="12" r="3" />
                                            <circle cx="7" cy="7" r="1" />
                                            <circle cx="17" cy="7" r="1" />
                                            <circle cx="7" cy="17" r="1" />
                                            <circle cx="17" cy="17" r="1" />
                                        </svg>
                                        2D
                                    </button>
                                </div>
                            </div>
                            {/* Right: Zoom controls */}
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600 text-sm">Zoom</span>
                                <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[#F3F3F3] text-black shadow">+</button>
                                <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[#F3F3F3] text-black shadow">-</button>
                                <button className="w-7 h-7 flex items-center justify-center rounded-full bg-black text-white shadow">
                                    {/* Fullscreen/expand icon */}
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M4 8V4h4" />
                                        <path d="M20 8V4h-4" />
                                        <path d="M4 16v4h4" />
                                        <path d="M20 16v4h-4" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-full">
                            {/* <MainFrame /> */}
                        </div>
                    </div>
                   

                </div>

            </div>
            

        </div>
    )
}