import { useTheme } from '@mui/material/styles';

import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo, useState , useEffect } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useAppSelector } from 'app/store';
import PreviousStatementWidgetType from '../types/PreviousStatementWidgetType';
import { Input } from '@mui/material';
import history from '@history';
import * as yup from 'yup';
import Chart from "react-apexcharts";
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import { selectContrastMainTheme } from 'app/store/fuse/settingsSlice';
import MergedChart from './MergedCharts';
import MergedMultipleChart from './MergedMultipleCharts';

/**
 * The ProfitCalculatorWidget.
 */
function ChartsWidget({ chart , breakevenPrice, onStoreFront=false, keepa=false}) {
  const roundAndFormatValue = (value) => {
    const roundedValue = Math.round(value / 1000) * 1000;
    return roundedValue.toLocaleString();
  };

  const [filter,setFilter]= useState(onStoreFront?'3 mon':'1 yr')
	const charts = chart?.charts;
	const [series1, setSeries1] = useState([])
	const [series2, setSeries2] = useState([])
	const [series3, setSeries3] = useState([])
	const [series4, setSeries4] = useState([])
	const [series5, setSeries5] = useState([])
	const [series6, setSeries6] = useState([])
	const [series7, setSeries7] = useState([])
	const [series8, setSeries8] = useState([])
	const [series9, setSeries9] = useState([])
	const [series10, setSeries10] = useState([])
	const [series11, setSeries11] = useState([])
  const [series12, setSeries12] = useState([])
  const [series13, setSeries13] = useState([])
  const [series14, setSeries14] = useState([])

	useEffect(() => {
        if (onStoreFront) {
            // setSeries1(charts.chart2?.series)
            setSeries2(charts?.chart3?.series)
            setSeries3(charts?.chart4?.series)
        } else {
            setSeries1(charts?.chart2?.series) // offer count mainchart2
            setSeries2(charts?.chart3?.series)
            setSeries3(charts?.chart4?.series) // sales rank
            setSeries4(charts?.chart8?.series) // list price
            setSeries5(charts?.chart7?.series) // New
            setSeries6(charts?.chart5?.series) // Amazan
            setSeries7(charts?.chart10?.series) // Buy Box
            setSeries8(charts?.chart9?.series) // warehouse deals
            setSeries9(charts?.chart11?.series) // Buy Box used
            setSeries10(charts?.chart6?.series)
            setSeries11(charts?.chart13?.series) //review count mainchart2
            setSeries12(charts?.chart12?.series) // Rating mainchart2
            setSeries13(charts?.chart14?.series) // used offer count mainchart2 
            setSeries14(charts?.chart1?.series) // monthly sales
        }
  }, [])
	
  // const label1 = charts?.chart2?.series[0]?.name;
  const label1 = (charts?.chart2?.series.length > 0) ? charts.chart2.series[0].name : "";
	const label2 = (charts?.chart3?.series.length > 0) ? charts?.chart3.series[0].name : "";
	const label3 = (charts?.chart4?.series.length > 0) ? charts.chart4.series[0].name : "";

	useEffect(() => {
        if(!onStoreFront){
            filterData();
        }
  }, [filter]);

  const filterData = () => {
      if (filter === 'all time') {
          setSeries1(charts?.chart2?.series);
          setSeries2(charts?.chart3?.series);
          setSeries3(charts?.chart4?.series);
      } else if (filter === '1 yr') {
          setSeries1(filterSeriesByTime(charts?.chart2?.series, 1));
          setSeries2(filterSeriesByTime(charts?.chart3?.series, 1));
          setSeries3(filterSeriesByTime(charts.chart4?.series, 1));
      } else if (filter === '3 mon') {
          setSeries1(filterSeriesByTime(charts?.chart2?.series, 0.25));
          setSeries2(filterSeriesByTime(charts?.chart3?.series, 0.25));
          setSeries3(filterSeriesByTime(charts?.chart4?.series, 0.25));
      }
  };

	const filterSeriesByTime = (series, years) => {
        // Filter series data based on the given time period (in years)
        const currentDate = new Date();
        const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - (years * 12), currentDate.getDate());

        const filteredSeries = series.map(data => ({
            name: data.name,
            data: data.data.filter(item => {
                const itemDate = new Date(item.x);
                return itemDate >= targetDate;
            })
        }));
        return filteredSeries;
  };

  const theme = useTheme();
	const contrastTheme = useAppSelector(selectContrastMainTheme(theme.palette.primary.main));

    // const chartOptions: ApexOptions = {
	// 	chart: {
	// 		animations: {
	// 			speed: 400,
	// 			animateGradually: {
	// 				enabled: false
	// 			}
	// 		},
	// 		fontFamily: 'inherit',
	// 		foreColor: 'inherit',
	// 		width: '100%',
	// 		height: '100%',
	// 		type: 'area',
	// 		sparkline: {
	// 			enabled: true
	// 		}
	// 	},
	// 	colors: [theme.palette.secondary.light, theme.palette.secondary.light],
	// 	fill: {
	// 		colors: [theme.palette.secondary.dark, theme.palette.secondary.light],
	// 		opacity: 0.5
	// 	},
	// 	series: series,
	// 	stroke: {
	// 		curve: 'straight',
	// 		width: 2
	// 	},
	// 	tooltip: {
	// 		followCursor: true,
	// 		theme: 'dark',
	// 		x: {
	// 			format: 'MMM dd, yyyy'
	// 		},
	// 		y: {
	// 			formatter: (value) => `${value}`
	// 		}
	// 	},
	// 	xaxis: {
	// 		type: 'datetime',
    //         labels: {
    //             offsetY: -20,
    //             style: {
    //                 colors: contrastTheme.palette.text.primary
    //             }
    //         },
	// 	}
	// };
  const [y1AxisMax, setY1AxisMax] = useState(null);
  const [y2AxisMax, setY2AxisMax] = useState(null);
  const [y3AxisMax, setY3AxisMax] = useState(null);

  const chartOptions: ApexOptions = {
		chart: {
			animations: {
				speed: 400,
				animateGradually: {
					enabled: false
				}
			},
			fontFamily: 'inherit',
			foreColor: 'inherit',
			width: '100%',
			height: '100%',
			type: 'area',
			toolbar: {
				show: false
			},
			zoom: {
				enabled: false
			}
		},
		colors: ['#EC6262'],
		dataLabels: {
			enabled: false
		},
		fill: {
			colors: ['#EC6262']
		},
		grid: {
			show: true,
			borderColor: theme.palette.divider,
			padding: {
				top: -20,
				bottom: -10,
				left: 0,
				right: 0
			},
			position: 'back',
			xaxis: {
				lines: {
					show: true
				}
			}
		},
		stroke: {
			width: 2
		},
		tooltip: {
			followCursor: true,
			theme: 'dark',
			x: {
				format: 'MMM dd, yyyy'
			},
			y: {
				formatter: (value) => `${value}`
			}
		},
		xaxis: {
			axisBorder: {
				show: false
			},
			axisTicks: {
				show: false
			},
			crosshairs: {
				stroke: {
					color: theme.palette.divider,
					dashArray: 0,
					width: 2
				}
			},
			labels: {
				offsetY: -5,
				style: {
					colors: '#000'
				}
			},
			tickAmount: 20,
			tooltip: {
				enabled: false
			},
			type: 'datetime'
		},
		yaxis: {
			axisTicks: {
				show: false
			},
			axisBorder: {
				show: false
			},
            labels:{
                offsetX:-8,
                formatter: function (value) {
                    // Round off the value to 2 decimal places
                    return Math.round(value);
                }
            },
            min:0,
			// min: (min) => min - 750,
			max: y3AxisMax,
			tickAmount: 4,
			// show: false
		},
        
	};

    // const label2 = data?.chart2?.series[0]?.seller_name;
    // const seriesData2 = data?.chart2?.series?.map((seller) => ({
    // 	name: seller.seller_name,
    // 	data: seller.series.map((value) => parseInt(value, 10))
    // }));

    // const label3 = data?.chart4?.series[0]?.seller_name;
    // const seriesData3 = data?.chart4?.series?.map((seller) => ({
    // 	name: seller.seller_name,
    // 	data: seller.series.map((value) => parseInt(value, 10))
    // }));

    // console.log('Titles', label1, label2);

    // const [chartData] = useState({
    //     series: seriesData,
    //     options: {
    //         xaxis: {
    //             categories: chart?.options?.map((seller) => seller),
    //             axisBorder: { show: true },
    //             axisTicks: { show: false },
    //             labels: { show: true }
    //         },
    //         yaxis: { show: false },
    //         grid: { show: false },
    //         chart: {
    //             sparkline: {
    //                 enabled: false
    //             },
    //             toolbar: {
    //                 show: false
    //             },
    //             // dropShadow: {
    //             //   enabled: true,
    //             //   color: '#000',
    //             //   top: 18,
    //             //   left: 7,
    //             //   blur: 10,
    //             //   opacity: 0.2
    //             // },
    //         },
    //         colors: ['#EE6161', '#76B8C4', '#F5BD63'],
    //     },
    //     stroke: {
    //         curve: 'smooth'
    //     },
    //     fill: {
    //         type: 'gradient',
    //         gradient: {
    //             shadeIntensity: 1,
    //             inverseColors: false,
    //             opacityFrom: 0.5,
    //             opacityTo: 0,
    //             stops: [0, 90, 100]
    //         },
    //     },
    // });

    // const [secondChartDate] = useState({
    //   series: seriesData2,
    //   options: {
    //     xaxis: {
    //       categories: data?.chart2?.options?.map((seller) => seller),
    //       axisBorder: { show: true },
    //       axisTicks: { show: false },
    //       labels: { show: true }
    //     },
    //     yaxis: { show: false },
    //     grid: { show: false },
    //     dataLabels: {
    //       enabled: false
    //     },
    //     chart: {
    //       sparkline: {
    //         enabled: false
    //       },
    //       toolbar: {
    //         show: false
    //       },
    //       // dropShadow: {
    //       //   enabled: true,
    //       //   color: '#000',
    //       //   top: 18,
    //       //   left: 7,
    //       //   blur: 10,
    //       //   opacity: 0.2
    //       // },
    //     },
    //     colors: ['#EE6161', '#76B8C4','#F5BD63'],
    //   },
    //   stroke: {
    //     curve: 'smooth'
    //   },
    //   fill: {
    //     type: 'gradient',
    //     gradient: {
    //       shadeIntensity: 1,
    //       inverseColors: false,
    //       opacityFrom: 0.5,
    //       opacityTo: 0,
    //       stops: [0, 90, 100]
    //     },
    //   },
    // });

    // const [thirdChartDate] = useState({
    //   series: seriesData3,
    //   options: {
    //     xaxis: {
    //       categories: data?.chart4?.options?.map((seller) => seller),
    //       axisBorder: { show: true },
    //       axisTicks: { show: false },
    //       labels: { show: true }
    //     },
    //     yaxis: { show: false },
    //     grid: { show: false },
    //     dataLabels: {
    //       enabled: false
    //     },
    //     chart: {
    //       sparkline: {
    //         enabled: false
    //       },
    //       toolbar: {
    //         show: false
    //       },
    //       // dropShadow: {
    //       //   enabled: true,
    //       //   color: '#000',
    //       //   top: 18,
    //       //   left: 7,
    //       //   blur: 10,
    //       //   opacity: 0.2
    //       // },
    //     },
    //     colors: ['#EE6161', '#76B8C4','#F5BD63'],
    //   },
    //   stroke: {
    //     curve: 'smooth'
    //   },
    //   fill: {
    //     type: 'gradient',
    //     gradient: {
    //       shadeIntensity: 1,
    //       inverseColors: false,
    //       opacityFrom: 0.5,
    //       opacityTo: 0,
    //       stops: [0, 90, 100]
    //     },
    //   },
    // });
  const chartOptions2: ApexOptions = {
    ...chartOptions,
    tooltip: {
      followCursor: true,
      theme: "dark",
      x: {
        format: "MMM dd, yyyy",
      },
      y: {
        formatter: (value) => `$${value}`,
      },
    },
    yaxis: {
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        offsetX: -8,
        formatter: function (value) {
          // Round off the value to 2 decimal places
          return Math.round(value);
        },
      },
      min: 0,
      // min: (min) => min - 750,
      max: y2AxisMax,
      tickAmount: 4,
      // show: false
    },
    annotations: {
      yaxis: [
        {
          y: breakevenPrice, // Specify the y-coordinate of the breakeven point
          borderColor: "#FF0000", // Specify the color of the line
          label: {
            borderColor: "#FF0000", // Specify the color of the label
            style: {
              color: "#FFFFFF", // Specify the color of the label text
              background: "#FF0000", // Specify the background color of the label
            },
            text: "Breakeven", // Specify the text of the label
            position: "right", // Specify the position of the label relative to the point
          },
        },
      ],
    },
  };

  const chartOptionsGraph1: ApexOptions = {
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
    // "#c6cfcf" used color
    colors: ["#9fe8d1", "#8d6e68", "#b6c5f1", "#fac8a1", "#f89abd", "#ff7800", "#d19fe8", "#000000"], // Add a color for the second series
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
        // console.log('w', w);
        // console.log('dataPointIndex', dataPointIndex);
        const salesRank = w.globals.series[0][dataPointIndex];
        const listPrice = w.globals.series[1][dataPointIndex];
        const New = w.globals.series[2][dataPointIndex];
        const amazon = w.globals.series[3][dataPointIndex];
        const buyBox = w.globals.series[4][dataPointIndex];
        const warehouseDeals = w.globals.series[5][dataPointIndex];
        const buyBoxUsed = w.globals.series[6][dataPointIndex];
        const used = w.globals.series[7][dataPointIndex];
        const salesRankText = salesRank !== undefined ? `$${salesRank}` : "N/A";
        const listPriceText = listPrice !== undefined ? listPrice : "N/A";
        const newText = New !== undefined ? New : "N/A";
        const amazonText = amazon !== undefined ? amazon : "N/A";
        const buyBoxText = buyBox !== undefined ? buyBox : "N/A";
        const warehouseDealText = warehouseDeals !== undefined ? warehouseDeals : "N/A";
        const buyBoxUsedText = buyBoxUsed !== undefined ? buyBoxUsed : "N/A";
        const usedText = used !== undefined ? used : "N/A";

        return `<div class="apexcharts-tooltip-custom">

              <div class="graph_data">
                <div class="sales_rank"></div>
                  <div>Sales Rank: ${salesRankText}</div>
                </div>

                <div class="graph_data">
                  <div class="list_price"></div>
                    <div>List Price: ${listPriceText?.toLocaleString()}</div>
                  </div>

                  <div class="graph_data">
                    <div class="new_price"></div>
                      <div>New: ${newText?.toLocaleString()}</div>
                    </div>
  
                  <div class="graph_data">
                    <div class="amazon_price"></div>
                      <div>Amazon: ${amazonText?.toLocaleString()}</div>
                    </div>

                  <div class="graph_data">
                    <div class="buy_box_price"></div>
                      <div>Buy Box: ${buyBoxText?.toLocaleString()}</div>
                    </div>
  
                  <div class="graph_data">
                    <div class="warehouse_price"></div>
                      <div>Warehouse Deals: ${warehouseDealText?.toLocaleString()}</div>
                    </div>
                  
                  <div class="graph_data">
                    <div class="buy_box_used_price"></div>
                      <div>Buy Box Used: ${buyBoxUsedText?.toLocaleString()}</div>
                    </div>

                  <div class="graph_data">
                    <div class="used_price"></div>
                      <div>Used: ${usedText?.toLocaleString()}</div>
                    </div>

                </div>
             `;
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
        // min: 0,
        // title: {
        //   text: "Product Price",
        // },
        // max: y1AxisMax,
        // tickAmount: 4,
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
            return `#${(Math.round(value)?.toLocaleString())}`;
          },
        },
        // min: 0,
        // title: {
        //   text: "Sales Rank", // Update the title for the second y-axis
        // },
        // max: y2AxisMax,
        // tickAmount: 4,
      },
    ],
  };

  const chartOptionsGraph2: ApexOptions = {
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
    // "#c6cfcf" used color
    colors: ["#10d856"], // Add a color for the second series
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
        // console.log('graph2', w);
        // console.log('dataPointIndex', dataPointIndex);
        
        const MonthlySales = w.globals.series[0][dataPointIndex];
        const MonthlySalesText = MonthlySales !== undefined ? MonthlySales : "N/A"
      
        return `<div class="apexcharts-tooltip-custom">

              <div class="graph_data">
                <div class="monthly_sales"></div> 
                  <div>Monthly Sales : ${MonthlySalesText}</div>
                </div>
               
             `;
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
        // min: 0,
        // title: {
        //   text: "Product Price",
        // },
        // max: y1AxisMax,
        // tickAmount: 4,
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
            return `#${(Math.round(value)?.toLocaleString())}`;
          },
        },
        // min: 0,
        // title: {
        //   text: "Sales Rank", // Update the title for the second y-axis
        // },
        // max: y2AxisMax,
        // tickAmount: 4,
      },
    ],
    
    
  };

  const chartOptionsGraph3: ApexOptions = {
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
    // "#c6cfcf" used color
    colors: ["#b81a1a", "#71ccb2", "#654ace", "#94317d"], // Add a color for the second series
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
        // console.log('w', w);
        // console.log('dataPointIndex', dataPointIndex);
        
        const offercount = w.globals.series[0][dataPointIndex];
        const Reviewcount = w.globals.series[1][dataPointIndex];
        const Rating = w.globals.series[2][dataPointIndex];
        const usedoffercount = w.globals.series[3][dataPointIndex];

        const offercountText = offercount !== undefined ? offercount: "N/A"
         const RatingText = Rating !== undefined ? Rating: "N/A"
        const ReviewcountText = Reviewcount !== undefined ? Reviewcount: "N/A"
         const usedoffercountText = usedoffercount !== undefined ? usedoffercount: "N/A"

        return `<div class="apexcharts-tooltip-custom">

              <div class="graph_data">
                <div class="offer_count"></div> 
                  <div>Offer Count: ${offercountText}</div>
                </div>

                <div class="graph_data">
                  <div class="rating"></div> 
                    <div>Rating: ${RatingText?.toLocaleString()}</div>
                  </div>

                  <div class="graph_data">
                    <div class="review_count"></div> 
                      <div>Review Count: ${ReviewcountText?.toLocaleString()}</div>
                    </div>
  
                  <div class="graph_data">
                    <div class="used_offer_count"></div> 
                      <div>Used Offer Count: ${usedoffercountText?.toLocaleString()}</div>
                    </div>
                </div>
             `;
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
        // min: 0,
        // title: {
        //   text: "Product Price",
        // },
        // max: y1AxisMax,
        // tickAmount: 4,
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
            return `#${(Math.round(value)?.toLocaleString())}`;
          },
        },
        // min: 0,
        // title: {
        //   text: "Sales Rank", // Update the title for the second y-axis
        // },
        // max: y2AxisMax,
        // tickAmount: 4,
      },
    ],
  };

  const calculateYAxisMax = (maxValue) => {
    const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
    return Math.ceil(maxValue / magnitude) * magnitude;
  };

  useEffect(()=>{
    if(series1.length>0) {
      const y1Values = series1[0]?.data.map((point) => point.y);
    const maxDataValue = Math.max(...y1Values);
    setY1AxisMax(calculateYAxisMax(maxDataValue))
  }
  },[series1])

  useEffect(() => {
    if (series2.length > 0) {
      const y2Values = series2[0]?.data.map((point) => point.y);
      const maxDataValue = Math.max(...y2Values);
      setY2AxisMax(calculateYAxisMax(maxDataValue));
    }
  }, [series2]);

  useEffect(() => {
    if (series3.length > 0) {
      const y3Values = series3[0]?.data.map((point) => point.y);
      const maxDataValue = Math.max(...y3Values);
      setY3AxisMax(calculateYAxisMax(maxDataValue));
    }
  }, [series3]);

  // const y3Values = series3[0]?.data.map((point) => point.y);
  // const y2Values = series2[0]?.data.map((point) => point.y);
  const chartOptions3: ApexOptions = {
    ...chartOptions,
    tooltip: {
      followCursor: true,
      theme: "dark",
      x: {
        format: "MMM dd, yyyy",
      },
      y: {
        formatter: (value) => `${value}`,
      },
    },
    yaxis: {
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        offsetX: -8,
        formatter: function (value) {
          // Round off the value to 2 decimal places
          return Math.round(value);
        },
      },
      min: 0,
      // min: (min) => min - 750,
      max: y1AxisMax,
      tickAmount: 4,
      // show: false
    },
  
  };

  const graph3 = [
    {
      name: "Offer Count",
      data: series1[0]?.data,
    },
    {
      name: "Rating",
      data: series12[0]?.data,
    },
    {
      name: "Review Count",
      data: series11[0]?.data,
    },
    {
      name: "Used Offer Count",
      data: series13[0]?.data,
    },
  ];

  const graph2 = [
    {
      name: "Monthly Sales",
      data: series14[0]?.data,
    },
    {
      name: "",
      data: [],
    }
  ];

  const graph1 = [
    {
      name: "Sales Rank",
      data: series3[0]?.data,
    },
    {
      name: "List Price",
      data: series4[0]?.data,
    },
    {
      name: "New",
      data: series5[0]?.data,
    },
    {
      name: "Amazon",
      data: series6[0]?.data,
    },
    {
      name: "Buy Box",
      data: series7[0]?.data,
    },
    {
      name: "Warehouse Deals",
      data: series8[0]?.data,
    },
    {
      name: "Buy Box used",
      data: series9[0]?.data,
    },
    {
      name: "Used",
      data: series10[0]?.data,
    }
  ];

  return (
      <>
        {keepa ? (      
            <div className="relative flex flex-col gap-16 flex-auto p-2 overflow-hidden" >

              <div className="flex flex-col flex-auto h-[320px] pt-10">

              <MergedMultipleChart series={graph1} options={chartOptionsGraph1}/>
              </div>

              <div className="flex flex-col flex-auto h-[280px] pt-10">
                <MergedMultipleChart series={graph2} options={chartOptionsGraph2}/>
              </div>
               
              <div className="flex flex-col flex-auto h-[280px] pt-10">
                <MergedMultipleChart series={graph3} options={chartOptionsGraph3}/>
              </div>

            </div>
        ) : ( 
            <div className="relative flex flex-col gap-16 flex-auto p-2 overflow-hidden">
              {!onStoreFront &&
                <div className="flex flex-col justify-between">
                <div className="flex items-center gap-3 p-1 w-full justify-end">
                        <div style={{ width: "30%" }}>
                          <select
                            id="price_option"
                            className={` w-full border border-solid border-gray-300 rounded-lg px-4 py-2 flex justify-center items-center gap-10`}
                            // type="text"
                            // defaultValue="Lowest"
                            // defaultChecked={filter}
                            defaultValue={filter}
                            onChange={(e) => {
                              // handleInputChange("price_option", e.target.value)
                              
                                setFilter(e.target.value);
                            
                            }}
                          >
                            <option value="all time">All time</option>
                            <option value="1 yr">1 year</option>
                            <option value="3 mon">3 months</option>
                          </select>
                        </div>
                      </div>
                    {/* <div className="flex flex-col">
                        <Typography className="text-md font-semibold tracking-tight leading-6 truncate">
                            Price History
                        </Typography>

                    </div> */}
                    {/* <div className='flex justify-between'>
                        <div className='flex gap-8 items-center'>
                            <div className='bg-secondary rounded-4 text-white text-lg p-6'>Current</div>
                            <div className='flex gap-6 '>
                                <div className='h-24 w-24 flex justify-center items-center rounded-full bg-grey-200 text-sm'>30</div>
                                <div className='h-24 w-24 flex justify-center items-center rounded-full bg-grey-200 text-sm'>90</div>
                                <div className='h-24 w-24 flex justify-center items-center rounded-full bg-grey-200 text-sm'>180</div>
                            </div>
                        </div>
                        <div className='bg-secondary rounded-4 text-white text-lg p-6'>All</div>
                    </div> */}

                </div>}
                {/* <div className="flex flex-col">
                        <Typography className="text-md font-semibold tracking-tight leading-6 truncate">
                            Price History
                        </Typography>

                    </div> */}
                {( series2?.length > 0 && series2[0]?.data.length > 0 && !onStoreFront ) && 
                    <div className = "flex flex-row justify-between" >

                        <div className="flex flex-col flex-auto h-[150px]">
                            <ReactApexChart
                                className="flex-auto w-full h-full"
                                options={chartOptions2}
                                series={series2}
                                type={chartOptions?.chart?.type}
                                height={chartOptions?.chart?.height}
                            />
                        </div>
            
                        <div className='flex flex-col justify-center ml-2 bg-[#D5E6E9] font-700 text-center p-2 rounded-tl-xl rounded-bl-xl text-[#0E505C] ' style = {{textOrientation : "mixed" , writingMode : "vertical-rl" , width : "2%" , }}>
                            <div>Price History</div>
                        </div>
                    </div>
                }
                {onStoreFront && series2.length > 0 && series2[0]?.data.length > 0 &&
                  (
                    <div className = "flex flex-row justify-between  border rounded-lg shadow-2 " >

                    <div className="flex flex-col flex-auto h-[155px] pt-10">
                      <MergedChart graphData={series2} series2={series3} />
                    </div>
                    {/* <div className='flex flex-col justify-center ml-2 bg-[#D5E6E9] font-700 text-center p-2 rounded-tl-xl rounded-bl-xl text-[#0E505C] ' style = {{textOrientation : "mixed" , writingMode : "vertical-rl" , width : "2%" , }}>
                            <div>Price History</div>
                        </div> */}
                        </div>
                  )}
                {/* <div className="flex flex-col">
                        <Typography className="text-md font-semibold tracking-tight leading-6 truncate">
                            {label3}
                        </Typography>

                    </div> */}

            {( series3.length > 0 && series3[0]?.data.length > 0 && !onStoreFront ) && 

                <div className = "flex flex-row justify-between" >
                    <div className="flex flex-col flex-auto h-[150px]">
                        <ReactApexChart
                            className="flex-auto w-full h-full"
                            options={chartOptions}
                            series={series3}
                            type={chartOptions?.chart?.type}
                            height={chartOptions?.chart?.height}
                        />
                    </div>
                {/* <div className="flex flex-col">
                        <Typography className="text-md font-semibold tracking-tight leading-6 truncate">
                            {label1}
                        </Typography>

                    </div> */}
                    <div className='flex flex-col justify-center ml-2 bg-[#D5E6E9] font-700 text-center p-2 rounded-tl-xl rounded-bl-xl text-[#0E505C] ' style = {{textOrientation : "mixed" , writingMode : "vertical-rl" , width : "2%" , }}>
                <div>{label3}</div>
              </div>
                </div>
            }
            {( series1.length > 0 && series1[0]?.data.length > 0 ) && 

                <div className ={`flex flex-row justify-between`} >
                    <div className="flex flex-col flex-auto h-[150px]">
                        <ReactApexChart
                            className="flex-auto w-full h-full"
                            options={chartOptions3}
                            series={series1}
                            type={chartOptions?.chart?.type}
                            height={chartOptions?.chart?.height}
                        />
                    </div>
                    <div className='flex flex-col justify-center ml-2 bg-[#D5E6E9] font-700 text-center p-2 rounded-tl-xl rounded-bl-xl text-[#0E505C] ' style = {{textOrientation : "mixed" , writingMode : "vertical-rl" , width : "2%" , }}>
                <div>{label1}</div>
              </div>
                </div>
            }
            </div>
        )}
      </>
  );
}

export default memo(ChartsWidget);
