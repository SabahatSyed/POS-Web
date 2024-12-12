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

/**
 * The ProfitCalculatorWidget.
 */
function RanksWidget({ data, caldata }) {
	// console.log(caldata);
	return (
    <div className="relative flex flex-col rounded-2xl gap-16 overflow-hidden ">
      <div className="flex flex-col gap-16  justify-between bg-[#D5E6E9] p-24">
        <div className="flex flex-col gap-8">
          <Typography className="text-2xl font-bold tracking-tight leading-6 truncate text-secondary">
            Statistics
          </Typography>
        </div>
      </div>
      <div className="flex flex-col mx-16 pb-24">
        <div className=" grid grid-cols-2 gap-10 py-4">
          {caldata?.BSR_perc && data?.product_data?.BSR && (
            <div className="flex flex-col justify-center items-center gap-6 border rounded-lg p-9 py-12  text-sm border-[#62BDFF] ">
              <div className=" text-base text-gray-700 font-bold text-center">
                BSR
              </div>
              <div className="flex gap-3 items-end justify-center text-lg text-secondary font-bold ">
                <div className="">
                  {new Intl.NumberFormat("en-US", {
                    notation: "compact",
                    compactDisplay: "short",
                  }).format(data?.product_data?.BSR)}
                  &nbsp;
                  {caldata?.BSR_perc >= 1
                    ? new Intl.NumberFormat("en-US", {
                        notation: "compact",
                        compactDisplay: "short",
                      }).format(
                        Number(Math.round(caldata?.BSR_perc).toFixed(0))
                      )
                    : "< 1"}
                  %
                </div>
                {/* <div className='text-secondary'>({data?.BSR_perc}%)</div> */}
                {/* <div>
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
									<path d="M0.710509 11.5341C0.318101 11.5341 0 11.8522 0 12.2446V22.6802C0 23.0726 0.318148 23.3907 0.710509 23.3907H4.99125V11.5341H0.710509Z" fill="#008300" />
									<path d="M24 15.4577C24 14.5558 23.5154 13.7648 22.7929 13.3317C23.0697 12.9319 23.2321 12.447 23.2321 11.9251C23.2321 10.5593 22.121 9.44822 20.7552 9.44822H15.5267C15.6869 8.72204 15.9061 7.63236 16.0587 6.49163C16.4558 3.52308 16.1844 1.87675 15.2046 1.31058C14.5937 0.957675 13.9351 0.886089 13.35 1.10882C12.898 1.28098 12.2876 1.70426 11.9398 2.74309L10.5656 6.34119C9.86892 8.06173 7.73547 9.86802 6.41235 10.8668V23.7052C8.86456 24.5644 11.4234 24.9999 14.034 24.9999H19.7311C21.0968 24.9999 22.208 23.8888 22.208 22.5231C22.208 22.0449 22.0717 21.5978 21.836 21.2188C22.6616 20.8167 23.232 19.9688 23.232 18.9904C23.232 18.4684 23.0696 17.9836 22.7928 17.5838C23.5154 17.1506 24 16.3597 24 15.4577Z" fill="#008300" />
								</svg>
							</div> */}
              </div>
            </div>
          )}
          <div className="flex flex-col justify-center items-center gap-6 border rounded-lg p-9 py-12  text-sm border-[#62BDFF] ">
            <div className=" text-base text-gray-700 font-bold text-center">
              Monthly Sold
            </div>
            <div className="flex gap-3 items-end justify-center text-lg text-secondary font-bold ">
              {new Intl.NumberFormat("en-US", {
                notation: "compact",
                compactDisplay: "short",
              }).format(caldata?.sales_per_month)}
              +
            </div>
          </div>
          {caldata?.average_yearly_price && (
            <div className="flex flex-col justify-center items-center gap-6 border rounded-lg p-9 py-12  text-sm border-[#62BDFF] ">
              <div className=" text-base text-gray-700 font-bold text-center">
                Average Yearly Price
              </div>
              <div className="flex gap-3 items-end justify-center text-lg text-secondary font-bold ">
                $
                {caldata?.average_yearly_price?.toFixed(2)?.toLocaleString() ||
                  "N/A"}
              </div>
            </div>
          )}
          {caldata?.buy_box_price && (
            <div className="flex flex-col justify-center items-center gap-6 border rounded-lg p-9 py-12  text-sm border-[#62BDFF] ">
              <div className=" text-base text-gray-700 font-bold text-center">
                Buy Box Price
              </div>
              <div className="flex gap-3 items-end justify-center text-lg text-secondary font-bold ">
                ${caldata?.buy_box_price?.toFixed(2).toLocaleString()}
              </div>
            </div>
          )}
          <div className="flex flex-col justify-center items-center gap-6 border rounded-lg p-9 py-12  text-sm border-[#62BDFF] ">
            <div className=" text-base text-gray-700 font-bold text-center">
              Lowest FBA Price
            </div>
            <div className="flex gap-3 items-end justify-center text-lg text-secondary font-bold ">
              ${caldata?.lowest_fba_price?.toFixed(2).toLocaleString()}
            </div>
          </div>
          {caldata?.lowest_fbm_price !== null && (
            <div className="flex flex-col justify-center items-center gap-6 border rounded-lg p-9 py-12  text-sm border-[#62BDFF] ">
              <div className=" text-base text-gray-700 font-bold text-center">
                Lowest FBM Price
              </div>
              <div className="flex gap-3 items-end justify-center text-lg text-secondary font-bold ">
                ${caldata?.lowest_fbm_price?.toFixed(2).toLocaleString()}
              </div>
            </div>
          )}
          <div className="flex flex-col justify-center items-center gap-6 border rounded-lg p-9 py-12  text-sm border-[#62BDFF] ">
            <div className=" text-base text-gray-700 font-bold text-center">
              FBA Seller Count
            </div>
            <div className="flex gap-3 items-end justify-center text-lg text-secondary font-bold ">
              {new Intl.NumberFormat("en-US", {
                notation: "compact",
                compactDisplay: "short",
              }).format(caldata?.fba_seller_count?.toFixed(0))}
            </div>
          </div>

          <div className="flex flex-col justify-center items-center gap-6 border rounded-lg p-9 py-12  text-sm border-[#62BDFF] ">
            <div className=" text-base text-gray-700 font-bold text-center">
              FBM Seller Count
            </div>
            <div className="flex gap-3 items-end justify-center text-lg text-secondary font-bold ">
              {new Intl.NumberFormat("en-US", {
                notation: "compact",
                compactDisplay: "short",
              }).format(caldata?.fbm_seller_count?.toFixed(0))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(RanksWidget);
