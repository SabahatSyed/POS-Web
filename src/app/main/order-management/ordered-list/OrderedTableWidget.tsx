import React, { useEffect, useMemo, useRef, useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import _ from "@lodash";
import FusePageSimple from "@fuse/core/FusePageSimple";
import {
	getRecords as getRolesRecords,
	getUsers,
} from "../../favourites/store/prepCenterSlice";
import ControlPointDuplicateIcon from "@mui/icons-material/ControlPointDuplicate";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "app/store";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import AddIcon from "@mui/icons-material/Add";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { Tooltip, useMediaQuery, useTheme } from "@mui/material";
import filterIcon from "../assets/filterIcon.svg";
import {
	Box,
	Button,
	FormHelperText,
	IconButton,
	Menu,
	MenuItem,
	Modal,
	TextField,
	TextareaAutosize,
	Typography,
} from "@mui/material";
import Input from "@mui/material/Input";
import RemoveIcon from "@mui/icons-material/Remove";
// import CloseIcon from "@mui/icons-material/Close";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import {
	TableConfig,
	TableEvent,
} from "app/shared-components/data-table-widget/types/dataTypes";
import ConfirmationDialog from "./ConfirmationDialog";
import axios from "axios";
import { showMessage } from "app/store/fuse/messageSlice";
import OrderedDataTableWidget from "app/shared-components/data-table-widget/OrderedDataTableWidget";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import MultiSelectDropdown from "../widgets/MultiSelectDropDown";
import MultiSelectCheckmarks from "../widgets/MultiSelectCheckMarks";
import Close from "@mui/icons-material/Close";
import CreateOrderForm from "../../favourites/components/CreateOrderForm";
import ConfirmationModal from "../widgets/ConfirmationModal";
import KeySelector from "../widgets/KeySelector";
import ReceivedOrderForm from "../../favourites/components/ReceivedOrder";
import PreppingForm from "../../favourites/components/PreppingForm";
import { selectUser, selectUserRole } from "app/store/user/userSlice";
import ShippedOrderForm from "../../favourites/components/ShippedForm";
import MenuIcon from "@mui/icons-material/Menu";
/**
 * The TablePageWidget.
 */
const style = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	// border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};

type TablePageWidgetProps = {
	title: string;
	tableConfig: TableConfig;
	getRecords: any;
	deleteRecord?: any;
	showLoader?: boolean;
	isSheets?: boolean;
	queryParams?: any;
	selectedRow?: any;
	showForm?: any;
	setShowForm?: any;
	setSelectedRow?: any;
	clickedRow?: any;
};
interface DateValueProps {
	fromDate?: Dayjs | null;
	toDate?: Dayjs | null;
}
function OrderedTableWidget(props: TablePageWidgetProps) {
	const {
		title,
		tableConfig,
		isSheets = false,
		queryParams,
		showForm,
		setShowForm,
		clickedRow,
	} = props;
	const userRole = useAppSelector(selectUserRole);
	console.log(userRole);

	const data = props.tableConfig.dataSource;
	const [isFiltered, setIsFiltered] = useState<boolean>(false);
	const [buttonLoading, setIsButtonLoading] = useState("");
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [selectedOrder, setSelectedOrder] = useState<any>([]);
	const [dateValues, setDateValues] = React.useState<any>({
		fromDate: null,
		toDate: null,
	});
	const [filterValues, setFilterValues] = useState<any>({
		prep_center_ids: null,
		status: null,
		order_types: null,
		user_ids: null,
	});
	const [formValues, setFormValues] = useState({
		note: null,
		page_link: null,
	});

	const getRecords = props.getRecords;
	const deleteRecord = props.deleteRecord;
	const showLoadr = props.showLoader;

	const onSomeEvent = tableConfig.onSomeEvent;
	// console.log(onSomeEvent);
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	console.log(open, selectedOrder);

	const handleClose = () => {
		setFormValues({ note: selectedRow.note, page_link: selectedRow.page_link });
		setShowForm(false);
	};
	const [menuAnchor, setMenuAnchor] = useState(null);
	const [sheetName, setSheetName] = useState<string>("");
	const [searchText, setSearchText] = useState("");
	const [pagination, setPagination] = useState(undefined);
	const [loading, setLoading] = useState(false);
	const [isClear, setIsClear] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedRow, setSelectedRow] = useState(null);
	const dispatch = useAppDispatch();
	const [selectedItems, setSelectedItems] = useState([]);
	const [selectedUsernames, setSelectedUsernames] = useState([]);
	const [selectedCenterNames, setSelectedCenterNames] = useState([]);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);

	const handleTagsChange = (items: string[]) => {
		setFilterValues((prevValues) => ({
			...prevValues,
			order_types: items.length > 0 ? JSON.stringify(items) : null,
		}));
	};
	const handleStatusChange = (items: string[]) => {
		setFilterValues((prevValues) => ({
			...prevValues,
			status: items.length > 0 ? JSON.stringify(items) : null,
		}));
	};

	const handleSelectedItemsChange = (items) => {
		setFilterValues((prevValues) => ({
			...prevValues,
			prep_center_ids: items.length > 0 ? JSON.stringify(items) : null,
		}));
	};
	const handleSelectedUsersChange = (items) => {
		console.log(items.length);
		setFilterValues((prevValues) => ({
			...prevValues,
			user_ids: items.length > 0 ? JSON.stringify(items) : null,
		}));
	};
	console.log(filterValues);

	useEffect(() => {
		const params = {
			page: pagination?.page || 1,
			limit: pagination?.limit || tableConfig.perPage,
			search: searchText,
			from_date: dateValues.fromDate
				? new Date(dateValues.fromDate).setSeconds(0, 0) / 1000
				: null,
			to_date: dateValues.toDate
				? new Date(dateValues.toDate).setHours(23, 59, 59) / 1000
				: null,
			...filterValues,
			...queryParams,
		};
		setPagination(params);
		dispatch(getRecords(params));
	}, [selectedItems, selectedTags, dateValues, filterValues]);
	useEffect(() => {
		console.log("in");

		const params = {
			page: pagination?.page || 1,
			limit: tableConfig.perPage,
			search: searchText,
			...queryParams,
		};
		setPagination(params);
		dispatch(getRecords(params));
	}, [dispatch, getRecords, tableConfig.perPage, searchText]);

	props.tableConfig.onSomeEvent = onTableEvent;
	useEffect(() => {}, [selectedOrder]);
	function onTableEvent(event: TableEvent) {
		console.log("onTableEvent", event);

		if (event.event == "loadData") {
			setPagination(event.params);
			dispatch(getRecords({ ...event.params, search: searchText }));
		}

		if (event.event == "rowAction") {
			if (event.action == "onDelete") {
				const row = event.params.row;
				setSelectedRow(row);
				setDialogOpen(true);
			}
		}
		if (event.event == "rowClick") {
			const row = event.params.row;
			setFormValues({ note: row.note, page_link: row.page_link });
			setSelectedRow(row);
		}

		onSomeEvent && onSomeEvent(event);
	}

	function handleRefresh() {
		setLoading(true);
		setIsButtonLoading("refresh");
		dispatch(getRecords(pagination)).finally(() => {
			setIsButtonLoading("refresh");
			setLoading(false);
		});
	}
	const [createOrderOpen, setCreateOrderOpen] = useState(false);

	const [receivedOrderOpen, setReceivedOrderOpen] = useState(false);
	const [preppingForm, setPreppingForm] = useState(false);
	const [shippedForm, setShippedForm] = useState(false);

	const handleCreateOrder = () => {
		setCreateOrderOpen(true);
	};
	const handleReceivedOrderOpen = () => {
		setReceivedOrderOpen(true);
	};
	function handleCreate() {
		axios.post("/api/remove_from_favourite");
	}
	const handleMenuOpen = (event) => {
		setMenuAnchor(event.currentTarget);
		console.log(event.currentTarget);
	};

	const handleMenuClose = () => {
		setMenuAnchor(null);
	};

	const handleRemove = async () => {
		// setLoading(true)
		setDeleteLoading(true);
		// Iterate over each favorite ID in the selectedRow array
		await Promise.allSettled(
			props.selectedRow.map(async (orderId) => {
				try {
					await axios.delete(`/api/order_list/?id=${orderId}`);
					props.setSelectedRow([]);
					setSelectedOrder([]);

					setShowForm(false);
				} catch (error) {
					setDeleteLoading(false);
					// Log the error for each failed API call
					console.error(`Error removing favorite with ID ${orderId}:`, error);
				}
			})
		);
		dispatch(showMessage({ variant: "success", message: "Success" }));
		// Clear all selected rows after successful removal
		setSelectedRow([]);
		setSelectedOrder([]);
		setDeleteDialogOpen(false);
		setDeleteLoading(false);
		handleRefresh();
	};
	const menuRef = useRef();

	const handleConfirmOrder = async () => {
		// setIsButtonLoading("confirm");
		setLoading(true);

		// Iterate over each favorite ID in the selectedRow array
		await Promise.allSettled(
			props.selectedRow.map(async (orderId) => {
				try {
					await axios.put(`/api/order_list/confirm_order`, {
						status: "Placed",
						id: orderId,
					});
					props.setSelectedRow([]);
					handleCloseDialog();
					setSelectedOrder([]);
					setShowForm(false);
				} catch (error) {
					// Log the error for each failed API call
					setLoading(false);
					// setIsButtonLoading("");
					console.error(`Error Updating Orders with ID ${orderId}:`, error);
				}
			})
		);
		dispatch(showMessage({ variant: "success", message: "Success" }));
		// Clear all selected rows after successful removal
		setSelectedRow([]);
		setSelectedOrder([]);
		setLoading(false);
		// setIsButtonLoading("");
		handleRefresh();
	};
	//  useEffect(() => {

	//    if (props.selectedRow?.length > 0) {
	//      if (!menuAnchor) {
	//        menuRef.current.click();
	//      }
	//    }
	//  }, [props.selectedRow]);
	useEffect(() => {
		if (Object.keys(data).length > 0) {
			if (data.records.length === 0 && Number(data.page) > 1) {
				console.log("in");
				dispatch(getRecords({ page: data.page - 1 }));
			}
		}
	}, [data]);

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
	const handleSubmit = async (e) => {
		e.preventDefault();
		const regex =
			/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-])\/?$/;
		if (regex.test(formValues.page_link) || !!formValues.page_link == false) {
			try {
				setLoading(true);

				await axios
					.put("/api/favourites/", {
						id: selectedRow.favourite_id,
						...formValues,
					})
					.then((resp: any) => {
						if (resp.error) {
							dispatch(
								showMessage({ message: resp.error.message, variant: "error" })
							);
						} else {
							dispatch(showMessage({ message: "Success", variant: "success" }));
							setFormValues({ note: null, page_link: null });
							setSelectedRow(null);
							handleRefresh();
							setShowForm(false);
						}
					});

				setLoading(false);
			} catch (error) {
				console.error("Error handling form submission:", error);
				dispatch(showMessage({ message: error?.message, variant: "error" }));
				setShowForm(false);
				setLoading(false);
			}
		} else {
			dispatch(showMessage({ message: "Invalid Link", variant: "error" }));
			setLoading(false);
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
	console.log(selectedOrder);

	const header = (
		<div className="flex flex-col w-full container">
			<div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 p-12 sm:p-24 md:p-32 pb-0 md:pb-0">
				<div className="sm:flex flex-col flex-auto mb-10 hidden">
					<Typography className="text-3xl font-semibold tracking-tight leading-8">
						{title}
					</Typography>
					<Typography
						className="font-medium tracking-tight"
						color="text.secondary"
					>
						Manage your orders!
					</Typography>
				</div>
				<div className="flex justify-between sm:hidden">
					<div className="flex flex-col flex-auto mb-10">
						<Typography className="text-3xl font-semibold tracking-tight leading-8">
							{title}
						</Typography>
						<Typography
							className="font-medium tracking-tight"
							color="text.secondary"
						>
							Manage your orders!
						</Typography>
					</div>

					{/* <div className="sm:hidden block">
						<IconButton ref={menuRef} onClick={handleMenuOpen}>
							<MoreHorizIcon />
						</IconButton>
          </div> */}

					{/* <Menu
						id="mui-menu"
						anchorEl={menuAnchor}
						open={Boolean(menuAnchor)}
						onClose={handleMenuClose}
					>
						{props.selectedRow.length === 0 &&
							(userRole[0] === "Admin" || userRole[0] === "Customer") && (
								<MenuItem
									className="flex items-center"
									onClick={handleCreateOrder}
								>
									<FuseSvgIcon size={20}>heroicons-solid:plus</FuseSvgIcon>
									Create Order
									{loading && buttonLoading === "create" && (
										<div className="ml-6 inline-flex items-center">
											<CircularProgress size={16} color="inherit" />
										</div>
									)}
								</MenuItem>
							)}
						{props.selectedRow.length > 0 && (
							<>
								{props.selectedRow.length === 1 && (
									<>
										{selectedOrder[0].status.toLowerCase() === "draft" && (
											<MenuItem onClick={() => setDialogOpen(true)}>
												{buttonLoading === "confirm" && loading ? (
													<CircularProgress size={20} color="inherit" />
												) : (
													<FuseSvgIcon size={20}>
														heroicons-solid:check
													</FuseSvgIcon>
												)}
												Confirm
											</MenuItem>
										)}
										{userRole[0] !== "Prep Center Admin" &&
											userRole[0] !== "Prep Center Staff" && (
												<>
													<MenuItem onClick={handleOpen}>
														Duplicate
														{showLoadr && (
															<div className="ml-6 inline-flex items-center">
																<CircularProgress size={16} color="inherit" />
															</div>
														)}
													</MenuItem>
													{(selectedOrder[0].status.toLowerCase() ===
														"received" ||
														selectedOrder[0].status.toLowerCase() ===
															"placed") && (
														<MenuItem onClick={() => setIsEdit(true)}>
															Edit
															{showLoadr && (
																<div className="ml-6 inline-flex items-center">
																	<CircularProgress size={16} color="inherit" />
																</div>
															)}
														</MenuItem>
													)}
												</>
											)}
									</>
								)}
								{selectedOrder.length > 0 &&
									selectedOrder.every(
										(item) =>
											item.status.toLowerCase() === "received" ||
											item.status.toLowerCase() === "in-progress"
									) &&
									(selectedOrder.every(
										(item) =>
											item.prep_center?.toLowerCase() === "self prep" &&
											["Admin", "Customer"].includes(userRole[0])
									) ||
										["Prep Center Staff", "Prep Center Admin"].includes(
											userRole[0]
										)) && (
										<MenuItem onClick={() => setPreppingForm(true)}>
											{buttonLoading === "confirm" && loading ? (
												<CircularProgress size={20} color="inherit" />
											) : (
												<></>
											)}
											Prepare Order
										</MenuItem>
									)}
								{selectedOrder.length > 0 &&
									selectedOrder.every(
										(data) => data.status.toLowerCase() === "placed"
									) &&
									["Prep Center Staff", "Prep Center Admin"].includes(
										userRole[0]
									) && (
										<MenuItem onClick={handleReceivedOrderOpen}>
											{buttonLoading === "confirm" && loading ? (
												<CircularProgress size={20} color="inherit" />
											) : (
												<></>
											)}
											Receive Order
										</MenuItem>
									)}
								{selectedOrder.length > 0 &&
									selectedOrder.every(
										(data) => data.status.toLowerCase() === "placed"
									) &&
									selectedOrder.every(
										(data) => data.prep_center?.toLowerCase() === "self prep"
									) &&
									["Admin", "Customer"].includes(userRole[0]) && (
										<MenuItem onClick={handleReceivedOrderOpen}>
											{buttonLoading === "confirm" && loading ? (
												<CircularProgress size={20} color="inherit" />
											) : (
												<></>
											)}
											Receive Order
										</MenuItem>
									)}
								{selectedOrder.length > 0 &&
									selectedOrder.every(
										(order) =>
											(order.status.toLowerCase() === "completed" ||
												order.status.toLowerCase() === "in-progress") &&
											((order.prep_center?.toLowerCase() === "self prep" &&
												["Admin", "Customer"].includes(userRole[0])) ||
												["Prep Center Staff", "Prep Center Admin"].includes(
													userRole[0]
												))
									) &&
									selectedOrder.every(
										(order) =>
											order.prep_center === selectedOrder[0].prep_center
									) &&
									selectedOrder.some(
										(order) => order.quantity_shipped !== order.quantity_prepped
									) && (
										<MenuItem onClick={() => setShippedForm(true)}>
											{buttonLoading === "confirm" && loading ? (
												<CircularProgress size={20} color="inherit" />
											) : (
												<></>
											)}
											Shipped to Amazon
										</MenuItem>
									)}
								{userRole[0] !== "Prep Center Admin" &&
									userRole[0] !== "Prep Center Staff" && (
										<MenuItem onClick={() => setDeleteDialogOpen(true)}>
											Delete
										</MenuItem>
									)}
							</>
						)}
					</Menu> */}
				</div>
				<div className="flex items-center flex-col sm:flex-row mt-24 sm:mt-0 sm:mx-8 space-x-4 space-y-4 sm:space-x-12 ">
					{props.selectedRow.length === 0 && (
						<>
							<div className="flex flex-row">

							<IconButton onClick={() => setIsFiltered(!isFiltered)}>
								<img src={filterIcon} alt="icon" />
							</IconButton>

							<Paper
								component={motion.div}
								initial={{ y: -20, opacity: 0 }}
								animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
								className="flex items-center w-full sm:max-w-256 sm:space-x-8 space-x-4 sm:px-16 px-8 rounded-full border-1 shadow-0 "
							>
								<FuseSvgIcon color="disabled">
									heroicons-solid:search
								</FuseSvgIcon>

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
							</div>

							{(userRole[0] === "Admin" || userRole[0] === "Customer") && (
								<>
									<div>

									</div>
									<Button
										className="whitespace-nowrap "
										variant="contained"
										color="secondary"
										onClick={handleCreateOrder}
										startIcon={
											<FuseSvgIcon className="">
												heroicons-solid:plus
											</FuseSvgIcon>
										}
									>
										Create Order
										{loading && buttonLoading === "create" && (
											<div className="ml-6 inline-flex items-center">
												<CircularProgress size={16} color="inherit" />
											</div>
										)}
									</Button>

									
								</>
							)}
						</>
					)}
					{/* flex gap-10 flex-col sm:flex-row */}
					<div className="grid grid-cols-2 sm:flex sm:flex-row place-items-center gap-10">
						{props.selectedRow.length > 0 ? (
							<>
								{props.selectedRow.length === 1 && (
									<>
										{selectedOrder[0].status.toLowerCase() === "draft" && (
											<>
												<Button
													className="whitespace-nowrap"
													variant="contained"
													color="secondary"
													onClick={() => setDialogOpen(true)}
													startIcon={
														buttonLoading === "confirm" && loading ? (
															<CircularProgress size={20} color="inherit" />
														) : (
															<FuseSvgIcon size={20}>
																heroicons-solid:check
															</FuseSvgIcon>
														)
													}
												>
													Confirm
												</Button>
											</>
										)}

										{userRole[0] != "Prep Center Admin" &&
											userRole[0] != "Prep Center Staff" && (
												<>
													<Button
														className="whitespace-nowrap bg-[#F5BD63] text-white"
														variant="contained"
														sx={{
															":hover": {
																background: "#F5BD63",
															},
														}}
														onClick={handleOpen}
														startIcon={<ControlPointDuplicateIcon />}
													>
														Duplicate
														{showLoadr && (
															<div className="ml-6 inline-flex items-center">
																<CircularProgress size={16} color="inherit" />
															</div>
														)}
													</Button>

													{/* <Button
														className="whitespace-nowrap bg-[#F5BD63] text-white flex sm:hidden"
														variant="contained"
														sx={{
															"& .muiltr-gcc2o7-MuiButton-startIcon": {
																marginLeft: 0,
																marginRight: 0,
															},
															":hover": {
																background: "#F5BD63",
															},
														}}
														onClick={handleOpen}
														startIcon={<ControlPointDuplicateIcon />}
													>
														{showLoadr && (
															<div className="ml-6 inline-flex items-center">
																<CircularProgress size={16} color="inherit" />
															</div>
														)}
													</Button> */}
													{(selectedOrder[0].status.toLowerCase() ==
														"received" ||
														selectedOrder[0].status.toLowerCase() ==
															"placed") && (
														<>
															<Button
																className="whitespace-nowrap bg-[#31A6FA] text-white"
																variant="contained"
																sx={{
																	":hover": {
																		background: "#31A6FA",
																	},
																}}
																onClick={() => setIsEdit(true)}
																startIcon={<ModeEditOutlineOutlinedIcon />}
															>
																Edit
																{showLoadr && (
																	<div className="ml-6 inline-flex items-center">
																		<CircularProgress
																			size={16}
																			color="inherit"
																		/>
																	</div>
																)}
															</Button>

															{/* <Button
																className="whitespace-nowrap bg-[#31A6FA] text-white flex sm:hidden"
																variant="contained"
																sx={{
																	"& .muiltr-gcc2o7-MuiButton-startIcon": {
																		marginLeft: 0,
																		marginRight: 0,
																	},
																	":hover": {
																		background: "#31A6FA",
																	},
																}}
																onClick={() => setIsEdit(true)}
																startIcon={<ModeEditOutlineOutlinedIcon />}
															>
																{showLoadr && (
																	<div className="ml-6 inline-flex items-center">
																		<CircularProgress
																			size={16}
																			color="inherit"
																		/>
																	</div>
																)}
															</Button> */}
														</>
													)}
												</>
											)}
									</>
								)}
								{selectedOrder.length > 0 &&
									selectedOrder.every(
										(item) =>
											item.status.toLowerCase() == "received" ||
											item.status.toLowerCase() == "in-progress"
									) &&
									(selectedOrder.every(
										(item) =>
											item.prep_center?.toLowerCase() == "self prep" &&
											["Admin", "Customer"].includes(userRole[0])
									) ||
										["Prep Center Staff", "Prep Center Admin"].includes(
											userRole[0]
										)) && (
										<Button
											className="whitespace-nowrap"
											variant="contained"
											color="secondary"
											onClick={() => setPreppingForm(true)}
											startIcon={
												buttonLoading === "confirm" && loading ? (
													<CircularProgress size={20} color="inherit" />
												) : (
													<></>
												)
											}
										>
											Prepare Order
										</Button>
									)}
								{selectedOrder.length > 0 &&
									selectedOrder.every(
										(data) => data.status.toLowerCase() === "placed"
									) &&
									["Prep Center Staff", "Prep Center Admin"].includes(
										userRole[0]
									) && (
										<>
											<Button
												className="whitespace-nowrap"
												variant="contained"
												color="secondary"
												onClick={handleReceivedOrderOpen}
												startIcon={
													buttonLoading === "confirm" && loading ? (
														<CircularProgress size={20} color="inherit" />
													) : (
														<></>
													)
												}
											>
												Receive Order
											</Button>
										</>
									)}
								{selectedOrder.length > 0 &&
									selectedOrder.every(
										(data) => data.status.toLowerCase() === "placed"
									) &&
									selectedOrder.every(
										(data) => data.prep_center?.toLowerCase() === "self prep"
									) &&
									["Admin", "Customer"].includes(userRole[0]) && (
										<>
											<Button
												className="whitespace-nowrap"
												variant="contained"
												color="secondary"
												onClick={handleReceivedOrderOpen}
												startIcon={
													buttonLoading === "confirm" && loading ? (
														<CircularProgress size={20} color="inherit" />
													) : (
														<></>
													)
												}
											>
												Receive Order
											</Button>
										</>
									)}
								{selectedOrder.length > 0 &&
									selectedOrder.every(
										(order) =>
											(order.status.toLowerCase() === "completed" ||
												order.status.toLowerCase() === "in-progress") &&
											((order.prep_center?.toLowerCase() === "self prep" &&
												["Admin", "Customer"].includes(userRole[0])) ||
												["Prep Center Staff", "Prep Center Admin"].includes(
													userRole[0]
												))
									) &&
									selectedOrder.every(
										(order) =>
											order.prep_center === selectedOrder[0].prep_center
									) &&
									selectedOrder.some(
										(order) => order.quantity_shipped !== order.quantity_prepped
									) && (
										<Button
											className="whitespace-nowrap bg-[#30B95F] hover:bg-[#30B95F] text-white"
											variant="contained"
											onClick={() => setShippedForm(true)}
											startIcon={
												buttonLoading === "confirm" && loading ? (
													<CircularProgress size={20} color="inherit" />
												) : (
													<></>
												)
											}
										>
											Shipped to Amazon
										</Button>
									)}

								{userRole[0] != "Prep Center Admin" &&
									userRole[0] != "Prep Center Staff" && (
										<>
											<Button
												className="whitespace-nowrap bg-[#EE6161] text-white "
												variant="contained"
												sx={{
													":hover": {
														background: "#EE6161",
													},
												}}
												onClick={() => setDeleteDialogOpen(true)}
												startIcon={<DeleteOutlineOutlinedIcon />}
											>
												Delete
											</Button>
											{/* <Button
												className="whitespace-nowrap bg-[#EE6161] text-white flex sm:hidden"
												variant="contained"
												sx={{
													"& .muiltr-gcc2o7-MuiButton-startIcon": {
														marginLeft: 0,
														marginRight: 0,
													},
													":hover": {
														background: "#EE6161",
													},
												}}
												onClick={() => setDeleteDialogOpen(true)}
												startIcon={<DeleteOutlineOutlinedIcon />}
											></Button> */}
										</>
									)}
							</>
						) : (
							""
						)}
					</div>
					{props.selectedRow.length === 0 && (
						<Button
							className={`
							mx-8
							${loading ? "w-120 pointer-events-none opacity-70" : "w-120"}
						`}
							variant="contained"
							color="primary"
							startIcon={
								buttonLoading === "refresh" && loading ? (
									<CircularProgress size={20} color="inherit" />
								) : (
									<FuseSvgIcon size={20}>heroicons-solid:refresh</FuseSvgIcon>
								)
							}
							onClick={handleRefresh}
						>
							<span>{loading ? "Refresh" : "Refresh"}</span>
						</Button>
					)}
					{/* {props.selectedRow.length === 0 && (
						<Tooltip title="Refresh" arrow>
						<Button
							className={`
							mx-8 sm:hidden flex
						`}
							variant="contained"
							color="primary"
							sx={{
								"& .muiltr-gcc2o7-MuiButton-startIcon": {
									marginLeft: 0,
									marginRight: 0,
								},
							}}
							startIcon={
								buttonLoading === "refresh" && loading ? (
									<CircularProgress size={20} color="inherit" />
								) : (
									<FuseSvgIcon className="ml-0 p-0" size={20}>
										heroicons-solid:refresh
									</FuseSvgIcon>
								)
							}
							onClick={handleRefresh}
							></Button>
							</Tooltip>
					)} */}
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

			<div
				style={{ display: isFiltered ? "" : "none" }}
				className="min-w-0 p-24 md:p-32 pb-0 md:pb-0  "
			>
				<div className="p-32 rounded-lg bg-white pb-[50px]">
					<div className="text-3xl flex justify-between font-semibold tracking-tight mb-10 leading-8">
						Filter
						<div>
							<span
								onClick={() => {
									setIsClear(true);
									setSelectedItems([]);
									setSelectedUsernames([]);
									setSelectedCenterNames([]);
									setSelectedUsers([]);
									setFilterValues({
										prep_center_ids: null,
										status: null,
										order_types: null,
										user_ids: null,
									});
									setDateValues({ fromDate: null, toDate: null });
									setIsFiltered(false);
								}}
								className="text-[#707070] text-md cursor-pointer tracking-normal"
							>
								Clear all
							</span>
							<IconButton
								onClick={() => {
									//  setSelectedItems([])
									//  setSelectedUsernames([])
									//  setSelectedCenterNames([])
									//  setSelectedUsers([])
									setIsFiltered(false);
								}}
							>
								<Close />
							</IconButton>
						</div>
					</div>
					<div className=" flex gap-20 flex-col sm:flex-row">
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DatePicker
								label="Date From"
								className="sm:w-[20%] w-full"
								value={dateValues.fromDate}
								onChange={(newValue) => {
									console.log(newValue);
									setDateValues((prevValue) => ({
										...prevValue,
										fromDate: newValue,
									}));
								}}
							/>
							<DatePicker
								className="sm:w-[20%] w-full"
								label="Date To"
								value={dateValues.toDate}
								onChange={(newValue) => {
									console.log(newValue);
									setDateValues((prevValue) => ({
										...prevValue,
										toDate: newValue,
									}));
								}}
							/>
						</LocalizationProvider>
						{["Prep Center Admin", "Prep Center Staff"].includes(
							userRole[0]
						) ? (
							<MultiSelectDropdown
								setIsClear={setIsClear}
								isClear={isClear}
								label={"Sellers"}
								dataSource={getUsers}
								setSelectedNames={setSelectedUsernames}
								// selectedItemNames={selectedUsernames}
								selectedItems={selectedUsers}
								setSelectedItems={setSelectedUsers}
								selectedArray={handleSelectedUsersChange}
							/>
						) : (
							<MultiSelectDropdown
								label={"Prep Center"}
								setIsClear={setIsClear}
								isClear={isClear}
								setSelectedNames={setSelectedCenterNames}
								// selectedItemNames={selectedCenterNames}
								dataSource={getRolesRecords}
								selectedItems={selectedItems}
								setSelectedItems={setSelectedItems}
								selectedArray={handleSelectedItemsChange}
							/>
						)}
						<MultiSelectCheckmarks
							options={["FBA", "FBM"]}
							setIsClear={setIsClear}
							isClear={isClear}
							label="Order Type"
							onChange={handleTagsChange}
						/>
						<MultiSelectCheckmarks
							options={[
								"Received",
								"Completed",
								"In-Progress",
								"Placed",
								"Draft",
							]}
							setIsClear={setIsClear}
							isClear={isClear}
							onChange={handleStatusChange}
							label="Status"
						/>
					</div>
					{selectedCenterNames.length > 0 && (
						<div className="flex gap-5 mt-10 items-center ">
							<Typography className="text-lg font-semibold">
								Prep Centers:
							</Typography>
							{selectedCenterNames.map((item, index) => (
								<Typography>
									{index != 0 && ", "}
									{item}
								</Typography>
							))}
						</div>
					)}
					{selectedUsernames.length > 0 && (
						<div className="flex gap-5 mt-10 items-center">
							<Typography className="text-lg font-semibold">
								Sellers:
							</Typography>
							{selectedUsernames.map((item, index) => (
								<Typography>
									{index != 0 && ", "}
									{item}
								</Typography>
							))}
						</div>
					)}
					{filterValues?.status && (
						<div className="flex gap-5 mt-10 items-center">
							<Typography className="text-lg font-semibold">Status:</Typography>
							{filterValues?.status.length > 0 &&
								JSON.parse(filterValues.status).map((item, index) => (
									<Typography>
										{index != 0 && ", "}
										{item}
									</Typography>
								))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
	useEffect(() => {
		if (selectedRow) {
			setFormValues({
				note: selectedRow.note,
				page_link: selectedRow.page_link,
			});
		}
	}, [selectedRow, clickedRow]);
	const [charCount, setCharCount] = useState(0);

	const handleChange = (e) => {
		const note = e.target.value;
		if (note.length <= 99) {
			setFormValues((prevState) => ({ ...prevState, note }));
			setCharCount(note.length);
		}
	};

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
								className={`w-full ${showForm && "flex gap-5"}`}
								variants={container}
								initial="hidden"
								animate="show"
							>
								<div className={`grid grid-cols-1 gap-32 w-full mt-32`}>
									<motion.div
										variants={item}
										className="xl:col-span-2 flex flex-col flex-auto"
										style={{
											minHeight: "min-content",
											maxHeight: "70vh",
											overflowY: "auto",
										}} // Adjust maxHeight as needed
									>
										{/* table view here */}
										<OrderedDataTableWidget
											setShowForm={setShowForm}
											filterValues={filterValues}
											dateValues={dateValues}
											selectedTableRow={props.selectedRow}
											setSelectedTableRow={props.setSelectedRow}
											selectedOrder={selectedOrder}
											setSelectedOrder={setSelectedOrder}
											{...tableConfig}
										/>
									</motion.div>
								</div>
							</motion.div>
						)
					);
				}, [data, props.selectedRow, formValues, loading, showForm])}
			</div>

			<Modal
				keepMounted
				open={dialogOpen}
				onClose={handleCloseDialog}
				aria-labelledby="keep-mounted-modal-title"
				aria-describedby="keep-mounted-modal-description"
			>
				<ConfirmationModal
					loading={loading}
					setLoading={setLoading}
					onClose={handleCloseDialog}
					onConfirm={handleConfirmOrder}
					title="Do you want to place this order?"
				/>
			</Modal>
			<Modal
				keepMounted
				open={deleteDialogOpen}
				onClose={() => setDeleteDialogOpen(false)}
				aria-labelledby="keep-mounted-modal-title"
				aria-describedby="keep-mounted-modal-description"
			>
				<ConfirmationModal
					loading={deleteLoading}
					setLoading={setDeleteLoading}
					onClose={() => setDeleteDialogOpen(false)}
					onConfirm={handleRemove}
					type="delete"
					title={
						selectedOrder.length > 1
							? "Do you want to delete these orders?"
							: "Do you want to delete this order?"
					}
				/>
			</Modal>

			<Modal
				keepMounted
				open={createOrderOpen}
				onClose={() => setCreateOrderOpen(false)}
				aria-labelledby="keep-mounted-modal-title"
				aria-describedby="keep-mounted-modal-description"
			>
				<Box
					sx={style}
					className="sm:rounded-8 border-1 h-full sm:h-[90vh] w-full sm:w-[95vw] md:w-[50vw] px-6 py-4 sm:p-20"
				>
					<CreateOrderForm
						// data={selectedOrder[0]}
						setSelectedRow={props.setSelectedRow}
						setSelectedOrder={setSelectedOrder}
						handleRefresh={handleRefresh}
						handleClose={() => setCreateOrderOpen(false)}
						createOrder={true}
					/>
				</Box>
			</Modal>
			{selectedOrder.length === 1 && (
				<Modal
					keepMounted
					open={open}
					onClose={() => setOpen(false)}
					aria-labelledby="keep-mounted-modal-title"
					aria-describedby="keep-mounted-modal-description"
				>
					<Box
						sx={style}
						className="sm:rounded-8 border-1 h-full sm:h-[90vh] w-full sm:w-[95vw] md:w-[50vw] px-6 py-4 sm:p-20"
					>
						<CreateOrderForm
							data={selectedOrder[0]}
							setSelectedRow={props.setSelectedRow}
							setSelectedOrder={setSelectedOrder}
							handleRefresh={handleRefresh}
							handleClose={() => setOpen(false)}
							status={true}
							onDuplicate={true}
						/>
					</Box>
				</Modal>
			)}
			{selectedOrder.length > 0 && (
				<Modal
					keepMounted
					open={receivedOrderOpen}
					onClose={() => setReceivedOrderOpen(false)}
					aria-labelledby="keep-mounted-modal-title"
					aria-describedby="keep-mounted-modal-description"
				>
					<Box
						sx={style}
						className="sm:rounded-8 border-1 h-full sm:h-[90vh] w-full sm:w-[95vw] md:w-[50vw] px-6 py-4 sm:p-20"
					>
						<ReceivedOrderForm
							open={receivedOrderOpen}
							status={true}
							data={selectedOrder}
							setSelectedRow={props.setSelectedRow}
							setSelectedOrder={setSelectedOrder}
							handleRefresh={handleRefresh}
							handleClose={() => setReceivedOrderOpen(false)}
						/>
					</Box>
				</Modal>
			)}
			{selectedOrder.length > 0 && (
				<Modal
					keepMounted
					open={preppingForm}
					onClose={() => setPreppingForm(false)}
					aria-labelledby="keep-mounted-modal-title"
					aria-describedby="keep-mounted-modal-description"
				>
					<Box sx={style} className="rounded-8 border-1 h-max w-[50vw]">
						<PreppingForm
							data={selectedOrder}
							open={preppingForm}
							setSelectedRow={props.setSelectedRow}
							setSelectedOrder={setSelectedOrder}
							handleRefresh={handleRefresh}
							handleClose={() => setPreppingForm(false)}
						/>
					</Box>
				</Modal>
			)}
			{selectedOrder.length > 0 && (
				<Modal
					keepMounted
					open={shippedForm}
					onClose={() => setShippedForm(false)}
					aria-labelledby="keep-mounted-modal-title"
					aria-describedby="keep-mounted-modal-description"
				>
					<Box
						sx={style}
						className="sm:rounded-8 border-1 h-full sm:h-[90vh] w-full sm:w-[95vw] md:w-[50vw] px-6 py-4 sm:p-20"
					>
						<ShippedOrderForm
							open={shippedForm}
							status={true}
							data={selectedOrder}
							setSelectedRow={props.setSelectedRow}
							setSelectedOrder={setSelectedOrder}
							handleRefresh={handleRefresh}
							handleClose={() => setShippedForm(false)}
						/>
					</Box>
				</Modal>
			)}
			{selectedOrder.length === 1 && isEdit && (
				<Modal
					keepMounted
					open={isEdit}
					onClose={() => setIsEdit(false)}
					aria-labelledby="keep-mounted-modal-title"
					aria-describedby="keep-mounted-modal-description"
				>

					{/* edit create order form */}


					<Box
						sx={style}
						className="sm:rounded-8 border-1 h-full sm:h-[90vh] w-full sm:w-[95vw] md:w-[50vw] px-6 py-4 sm:p-20"
					>
						{selectedOrder[0].status.toLowerCase() === "placed" ? (
							<CreateOrderForm
								data={selectedOrder[0]}
								setSelectedRow={props.setSelectedRow}
								setSelectedOrder={setSelectedOrder}
								handleRefresh={handleRefresh}
								handleClose={() => setIsEdit(false)}
								status={true}
								onDuplicate={true}
								isEdit={true}
							/>
						) : selectedOrder[0].status.toLowerCase() === "received" ? (
							<ReceivedOrderForm
								open={isEdit}
								status={true}
								data={selectedOrder}
								setSelectedRow={props.setSelectedRow}
								setSelectedOrder={setSelectedOrder}
								handleRefresh={handleRefresh}
								handleClose={() => setIsEdit(false)}
							/>
						) : (
							<></>
						)}
					</Box>
				</Modal>
			)}
		</>
	);

	return <FusePageSimple header={header} content={content} />;
}

export default OrderedTableWidget;
