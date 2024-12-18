import { useState } from "react";
import React from "react";
import Chart from "react-apexcharts";

import CanvasJSReact from "@canvasjs/react-charts";
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

function BuyBox({ data }) {
  // Check if data is empty
  const hasData = data && data.length > 0;

  const percentageSeries = hasData ? data.map((seller) => seller.perc) : [100];
  const labels = hasData
    ? data.map((seller) => seller.seller_name)
    : ["SUPPRESSED"];
  const colors = hasData
    ? [
        "#EE6161",
        "#F5BD63",
        "#76B8C4",
        "#F5BD63",
        "#4A90E2",
          "#50E3C2",
          "#B8E986",
          "#7ED321",
          "#417505",
          "#BD10E0",
          "#9013FE",
          "#8B572A",
          "#4A4A4A",
          "#9B9B9B",
          "#F8E71C",
          "#D0021B",
          "#C39BD3",
          "#1F618D",
          "#F39C12",
          "#5D6D7E",
          "#117A65",
          "#922B21",
          "#AF601A",
          "#884EA0",
      
      ]
    : ["#000000"];

  // Check if "SUPPRESSED" is in the data
  const suppressedIndex = labels.indexOf("SUPPRESSED");

  if (suppressedIndex !== -1) {
    colors[suppressedIndex] = "#000000"; // Set color for "SUPPRESSED" to white
  }

  const dataPoints = hasData
    ? data.map((item) => ({
        y: item.perc,
        label: item.seller_name ?? item.seller_id,
      }))
    : [{ y: 100, label: "SUPPRESSED" }];

  const options ={
    animationEnabled: true,
    colorSet: "customColorSet",
    legend: {
      enabled: false, // Hide the legend
    },
    data: [
      {
        type: "pie",
        startAngle: 30,
        dataPoints: dataPoints,
        indexLabelPlacement: "outside",
        toolTipContent: "<b>{label}</b>: {y}%",
        radius: "70%",
        indexLabelFontSize: 10,
        indexLabel: "{label}",
      },
    ],
  };

  // Custom color set for CanvasJS
  CanvasJSReact.CanvasJS.addColorSet("customColorSet", colors);

  return (
    <div className="calculator">
      <div className="List">
        <CanvasJSChart
          containerProps={{ width: "100%", height: "300px" }}
          options={options}
        />
      </div>
    </div>
  );
}

export default BuyBox;