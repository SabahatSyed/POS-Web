import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import "./charts.css"
// series3, series4, series5, series6, series7, series8, series9, series10  
const MergedMultipleChart = ({ series, options }) => {

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

  // useEffect(() => {
  //   if (series3.length > 0) {
  //     const y1Values = series3[0]?.data.map((point) => point.y);
  //     const maxDataValue = Math.max(...y1Values);
  //     setY1AxisMax(calculateYAxisMax(maxDataValue));
  //   }
  // }, [series3]);

  // useEffect(() => {
  //   if (series4.length > 0) {
  //     const y2Values = series4[0]?.data.map((point) => point.y);
  //     const maxDataValue = Math.max(...y2Values);
  //     setY2AxisMax(calculateYAxisMax(maxDataValue));
  //   }
  // }, [series4]);

  
  // const chartOptionsgraph2: ApexOptions = {
  //   chart: {
  //     animations: {
  //       speed: 400,
  //       animateGradually: {
  //         enabled: false,
  //       },
  //     },
  //     fontFamily: "inherit",
  //     foreColor: "inherit",
  //     width: "100%",
  //     height: "100%",
  //     type: "line",
  //     toolbar: {
  //       show: false,
  //     },
  //     zoom: {
  //       enabled: false,
  //     },
  //   },
  //   // "#c6cfcf" used color
  //   colors: ["#9fe8d1", "#8d6e68", "#b6c5f1", "#000000"], // Add a color for the second series
  //   dataLabels: {
  //     enabled: false,
  //   },
  //   grid: {
  //     show: true,
  //     borderColor: "#e7e7e7", // Replace theme.palette.divider with a color
  //     padding: {
  //       top: -20,
  //       bottom: -10,
  //       left: 0,
  //       right: 0,
  //     },
  //     position: "back",
  //     xaxis: {
  //       lines: {
  //         show: true,
  //       },
  //     },
  //   },
  //   stroke: {
  //     width: 2,
  //   },
  //   tooltip: {
  //     followCursor: true,
  //     shared: true,
  //     intersect: false,
  //     theme: "dark",
  //     x: {
  //       format: "MMM dd, yyyy",
  //     },
  //     custom: function ({ graph1, seriesIndex, dataPointIndex, w }) {
  //       // console.log('w', w);
  //       // console.log('dataPointIndex', dataPointIndex);
        
  //       const offercount = w.globals.graph1[1][dataPointIndex];
  //       const Reviewcount = w.globals.graph1[2][dataPointIndex];
  //       const Rating = w.globals.graph1[3][dataPointIndex];
  //       const usedoffercount = w.globals.graph1[4][dataPointIndex];

  //       const offercountText = offercount !== undefined ? offercount: "N/A"
  //        const RatingText = Rating !== undefined ? Rating: "N/A"
  //       const ReviewcountText = Reviewcount !== undefined ? Reviewcount: "N/A"
  //        const usedoffercountText = usedoffercount !== undefined ? usedoffercount: "N/A"

  //       return `<div class="apexcharts-tooltip-custom">

  //             <div class="graph_data">
  //               <div class="sales_rank"></div> //offercount
  //                 <div>Sales Rank: ${offercountText?.toLocaleString}</div>
  //               </div>

  //               <div class="graph_data">
  //                 <div class="list_price"></div> // rating
  //                   <div>List Price: ${RatingText?.toLocaleString()}</div>
  //                 </div>

  //                 <div class="graph_data">
  //                   <div class="new_price"></div> Reviewcount
  //                     <div>New: ${ReviewcountText?.toLocaleString()}</div>
  //                   </div>
  
  //                 <div class="graph_data">
  //                   <div class="amazon_price"></div> //used offer count 
  //                     <div>Amazon: ${usedoffercountText?.toLocaleString()}</div>
  //                   </div>
  //               </div>
  //            `;
  //     },
  //   },
  //   xaxis: {
  //     axisBorder: {
  //       show: false,
  //     },
  //     axisTicks: {
  //       show: false,
  //     },
  //     crosshairs: {
  //       stroke: {
  //         color: "#e7e7e7", // Replace theme.palette.divider with a color
  //         dashArray: 0,
  //         width: 2,
  //       },
  //     },
  //     labels: {
  //       offsetY: -5,
  //       style: {
  //         colors: "#000",
  //       },
  //     },
  //     tickAmount: 20,
  //     tooltip: {
  //       enabled: false,
  //     },
  //     type: "datetime",
  //   },
  //   yaxis: [
  //     {
  //       axisTicks: {
  //         show: false,
  //       },
  //       axisBorder: {
  //         show: false,
  //       },
  //       labels: {
  //         offsetX: -8,
  //         formatter: function (value) {
  //           return `$${value.toFixed(0)}`; // Add dollar sign for Product Price
  //         },
  //       },
  //       // min: 0,
  //       // title: {
  //       //   text: "Product Price",
  //       // },
  //       // max: y1AxisMax,
  //       // tickAmount: 4,
  //     },
  //     {
  //       opposite: true,
  //       axisTicks: {
  //         show: false,
  //       },
  //       axisBorder: {
  //         show: false,
  //       },
  //       labels: {
  //         offsetX: -8,
  //         formatter: function (value) {
  //           return (Math.round(value)?.toLocaleString());
  //         },
  //       },
  //       // min: 0,
  //       // title: {
  //       //   text: "Sales Rank", // Update the title for the second y-axis
  //       // },
  //       // max: y2AxisMax,
  //       // tickAmount: 4,
  //     },
  //   ],
  // };
  // const chartOptions: ApexOptions = {
  //   chart: {
  //     animations: {
  //       speed: 400,
  //       animateGradually: {
  //         enabled: false,
  //       },
  //     },
  //     fontFamily: "inherit",
  //     foreColor: "inherit",
  //     width: "100%",
  //     height: "100%",
  //     type: "line",
  //     toolbar: {
  //       show: false,
  //     },
  //     zoom: {
  //       enabled: false,
  //     },
  //   },
  //   // "#c6cfcf" used color
  //   colors: ["#9fe8d1", "#8d6e68", "#b6c5f1", "#fac8a1", "#f89abd", "#ff7800", "#d19fe8", "#000000"], // Add a color for the second series
  //   dataLabels: {
  //     enabled: false,
  //   },
  //   grid: {
  //     show: true,
  //     borderColor: "#e7e7e7", // Replace theme.palette.divider with a color
  //     padding: {
  //       top: -20,
  //       bottom: -10,
  //       left: 0,
  //       right: 0,
  //     },
  //     position: "back",
  //     xaxis: {
  //       lines: {
  //         show: true,
  //       },
  //     },
  //   },
  //   stroke: {
  //     width: 2,
  //   },
  //   tooltip: {
  //     followCursor: true,
  //     shared: true,
  //     intersect: false,
  //     theme: "dark",
  //     x: {
  //       format: "MMM dd, yyyy",
  //     },
  //     custom: function ({ series, seriesIndex, dataPointIndex, w }) {
  //       // console.log('w', w);
  //       // console.log('dataPointIndex', dataPointIndex);
  //       const salesRank = w.globals.series[0][dataPointIndex];
  //       const listPrice = w.globals.series[1][dataPointIndex];
  //       const New = w.globals.series[2][dataPointIndex];
  //       const amazon = w.globals.series[3][dataPointIndex];
  //       const buyBox = w.globals.series[4][dataPointIndex];
  //       const warehouseDeals = w.globals.series[5][dataPointIndex];
  //       const buyBoxUsed = w.globals.series[6][dataPointIndex];
  //       const used = w.globals.series[7][dataPointIndex];
  //       const salesRankText = salesRank !== undefined ? `$${salesRank}` : "N/A";
  //       const listPriceText = listPrice !== undefined ? listPrice : "N/A";
  //       const newText = New !== undefined ? New : "N/A";
  //       const amazonText = amazon !== undefined ? amazon : "N/A";
  //       const buyBoxText = buyBox !== undefined ? buyBox : "N/A";
  //       const warehouseDealText = warehouseDeals !== undefined ? warehouseDeals : "N/A";
  //       const buyBoxUsedText = buyBoxUsed !== undefined ? buyBoxUsed : "N/A";
  //       const usedText = used !== undefined ? used : "N/A";

  //       return `<div class="apexcharts-tooltip-custom">

  //             <div class="graph_data">
  //               <div class="sales_rank"></div>
  //                 <div>Sales Rank: ${salesRankText}</div>
  //               </div>

  //               <div class="graph_data">
  //                 <div class="list_price"></div>
  //                   <div>List Price: ${listPriceText?.toLocaleString()}</div>
  //                 </div>

  //                 <div class="graph_data">
  //                   <div class="new_price"></div>
  //                     <div>New: ${newText?.toLocaleString()}</div>
  //                   </div>
  
  //                 <div class="graph_data">
  //                   <div class="amazon_price"></div>
  //                     <div>Amazon: ${amazonText?.toLocaleString()}</div>
  //                   </div>

  //                 <div class="graph_data">
  //                   <div class="buy_box_price"></div>
  //                     <div>Buy Box: ${buyBoxText?.toLocaleString()}</div>
  //                   </div>
  
  //                 <div class="graph_data">
  //                   <div class="warehouse_price"></div>
  //                     <div>Warehouse Deals: ${warehouseDealText?.toLocaleString()}</div>
  //                   </div>
                  
  //                 <div class="graph_data">
  //                   <div class="buy_box_used_price"></div>
  //                     <div>Buy Box Used: ${buyBoxUsedText?.toLocaleString()}</div>
  //                   </div>

  //                 <div class="graph_data">
  //                   <div class="used_price"></div>
  //                     <div>Used: ${usedText?.toLocaleString()}</div>
  //                   </div>

  //               </div>
  //            `;
  //     },
  //   },
  //   xaxis: {
  //     axisBorder: {
  //       show: false,
  //     },
  //     axisTicks: {
  //       show: false,
  //     },
  //     crosshairs: {
  //       stroke: {
  //         color: "#e7e7e7", // Replace theme.palette.divider with a color
  //         dashArray: 0,
  //         width: 2,
  //       },
  //     },
  //     labels: {
  //       offsetY: -5,
  //       style: {
  //         colors: "#000",
  //       },
  //     },
  //     tickAmount: 20,
  //     tooltip: {
  //       enabled: false,
  //     },
  //     type: "datetime",
  //   },
  //   yaxis: [
  //     {
  //       axisTicks: {
  //         show: false,
  //       },
  //       axisBorder: {
  //         show: false,
  //       },
  //       labels: {
  //         offsetX: -8,
  //         formatter: function (value) {
  //           return `$${value.toFixed(0)}`; // Add dollar sign for Product Price
  //         },
  //       },
  //       // min: 0,
  //       // title: {
  //       //   text: "Product Price",
  //       // },
  //       // max: y1AxisMax,
  //       // tickAmount: 4,
  //     },
  //     {
  //       opposite: true,
  //       axisTicks: {
  //         show: false,
  //       },
  //       axisBorder: {
  //         show: false,
  //       },
  //       labels: {
  //         offsetX: -8,
  //         formatter: function (value) {
  //           return (Math.round(value)?.toLocaleString());
  //         },
  //       },
  //       // min: 0,
  //       // title: {
  //       //   text: "Sales Rank", // Update the title for the second y-axis
  //       // },
  //       // max: y2AxisMax,
  //       // tickAmount: 4,
  //     },
  //   ],
  // };

  // const series = [
  //   {
  //     name: "Sales Rank",
  //     data: series3[0].data,
  //   },
  //   {
  //     name: "List Price",
  //     data: series4[0].data,
  //   },
  //   {
  //     name: "New",
  //     data: series5[0].data,
  //   },
  //   {
  //     name: "Amazon",
  //     data: series6[0].data,
  //   },
  //   {
  //     name: "Buy Box",
  //     data: series7[0].data,
  //   },
  //   {
  //     name: "Warehouse Deals",
  //     data: series8[0].data,
  //   },
  //   {
  //     name: "Buy Box used",
  //     data: series9[0].data,
  //   },
  //   {
  //     name: "Used",
  //     data: series10[0].data,
  //   }
  // ];
  return (
    <>
  
    <ReactApexChart
      className="flex-auto"
      options={options}
      // options={chartOptions1}
      series={series}
      type={options.chart.type}
      height={options.chart.height}
    />
  
  

</>

  );
};

export default MergedMultipleChart;
