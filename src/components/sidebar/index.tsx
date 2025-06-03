import React from "react";
import { HomeIcon } from "./HomeIcon";
import { DashboardIcon } from "./DashboardIcon";
import { CompanyIcon } from "./CompanyIcon";
import { KycIcon } from "./KycIcon";
import { BetLogsIcon } from "./BetLogsIcon";
import { ApiIcon } from "./ApiIcon";
import { SettingsIcon } from "./SettingsIcon";
import { LogoutIcon } from "./LogoutIcon";

interface SidebarProps {
  active: string;
  hovered: string | null;
  setActive: (name: string) => void;
  setHovered: (name: string | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  active,
  hovered,
  setActive,
  setHovered,   
}) => (
  <div className="h-[calc(100vh-40px)] w-[98px] bg-[#E4E4E4] rounded-3xl flex flex-col items-center py-4 justify-between" style={{ zIndex: 1001 }}>
    {/* Top: Logo + Home */}
    <div className="flex flex-col items-center gap-8">
      <img src="/logo.png" className="w-14 h-14 mb-2" alt="logo" />
      <div className="flex flex-col items-center">
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
);

export default Sidebar;
