import { useEffect, useMemo, useState } from 'react';
import _ from '@lodash';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { motion } from 'framer-motion';
import { getRoles, selectRolesRecords } from '../store/dataSlice';
import { useAppDispatch, useAppSelector } from 'app/store';
import RoleTransactiontable from './ProspectsTransactiontable';
import { Button, Typography } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { useNavigate } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

/**
 * The UsersTablePage.
 */
function RolesTablePage() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const widgets = useAppSelector(selectRolesRecords);
	const [tabValue, setTabValue] = useState(0);
	console.log("ww", widgets)
	useEffect(() => {
		dispatch(getRoles());
	}, [dispatch]);
	function handleChangeTab(event: React.SyntheticEvent, value: number) {
		setTabValue(value);
	}
	const handleCreateClick = () => {
		// Navigate to the UserForm page
		navigate('/roles/form');
	};
	const data = [{ 'id': '11', 'name': 'abc' }]

	const header = (
		<div className="flex w-full container">
			<div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 px-6">
				<div className="flex flex-col flex-auto lg:mt-10 mt-10 ">
					<Typography className="text-3xl lg:ml-12 ml-12 font-semibold tracking-tight leading-8">
						Prospects
					</Typography>
					{/* <Typography
						className="font-medium tracking-tight"
						color="text.secondary"
					>
						Keep track of your users data
					</Typography> */}
				</div>

				<div className="flex items-center space-x-1 ">

					<div className="w-full py-12 pt-16 sm:pt-24 lg:ltr:pr-0 lg:rtl:pl-0 ">
						<Tabs
							value={tabValue}
							onChange={handleChangeTab}
							indicatorColor="secondary"
							textColor="inherit"
							variant="scrollable"
							scrollButtons={false}
							className="w-full min-h-40"

							classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
							TabIndicatorProps={{
								children: (
									<Box
										sx={{ bgcolor: 'text.disabled' }}
										className="w-full h-full rounded-full opacity-20"
									/>
								),
							}}
						>
							{['All', 'Not Processed', 'Processed', 'Try Again', 'Archived', 'Restored'].map((label, index) => (
								<Tab
									key={index}
									className="text-14 font-semibold min-h-40 rounded-full min-w-64 mx-4 px-12"
									disableRipple
									label={label}
									style={{
										backgroundColor: tabValue === index ? 'your-selected-background-color' : 'white',
										color: tabValue === index ? 'your-selected-text-color' : 'inherit',
									}}
								/>
							))}

						  </Tabs>
						     {/* {tabValue === 0 && <HomeTab />} 
			                 {tabValue === 1 && <BudgetTab />}
			                 {tabValue === 2 && <TeamTab />}*/}
					</div>
					<div className="flex  mx-12 lg:mt-8">
					<Button
						className="whitespace-nowrap"
						variant="contained"
						color="primary"
						startIcon={<FuseSvgIcon size={20}>heroicons-solid:refresh</FuseSvgIcon>}
					>
						Refresh
					</Button>
					</div>
				</div>
			</div>
		</div>
	);

	const content = (
		<div className="w-full px-24 md:px-32 pb-24">
			{useMemo(() => {
				const container = {
					show: {
						transition: {
							staggerChildren: 0.06
						}
					}
				};

				const item = {
					hidden: { opacity: 0, y: 20 },
					show: { opacity: 1, y: 0 }
				};

				return (
					!_.isEmpty(data) && (
						<motion.div
							className="w-full"
							variants={container}
							initial="hidden"
							animate="show"
						>

							<div className="grid grid-cols-1 xl:grid-cols-3 gap-32 w-full mt-32">
								<motion.div
									variants={item}
									className="xl:col-span-2 flex flex-col flex-auto"
								>

									<RoleTransactiontable />
								</motion.div>

							</div>
						</motion.div>
					)
				);
			}, [widgets])}
		</div>
	);

	return (
		<FusePageSimple
			header={header}
			content={content}
		/>
	);
}

export default RolesTablePage;
