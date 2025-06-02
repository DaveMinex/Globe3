import React from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

interface IrregularAreaChartProps {
  series: ApexAxisChartSeries;
  options?: ApexOptions;
  height?: number | string;
  className?: string;
}

export const IrregularAreaChart: React.FC<IrregularAreaChartProps> = ({
  series,
  options = {},
  height = 180,
  className = "",
}) => {
  const defaultOptions: ApexOptions = {
    chart: {
      type: "area",
      stacked: false,
      zoom: { enabled: false },
      toolbar: { show: false },
      background: "transparent",
    },
    dataLabels: { enabled: false },
    markers: { size: 0 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100],
      },
    },
    yaxis: {
      show: false,
      labels: {
        style: { colors: "#8e8da4" },
        offsetX: 0,
        formatter: (val: number) => val.toLocaleString(),
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    xaxis: {
      type: "datetime",
      tickAmount: 8,
      labels: {
        rotate: 0,
        rotateAlways: true,
        style: { colors: "#8e8da4" },
      },
    },
    tooltip: { shared: true },
    legend: {
      position: "top",
      horizontalAlign: "right",
      offsetX: -10,
    },
    ...options,
  };

  return (
    <div className={className}>
      <ReactApexChart
        options={defaultOptions}
        series={series}
        type="area"
        height={height}
      />
    </div>
  );
}; 