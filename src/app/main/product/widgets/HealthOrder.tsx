import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useAppSelector } from 'app/store';
import PreviousStatementWidgetType from '../types/PreviousStatementWidgetType';
import { Input } from '@mui/material';
import history from '@history';
import * as yup from 'yup';
import { da } from 'date-fns/locale';
import { Tooltip } from '@mui/material'; 

/**
 * The ProfitCalculatorWidget.
 */
function HealthOrderWidget({health, data}) {

	// function getStatusText(percentage) {
    //     if (percentage < 0.33) {
    //         return 'Unhealthy';
    //     } else if (percentage < 0.67) {
    //         return 'Moderate';
    //     } else if (percentage <= 1){
    //         return 'Healthy';
    //     } else {
	// 		return 'Unhealthy';
	// 	}
    // }
    
    // function getStatusColor(percentage) {
    //     if (percentage < 0.33) {
    //         return 'red';
    //     } else if (percentage < 0.67) {
    //         return 'orange';
    //     } else if (percentage <= 1){
    //         return 'green';
    //     } else {
	// 		return 'red';
	// 	}

    // }

	const tooltipDescriptions = {
		"BSR Raw" : "BSR Analysis: The relative Best Seller Rank within the parent category.",
		// "Sellers Quality" : "Seller's Quality: Some tooltip description for Sellers Quality.",
		"Buy Box Distribution" : "BuyBox Analysis: Some tooltip description for Buy Box Distribution.",
		"Health Analysis" : "The overall risk of a specific ASIN, based on the underlying indicators.",
		"Offers Ratio" : "The ratio between Offer Count and Monthly Sales.",
		"Offers Volatility" : "The fluctuation of Offer Count over time.",
		"Price Trend" : "The direction and strength of Price over time.",
		"Price Volatility" : "The fluctuation of Price over time.",
		"Seasonality" : "The strength of seasonal fluctuations relative to the current date.",
		"Sellers Quality" : "The strength of other Sellers within the product.",
		"BSR Volatility" : "The fluctuation of the Best Seller Rank over time.",
	};

	function getStatusColor(percentage) {
        const hue = percentage * 120;

    // Generate HSL color string with calculated hue for transitioning from red to green
        return `linear-gradient(to top, hsl(${hue}, 60%, 70%), rgba(255, 255, 255, 0))`;
	}
// console.log(data);
	return (
    <div className="relative flex flex-col rounded-2xl gap-16 overflow-hidden">
      <div className="flex flex-col gap-16  justify-between p-24 bg-[#D5E6E9]">
        <div className="flex flex-col gap-8">
          <Typography className="text-2xl font-bold tracking-tight leading-6 truncate text-secondary">
            Health Analysis
          </Typography>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 p-4">
        {/* <div className="flex flex-col px-16 "> */}
        <div
          className="flex justify-center border rounded-lg p-9  text-sm shadow text-center col-span-2 "
          style={{
            backgroundImage: `linear-gradient(to top, hsl(210, 60%, 70%), rgba(255, 255, 255, 0))`,
          }}
        >
          <div>
            <div>Health Score</div>
            <div className='text-[26px]'> {Math.round(health * 100)}%</div>
          </div>
        </div>
        {/* <div className="flex flex-col px-16 "> */}

        {/* <div className='flex flex-col gap-6 py-4'>
					
				<div className='flex justify-between border rounded-lg p-9  text-sm shadow '>
					<div className=" font-500">Health</div>
					<div>{health ? Math.round((health as number) * 100) : "N/A"} %</div>

				</div>
			</div>
			<Typography className='w-full text-center text-gray-700 font-600 py-8 '>
            Health Order
            </Typography> */}
        {data && Object.entries(data).length > 0 ? (
          Object.entries(data).map(([key, value]) => (
            <div className="flex flex-col gap-6 py-4" key={key}>
              <Tooltip title={tooltipDescriptions[key] || ""} placement="top">
                {typeof value === "number" && (
                  <div
                    className="flex flex-col justify-center text-center border rounded-lg p-9  text-sm shadow "
                    style={{ backgroundImage: getStatusColor(value) }}
                  >
                    <div>
                      {key == "BSR Raw" && "BSR Analysis"}{" "}
                      {key == "Sellers Quality" && "Seller's Quality"}{" "}
                      {key == "Buy Box Distribution" && "BuyBox Analysis"}{" "}
                      {key != "BSR Raw" &&
                        key != "Sellers Quality" &&
                        key != "Buy Box Distribution" &&
                        key}
                    </div>
                    <div className='text-[26px]'>{Math.round((value as any) * 100)}%</div>
                  </div>
                )}
              </Tooltip>
            </div>
          ))
        ) : (
          <div className="w-full text-center text-gray-500 font-600 p-5 mt-4">
            No Health Analysis
          </div>
        )}

        {/* </div>	 */}
      </div>
    </div>
  );
}

export default memo(HealthOrderWidget);
