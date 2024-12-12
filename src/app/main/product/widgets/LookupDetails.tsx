import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useAppSelector } from 'app/store';
import PreviousStatementWidgetType from '../types/PreviousStatementWidgetType';
import { Input } from '@mui/material';
import history from '@history';

/**
 * The Alerts widget.
 */
function LookupWidget() {
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
		<Paper className="relative flex flex-col  flex-auto p-24  rounded-2xl shadow overflow-hidden">
			<div className="flex items-center justify-between mb-16">
				<div className="flex flex-col">
					<Typography className="text-2xl font-bold tracking-tight leading-6 truncate">
                    Lookup Details
					</Typography>
					
				</div>
				
			</div>
						
			<div className='flex flex-col gap-16 '>
                <div className='flex justify-between border rounded-lg px-9 py-16  text-sm shadow'>
                <Paper className="flex p-4 items-center w-full px-16 py-4 border-1 border-gray-A100 h-40 rounded-full shadow-md">
                    <Typography className="text-md  tracking-tight leading-6 truncate border-gray-A200 border-r pr-2">
                    Source
					</Typography>
					<Input
						placeholder="URL, Store, etc."
						className="flex flex-1 px-8 placeholder:text-black"
						disableUnderline
						fullWidth
						//value={search}
						inputProps={{
							'aria-label': 'Search'
						}}
						onKeyDown={handleKeyDown}
						//onChange={handleSearchText}
					/>
					
                </Paper>
                </div>
                <div className='flex justify-end gap-12'>
                    <div className='p-6 w-32  rounded-md ' style={{background: "linear-gradient(180deg, rgba(138, 204, 255, 0.97) 0%, rgba(10, 87, 147, 0.97) 100%)"}}>
                        <FuseSvgIcon className='text-white'
                            size={20}
                            onClick={handleSearch}
                        >
                            heroicons-solid:printer
                        </FuseSvgIcon>
                    </div>
                    <div className='p-6 w-32  rounded-md ' style={{background: "linear-gradient(180deg, rgba(138, 204, 255, 0.97) 0%, rgba(10, 87, 147, 0.97) 100%)"}}>
                        <FuseSvgIcon className='text-white'
                            size={20}
                            onClick={handleSearch}
                        >
                            heroicons-outline:printer
                        </FuseSvgIcon>
                    </div>
                    <div className='p-6 w-32  rounded-md ' style={{background: "linear-gradient(180deg, rgba(138, 204, 255, 0.97) 0%, rgba(10, 87, 147, 0.97) 100%)"}}>
                        <FuseSvgIcon className='text-white'
                            size={20}
                            onClick={handleSearch}
                        >
                            heroicons-outline:printer
                        </FuseSvgIcon>
                    </div>
                </div>
            </div>
		</Paper>
	);
}

export default memo(LookupWidget);
