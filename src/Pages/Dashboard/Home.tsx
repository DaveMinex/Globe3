import React, { useState, useEffect, useRef } from "react";
import { HomeIcon } from "../../components/Sidebar/HomeIcon";
import { DashboardIcon } from "../../components/Sidebar/DashboardIcon";
import { CompanyIcon } from "../../components/Sidebar/CompanyIcon";
import { KycIcon } from "../../components/Sidebar/KycIcon";
import { BetLogsIcon } from "../../components/Sidebar/BetLogsIcon";
import { ApiIcon } from "../../components/Sidebar/ApiIcon";
import { SettingsIcon } from "../../components/Sidebar/SettingsIcon";
import { LogoutIcon } from "../../components/Sidebar/LogoutIcon";
import { GlowingRippleDot } from "../../components/Dashboard/GlowingRippleDot";
import { MainFrame } from "./MainFrame";
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import { ThemeToggle } from "../../components/Dashboard/ThemeToggle";
import Sidebar from "../../components/Sidebar/index";
import { Header } from "../../components/Header";
import { Earth } from "../../components/Dashboard/Earth";
import { Footer } from "../../components/Dashboard/Footer";

interface Location {
    lat: number;
    lng: number;
    city: string;
    users: number;
    position: {
        x: number;
        y: number;
    };
}

export interface IDashboardHomeProps {
    className?: string;
}

export const DashboardHome = ({
    className,
    ...props
}: IDashboardHomeProps): JSX.Element => {
    const [loading, setLoading] = useState(true);
    const [hovered, setHovered] = useState<string | null>(null);
    const [active, setActive] = useState<string>("Dashboard");
    const [viewMode, setViewMode] = useState<'3D' | '2D'>('3D');
    const [scrollY, setScrollY] = useState(window.innerHeight);
    const [mainFrameHeight, setMainFrameHeight] = useState(0);
    const [selectedCity, setSelectedCity] = useState<Location | null>(null);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [toggleAnim, setToggleAnim] = useState(false);
    const [moveAnim, setMoveAnim] = useState<'left' | 'right' | null>(null);
    const mainFrameRef = useRef<HTMLDivElement>(null);
    const globeRef = useRef<any>();

    const locations: Location[] = [
        {
            lat: 32.7157,
            lng: -117.1611,
            city: "San Diego",
            users: 140867,
            position: { x: 0.22, y: 0.28 }
        },
        {
            lat: 40.7128,
            lng: -74.0060,
            city: "New York City",
            users: 3586,
            position: { x: 0.29, y: 0.27 }
        },
        {
            lat: 29.7604,
            lng: -95.3698,
            city: "Houston",
            users: 24980,
            position: { x: 0.24, y: 0.33 }
        },
        {
            lat: 34.0522,
            lng: -118.2437,
            city: "Los Angeles",
            users: 6354,
            position: { x: 0.19, y: 0.30 }
        },
        {
            lat: 41.8781,
            lng: -87.6298,
            city: "Chicago",
            users: 10756,
            position: { x: 0.26, y: 0.28 }
        }
    ];

    // Generate particles for the globe
    const particles = Array.from({ length: 1000 }, () => ({
        lat: (Math.random() - 0.5) * 180,
        lng: (Math.random() - 0.5) * 360,
        size: Math.random() * 0.5 + 0.1,
        color: ['#ffffff', '#ffff00', '#00ffff'][Math.floor(Math.random() * 3)]
    }));

    useEffect(() => {
        if (globeRef.current) {
            const controls = globeRef.current.controls();
            controls.enableZoom = true;
            controls.enablePan = true;
            controls.enableRotate = true;
            controls.rotateSpeed = 0.5;
            controls.zoomSpeed = 0.5;
            controls.panSpeed = 0.5;
            controls.minDistance = 200;
            controls.maxDistance = 500;
        }
    }, []);

    const handlePointClick = (point: any) => {
        setSelectedCity(point as Location);
        if (globeRef.current) {
            globeRef.current.pointOfView({
                lat: point.lat,
                lng: point.lng,
                altitude: 2
            }, 1000);
        }
    };

    const getMainFrameHeight = () => {
        if (mainFrameRef.current) {
            const height = mainFrameRef.current.scrollHeight;
            setMainFrameHeight(height);
            return height;
        }
        return 0;
    }

    useEffect(() => {
        getMainFrameHeight();
    }, []); // Run once after mount

    useEffect(() => {
        const handleScroll = (event: WheelEvent) => {
            console.log(getMainFrameHeight());
            if (getMainFrameHeight() === 0) return;
            setScrollY(prev => {
                return prev + event.deltaY
            });
            return
        };
        window.addEventListener("wheel", handleScroll);
        return () => window.removeEventListener("wheel", handleScroll);
    }, []);

    useEffect(() => {
        console.log(window.innerHeight)
        console.log(scrollY);
    }, [scrollY]);

    const handleThemeToggle = () => {
        setMoveAnim(theme === 'light' ? 'right' : 'left');
        setTimeout(() => {
            setTheme(theme === 'light' ? 'dark' : 'light');
            setMoveAnim(null);
        }, 300); // match animation duration
    };

    return (
        <div className={`w-full bg-[#E4E4E4] relative overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
            <div className="relative max-w-[1440px] h-[100vh] mx-auto bg-white overflow-hidden z-10">

                {/* Scene 1 */}
                <div className="w-full h-full overflow-hidden">
                    <div className="relative">
                        <div className="flex flex-row bg-white m-4 gap-4 relative">

                            {/* Sidebar */}
                            <Sidebar
                                active={active}
                                hovered={hovered}
                                setActive={setActive}
                                setHovered={setHovered}
                            />
                            {/* Main */}
                            <div className="w-full h-[calc(100vh-40px)] flex flex-col relative">
                                {/* Header */}
                                <Header
                                    searchPlaceholder="Search here..."
                                    onSearchChange={(value) => console.log(value)}
                                    avatarSrc="/ellipse-10.png"
                                    className="z-20 relative"
                                />
                                {/* description */}
                                <div className="flex flex-row mt-16 w-full relative">
                                    <div className="flex flex-row justify-between w-full px-4">
                                        <div className="flex flex-col gap-8">
                                            <div>
                                                <p
                                                    className="text-[22px] font-sfmono  leading-[17px]"
                                                    style={{ letterSpacing: '-0.03em' }}
                                                >
                                                    AI Powered
                                                </p>
                                                <p
                                                    className="text-[22px] font-sfmono"
                                                    style={{ letterSpacing: '-0.03em' }}
                                                >

                                                    User Dashboard
                                                </p>
                                            </div>
                                            <div>

                                                <div>
                                                    <p
                                                        className="text-md font-satoshi font-medium text-[14px] leading-[17px] text-black/60"
                                                        style={{ letterSpacing: '-0.03em' }}
                                                    >
                                                        Rotate The Globe
                                                    </p>
                                                    <p className="text-md font-satoshi font-medium text-[14px] leading-[17px] text-black/60"
                                                        style={{ letterSpacing: '-0.03em' }}
                                                    >
                                                        You'll See The World Over
                                                    </p>
                                                </div>
                                                <div className="mt-4">
                                                    <p className=" font-satoshi font-medium text-[22px]  leading-[17px]"
                                                        style={{ letterSpacing: '-0.03em' }}
                                                    >
                                                        Active Users and
                                                    </p>
                                                    <p className=" font-satoshi font-medium text-[22px]  leading-[38px]"
                                                        style={{ letterSpacing: '-0.03em' }}
                                                    >
                                                        Their Details.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            <div className="w-[180px]">
                                                <p className="font-satoshi font-medium text-[38px]  leading-[39px]" style={{ letterSpacing: '-0.03em' }}>
                                                    Main
                                                </p>
                                                <p className="font-satoshi font-medium text-[38px]  leading-[39px]" style={{ letterSpacing: '-0.03em' }}>
                                                    Analytics
                                                </p>
                                            </div>
                                            <div className="mb-4">
                                                <div className="font-satoshi font-medium text-[18px] text-black/60" style={{ letterSpacing: '-0.03em' }}>Global Active Users</div>
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="font-sfmono font-medium text-[22px] black-gray"
                                                        style={{ letterSpacing: '-0.03em' }}
                                                    >
                                                        14,000
                                                    </span>
                                                    <span className="flex items-center black-gray font-sfpro font-regular text-[13px]"
                                                        style={{ letterSpacing: '-0.03em' }}
                                                    >
                                                        {/* Up arrow icon (SVG) */}
                                                        <img src="frame3.svg" alt="Up arrow" className="w-4 h-4 mr-0.5 inline" />
                                                        +34%
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mb-4">
                                                <div className="font-satoshi font-medium text-[18px] text-black/60" style={{ letterSpacing: '-0.03em' }}>Total No. Of Bet Amounts</div>
                                                <div className="flex items-center gap-2 justify-between">
                                                    <span
                                                        className="font-sfmono font-medium text-[22px] black-gray"
                                                        style={{ letterSpacing: '-0.03em' }}
                                                    >
                                                        $100,000
                                                    </span>
                                                    <span className="flex items-center black-gray font-sfpro font-regular text-[13px]"
                                                        style={{ letterSpacing: '-0.03em' }}
                                                    >
                                                        {/* Up arrow icon (SVG) */}
                                                        <img src="frame3.svg" alt="Up arrow" className="w-4 h-4 mr-0.5 inline" />
                                                        +64%
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mb-4">
                                                <div className="font-satoshi font-medium text-[18px] text-black/60" style={{ letterSpacing: '-0.03em' }}>Total Withdrawal Requested</div>
                                                <div className="flex items-center gap-2 justify-between">
                                                    <span
                                                        className="font-sfmono font-medium text-[22px] black-gray"
                                                        style={{ letterSpacing: '-0.03em' }}
                                                    >
                                                        $1,20,000
                                                    </span>
                                                    <span className="flex items-center black-gray font-sfpro font-regular text-[13px]"
                                                        style={{ letterSpacing: '-0.03em' }}
                                                    >
                                                        {/* Up arrow icon (SVG) */}
                                                        <img src="frame3.svg" alt="Up arrow" className="w-4 h-4 mr-0.5 inline" />
                                                        +40%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Earth */}
                                <div className={`absolute top-[40px] w-full h-full z-0 ${viewMode === '2D' ? 'pointer-events-none' : ''}`}>
                                    <div className="w-full h-full flex justify-center items-center">
                                        <Earth
                                            viewMode={viewMode}
                                            locations={locations}
                                            selectedCity={selectedCity}
                                            onPointClick={handlePointClick}
                                            globeRef={globeRef}
                                        />
                                    </div>
                                </div>
                                {/* Footer */}
                                <Footer
                                    viewMode={viewMode}
                                    setViewMode={setViewMode}
                                    lightIcon="/theme-toggle-light.svg"
                                    darkIcon="/theme-toggle-dark.svg"
                                    iconSize={20}
                                    lightLabel="Light"
                                    darkLabel="Dark"
                                    animationDuration={200}
                                    className="my-4 z-20 relative"
                                    style={{ border: '2px solid #eee', zIndex: 1000 }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}