import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import data from "./data.json";
const TrendChart = () => {
  // const [trendChartConfig, setTrendChartConfig] = useState({
  //   chart: {
  //     animations: {
  //       enabled: false
  //     },
  //     fontFamily: 'inherit',
  //     foreColor: 'inherit',
  //     height: '100%',
  //     type: 'area',
  //     toolbar: {
  //       show: false
  //     },
  //     zoom: {
  //       enabled: false
  //     }
  //   },
  //   colors: ['#64748B', '#94A3B8'],
  //   dataLabels: {
  //     enabled: false
  //   },
  //   fill: {
  //     colors: ['#64748B', '#94A3B8'],
  //     opacity: 0.5
  //   },
  //   grid: {
  //     show: false,
  //     padding: {
  //       bottom: -40,
  //       left: 0,
  //       right: 0
  //     }
  //   },
  //   legend: {
  //     show: false
  //   },
  //   stroke: {
  //     curve: 'smooth',
  //     width: 2
  //   },
  //   tooltip: {
  //     followCursor: true,
  //     theme: 'dark',
  //     x: {
  //       format: 'MMM dd, yyyy'
  //     }
  //   },
  //   xaxis: {
  //     axisBorder: {
  //       show: false
  //     },
  //     labels: {
  //       offsetY: -20,
  //       rotate: 0,
  //       style: {
  //         colors: 'var(--fuse-text-secondary)'
  //       }
  //     },
  //     tickAmount: 3,
  //     tooltip: {
  //       enabled: true
  //     },
  //     type: 'datetime'
  //   },
  //   yaxis: {
  //     labels: {
  //       style: {
  //         colors: 'var(--fuse-text-secondary)'
  //       }
  //     },
  //     max: (max) => max + 50,
  //     min: (min) => min - 50,
  //     show: false,
  //     tickAmount: 5
  //   }
  // });

  const [trendSeries, setTrendSeries] = useState([]);

  useEffect(() => {
    // Your data fetching or processing logic here
    const graphData = data.data?.eod_data.map((element, index) => ({
      x: new Date(element.date),
      y: element.close,
    }));

    setTrendSeries([
      {
        name: 'Close',
        data: graphData,
      }
    ]);
  }, []); // Add dependencies if needed

  return (
    <div className="relative bg-white rounded-2xl shadow-xl">
      <div className="absolute top-28 left-20 text-md font-bold text-black">
        Last 30 days Data
      </div>
      <div className="absolute top-28 right-20 text-xs font-bold text-black">
        30 days
      </div>
      <div className="flex flex-col flex-auto h-[350px] overflow-hidden rounded-b-2xl mt-3">
        <Chart
          options={{
            chart: {
              animations: {
                enabled: false
              },
              fontFamily: 'inherit',
              foreColor: 'inherit',
              height: '100%',
              type: 'area',
              
              toolbar: {
                show: false
              },
              zoom: {
                enabled: false
              }
            },
            colors: ['#64748B', '#94A3B8'],
            dataLabels: {
              enabled: false
            },
            fill: {
              colors: ['#64748B', '#94A3B8'],
              opacity: 0.5
            },
            grid: {
              show: false,
              padding: {
                bottom: -40,
                left: 0,
                right: 0
              }
            },
            legend: {
              show: false
            },
            stroke: {
              curve: 'smooth',
              width: 2
            },
            tooltip: {
              followCursor: true,
              theme: 'dark',
              x: {
                format: 'MMM dd, yyyy'
              }
            },
            xaxis: {
              axisBorder: {
                show: false
              },
              labels: {
                offsetY: -20,
                rotate: 0,
                style: {
                  colors: 'var(--fuse-text-secondary)'
                }
              },
              tickAmount: 3,
              tooltip: {
                enabled: true
              },
              type: 'datetime'
            },
            yaxis: {
              labels: {
                style: {
                  colors: 'var(--fuse-text-secondary)'
                }
              },
              max: (max) => max + 50,
              min: (min) => min - 50,
              show: false,
              tickAmount: 5
            }
          }}
          series={trendSeries}
          type="area"
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
};

export default TrendChart;
