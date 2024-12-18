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
function SearchWidget() {
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
                    Search Again
					</Typography>
					
				</div>
				
			</div>
						
			<div className='flex flex-col gap-16 '>
                <div className='flex justify-between border rounded-lg px-9 py-16  text-sm shadow'>
                <Paper className="flex p-4 items-center w-full px-16 py-4 border-1 border-gray-A100 h-40 rounded-full shadow-md">
                <div className="p-2  border-r" >
                            <IconButton className='p-0 text-black'
                                aria-label="more"
                                size="medium"
                            >
                                <FuseSvgIcon>heroicons-outline:search</FuseSvgIcon>
                            </IconButton>
                        </div> 
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
                
            </div>
		</Paper>
	);
}

export default memo(SearchWidget);
