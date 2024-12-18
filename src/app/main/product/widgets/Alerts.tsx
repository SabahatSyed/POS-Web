import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useAppSelector } from 'app/store';
import { selectWidgets } from '../store/productsSlice';
import PreviousStatementWidgetType from '../types/PreviousStatementWidgetType';
import { Input } from '@mui/material';
import history from '@history';
import * as yup from 'yup';

/**
 * The ProfitCalculatorWidget.
 */
function AlertsWidget({ caldata }) {

	// console.log("alertdata",caldata)

	return (
		<div className="relative flex flex-col gap-16 overflow-hidden">
			<div className="flex  justify-between p-24">
				<div className="flex flex-col gap-8">
					<Typography className="text-2xl font-bold tracking-tight leading-6 truncate">
						Alerts
					</Typography>

				</div>
				<div>
					{/* <div className=' rounded-4 text-white text-sm p-6' style={{background: "linear-gradient(180deg, rgba(138, 204, 255, 0.97) 0%, rgba(10, 87, 147, 0.97) 100%)"}}>Login</div> */}

				</div>
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

			</div>
			<div className="flex flex-col py-4 px-16">

				<div className='grid grid-cols-3 gap-6 mb-16'>
					{/* <div className=' col-span-1 border rounded-lg p-9  text-sm shadow'>
						<div >Hazmat</div>
					</div>
					<div className='col-span-2 text-[#008300] border rounded-lg p-9  text-sm shadow'>
						<div >{caldata?.hazmat ? "Yes" : "No"}</div>
					</div> */}
					<div className=' col-span-2 border rounded-lg p-9  text-sm shadow'>
						<div >Dangerous Goods</div>
					</div>
					<div className='col-span-1 border text-secondary rounded-lg p-9  text-sm shadow'>
						<div >{caldata?.dangerous_goods ? "Yes" : "No"}</div>
					</div>
					<div className='col-span-2 border rounded-lg p-9  text-sm shadow'>
						<div >Only One Offer</div>
					</div>
					<div className='col-span-1 text-[#008300] flex justify-between border rounded-lg p-9  text-sm shadow'>
						<div >{caldata?.only_one_offer ? "Yes" : "No"}</div>
					</div>
					<div className='col-span-2 border rounded-lg p-9  text-sm shadow'>
						<div >IP Complaints</div>
					</div>
					<div className='col-span-1 text-[#008300] flex justify-between border rounded-lg p-9  text-sm shadow'>
						<div >{caldata?.IP_complaints ? "Yes" : "No"}</div>
					</div>
					{/* <div className='col-span-1 flex justify-between border rounded-lg p-9  text-sm shadow'>
						<div >Size</div>
					</div>
					<div className='col-span-2 text-[#008300] flex justify-between border rounded-lg p-9  text-sm shadow'>
						<div >{caldata?.size}</div>
					</div>
					<div className='col-span-1 flex justify-between border rounded-lg p-9  text-sm shadow'>
						<div >Private Label</div>
					</div>
					<div className='col-span-2 text-[#008300] flex justify-between border rounded-lg p-9  text-sm shadow'>
						<div >{caldata?.private_label}</div>
					</div> */}

				</div>

			</div>
			{/* <div className="absolute top-0 ltr:right-0 rtl:left-0 w-96 h-96 -m-24">
					<FuseSvgIcon
						size={96}
						className="opacity-25 text-green-500 dark:text-green-400"
					>
						heroicons-outline:check-circle
					</FuseSvgIcon>
				
			</div>  */}
		</div>
	);
}

export default memo(AlertsWidget);
