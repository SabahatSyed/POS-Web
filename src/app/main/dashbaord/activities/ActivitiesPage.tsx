import FusePageSimple from '@fuse/core/FusePageSimple';
import Typography from '@mui/material/Typography';
import Timeline from '@mui/lab/Timeline';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import exampleActivitiesData from './exampleActivitiesData';
import ActivityTimelineItem from './ActivityTimelineItem';
import Stack from '@mui/system/Stack';
import Alert from '@mui/material/Alert';
import { useAppDispatch, useAppSelector } from 'app/store';
import { selectUser, selectUserPermissions } from 'app/store/user/userSlice';
import Avatar from '@mui/material/Avatar';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

/**
 * The activities page.
 */
function ActivitiesPage() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);

	const permission = useAppSelector(selectUserPermissions)
	const hasSettingsPermission = permission.includes('Manage Settings')

	return (
		<FusePageSimple
			header={
				<div className="flex flex-col w-full px-24 sm:px-32 bg-white">
					<div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 my-32 sm:my-48">
						<div className="flex flex-auto items-center min-w-0">
							<Avatar
								className="flex-0 w-64 h-64"
								alt="user photo"
								src={user?.data?.photoURL}
							>
								{user?.data?.displayName?.[0]}
							</Avatar>
							<div className="flex flex-col min-w-0 mx-16">
								<Typography className="text-2xl md:text-3xl font-semibold tracking-tight leading-7 md:leading-snug truncate">
									{`Welcome, ${user.data.displayName}!`}
								</Typography>

								<div className="flex items-center">
									<FuseSvgIcon
										size={20}
										color="action"
									>
										heroicons-solid:bell
									</FuseSvgIcon>
									<Typography
										className="mx-6 leading-6 truncate"
										color="text.secondary"
									>
										You have 4 new notifications
									</Typography>
								</div>
							</div>
						</div>
						<div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
							<Button component={Link} to="/apps/chat"
								className="whitespace-nowrap"
								variant="contained"
								color="primary"
								startIcon={<FuseSvgIcon size={20}>heroicons-solid:mail</FuseSvgIcon>}
							>
								Messages
							</Button>
							{hasSettingsPermission && (
								<Button component={Link} to="/setting"
									className="whitespace-nowrap"
									variant="contained"
									color="secondary"
									startIcon={<FuseSvgIcon size={20}>heroicons-solid:cog</FuseSvgIcon>}
								>
									Settings
								</Button>
							)}
						</div>
					</div>
					
				</div>
			}
			content={
				<>
					<div className="flex flex-auto flex-col px-24 py-24 sm:pb-80 ">
						
						{/* <Typography className="text-3xl font-extrabold leading-none tracking-tight pb-16">
							Notifications
						</Typography> */}

						<Stack sx={{ width: '100%' }} spacing={2}>
							{/* <Alert severity="error">This is an error alert — check it out!</Alert> */}
							<Alert severity="warning">Your BORRO applicaiton requires attention —
								<Link className='ml-4' to="/">please review!</Link>
							</Alert>
							{/* <Alert severity="info">This is an info alert — check it out!</Alert>
							<Alert severity="success">This is a success alert — check it out!</Alert> */}
						</Stack>
						
						<Typography className="text-3xl font-extrabold leading-none tracking-tight mt-64">
							Recent Activities
						</Typography>
						<Typography
							className="mt-6 text-lg"
							color="text.secondary"
						>
							Application wide activities are listed here as individual items, starting with the most recent.
						</Typography>
						<Timeline
							className="py-48"
							position="right"
							sx={{
								'& .MuiTimelineItem-root:before': {
									display: 'none'
								}
							}}
						>
							{exampleActivitiesData.map((item, index) => (
								<ActivityTimelineItem
									last={exampleActivitiesData.length === index + 1}
									item={item}
									key={item.id}
								/>
							))}
						</Timeline>
					</div>
				</>
			}
			scroll={isMobile ? 'normal' : 'page'}
		/>
	);
}

export default ActivitiesPage;
