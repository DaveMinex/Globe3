import React, { useState, useRef, useEffect } from "react";
import { DashboardStatCard } from "../components/DashboardStatCard";
import { IrregularAreaChart } from "../components/IrregularAreaChart";
import { StatCardsSection } from "../components/StatCardsSection";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../components/Dropdown";
import { CircularProgressChart } from "../components/CircularProgressChart";
import ApexCharts from "apexcharts";

export interface IMainFrameProps {
    className?: string;
}

// Example data for the chart
const chartSeries = [
    {
        name: "Total Bet Amount",
        data: [
            [new Date("2025-04-01").getTime(), 7532],
            [new Date("2025-04-04").getTime(), 12000],
            [new Date("2025-04-08").getTime(), 7532],
            [new Date("2025-04-20").getTime(), 18000],
            [new Date("2025-04-25").getTime(), 15000],
            [new Date("2025-06-01").getTime(), 10000],
        ],
    },
];
const userRegistrrationchartSeries = [
    {
        name: "Total Bet Amount",
        data: [
            [new Date("2025-04-01").getTime(), 7532],
            [new Date("2025-04-04").getTime(), 12000],
            [new Date("2025-04-08").getTime(), 7532],
            [new Date("2025-04-20").getTime(), 18000],
            [new Date("2025-04-25").getTime(), 15000],
            [new Date("2025-06-01").getTime(), 10000],
        ],
    },
];

const chartOptions: ApexOptions = {
    colors: ["#000"],
    stroke: {
        curve: "smooth" as const,
        width: 4,
        colors: ["#000"],
    },
    fill: {
        type: "gradient" as const,
        gradient: {
            shade: "light" as const,
            type: "vertical" as const,
            shadeIntensity: 0.2,
            gradientToColors: ["#fff"],
            inverseColors: false,
            opacityFrom: 0.5,
            opacityTo: 0,
            stops: [0, 100],
        },
    },
    markers: {
        size: 6,
        colors: ["#fff"],
        strokeColors: "#000",
        strokeWidth: 3,
        hover: { size: 8 },
    },
    chart: {
        type: "area" as const,
        toolbar: {
            show: false
        },
        zoom: {
            enabled: false
        }
    },
    dataLabels: {
        enabled: false
    },
    grid: {
        show: true,
        borderColor: '#f3f3f3',
        strokeDashArray: 4,
        position: 'back',
        xaxis: {
            lines: {
                show: true
            }
        },
        yaxis: {
            lines: {
                show: true
            }
        }
    },
    xaxis: {
        type: "datetime" as const,
        labels: {
            show: true,
            style: {
                colors: "#666",
                fontSize: '12px',
                fontFamily: 'SfProDisplay-Medium'
            },
            datetimeFormatter: {
                year: 'yyyy',
                month: "MMM 'yy",
                day: 'dd MMM',
                hour: 'HH:mm'
            }
        },
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        }
    },
    yaxis: {
        show: true,
        labels: {
            show: true,
            style: {
                colors: "#666",
                fontSize: '12px',
                fontFamily: 'SfProDisplay-Medium'
            },
            formatter: (val: number) => val.toLocaleString()
        },
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        }
    },
    tooltip: {
        enabled: true,
        shared: true,
        intersect: false,
        x: {
            format: 'dd MMM yyyy HH:mm'
        },
        y: {
            formatter: (value: number) => value.toLocaleString()
        },
        style: {
            fontSize: '12px',
            fontFamily: 'SfProDisplay-Medium'
        },
        theme: 'light',
        marker: {
            show: true
        }
    }
};

// Replace the static filter with a dropdown
const filterOptions = [
    { label: "This Month", value: "month" },
    { label: "This Week", value: "week" },
    { label: "This Year", value: "year" },
];

// Add new filter options for game section
const gameFilterOptions = [
    { label: "Today", value: "today" },
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
];

export const MainFrame = ({
    className,
    ...props
}: IMainFrameProps): JSX.Element => {
    const [activePeriod, setActivePeriod] = useState("this_month");
    const [selectedPeriod, setSelectedPeriod] = useState("Today");
    const periodOptions = ["Today", "This Week", "This Month"];
    const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [selectedUserRegFilter, setSelectedUserRegFilter] = useState(filterOptions[0]);
    const [userRegDropdownOpen, setUserRegDropdownOpen] = useState(false);
    const userRegDropdownRef = useRef<HTMLDivElement>(null);
    const [selectedGameFilter, setSelectedGameFilter] = useState(gameFilterOptions[0]);
    const [gameDropdownOpen, setGameDropdownOpen] = useState(false);
    const gameDropdownRef = useRef<HTMLDivElement>(null);
    const [selectedWinFilter, setSelectedWinFilter] = useState(gameFilterOptions[0]);
    const [winDropdownOpen, setWinDropdownOpen] = useState(false);
    const winDropdownRef = useRef<HTMLDivElement>(null);
    const [selectedLossFilter, setSelectedLossFilter] = useState(gameFilterOptions[0]);
    const [lossDropdownOpen, setLossDropdownOpen] = useState(false);
    const lossDropdownRef = useRef<HTMLDivElement>(null);
    const [selectedWithdrawalFilter, setSelectedWithdrawalFilter] = useState(gameFilterOptions[0]);
    const [withdrawalDropdownOpen, setWithdrawalDropdownOpen] = useState(false);
    const withdrawalDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
            if (userRegDropdownRef.current && !userRegDropdownRef.current.contains(event.target as Node)) {
                setUserRegDropdownOpen(false);
            }
            if (gameDropdownRef.current && !gameDropdownRef.current.contains(event.target as Node)) {
                setGameDropdownOpen(false);
            }
            if (winDropdownRef.current && !winDropdownRef.current.contains(event.target as Node)) {
                setWinDropdownOpen(false);
            }
            if (lossDropdownRef.current && !lossDropdownRef.current.contains(event.target as Node)) {
                setLossDropdownOpen(false);
            }
            if (withdrawalDropdownRef.current && !withdrawalDropdownRef.current.contains(event.target as Node)) {
                setWithdrawalDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const updateData = (period: string) => {
        setActivePeriod(period);
        switch (period) {
            case 'this_month':
                ApexCharts.exec(
                    'area-datetime',
                    'zoomX',
                    new Date('01 Apr 2025').getTime(),
                    new Date('30 Apr 2025').getTime()
                );
                break;
            case 'last_month_period':
                ApexCharts.exec(
                    'area-datetime',
                    'zoomX',
                    new Date('01 Mar 2025').getTime(),
                    new Date('31 Mar 2025').getTime()
                );
                break;
            default:
        }
    };

    return (
        <div className="w-full bg-[#E4E4E400]">
            <div className={"bg-transparent h-[900px] max-w-[1440px] mx-auto"}>
                <div className="w-full h-full">
                    <StatCardsSection />
                    <div className="flex flex-row gap-4">
                        <div className="flex flex-col gap-4">
                            <div
                                className="w-full"
                            >
                                <div className="bg-[#e4e4e4] w-full    relative ">

                                    <div
                                        className="mt-4 flex flex-row justify-between items-start px-4 py-2"
                                    >
                                        <div className="flex flex-row gap-1.5 items-start justify-start w-[219px]">
                                            <div className="flex flex-col gap-0.5 items-start justify-start self-stretch shrink-0 relative w-full">
                                                <div
                                                    className="text-[#000000] text-left text-nowrap font-['SfProDisplay-Semibold',_sans-serif] text-lg font-semibold relative self-stretch"
                                                    style={{ letterSpacing: "0.01em" }}
                                    >
                                                    Total Bet Amount Overview{" "}
                            </div>
                            <div
                                                    className="text-[rgba(0,0,0,0.60)] text-left font-['SfProDisplay-Medium',_sans-serif] text-[13px] font-medium relative self-stretch"
                                                    style={{ letterSpacing: "0.02em" }}
                            >
                                                    Monthly Views{" "}
                        </div>
                        <div
                                                    className="text-[#000000] text-left font-['SfProDisplay-Bold',_sans-serif] text-xl font-bold relative self-stretch"
                                                    style={{ letterSpacing: "0.01em" }}
                        >
                                                    $57,892.00{" "}
                            </div>
                                </div>
                                        </div>
                                        <div className="flex flex-row gap-3 items-center justify-start">
                                            <button
                                                className={`rounded-[23px] border-solid border-[rgba(0,0,0,0.20)] border-[0.6px] pt-1.5 pr-2.5 pb-1.5 pl-2.5 flex flex-row gap-1.5 items-center justify-center shrink-0 h-8 relative`}
                                        style={{
                                                    background: activePeriod === "this_month"
                                                        ? "linear-gradient(180deg, rgba(255,255,255,1) 0%,rgba(243,243,243,1) 100%)"
                                                        : "linear-gradient(180deg, rgba(255,255,255,1) 0%,rgba(243,243,243,1) 100%)"
                                                }}
                                                onClick={() => updateData("this_month")}
                                            >
                                                <div
                                                    className="rounded-full shrink-0 w-2.5 h-2.5 relative flex items-center justify-center"
                                        style={{
                                                        border: "1.5px solid #c5c5c5",
                                                        background: "#fff",
                                                        aspectRatio: "1"
                                        }}
                                    >
                                                    {activePeriod === "this_month" && (
                                                        <div className="bg-black rounded-full w-1.5 h-1.5"></div>
                                                    )}
                                        </div>
                                                <div className="text-[#000000] text-center font-['SfProDisplay-Medium',_sans-serif] text-[15px] text-sm relative">
                                                    This month{" "}
                                    </div>
                                            </button>
                                            <button
                                                className={`rounded-[23px] border-solid border-[rgba(0,0,0,0.20)] border-[0.6px] pt-1.5 pr-2.5 pb-1.5 pl-2.5 flex flex-row gap-1.5 items-center justify-center shrink-0 h-8 relative`}
                                        style={{
                                                    background: activePeriod === "last_month_period"
                                                        ? "linear-gradient(180deg, rgba(255,255,255,1) 0%,rgba(243,243,243,1) 100%)"
                                                        : "linear-gradient(180deg, rgba(255,255,255,1) 0%,rgba(243,243,243,1) 100%)"
                                                }}
                                                onClick={() => updateData("last_month_period")}
                                            >
                    <div
                                                    className="rounded-full shrink-0 w-2.5 h-2.5 relative flex items-center justify-center"
                                style={{
                                                        border: "1.5px solid #c5c5c5",
                                                        background: "#fff",
                                                        aspectRatio: "1"
                                    }}
                                                >
                                                    {activePeriod === "last_month_period" && (
                                                        <div className="bg-black rounded-full w-1.5 h-1.5"></div>
                                                    )}
                                </div>
                                <div className="text-[#000000] text-center font-['SfProDisplay-Medium',_sans-serif] text-[15px] text-sm relative">
                                    Some period last month{" "}
                                </div>
                                            </button>
                            <div
                                className="rounded-[23px] border-solid border-[rgba(0,0,0,0.20)] border-[0.6px] pt-1.5 pr-2.5 pb-1.5 pl-2.5 flex flex-row gap-1 items-center justify-center shrink-0 relative"
                                style={{
                                    background:
                                        "linear-gradient(180deg, rgba(255, 255, 255, 1.00) 0%,rgba(243, 243, 243, 1.00) 100%)",
                                }}
                            >
                                <div className="text-[#000000] text-center font-['SfProDisplay-Medium',_sans-serif] text-[15px] text-sm relative">
                                    Total Balance{" "}
                                </div>
                                <img
                                    className="shrink-0 w-5 h-5 relative overflow-visible"
                                    src="frame9.svg"
                                />
                            </div>
                        </div>
                                </div>

                                    <div className="chart-irregular w-full  ">
                                        <IrregularAreaChart series={chartSeries} height={180} className="w-full" options={chartOptions} />
                                </div>

                            </div>
 
                                <div className="mt-4 bg-[#e4e4e4] px-2 py-4">
                                    <div className="flex flex-row justify-between items-end justify-start ">
                            <div
                                className="text-[#000000] text-left font-['PpNeueMontreal-Medium',_sans-serif] text-lg font-medium relative"
                                style={{ letterSpacing: "-0.03em" }}
                            >
                                Game Monitoring Overview{" "}
                            </div>
                            <div className="flex flex-row gap-3 items-center justify-start shrink-0 relative">
                                <div
                                    className="text-[rgba(0,0,0,0.70)] text-left font-['PpNeueMontreal-Medium',_sans-serif] text-lg font-medium relative"
                                    style={{ letterSpacing: "-0.03em" }}
                                >
                                    Latest Updates: Just Now{" "}
                                </div>
                                            <div className="bg-[#0a1844] rounded-[9px] p-1.5 flex flex-row gap-0.5 items-center justify-center shrink-0 relative">
                                                <Dropdown
                                                    options={filterOptions}
                                                    value={selectedFilter}
                                                    onChange={setSelectedFilter}
                                    />
                                </div>
                            </div>
                        </div>
                                    <div className="flex flex-row gap-5 items-center justify-start mt-4">
                            <div
                                            className="bg-[#ffffff] rounded-3xl shrink-0 w-[255px] h-[126px] relative overflow-hidden"
                                style={{ backdropFilter: "blur(20px)" }}
                            >
                                <div
                                    className="flex flex-row gap-[21px] items-center justify-start absolute left-[50%] top-[50%]"
                                    style={{ translate: "-50% -50%" }}
                                >
                                    <div
                                        className="bg-[#0a1844] rounded-[27px] p-2 flex flex-row gap-2 items-center justify-center shrink-0 w-[54px] h-[54px] relative"
                                        style={{
                                            boxShadow:
                                                "0px 2px 4px 0px rgba(115, 115, 115, 0.20),  2px 7px 7px 0px rgba(115, 115, 115, 0.17),  4px 16px 10px 0px rgba(115, 115, 115, 0.10),  8px 28px 12px 0px rgba(115, 115, 115, 0.03),  12px 44px 13px 0px rgba(115, 115, 115, 0.00)",
                                        }}
                                    >
                                        <img
                                            className="shrink-0 w-[30px] h-[30px] relative overflow-visible"
                                            style={{ aspectRatio: "1" }}
                                            src="frame11.svg"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-0.5 items-start justify-start shrink-0 w-32 relative">
                                        <div
                                            className="text-[#000000] text-left font-['PpNeueMontreal-Medium',_sans-serif] text-[40px] font-medium relative self-stretch"
                                            style={{ letterSpacing: "-0.03em" }}
                                        >
                                            5,124{" "}
                                        </div>
                                        <div
                                            className="text-[rgba(0,0,0,0.60)] text-left font-['SfProDisplay-Medium',_sans-serif] text-base font-medium relative self-stretch"
                                            style={{ letterSpacing: "-0.03em" }}
                                        >
                                            Total Online Players{" "}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                            className="bg-[#ffffff] rounded-3xl shrink-0 w-[253px] h-[126px] relative overflow-hidden"
                                style={{ backdropFilter: "blur(20px)" }}
                            >
                                <div
                                    className="flex flex-row gap-2.5 items-center justify-center absolute left-[50%] top-[50%]"
                                    style={{ translate: "-50% -50%" }}
                                >
                                    <div
                                        className="bg-[#0a1844] rounded-[27px] p-2 flex flex-row gap-2 items-center justify-center shrink-0 w-[54px] h-[54px] relative"
                                        style={{
                                            boxShadow:
                                                "0px 2px 4px 0px rgba(115, 115, 115, 0.20),  2px 7px 7px 0px rgba(115, 115, 115, 0.17),  4px 16px 10px 0px rgba(115, 115, 115, 0.10),  8px 28px 12px 0px rgba(115, 115, 115, 0.03),  12px 44px 13px 0px rgba(115, 115, 115, 0.00)",
                                        }}
                                    >
                                        <img
                                            className="shrink-0 w-[30px] h-[30px] relative overflow-visible"
                                            style={{ aspectRatio: "1" }}
                                            src="frame12.svg"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-0.5 items-start justify-start shrink-0 relative">
                                        <div
                                            className="text-[#000000] text-left font-['PpNeueMontreal-Medium',_sans-serif] text-[40px] font-medium relative"
                                            style={{ letterSpacing: "-0.03em" }}
                                        >
                                            37h 20m{" "}
                                        </div>
                                        <div
                                            className="text-[rgba(0,0,0,0.60)] text-left font-['SfProDisplay-Medium',_sans-serif] text-base font-medium relative self-stretch"
                                            style={{ letterSpacing: "-0.03em" }}
                                        >
                                            Total Gaming Time{" "}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                            className="bg-[#ffffff] rounded-3xl shrink-0 w-[253px] h-[126px] relative overflow-hidden"
                                style={{ backdropFilter: "blur(20px)" }}
                            >
                                <div
                                    className="flex flex-row gap-2.5 items-center justify-center absolute left-[50%] top-[50%]"
                                    style={{ translate: "-50% -50%" }}
                                >
                                    <div
                                        className="bg-[#0a1844] rounded-[27px] p-2 flex flex-row gap-2 items-center justify-center shrink-0 w-[54px] h-[54px] relative"
                                        style={{
                                            boxShadow:
                                                "0px 2px 4px 0px rgba(115, 115, 115, 0.20),  2px 7px 7px 0px rgba(115, 115, 115, 0.17),  4px 16px 10px 0px rgba(115, 115, 115, 0.10),  8px 28px 12px 0px rgba(115, 115, 115, 0.03),  12px 44px 13px 0px rgba(115, 115, 115, 0.00)",
                                        }}
                                    >
                                        <img
                                            className="shrink-0 w-[30px] h-[30px] relative overflow-visible"
                                            style={{ aspectRatio: "1" }}
                                            src="frame13.svg"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-0.5 items-start justify-start shrink-0 relative">
                                        <div
                                            className="text-[#000000] text-left font-['PpNeueMontreal-Medium',_sans-serif] text-[40px] font-medium relative"
                                            style={{ letterSpacing: "-0.03em" }}
                                        >
                                            $827,950{" "}
                                        </div>
                                        <div
                                            className="text-[rgba(0,0,0,0.60)] text-left font-['SfProDisplay-Medium',_sans-serif] text-base font-medium relative self-stretch"
                                            style={{ letterSpacing: "-0.03em" }}
                                        >
                                            Total Bet Amount{" "}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                            className="bg-[#ffffff] rounded-3xl shrink-0 w-[71px] h-[126px] relative overflow-hidden"
                                style={{ backdropFilter: "blur(20px)" }}
                            >
                                            <button
                                    className="bg-[#0a1844] rounded-[27px] p-2 flex flex-row gap-2 items-center justify-center w-12 h-12 absolute left-[50%] top-[50%]"
                                    style={{
                                        translate: "-50% -50%",
                                        boxShadow:
                                            "0px 2px 4px 0px rgba(115, 115, 115, 0.20),  2px 7px 7px 0px rgba(115, 115, 115, 0.17),  4px 16px 10px 0px rgba(115, 115, 115, 0.10),  8px 28px 12px 0px rgba(115, 115, 115, 0.03),  12px 44px 13px 0px rgba(115, 115, 115, 0.00)",
                                        aspectRatio: "1",
                                    }}
                                >
                                    <img
                                        className="shrink-0 w-7 h-7 relative overflow-visible"
                                        src="frame14.svg"
                                    />
                                            </button>
                                </div>
                            </div>


                                    <div className="flex flex-row gap-4 justify-between mt-4 ">
                        <div
                                            className="bg-[#ffffff] rounded-3xl p-4 w-1/2 flex flex-col gap-4"
                        >

                                            <div className="flex flex-row  gap-1items-center justify-between">
                                <div
                                    className="text-[#000000] text-left font-['SfProDisplay-Semibold',_sans-serif] text-lg font-semibold relative"
                                    style={{ letterSpacing: "-0.03em" }}
                                >
                                    Game Being Played{" "}
                                </div>
                                <div className="bg-[#0a1844] rounded-[9px] p-1.5 flex flex-row gap-0.5 items-center justify-center shrink-0 relative">
                                                    <Dropdown
                                                        options={gameFilterOptions}
                                                        value={selectedGameFilter}
                                                        onChange={setSelectedGameFilter}
                                    />
                                </div>
                            </div>
                                            <div className="flex flex-row gap-2.5 items-center justify-start">
                                <img
                                    className="rounded-[14px] shrink-0 w-16 h-16 relative overflow-visible"
                                    style={{ aspectRatio: "1" }}
                                    src="frame16.svg"
                                />
                                <div className="flex flex-col gap-1 items-start justify-start shrink-0 w-[145px] relative">
                                    <div
                                        className="text-[#000000] text-left font-['SfProDisplay-Medium',_sans-serif] text-2xl font-medium relative self-stretch"
                                        style={{ letterSpacing: "-0.03em" }}
                                    >
                                        BlackJack{" "}
                                    </div>
                                    <div className="flex flex-row gap-2.5 items-center justify-start self-stretch shrink-0 relative">
                                        <div
                                            className="text-[rgba(0,0,0,0.60)] text-left font-['SfProDisplay-Medium',_sans-serif] text-base font-medium relative"
                                            style={{ letterSpacing: "-0.03em" }}
                                        >
                                            24 Hours{" "}
                                        </div>
                                        <div
                                            className="text-[rgba(0,0,0,0.60)] text-left font-['SfProDisplay-Medium',_sans-serif] text-base font-medium relative"
                                            style={{ letterSpacing: "-0.03em" }}
                                        >
                                            35 Minutes{" "}
                                        </div>
                                    </div>
                                </div>
                            </div>
                                            <div className="flex justify-between gap-1 border-t-2 border-gray-400 pt-4">
                                                <div className="w-full bg-[#f3f3f3] rounded-[13px] border-solid border-[transparent] border-[0.6px] pt-1.5 pr-2.5 pb-1.5 pl-2.5 flex flex-col gap-1">
                                <div
                                    className="text-[#0a1844] text-left font-['PpNeueMontreal-Medium',_sans-serif] text-sm font-medium relative self-stretch"
                                    style={{ letterSpacing: "-0.03em" }}
                                >
                                    Bet amount{" "}
                                </div>
                                    <div
                                                        className="text-ui-colors-black text-left font-['SfProDisplay-Semibold',_sans-serif] text-lg font-semibold"
                                    >
                                        $21,53,000 <br />
                                    </div>
                                </div>
                                                <div className="w-full bg-[#f3f3f3] rounded-[13px] border-solid border-[transparent] border-[0.6px] pt-1.5 pr-2.5 pb-1.5 pl-2.5 flex flex-col gap-[3px] items-center justify-center ">
                                <div
                                    className="text-[#0a1844] text-left font-['PpNeueMontreal-Medium',_sans-serif] text-sm font-medium relative self-stretch"
                                    style={{ letterSpacing: "-0.03em" }}
                                >
                                    Losing amount{" "}
                                </div>
                                    <div
                                                        className="text-ui-colors-black text-left font-['SfProDisplay-Semibold',_sans-serif] text-lg font-semibold"
                                    >
                                        $243,300,000
                                    </div>
                                </div>
                                                <div className="w-full bg-[#f3f3f3] rounded-[13px] border-solid border-[transparent] border-[0.6px] pt-1.5 pr-2.5 pb-1.5 pl-2.5 flex flex-col  justify-center">
                                <div
                                    className="text-[#0a1844] text-left font-['PpNeueMontreal-Medium',_sans-serif] text-sm font-medium relative self-stretch"
                                    style={{ letterSpacing: "-0.03em" }}
                                >
                                    Win amount{" "}
                                </div>
                                <div className="shrink-0 w-[95px] h-[21px] relative overflow-hidden">
                                    <div
                                        className="text-ui-colors-black text-left font-['SfProDisplay-Semibold',_sans-serif] text-lg font-semibold absolute left-0 top-[calc(50%_-_10.5px)]"
                                        style={{ letterSpacing: "-0.03em" }}
                                    >
                                        $42,33,000
                                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                                            className="bg-[#ffffff] rounded-3xl flex flex-col gap-1 w-full h-[240px] relative"
                                        >
                                            <div className="flex flex-row gap-4 items-center justify-between px-4 pt-4  ">
                                                <div
                                                    className="text-[#000000] text-left font-['SfProDisplay-Semibold',_sans-serif] text-lg font-semibold relative"
                                                    style={{ letterSpacing: "-0.03em" }}
                        >
                                                    User Registration{" "}
                                                </div>
                                                <div className="bg-[#0a1844] rounded-[9px] p-1.5 flex flex-row gap-0.5 items-center justify-center shrink-0 relative">
                                                    <Dropdown
                                                        options={filterOptions}
                                                        value={selectedUserRegFilter}
                                                        onChange={setSelectedUserRegFilter}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-start justify-start  px-4 ">
                                                <div className="text-ui-colors-black text-left font-['PpNeueMontreal-Medium',_sans-serif] text-4xl ">
                                                    346{" "}
                                                </div>
                                                <div
                                                    className="text-[rgba(0,0,0,0.60)] text-left font-['PpNeueMontreal-Medium',_sans-serif] text-sm font-medium relative self-stretch"
                                                    style={{ margin: "-4px 0 0 0" }}
                                                >
                                                    Today{" "}
                                                </div>
                                            </div>
                                            <div className="flex flex-row gap-2 items-center justify-start px-4 w-full absolute top-[60px]">
                                                <IrregularAreaChart series={userRegistrrationchartSeries} height={180} className="w-full" options={chartOptions} />
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="flex flex-row gap-4 items-center justify-between mt-4 w-full"

                                    >
                                        <div
                                            className="bg-[#ffffff] rounded-3xl flex flex-col  justify-between w-full px-4 py-2"
                                        >
                                            <div className="flex flex-row  justify-between w-full">
                                    <div
                                        className="text-[#000000] text-left font-['SfProDisplay-Medium',_sans-serif] text-lg font-medium relative"
                                        style={{ letterSpacing: "-0.03em" }}
                                    >
                                        Total Win Amounts{" "}
                                    </div>
                                    <div
                                        className="text-[#000000] text-left font-['SfProDisplay-Medium',_sans-serif] text-lg font-medium relative"
                                        style={{ letterSpacing: "-0.03em" }}
                                    >
                                                    ...{" "}
                                    </div>
                                </div>
                                            <div className="flex flex-row gap-1 bg-[#0a1844] w-[100px] rounded-xl px-4 py-2 select-none relative">
                                                <Dropdown
                                                    options={gameFilterOptions}
                                                    value={selectedWinFilter}
                                                    onChange={setSelectedWinFilter}
                                                />
                                            </div>
                                            <div className=" rounded-[13px] pt-2 pr-2.5 pb-2 flex flex-row gap-1">
                                    <img
                                                    className="w-[38px] h-[38px] relative overflow-visible"
                                                    src="frame19.svg"
                                    />
                                    <div
                                        className="text-[#000000] text-left font-['SfProDisplay-Medium',_sans-serif] text-3xl font-medium relative"
                                        style={{ letterSpacing: "-0.03em" }}
                                    >
                                        $450,12,900{" "}
                                    </div>
                                </div>
                            </div>
                            <div
                                            className="bg-[#ffffff] rounded-3xl flex flex-col  justify-between w-full px-4 py-2"
                            >
                                            <div className="flex flex-row  justify-between w-full">
                                    <div
                                        className="text-[#000000] text-left font-['SfProDisplay-Medium',_sans-serif] text-lg font-medium relative"
                                        style={{ letterSpacing: "-0.03em" }}
                                    >
                                        Total Loss Amounts{" "}
                                    </div>
                                    <div
                                        className="text-[#000000] text-left font-['SfProDisplay-Medium',_sans-serif] text-lg font-medium relative"
                                        style={{ letterSpacing: "-0.03em" }}
                                    >
                                                    ...{" "}
                                    </div>
                                </div>
                                            <div className="flex flex-row gap-1 bg-[#0a1844] w-[100px] rounded-xl px-4 py-2 select-none relative">
                                                <Dropdown
                                                    options={gameFilterOptions}
                                                    value={selectedLossFilter}
                                                    onChange={setSelectedLossFilter}
                                                />
                                            </div>
                                            <div className=" rounded-[13px] pt-2 pr-2.5 pb-2 flex flex-row gap-1">
                                    <img
                                                    className="w-[38px] h-[38px] relative overflow-visible"
                                        src="frame19.svg"
                                    />
                                    <div
                                        className="text-[#000000] text-left font-['SfProDisplay-Medium',_sans-serif] text-3xl font-medium relative"
                                        style={{ letterSpacing: "-0.03em" }}
                                    >
                                        $500,45,498{" "}
                                    </div>
                                </div>
                            </div>
                            <div
                                            className="bg-[#ffffff] rounded-3xl flex flex-col  justify-between w-full px-4 py-2"
                            >
                                            <div className="flex flex-row  justify-between w-full">
                                    <div
                                        className="text-[#000000] text-left font-['SfProDisplay-Medium',_sans-serif] text-lg font-medium relative"
                                        style={{ letterSpacing: "-0.03em" }}
                                    >
                                        Total Wthdrawals{" "}
                                    </div>
                                    <div
                                        className="text-[#000000] text-left font-['SfProDisplay-Medium',_sans-serif] text-lg font-medium relative"
                                        style={{ letterSpacing: "-0.03em" }}
                                    >
                                                    ...{" "}
                                    </div>
                                </div>
                                            <div className="flex flex-row gap-1 bg-[#0a1844] w-[100px] rounded-xl px-4 py-2 select-none relative">
                                                <Dropdown
                                                    options={gameFilterOptions}
                                                    value={selectedWithdrawalFilter}
                                                    onChange={setSelectedWithdrawalFilter}
                                                />
                                            </div>
                                            <div className=" rounded-[13px] pt-2 pr-2.5 pb-2 flex flex-row gap-1">
                                    <img
                                        className="shrink-0 w-[38px] h-[38px] relative overflow-visible"
                                        style={{ aspectRatio: "1" }}
                                        src="frame21.svg"
                                    />
                                    <div
                                        className="text-[#000000] text-left font-['SfProDisplay-Medium',_sans-serif] text-3xl font-medium relative"
                                        style={{ letterSpacing: "-0.03em" }}
                                    >
                                        $389,87,920{" "}
                                    </div>
                                </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        </div>

                        <div
                            className="bg-[#e4e4e4] border-solid border-[transparent] border-[0.6px] w-full h-[402px] mt-4"
                        >
                            <div className="flex flex-row gap-[142px] items-center justify-center py-4">
                                <div
                                    className="text-[#000000] text-left font-['SfProDisplay-Medium',_sans-serif] text-lg font-medium relative"
                                    style={{ letterSpacing: "-0.03em" }}
                                >
                                    Game Time &amp; RTP{" "}
                                </div>
                                <div
                                    className="text-[#000000] text-left font-['SfProDisplay-Medium',_sans-serif] text-lg font-medium relative"
                                >
                                    ... {" "}
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center py-4 relative">
                                <CircularProgressChart
                                    value={0.8}
                                    label="4:30"
                                    subLabel="Game Time"
                                    subSubLabel="PM"
                                    size={180}
                                    strokeWidth={14}
                                    gradientFrom="#0a1844"
                                    gradientTo="#bfc5d1"
                                    bgColor="#f3f3f3"
                                />
                            </div>
                            <div
                                className="flex flex-col gap-1 items-center justify-center mx-8 border-t-2 border-gray-400"
                            >
                                <div className="flex flex-row gap-1 items-center justify-start mt-4">
                                    <div className="text-[#000000] text-center font-['SfProDisplay-Semibold',_sans-serif] text-5xl font-semibold">
                                        95.34 %
                                </div>
                                    </div>
                                <div className="text-[rgba(0,0,0,0.60)] text-center font-['SfProDisplay-Medium',_sans-serif] text-lgl">
                                    Current Game RTP{" "}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
