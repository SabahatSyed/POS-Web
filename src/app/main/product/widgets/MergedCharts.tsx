import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import "./charts.css"

const MergedChart = ({ graphData, series2 }) => {
    const [y1AxisMax, setY1AxisMax] = useState(null);
    const [y2AxisMax, setY2AxisMax] = useState(null);
  const roundAndFormatValue = (value) => {
    let roundingUnit = 1;

    if (value < 1000) {
      roundingUnit = 100;
    } else if (value < 10000) {
      roundingUnit = 500;
    } else if (value < 20000) {
      roundingUnit = 1000;
    } else if (value < 50000) {
      roundingUnit = 5000;
    } else if (value < 100000) {
      roundingUnit = 10000;
    } else {
      roundingUnit = 10000;
    }

    const roundedValue = Math.ceil(value / roundingUnit) * roundingUnit;
    return roundedValue.toLocaleString();
  };
  const calculateYAxisMax = (maxValue) => {
    const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
    return Math.floor(maxValue / magnitude) * magnitude;
  };

  useEffect(() => {
    if (graphData.length > 0) {
      const y1Values = graphData[0]?.data.map((point) => point.y);
      const maxDataValue = Math.max(...y1Values);
      setY1AxisMax(calculateYAxisMax(maxDataValue));
    }
  }, [graphData]);
  useEffect(() => {
    if (series2.length > 0) {
      const y2Values = series2[0]?.data.map((point) => point.y);
      const maxDataValue = Math.max(...y2Values);
      setY2AxisMax(calculateYAxisMax(maxDataValue));
    }
  }, [series2]);
  const chartOptions: ApexOptions = {
    chart: {
      animations: {
        speed: 400,
        animateGradually: {
          enabled: false,
        },
      },
      fontFamily: "inherit",
      foreColor: "inherit",
      width: "100%",
      height: "100%",
      type: "line",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: ["#EC6262", "#2E93fA"], // Add a color for the second series
    dataLabels: {
      enabled: false,
    },

    grid: {
      show: true,
      borderColor: "#e7e7e7", // Replace theme.palette.divider with a color
      padding: {
        top: -20,
        bottom: -10,
        left: 0,
        right: 0,
      },
      position: "back",
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    stroke: {
      width: 2,
    },
    tooltip: {
      followCursor: true,
      shared: true,
      intersect: false,
      theme: "dark",
      x: {
        format: "MMM dd, yyyy",
      },
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const productPrice = w.globals.series[0][dataPointIndex];
        const salesRank = w.globals.series[1][dataPointIndex];
        const productPriceText =
          productPrice !== undefined ? `$${productPrice}` : "N/A";
        const salesRankText = salesRank !== undefined ? salesRank : "N/A";

        return `<div class="apexcharts-tooltip-custom">
              <div class="graph_data">
                <div class="product_price"></div>
                <div>Product Price: ${productPriceText}</div>
                </div>
                 <div class="graph_data">
                <div class="sales_rank"></div>
                <div>Sales Rank: ${salesRankText?.toLocaleString()}</div>
                </div>
             </div>`;
      },
    },

    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        stroke: {
          color: "#e7e7e7", // Replace theme.palette.divider with a color
          dashArray: 0,
          width: 2,
        },
      },
      labels: {
        offsetY: -5,
        style: {
          colors: "#000",
        },
      },
      tickAmount: 20,
      tooltip: {
        enabled: false,
      },
      type: "datetime",
    },
    yaxis: [
      {
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          offsetX: -8,
          formatter: function (value) {
            return `$${value.toFixed(0)}`; // Add dollar sign for Product Price
          },
        },
        min: 0,
        title: {
          text: "Product Price",
        },
        max: y1AxisMax,
        tickAmount: 4,
      },
      {
        opposite: true,
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          offsetX: -8,
          formatter: function (value) {
            return (Math.round(value)?.toLocaleString());
          },
        },
        min: 0,
        title: {
          text: "Sales Rank", // Update the title for the second y-axis
        },
        max: y2AxisMax,
        tickAmount: 4,
      },
    ],
  };

  const series = [
    {
      name: "Product Price",
      data: graphData[0].data,
    },
    {
      name: "Sales Rank",
      data: series2[0].data,
    },
  ];

  return (
    <ReactApexChart
      className="flex-auto"
      options={chartOptions}
      series={series}
      type={chartOptions.chart.type}
      height={chartOptions.chart.height}
    />
  );
};

export default MergedChart;
