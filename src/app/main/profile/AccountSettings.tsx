import FusePageSimple from '@fuse/core/FusePageSimple';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import _ from '@lodash';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { useAppDispatch, useAppSelector } from 'app/store';
import * as React from 'react';
import DashboardAppHeader from './AccountSettingsHeader';
import Profile from './pages/ProfilePage'
import AccountDetails from './pages/MyDetails'
import BillingTable from './pages/Billing'
import PasswordChange from './pages/Password'
import { useLocation } from 'react-router-dom';
import { selectUser } from 'app/store/user/userSlice';
const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 0 0 1px  ${theme.palette.divider}`
	}
}));

/**
 * The AccountSettings page.
 */
function AccountSettings() {
	const dispatch = useAppDispatch();
	// const widgets = useAppSelector(selectWidgets);

	const [tabValue, setTabValue] = useState(0);
	const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('userid');
	const user= useAppSelector(selectUser);
	const userRole= user.role[0];
	

	useEffect(() => {
		// dispatch(getWidgets());
	}, [dispatch]);

	function handleChangeTab(event: React.SyntheticEvent, value: number) {
		setTabValue(value);
	}

	// if (_.isEmpty(widgets)) {
	// 	return null;
	// }

	return (
		<Root
			header={<DashboardAppHeader />}
			content={
				<div className="w-full pt-12 lg:ltr:pr-0 lg:rtl:pl-0 bg-white ">
					<Tabs
						value={tabValue}
						onChange={handleChangeTab}
						indicatorColor="secondary"
						textColor="inherit"
						variant="scrollable"
						scrollButtons={false}
						className="w-full px-20 -mx-4 min-h-20 border-b "
						classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
						TabIndicatorProps={{
							children: (
								<Box
									// sx={{ bgcolor: 'text.disabled' }}
									className="w-full h-full rounded-full opacity-20"
								/>
							)
						}}
					>
						<Tab
							className="text-14 font-semibold min-h-20 min-w-64 mx-4 px-12"
							disableRipple
							label="My Details"
						/>

						<Tab
							className="text-14 font-semibold min-h-20 min-w-64 mx-4 px-12"
							disableRipple
							label="Profile"
							disabled={userId !== null}

						/>

						<Tab
							className="text-14 font-semibold min-h-20 min-w-64 mx-4 px-12"
							disableRipple
							label="Reset Password"
							disabled={userId !== null}
						/>
						<Tab
							className="text-14 font-semibold min-h-20 min-w-64 mx-4 px-12"
							disableRipple
							label="Team"
							disabled
						/>
						<Tab
							className="text-14 font-semibold min-h-20 min-w-64 mx-4 px-12"
							disableRipple
							label="Billing"
							disabled={userRole==='Prep Center Admin' || userRole==='Prep Center Staff'}
						/>
						<Tab
							className="text-14 font-semibold min-h-20 min-w-64 mx-4 px-12"
							disableRipple
							label="Notifications"
							disabled
						/>
						<Tab
							className="text-14 font-semibold min-h-20 min-w-64 mx-4 px-12"
							disableRipple
							label="Integrations"
							disabled
						/>
					</Tabs>
					{tabValue === 0 && <AccountDetails userRole={userRole} userId={userId} />}
					{tabValue === 1 && <Profile />}
					{tabValue === 2 && <PasswordChange />}
					{tabValue === 4 && <BillingTable user_id={userId} />}
				</div>
			}
		/>
	);
}

export default AccountSettings;
