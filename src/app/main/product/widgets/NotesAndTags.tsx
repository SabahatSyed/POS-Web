import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useAppSelector } from 'app/store';
// import { selectWidgets } from '../store/widgetsSlice';
import PreviousStatementWidgetType from '../types/PreviousStatementWidgetType';
import { Input } from '@mui/material';
import history from '@history';

/**
 * The Alerts widget.
 */
function NotesWidget() {
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
			<div className="flex items-center justify-between mb-16">
				<div className="flex flex-col">
					<Typography className="text-2xl font-bold tracking-tight leading-6 truncate">
                    Notes & Tags
					</Typography>
					
				</div>
				
			</div>
						
			<div>
                <div className='flex justify-between border rounded-lg p-9  text-sm shadow'>
                    <div className='flex items-center ' >
                        <div className="p-2 bg-[#ACD2EF]" >
                            <IconButton className='p-0 text-white'
                                aria-label="more"
                                size="large"
                            >
                                <FuseSvgIcon>heroicons-outline:plus-circle</FuseSvgIcon>
                            </IconButton>
                        </div> 
                        <div className='p-5 px-8 pt-6 text-white' style={{background: "linear-gradient(180deg, rgba(138, 204, 255, 0.97) 0%, rgba(10, 87, 147, 0.97) 100%)"}}>Add Note</div>
                    </div>
                    <div className='p-6 rounded-full bg-[#D2EBFF]'>
                        <IconButton className='p-0 text-white bg-secondary'
                            aria-label="more"
                            size="large"
                        >
                            <FuseSvgIcon >heroicons-outline:star</FuseSvgIcon>
                        </IconButton>
                    </div>
                </div>
            </div>
		</Paper>
	);
}

export default memo(NotesWidget);
