import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useState } from 'react';
import FormDialog from 'app/shared-components/FormDialog';
import { useAppDispatch, useAppSelector } from 'app/store';
import { useNavigate } from 'react-router';
import { addRecord, getRecords } from './store/SupportSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { selectUserRole } from 'app/store/user/userSlice';

/**
 * The support component.
 */
function SupportHeader() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [message, setMessage] = useState('')
	const [heading, setHeading] = useState('')
	const [loading, setLoading] = useState(false)
	const userRole = useAppSelector(selectUserRole);
	const user= userRole[0];

  // Function to open the dialog
  const openDialog = () => {
    setDialogOpen(true);
  };

  // Function to close the dialog
  const closeDialog = () => {
    setDialogOpen(false);
  };

  // Function to handle confirmation (API call)
  const handleConfirm = async () => {
    try {
      // Perform your API call here using `fetch` or any other library
      // Example:
	  setLoading(true)
	  const payload = { message: message , title:heading }
      await dispatch(addRecord({payload}))
					.then((resp: any) => {
						console.log(resp);
						if (resp.error) {
							dispatch(showMessage({ message: resp.error.message, variant: 'error' }));
						}
						else {
							dispatch(showMessage({ message: 'Success', variant: 'success' }));
							// history.push(`/product/${resp.payload.product_id}`)
							dispatch(getRecords())
						}
					});
    } catch (error) {
    }
	setLoading(false)

    closeDialog();
  };
	return (
		<div className="flex w-full container">
			<div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 p-24 md:p-32 pb-0 md:pb-0">
				<div className="flex  flex-auto">
				 <Typography className="text-3xl font-semibold tracking-tight leading-8">
						Customer Queries
				</Typography>
				
					
				</div>
				{userRole[0] == 'Customer' && <Button
						className="whitespace-nowrap"
						variant="contained"
						color="secondary"
						onClick={()=>openDialog()}
						startIcon={<FuseSvgIcon size={20}>heroicons-solid:plus</FuseSvgIcon>}
					>
						New Message
				</Button>}
				{/*<div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
					<Button
						className="whitespace-nowrap"
						startIcon={<FuseSvgIcon size={20}>heroicons-solid:document-report</FuseSvgIcon>}
					>
						Reports
					</Button>
					<Button
						className="whitespace-nowrap"
						startIcon={<FuseSvgIcon size={20}>heroicons-solid:cog</FuseSvgIcon>}
					>
						Settings
					</Button>
					
				</div> */}
				 <FormDialog
					open = {dialogOpen}
					onClose = {closeDialog}
					onConfirm = {handleConfirm}
					title = "New Query"
					content = {message}
					heading={heading}
					setHeading={setHeading}
					setContent = {setMessage}
					loading = {loading}
					user={user}
				/>
			</div>
		</div>
	);
}

export default SupportHeader;
