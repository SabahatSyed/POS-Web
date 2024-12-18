import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo, useState, useEffect } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useAppSelector } from 'app/store';
import { selectWidgets } from '../store/productsSlice';
import PreviousStatementWidgetType from '../types/PreviousStatementWidgetType';
import { Input } from '@mui/material';
import history from '@history';

/**
 * The QuickInfo widget.
 */
function QuickInfoWidget({caldata, data}) {
	
	console.log("QuickInfoWidget", data)

	const [quickData,setQuickData] = useState({})
	// const widgets = useAppSelector(selectWidgets);
	// const { status, date, limit, spent, minimum } = widgets.previousStatement as PreviousStatementWidgetType;
	const handleSearch = () => {
        // Logic to handle the search, e.g., redirect to the search results page
        history.push('/product/1239');
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            // Handle Enter key press, e.g., redirect to the search results page
            history.push('/product/1239');
        }
    };
	return (
		<Paper className="relative flex flex-col flex-auto p-24  rounded-2xl shadow overflow-hidden">
			<div className="flex items-center justify-between">
				<div className="flex flex-col gap-8">
					<Typography className="text-2xl font-bold  tracking-tight leading-6 truncate">
						Quick Info
					</Typography>
					<Typography className=" text-secondary font-medium text-sm">Alert <span className='bg-secondary text-white uppercase px-2 py-1 rounded-2 '>BB</span>  <span className='bg-secondary text-white uppercase px-2 py-1 rounded-2 '>PL</span></Typography>
					
				
				</div>
				
			</div>
			<div className="flex  flex-col mt-16 gap-16 ">
			{/* <Paper className="flex p-4 items-center w-full px-16 py-4 border-1 border-gray-A100 h-40 rounded-full shadow-md">
							

							<Input
								placeholder="Enter product name or Product SSID"
								className="flex flex-1 px-8 placeholder:text-black"
								disableUnderline
								fullWidth
								//value={searchText}
								inputProps={{
									'aria-label': 'Search'
								}}
								onKeyDown={handleKeyDown}

								//onChange={handleSearchText}
							/>
							<FuseSvgIcon
								color="secondary"
								size={20}
								onClick={handleSearch}

							>
								heroicons-solid:search
							</FuseSvgIcon>
						</Paper> */}

				<div className="flex flex-col  my-12">
					<Typography
						color="text.secondary"
						className="text-sm font-medium leading-none"
					>
						BSR
					</Typography>
					<Typography className="mt-8 font-bold text-xl leading-none">
						{/* {limit.toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD'
						})} */}
						7k (1%)
					</Typography>
				</div>
				<div className='grid grid-cols-2 gap-12 '>
					<div>
						<Typography
							color="text.secondary"
							className="text-sm font-medium leading-none"
						>
							Est. Sales
						</Typography>
						<Typography className="mt-8 font-bold text-xl leading-none">
							{/* {spent.toLocaleString('en-US', {
								style: 'currency',
								currency: 'USD'
							})} */}
							319 / mo
						</Typography>
					</div>
					<div>
						<Typography
							color="text.secondary"
							className="text-sm font-medium leading-none "
						>
							Max Cost
						</Typography>
						<Typography className="mt-8 font-bold text-xl leading-none">
							{/* {spent.toLocaleString('en-US', {
								style: 'currency',
								currency: 'USD'
							})} */}
							{caldata && caldata?.max_cost?.toFixed(2)}
						</Typography>
					</div>
					<div className="flex flex-col w-full justify-between  my-16">
						<Typography
							color="text.secondary"
							className="text-sm font-medium leading-none"
						>
							Cost Price
						</Typography>
						<div className='flex text-black w-full  items-center border px-8 rounded-8 mt-8 '>
						<Typography className="font-medium text-xl leading-none">
							{/* {spent.toLocaleString('en-US', {
								style: 'currency',
								currency: 'USD'
							})} */}
							$ 
						</Typography>
						<Typography className="mt-8 font-bold text-xl  leading-none">
							{/* {spent.toLocaleString('en-US', {
								style: 'currency',
								currency: 'USD'
							})} */}
							{ data?.product_data?.sale_price?.toFixed(2)}
						</Typography>
						</div>
					</div>
					<div className="flex flex-col w-full justify-between  my-12">
						<Typography
							color="text.secondary"
							className="text-sm font-medium leading-none"
						>
							Sale Price
						</Typography>
						<div className='flex text-black w-full  items-center border px-8 rounded-8 mt-8 '>
						<Typography className="font-medium text-xl leading-none">
							{/* {spent.toLocaleString('en-US', {
								style: 'currency',
								currency: 'USD'
							})} */}
							$ 
						</Typography>
						<Typography className="mt-8 font-bold text-xl  leading-none">
							{/* {spent.toLocaleString('en-US', {
								style: 'currency',
								currency: 'USD'
							})} */}
							{ data?.product_data?.sale_price?.toFixed(2)}
						</Typography>
						</div>
					</div>
					<div>
						<Typography
							color="text.secondary"
							className="text-sm font-medium leading-none"
						>
							Profit
						</Typography>
						<Typography className="mt-8 font-bold text-xl  leading-none">
							{/* {spent.toLocaleString('en-US', {
								style: 'currency',
								currency: 'USD'
							})} */}
							{ caldata && caldata?.total_profit?.toFixed(2)}
						</Typography>
					</div>
					<div>
						<Typography
							color="text.secondary"
							className="text-sm font-medium leading-none  "
						>
							ROI
						</Typography>
						<Typography className="mt-8 font-bold text-xl leading-none">
							{/* {spent.toLocaleString('en-US', {
								style: 'currency',
								currency: 'USD'
							})} */}
						{ caldata && caldata?.roi?.toFixed(2)}
						</Typography>
					</div>

				</div>
				
			</div>					
			 <div className="absolute top-0 ltr:right-0 rtl:left-0 w-96 h-96 -m-24">
				{/* {status === 'paid' && (
					<FuseSvgIcon
						size={96}
						className="opacity-25 text-green-500 dark:text-green-400"
					>
						heroicons-outline:check-circle
					</FuseSvgIcon>
				)}

				{status === 'pending' && (
					<FuseSvgIcon
						size={96}
						className="opacity-25 text-red-500 dark:text-red-400"
					>
						heroicons-outline:exclamation-circle
					</FuseSvgIcon>
				)} */}
				
			</div> 
		</Paper>
	);
}

export default memo(QuickInfoWidget);
