import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import ApexCharts, { ApexOptions } from "apexcharts";

interface IrregularAreaChartProps {
  series: ApexAxisChartSeries;
  height?: number | string;
  className?: string;
}

export const IrregularAreaChart: React.FC<IrregularAreaChartProps> = ({
  series,
  height = 350,
  className = "",
}) => {
  const [selection, setSelection] = useState('this_month');

  const options: ApexOptions = {
    chart: {
      id: 'area-datetime',
      type: 'area',
      height: typeof height === 'number' ? height : 350,
      zoom: {
        autoScaleYaxis: true
      },
      toolbar: { show: false },
      background: 'transparent',
    },
    annotations: {
      yaxis: [
        {
          y: 30,
          borderColor: '#999',
          label: {
            show: true,
            text: 'Support',
            style: {
              color: '#fff',
              background: '#00E396',
            },
          },
        },
      ],
      xaxis: [
        {
          x: new Date('14 Nov 2012').getTime(),
          borderColor: '#999',
          yAxisIndex: 0,
          label: {
            show: true,
            text: 'Rally',
            style: {
              color: '#fff',
              background: '#775DD0',
            },
          },
        },
      ],
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
      style: 'hollow',
    },
    xaxis: {
      type: 'datetime',
      min: new Date('01 Mar 2025').getTime(),
      tickAmount: 6,
    },
    tooltip: {
      x: {
        format: 'dd MMM yyyy',
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 100],
      },
    },
  };

  const updateData = (period: string) => {
    setSelection(period);
    switch (period) {
      case 'this_month':
        // April 2025
        ApexCharts.exec(
          'area-datetime',
          'zoomX',
          new Date('01 Apr 2025').getTime(),
          new Date('30 Apr 2025').getTime()
        );
        break;
      case 'last_month_period':
        // March 2025
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
    <div className={className}>
      {/* <div className="toolbar mb-4 flex gap-2">
        <button
          onClick={() => updateData('this_month')}
          className={`px-3 py-1 rounded-md text-sm ${
            selection === 'this_month'
              ? 'bg-[#0a1844] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          This Month
        </button>
        <button
          onClick={() => updateData('last_month_period')}
          className={`px-3 py-1 rounded-md text-sm ${
            selection === 'last_month_period'
              ? 'bg-[#0a1844] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Some Period Last Month
        </button>
      </div> */}
      <ReactApexChart options={options} series={series} type="area" height={height} />
    </div>
  );
};
