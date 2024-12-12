// import DemoContent from '@fuse/core/DemoContent';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { selectUserPermissions } from 'app/store/user/userSlice';
import { useAppDispatch, useAppSelector } from 'app/store';
import { useEffect, useMemo } from 'react';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.palette.divider
	},
	'& .FusePageSimple-content': {},
	'& .FusePageSimple-sidebarHeader': {},
	'& .FusePageSimple-sidebarContent': {}
}));

function Dashboard() {
	// const { t } = useTranslation('dashboardPage');

	const userPermissions = useAppSelector(selectUserPermissions);
	console.log(userPermissions);
	
	return (
		<Root
			header={
				<div className="p-24">
					<h4>Dashboard</h4>
				</div>
			}
			content={
				<div className="p-24">
					<h4>Content</h4>
					<br />
				</div>
			}
		/>
	);
}

export default Dashboard;
