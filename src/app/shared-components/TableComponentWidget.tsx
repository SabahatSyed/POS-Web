import { useEffect, useMemo, useState } from "react";
import _ from "@lodash";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "app/store";
import { Button, Typography } from "@mui/material";
import Input from "@mui/material/Input";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import DataTableWidget from "app/shared-components/data-table-widget/DataTableWidget";
import {
	TableConfig,
	TableEvent,
} from "app/shared-components/data-table-widget/types/dataTypes";
import ConfirmationDialog from "./ConfirmationDialog";

/**
 * The TablePageWidget.
 */

type TablePageWidgetProps = {
	title: string;
	tableConfig: TableConfig;
	getRecords: any;
	deleteRecord?: any;
};

function TablePageWidget(props: TablePageWidgetProps) {
	const { title, tableConfig } = props;

	const data = props.tableConfig.dataSource;

	const getRecords = props.getRecords;
	const deleteRecord = props.deleteRecord;

	const onSomeEvent = tableConfig.onSomeEvent;
	// console.log(onSomeEvent);
	const [searchText, setSearchText] = useState("");
	const [pagination, setPagination] = useState(undefined);
	const [loading, setLoading] = useState(false);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedRow, setSelectedRow] = useState(null);

	const dispatch = useAppDispatch();

	useEffect(() => {
		const params = {
			page: pagination?.page || 1,
			limit: tableConfig.perPage,
			search: searchText,
		};
		setPagination(params);
		dispatch(getRecords(params));
	}, [dispatch, getRecords, tableConfig.perPage, searchText]);

	props.tableConfig.onSomeEvent = onTableEvent;

	function onTableEvent(event: TableEvent) {
		console.log("onTableEvent", event);

		if (event.event == "loadData") {
			setPagination(event.params);

			dispatch(getRecords(event.params));
		}

		if (event.event == "rowAction") {
			if (event.action == "onDelete") {
				const row = event.params.row;
				setSelectedRow(row);
				setDialogOpen(true);
			}
		}

		onSomeEvent && onSomeEvent(event);
	}

	function handleRefresh() {
		setLoading(true);
		dispatch(getRecords(pagination)).finally(() => {
			setLoading(false);
		});
	}

	function handleCreate() {
		onSomeEvent && onSomeEvent({ event: "none", action: "create" });
	}

	const handleCloseDialog = () => {
		setDialogOpen(false);
	};

	const handleConfirmDialog = () => {
		// Your confirmation logic goes here
		// e.g., perform some action and then close the dialog
		handleCloseDialog();
		if (deleteRecord) {
			dispatch(deleteRecord({ id: selectedRow.id })).then(() => {
				handleRefresh();
			});
		}
	};

	// const title = 'Roles';
	// const tableConfig: TableConfig = {
	// 	selection: 'none',
	// 	rowActions: [
	// 		{'tooltip': 'Edit', action: 'onEdit', icon: 'heroicons_outline:pencil'},
	// 	],
	// 	columns: [
	// 		{name: 'name', title: 'Name', type: 'text', sort: false},
	// 		{name: 'createdAt', title: 'Datetime', type: 'datetime', sort: false, width: 'w-50'},
	// 	],
	// 	dataSource: data,
	// 	// actions: this.actions,
	// 	// events: this.events,
	// 	perPage: 30
	// }

	const header = (
		<div className="flex w-full container">
			<div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 p-24 md:p-32 pb-0 md:pb-0">
				<div className="flex flex-col flex-auto">
					<Typography className="text-3xl font-semibold tracking-tight leading-8">
						{title}
					</Typography>
				</div>
				<div className="flex items-center mt-24 sm:mt-0 sm:mx-8 sm:space-x-12 space-x-4 justify-center sm:flex-row flex-col space-y-10 sm:space-y-0">
					<Paper
						component={motion.div}
						initial={{ y: -20, opacity: 0 }}
						animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
						className="flex items-center w-full sm:max-w-256 space-x-8 px-16 rounded-full border-1 shadow-0 "
					>
						<FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>

						<Input
							placeholder="Search"
							className="flex flex-1"
							disableUnderline
							fullWidth
							value={searchText}
							onChange={(ev) => setSearchText(ev.target.value)}
							inputProps={{
								"aria-label": "Search",
							}}
							// onChange={(ev: ChangeEvent<HTMLInputElement>) =>
							// 	//dispatch(setProductsSearchText(ev.target.value))
							// }
						/>
					</Paper>
					<div>
						
					{tableConfig.showAdd ? (
						<>
						<Button
							className="whitespace-nowrap bg-blue-gray-600"
							variant="contained"
							// color="secondary"
							startIcon={
								<FuseSvgIcon size={20}>heroicons-solid:plus</FuseSvgIcon>
							}
							onClick={handleCreate}
							>
							Create
							</Button>
							{/* <Button
							className="whitespace-nowrap sm:hidden flex "
							variant="contained"
								color="secondary"
								sx={{
									'& .muiltr-gcc2o7-MuiButton-startIcon': {
									  marginLeft: 0,
									  marginRight:0,
								  },}}
							startIcon={
								<FuseSvgIcon size={20}>heroicons-solid:plus</FuseSvgIcon>
							}
							onClick={handleCreate}
						>
					
						</Button> */}
							</>
					) : (
						""
					)}

					<Button
						className={`
							mx-8
							${loading ? "w-120 pointer-events-none opacity-70" : "w-120"}
						`}
						variant="contained"
						color="primary"
						startIcon={
							loading ? (
								<CircularProgress size={20} color="inherit" />
							) : (
								<FuseSvgIcon size={20}>heroicons-solid:refresh</FuseSvgIcon>
							)
						}
						onClick={handleRefresh}
					>
						<span>{loading ? "Refresh" : "Refresh"}</span>
					</Button>
					{/* <Button
						className={` flex
							  sm:hidden 
							${loading ? "w-20 pointer-events-none opacity-70" : "w-20"}
						`}
						variant="contained"
						color="primary"
						sx={{
							'& .muiltr-gcc2o7-MuiButton-startIcon': {
							  marginLeft: 0,
							  marginRight:0,
						  },}}
						startIcon={
							loading ? (
								<CircularProgress size={20} color="inherit" />
							) : (
								<FuseSvgIcon size={20}>heroicons-solid:refresh</FuseSvgIcon>
							)
						}
						onClick={handleRefresh}
					></Button> */}
					{/* <Button
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
					</Button> */}
					{/* <Button
						className="whitespace-nowrap"
						variant="contained"
						color="secondary"
						startIcon={<FuseSvgIcon size={20}>heroicons-solid:save</FuseSvgIcon>}
					>
						Export
					</Button> */}
					</div>
					
					</div>
			</div>
		</div>
	);

	const content = (
		<>
			<div className="w-full px-24 md:px-32 pb-24">
				{useMemo(() => {
					const container = {
						show: {
							transition: {
								staggerChildren: 0.06,
							},
						},
					};

					const item = {
						hidden: { opacity: 0, y: 20 },
						show: { opacity: 1, y: 0 },
					};

					return (
						!_.isEmpty(data) && (
							<motion.div
								className="w-full"
								variants={container}
								initial="hidden"
								animate="show"
							>
								<div className="grid grid-cols-1 gap-32 w-full mt-32">
									<motion.div
										variants={item}
										className="xl:col-span-2 flex flex-col flex-auto"
									>
										{/* table view here */}
										<DataTableWidget {...tableConfig} />
									</motion.div>
								</div>
							</motion.div>
						)
					);
				}, [data])}
			</div>
			<ConfirmationDialog
				open={dialogOpen}
				onClose={handleCloseDialog}
				onConfirm={handleConfirmDialog}
				title="Confirmation"
				content="Are you sure you want to perform this action?"
			/>
		</>
	);

	return (
		<div>
			{header}
			{content}
		</div>
	);
}

export default TablePageWidget;
