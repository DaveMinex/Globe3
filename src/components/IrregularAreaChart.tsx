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
    markers: { 
      size: 4,
      colors: ["#0a1844"],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6
      }
    },
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
      show: true,
      labels: {
        style: { 
          colors: "#666",
          fontSize: '12px',
          fontFamily: 'SfProDisplay-Medium'
        },
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
        rotateAlways: false,
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
      axisBorder: { show: false },
      axisTicks: { show: false }
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
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      offsetX: -10,
      labels: {
        colors: "#666"
      }
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