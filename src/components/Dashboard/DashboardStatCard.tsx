import React from "react";

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  delta?: string;
  deltaIcon?: string;
  icon?: string;
  iconBg?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  title,
  value,
  subtitle,
  delta,
  deltaIcon,
  icon,
  iconBg = "bg-[rgba(0,0,0,0.10)]",
  className = "",
  style = {},
}) => {
  return (
    // <div
    //   className={`bg-[#ffffff] rounded-3xl border-solid border-[transparent] border-4 overflow-hidden ${className}`}
    //   style={{ backdropFilter: "blur(20px)" }}
    // >
    //   <div className="text-[#000000] text-left font-['SfProDisplay-Medium',_sans-serif] text-lg text-sm absolute left-[13px] top-[13px]">
    //     {title}
    //   </div>
    //   <div className="flex flex-row gap-3 items-center justify-start absolute left-[13px] bottom-[0px]">
    //     <div className="text-[#000000] text-left font-['SfProDisplay-Semibold',_sans-serif] text-[64px] font-semibold relative">
    //       {value}
    //     </div>
    //     {subtitle && (
    //       <div className="flex flex-col items-end justify-between shrink-0 w-[136px] h-[58px] relative">
    //         <div className="flex flex-row gap-1 items-center justify-end self-stretch shrink-0 relative">
    //           <div className="text-[rgba(0,0,0,0.70)] text-right font-['SfProDisplay-Medium',_sans-serif] text-base text-sm relative">
    //             {subtitle}
    //           </div>
    //         </div>
    //         {delta && (
    //           <div
    //             className="rounded-[9px] p-1.5 flex flex-row gap-0.5 items-center justify-center shrink-0 relative"
    //             style={{
    //               background: delta.includes("-")
    //                 ? "var(--gradients-red, linear-gradient(180deg, rgba(255, 125, 125, 1.00) 0%,rgba(246, 26, 26, 1.00) 100%))"
    //                 : "var(--gradients-green, linear-gradient(180deg, rgba(114, 255, 119, 1.00) 0%,rgba(13, 164, 18, 1.00) 100%))",
    //             }}
    //           >
    //             <div className="text-[#ffffff] text-left font-['SfProDisplay-Medium',_sans-serif] text-base text-sm relative">
    //               {delta}
    //             </div>
    //             {deltaIcon && (
    //               <img
    //                 className="shrink-0 w-5 h-5 relative overflow-visible"
    //                 src={deltaIcon}
    //                 alt="delta icon"
    //               />
    //             )}
    //           </div>
    //         )}
    //       </div>
    //     )}
    //   </div>
    //   {icon && (
    //     <div
    //       className={`${iconBg} rounded-3xl p-2.5 flex flex-row gap-2 items-center justify-start w-12 h-12 absolute left-[233px] top-3`}
    //       style={{ backdropFilter: "blur(20px)" }}
    //     >
    //       <img
    //         className="shrink-0 w-7 h-7 relative overflow-visible"
    //         src={icon}
    //         alt="card icon"
    //       />
    //     </div>
    //   )}
    // </div>
    <div className="p-4 py-3 bg-white rounded-3xl">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-1 justify-between">
          <div className="text-md font-bold">{title}</div>
          <div>
            {icon && <button className="bg-gray-200 rounded-full p-2 hover:bg-gray-300"><img src={icon} alt="icon" /></button>}
          </div>
        </div>
        <div className="flex flex-row gap-1 justify-between">
          <div className="text-5xl font-bold">{value}</div>
          <div className="flex flex-col gap-1 justify-end items-end">
            <div>
              {subtitle}
            </div>
            <div className="flex gap-1 items-center bg-red-500 rounded-md p-1">
              <div className="text-sm font-bold text-white">{delta}</div>  <img src={deltaIcon} alt="delta" /> 
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}; 