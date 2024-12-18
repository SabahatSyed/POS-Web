import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router';

/**
 * The FinanceDashboardAppHeader component.
 */
function SubscriptionHeader({onClose}) {

	const closeDialog = onClose;
	const navigate = useNavigate();

	const handleGoBack = () => {
		// navigate("/profile");
		closeDialog && closeDialog()

	};
	return (
		<div className="flex w-full container">
			<div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 p-24 md:p-32 pb-0 md:pb-0">
				<div className="flex  flex-auto items-center ">
				
					<IconButton
									aria-label="Open drawer"
									onClick={() => handleGoBack()}
									className="flex"
									size="large"
								>
									<FuseSvgIcon>heroicons-outline:arrow-left</FuseSvgIcon>
					</IconButton>
				
				 <Typography className="text-3xl font-semibold tracking-tight leading-8">
						Payment Method
				</Typography>
				
					
				</div>
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
					<Button
						className="whitespace-nowrap"
						variant="contained"
						color="secondary"
						startIcon={<FuseSvgIcon size={20}>heroicons-solid:save</FuseSvgIcon>}
					>
						Export
					</Button>
				</div> */}
			</div>
		</div>
	);
}

export default SubscriptionHeader;
