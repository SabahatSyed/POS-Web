import { useEffect, useMemo, useRef, useState } from "react";
import ReplyAllIcon from "@mui/icons-material/ReplyAll";
import _ from "@lodash";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import FusePageSimple from "@fuse/core/FusePageSimple";
import history from "@history";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "app/store";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { useNavigate, useParams } from "react-router";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import format from "date-fns/format";
import notesIcon from "../assets/Notes.svg";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import reportNoteIcon from "../assets/reportnotes.svg";
import { getOrdersRecords, selectOrders } from "../store/orderSlice";
import {
	Button,
	CircularProgress,
	Dialog,
	DialogContent,
	IconButton,
	Modal,
	Paper,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import NotesComponent from "../widgets/NotesComponent";
import axios from "axios";
import { getShippingOrdersRecords } from "../../shipping-list/store/orderSlice";
import { showMessage } from "app/store/fuse/messageSlice";
import ConfirmationModal from "../widgets/ConfirmationModal";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Activities from "../widgets/Activities";
import EditOutlined from "@mui/icons-material/FileDownloadOutlined";
import FileViewer from "../widgets/PdfViewer";
import Close from "@mui/icons-material/Close";

/**
 * The finance dashboard app.
 */
function OrderDetailsPage() {
	const dispatch = useAppDispatch();
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [value, setValue] = useState("1");
	const [uploadLoading, setUploadLoading] = useState(false);
	const [deleteId, setDeleteId] = useState(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const inputRef = useRef();
	let { id } = useParams();
	const [shippingDetails, setShippingDetails] = useState([]);
	const [noteData, setNoteData] = useState<any>([]);
	const [data, setData] = useState<any>({});
	console.log(data);
	const [selectedFile, setSelectedFile] = useState(null);
	const [totalFiles, setTotalFiles] = useState([]);

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		setSelectedFile(file);
		const maxSize = 20 * 1024 * 1024;
		if (file) {
			if (file.size < maxSize) {
				handleUpload(file);
			} else {
				dispatch(
					showMessage({
						variant: "error",
						message: "File size should be less than 20 MB",
					})
				);
				inputRef.current.value = "";
			}
		}
	};
	const handleChange = (event: React.SyntheticEvent, newValue: string) => {
		setValue(newValue);
	};
	console.log(value);

	const fetchData = async () => {
		try {
			const response = await axios.get(
				`/api/order_list/fetch_order_attachments?order_list_id=${id}`
			);
			console.log(response.data);
			setTotalFiles(response.data.attachments);
		} catch (e) {
			console.log(e);
		}
	};
	const getData = async () => {
		await axios
			.get(`api/order_list/fetch_order_notes?order_list_id=${id}`)
			.then((res) => {
				setNoteData(res.data.notes);
			});
	};

	useEffect(() => {
		if (data?.order_list_id) {
			getData();
		}
	}, [data?.order_list_id]);
	useEffect(() => {
		fetchData();
	}, []);
	const [open, setOpen] = useState(false);
	const [selectedOpenFile, setSelectedOpenFile] = useState(null);

	const handleOpen = (fileUrl) => {
		console.log(fileUrl);

		setSelectedOpenFile(fileUrl);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setSelectedOpenFile(null);
	};

	const handleUpload = async (myFile) => {
		setUploadLoading(true);
		if (!myFile) {
			alert("No file selected");
			return;
		}

		const formData = new FormData();
		formData.append("UserFile", myFile);
		formData.append("order_list_id", id);

		try {
			const response = await axios.post(
				"/api/order_list/upload_file",
				formData
			);
			console.log("File uploaded successfully:", response.data);
			fetchData();
			dispatch(
				showMessage({
					variant: "success",
					message: `${response?.data?.message}`,
				})
			);
		} catch (error) {
			console.error("Error uploading file:", error);
			dispatch(showMessage({ variant: "error", message: error?.message }));
		}
		setUploadLoading(false);
	};
	const handleDelete = async () => {
		setDeleteLoading(true);
		try {
			await axios.post("/api/order_list/remove_file", { id: deleteId });
			dispatch(showMessage({ variant: "success", message: "Success" }));
			fetchData();
			setDeleteDialogOpen(false);
		} catch (e) {
			console.log(e);
			dispatch(showMessage({ variant: "error", message: "Error" }));
		}
		setDeleteLoading(false);
	};
	const [buttonLoading, setButtonLoading] = useState(false);
	function handleRefresh() {
		setButtonLoading(true);
		getData();
		fetchData();
		setTimeout(() => {
			console.log("in");

			setButtonLoading(false);
		}, 1000);
	}

	const fetchShippingDetails = async (id) => {
		try {
			await axios.get(`/api/shipments/?order_list_id=${id}`).then((res) => {
				console.log(res.data.records);
				setShippingDetails(res.data.records);
			});
		} catch (e) {
			console.log(e);
		}
	};
	useEffect(() => {
		if (id) {
			fetchShippingDetails(id);
		}
	}, [id]);
	useEffect(() => {
		dispatch(getOrdersRecords({ id: id })).then((res) => {
			setData(res.payload.records[0]);
		});
	}, [id]);
	const downloadFile = async (url, fileName) => {
		await fetch(url)
			.then((response) => response.blob())
			.then((blob) => {
				const url = window.URL.createObjectURL(new Blob([blob]));
				const link = document.createElement("a");
				link.href = url;
				link.setAttribute("download", fileName);
				document.body.appendChild(link);
				link.click();
				link.parentNode.removeChild(link);
			});
	};
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const content = (
		<div className="w-full p-10 sm:p-24 md:p-32 pb-0 md:pb-0">
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
					<>
						<Box
							sx={{
								width: "100%",
								typography: "body1",
								gap: "10px",
							}}
						>
							<TabContext value={value}>
								<div className="sm:flex gap-10  items-center ">
									<div className="flex  justify-between items-center">
										<IconButton
											onClick={() => {
												navigate(-1);
											}}
											size="large"
										>
											<FuseSvgIcon>heroicons-outline:arrow-left</FuseSvgIcon>
										</IconButton>
										<Button
											className={`
							mx-8 sm:hidden flex 
							${loading ? "w-120 pointer-events-none opacity-70" : "w-120"}
						`}
											variant="contained"
											color="primary"
											startIcon={
												buttonLoading ? (
													<CircularProgress size={20} color="inherit" />
												) : (
													<FuseSvgIcon size={20}>
														heroicons-solid:refresh
													</FuseSvgIcon>
												)
											}
											onClick={handleRefresh}
										>
											Refresh
										</Button>
									</div>

									<Box
										sx={{
											borderBottom: 1,
											borderColor: "divider",
											width: "100%",
										}}
									>
										<TabList onChange={handleChange}>
											<Tab label="Order Details" value="1" />
											<Tab label="Activities" value="2" />
										</TabList>
									</Box>
									<Button
										className={`
							mx-8 sm:flex hidden
							${loading ? "w-120 pointer-events-none opacity-70" : "w-120"}
						`}
										variant="contained"
										color="primary"
										startIcon={
											buttonLoading ? (
												<CircularProgress size={20} color="inherit" />
											) : (
												<FuseSvgIcon size={20}>
													heroicons-solid:refresh
												</FuseSvgIcon>
											)
										}
										onClick={handleRefresh}
									>
										Refresh
									</Button>
								</div>
								<TabPanel className="px-0 mx-0" value="1">
									{Object.keys(data).length > 0 && (
										<div className="w-full">
											<div className="flex md:flex-row sm:flex-col flex-col h-full  gap-20 mb-24">
												<Paper className=" scroll-w-0 rounded-2xl relative p-24 h-max md:w-[64%] sm:px-52 px-8 ">
													<div className="flex items-center justify-start gap-20 ">
														<div>
															<Typography className=" text-[#7D7980] font-semibold text-lg">
																Order Number:
															</Typography>
															<Typography className="font-bold text-xl text-center">
																{data?.order_no}
															</Typography>
														</div>
													</div>
													<div className="flex gap-20 mt-20">
														<img
															className="w-[20%]"
															src={data.image}
															alt="image"
														/>
														<div className="w-[70%] flex flex-col gap-5">
															<Typography className=" w-[90%] leading-7 font-600 text-[20px] line-clamp-2">
																{data.item_name}
															</Typography>
															<Typography className=" text-[#6B6B6B] text-[14px]">
																By {data.manufacturer}
															</Typography>
															<Typography className="  text-[14px]">
																<span className="font-bold">Asin:</span>{" "}
																{data.asin}
															</Typography>
														</div>
													</div>
													<div className="flex flex-col gap-10 mt-24">
														<Typography className=" text-[#76B8C4] text-[20px] ">
															Order Details
														</Typography>
														<div className="flex-row flex sm:gap-20 gap-5">
															<div className="w-1/2 gap-10 flex flex-col">
																<div className="flex justify-between">
																	<Typography className="font-bold text-[14px]">
																		Type:
																	</Typography>
																	<Typography className="text-[14px] text-left">
																		{data?.order_type}
																	</Typography>
																</div>
																<div className="flex justify-between">
																	<Typography className="font-bold text-[14px]">
																		Sale Price:
																	</Typography>
																	<Typography className="text-[14px]">
																		${data?.sale_price}
																	</Typography>
																</div>{" "}
																<div className="flex justify-between">
																	<Typography className="font-bold text-[14px]">
																		Cost Price:
																	</Typography>
																	<Typography className="text-[14px]">
																		${data?.cost_price}
																	</Typography>
																</div>
																<div className="flex justify-between">
																	<Typography className="font-bold text-[14px]">
																		Received Date:
																	</Typography>
																	<Typography className="text-[14px] text-left">
																		{data.received_date != null ? (
																			typeof data.received_date == "number" ? (
																				<Typography className="w-max">
																					{format(
																						new Date(data.received_date * 1000),
																						"MMM dd, y"
																					)}
																				</Typography>
																			) : (
																				<Typography className="w-max">
																					{format(
																						new Date(data.received_date),
																						"MMM dd, y"
																					)}
																				</Typography>
																			)
																		) : (
																			<>Not Received</>
																		)}
																	</Typography>
																</div>
															</div>
															<div className="w-1/2 gap-10 flex flex-col">
																<div className="flex justify-between">
																	<Typography className="font-bold text-[14px]">
																		Prep Center:
																	</Typography>
																	<Typography className="text-[14px] text-left">
																		{data.prep_center}
																	</Typography>
																</div>

																<div className="flex justify-between gap-10">
																	<Typography className="font-bold text-[14px]">
																		Supplier:
																	</Typography>
																	<Typography className=" truncate text-[14px] text-left">
																		<Tooltip
																			title={<div>{data?.supplier}</div>}
																			placement={"bottom-start"}
																		>
																			{data?.supplier}
																		</Tooltip>
																	</Typography>
																</div>
																<div className="flex justify-between">
																	<Typography className="font-bold text-[14px]">
																		Quantity:
																	</Typography>
																	<Typography className="text-[14px] text-left">
																		{data?.quantity_received}
																	</Typography>
																</div>
															</div>
														</div>
														{/* <Typography className=' text-[#76B8C4] text-[28px] '>Order Details</Typography> */}
													</div>
													<div className="flex flex-col rounded-6 gap-0 mt-24 relative xlg:h-[30vh] h-[40vh] bg-[#F5F5F5] p-10">
														<div className="flex gap-10">
															<img
																// style={{ width: "12px" }}
																src={notesIcon}
																alt="icon"
															/>
															<Typography className=" text-[#76B8C4] text-[20px] ">
																Notes
															</Typography>
														</div>
														<NotesComponent
															data={noteData}
															setNoteData={setNoteData}
															id={data.order_list_id}
														/>
													</div>
												</Paper>
												<Paper className="rounded-2xl md:w-[34%] p-24 ">
													<div className="flex flex-col w-full justify-center items-end">
														<Typography className="text-right font-bold rounded-[19px] text-lg px-16 pb-4">
															Status
														</Typography>
														<div
															style={{
																background:
																	data?.status.toLowerCase() == "draft"
																		? "#EE6161"
																		: data?.status.toLowerCase() == "placed"
																		? "#31a6fa"
																		: data?.status.toLowerCase() == "shipped"
																		? "#30B95F"
																		: data?.status.toLowerCase() ==
																		  "in-progress"
																		? "#F5BD63"
																		: data?.status.toLowerCase() == "received"
																		? "#0e505c"
																		: "#085394",
															}}
															className={`rounded-[19px] text-lg px-16 py-4 text-white`}
														>
															{data?.status}
														</div>
													</div>
													<div className="flex flex-col gap-10 mt-20">
														<Typography className=" text-[#76B8C4] text-[20px] ">
															Processing Details
														</Typography>
														<div className="w-[90%] flex-col flex gap-10 ">
															<div className="flex justify-between">
																<Typography className="font-bold text-[14px]">
																	Units Ordered:
																</Typography>
																<Typography className="text-[14px]">
																	{data?.quantity_ordered}
																</Typography>
															</div>
															<div className="flex justify-between">
																<Typography className="font-bold text-[14px]">
																	Units Prepped:
																</Typography>
																<Typography className="text-[14px]">
																	{data?.quantity_prepped}
																</Typography>
															</div>
															<div className="flex justify-between">
																<Typography className="font-bold text-[14px]">
																	% Prepped:
																</Typography>
																<Typography className="text-[14px]">
																	{data?.percentage_prepped}
																</Typography>
															</div>
															<div className="flex justify-between">
																<Typography className="font-bold text-[14px]">
																	Prepping Status:
																</Typography>
																<Typography
																	className={`text-[14px] text-[${
																		data?.status.toLowerCase() == "draft"
																			? "#31A6FA"
																			: data?.status.toLowerCase() == "placed"
																			? "#0E505C"
																			: data?.status.toLowerCase() == "approved"
																			? "#30B95F"
																			: "#EE6161"
																	}]`}
																>
																	{data?.status}
																</Typography>
															</div>
														</div>

														<div className="flex justify-between items-center w-[90%]">
															<Typography className=" text-[#76B8C4] text-[20px]  ">
																Shipping Details
															</Typography>
															{shippingDetails.length > 1 && (
																<Button
																	onClick={() => {
																		dispatch(
																			getShippingOrdersRecords({
																				order_list_id: id,
																			})
																		);
																		history.push(`/shipping/table/${id}`);
																	}}
																	className=" bg-none "
																>
																	{" "}
																	View All
																</Button>
															)}
														</div>
														{shippingDetails.length > 0 ? (
															<div className="w-[90%] flex-col flex gap-10 ">
																<div className="flex justify-between">
																	<Typography className="font-bold text-[14px]">
																		Shipping Status:
																	</Typography>
																	<Typography className="text-[14px]">
																		{
																			shippingDetails[
																				shippingDetails.length - 1
																			]?.status
																		}
																	</Typography>
																</div>
																<div className="flex justify-between">
																	<Typography className="font-bold text-[14px]">
																		Shipping Carrier:
																	</Typography>
																	<Typography className="text-[14px]">
																		{
																			shippingDetails[
																				shippingDetails.length - 1
																			]?.carrier
																		}
																	</Typography>
																</div>
																<div className="flex justify-between">
																	<Typography className="font-bold text-[14px]">
																		Quantity Shipped:
																	</Typography>
																	<Typography className="text-[14px]">
																		{data?.quantity_shipped}
																	</Typography>
																</div>
																<div className="flex justify-between">
																	<Typography className="font-bold text-[14px]">
																		Shipment Date:
																	</Typography>
																	<Typography className="text-[14px]">
																		{shippingDetails[shippingDetails.length - 1]
																			?.shipment_date != null ? (
																			typeof shippingDetails[
																				shippingDetails.length - 1
																			]?.shipment_date == "number" ? (
																				<Typography className="w-max">
																					{format(
																						new Date(
																							shippingDetails[
																								shippingDetails.length - 1
																							]?.shipment_date * 1000
																						),
																						"MMM dd, y"
																					)}
																				</Typography>
																			) : (
																				<Typography className="w-max">
																					{format(
																						new Date(
																							shippingDetails[
																								shippingDetails.length - 1
																							]?.shipment_date
																						),
																						"MMM dd, y"
																					)}
																				</Typography>
																			)
																		) : (
																			<>Not Received</>
																		)}
																	</Typography>
																</div>
																<div className="flex justify-between">
																	<Typography className="font-bold text-[14px]">
																		Tracking Information:
																	</Typography>
																	<Typography className="text-[14px]">
																		{
																			shippingDetails[
																				shippingDetails.length - 1
																			]?.tracking_number
																		}
																	</Typography>
																</div>
															</div>
														) : (
															<Typography>No Order Shipped</Typography>
														)}
														<div>
															<Typography className=" text-[#76B8C4] text-[20px] ">
																File Management
															</Typography>
															<input
																type="file"
																style={{ display: "none" }}
																ref={inputRef}
																onChange={handleFileChange}
															/>

															<div
																onClick={
																	uploadLoading
																		? () => {}
																		: () => inputRef.current.click()
																}
																className="flex items-center cursor-pointer mt-10"
															>
																{uploadLoading ? (
																	<IconButton className="p-0 m-0 pr-4">
																		<CircularProgress
																			size={20}
																			sx={{ color: "#31A6FA" }}
																		/>
																	</IconButton>
																) : (
																	<IconButton className="p-0 m-0 pr-4">
																		<FileUploadOutlinedIcon
																			titleAccess="Upload"
																			className=" text-[#31A6FA]"
																		/>
																	</IconButton>
																)}
																{uploadLoading ? (
																	<Typography className=" text-[#31A6FA]">
																		Uploading
																	</Typography>
																) : (
																	<Typography className=" text-[#31A6FA]">
																		Upload File
																	</Typography>
																)}
															</div>
														</div>
														<div>
															<div className="xlg:h-[20vh] md:h-[18vh] overflow-y-auto">
																{totalFiles.length > 0 ? (
																	totalFiles.map((item) => (
																		<div className="flex justify-between py-0">
																			<div
																				onClick={() => {
																					if (
																						[
																							".pdf",
																							".jpg",
																							".jpeg",
																							".png",
																						].includes(item.file_ext)
																					) {
																						handleOpen(item.file_url);
																					}
																				}}
																				style={{
																					cursor: [
																						".pdf",
																						".jpg",
																						".jpeg",
																						".png",
																					].includes(item.file_ext)
																						? "pointer"
																						: "default",
																				}}
																				className="flex items-center"
																			>
																				<IconButton className="p-0 m-0 pr-4">
																					<InsertDriveFileOutlinedIcon
																						titleAccess="Upload"
																						className=" text-[#525252]"
																					/>
																				</IconButton>
																				<Typography
																					className="line-clamp-2 break-words break-all"
																					// This attribute prompts the download
																				>
																					{item.file_name}
																				</Typography>
																			</div>
																			<div className="flex items-center">
																				<IconButton
																					sx={{ background: "none !important" }}
																					href={item.file_url} // Add the URL of the file here
																					download={item.file_name}
																					target="_blank" // onClick={() => {
																					//   setDeleteId(item.id);
																					//   setDeleteDialogOpen(true);
																					// }}
																				>
																					<EditOutlined
																						titleAccess="Download"
																						fontSize="small"
																						className=" text-secondary"
																					/>
																				</IconButton>
																				<IconButton
																					onClick={() => {
																						setDeleteId(item.id);
																						setDeleteDialogOpen(true);
																					}}
																				>
																					<DeleteOutlineOutlinedIcon
																						titleAccess="Delete"
																						fontSize="small"
																						className=" text-[#EE6161]"
																					/>
																				</IconButton>
																			</div>
																		</div>
																	))
																) : (
																	<>
																		{!loading && <>Please Upload Files Here</>}
																	</>
																)}
																<Dialog
																	open={open}
																	onClose={handleClose}
																	fullWidth
																	maxWidth="lg"
																>
																	<DialogContent>
																		<div
																			className="text-right w-full pb-20 cursor-pointer"
																			onClick={handleClose}
																		>
																			<Close />
																		</div>
																		{selectedOpenFile && (
																			<FileViewer fileUrl={selectedOpenFile} />
																		)}
																	</DialogContent>
																</Dialog>
															</div>
														</div>
														{/* <>
                        <Typography className=" text-[#76B8C4] text-[20px] ">
                          Discrepancy Reporting
                        </Typography>{" "}
                        <div className="flex items-center gap-10">
                          <img src={reportNoteIcon} alt="icon" />
                          <Typography className=" text-[#EE6161] text-[14px] ">
                            Report Discrepancy
                          </Typography>{" "}
                        </div>
                      </> */}
														{/* <div className="rounded-2xl border-2 border-[#525252] p-8">
                        <textarea
                          placeholder="Report Discrepancy"
                          className="px-4 py-8 rounded-2xl w-full"
                        />
                        <div className="flex justify-between">
                          <div className="flex">
                            <IconButton>
                              <ImageOutlinedIcon />
                            </IconButton>{" "}
                            <IconButton>
                              <AttachFileOutlinedIcon />
                            </IconButton>
                          </div>
                          <div className="flex gap-10">
                            <button className="bg-none text-[12px] text-[#525252] py-0 px-12 rounded-2xl">
                              Cancel
                            </button>

                            <button className="bg-[#EE6161] m-0 text-[12px] text-white py-0 px-12 rounded-3xl">
                              Report
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <IconButton>
                            <InsertDriveFileOutlinedIcon
                              titleAccess="Upload"
                              className=" text-[#EE6161]"
                            />
                          </IconButton>
                          <Typography className="text-[#EE6161]">Report</Typography>
                        </div>
                        <div className="flex">
                          <IconButton>
                            <ModeEditOutlineOutlinedIcon
                              fontSize="small"
                              titleAccess="Upload"
                              className=" text-[#525252]"
                            />
                          </IconButton>
                          <IconButton>
                            <DeleteOutlineOutlinedIcon
                              titleAccess="Upload"
                              fontSize="small"
                              className=" text-[#EE6161]"
                            />
                          </IconButton>
                        </div>
                      </div> */}
													</div>
												</Paper>
											</div>
										</div>
									)}
								</TabPanel>
								<TabPanel className="px-0 mx-0" value="2">
									<div className="w-full">
										<div className="flex flex-col gap-20 mb-24">
											<Paper className=" scroll-w-0 rounded-2xl relative p-24 sm:px-52 px-8 h-[81vh] overflow-y-auto scrollbar ">
												<Activities />
											</Paper>
										</div>
									</div>
								</TabPanel>
							</TabContext>
						</Box>
					</>
				);
			}, [
				id,
				data,
				shippingDetails,
				totalFiles,
				uploadLoading,
				value,
				selectedOpenFile,
				buttonLoading,
				noteData,
			])}
		</div>
	);

	return (
		<div className="flex justify-center items-center h-full">
			{loading ? (
				<CircularProgress size={40} color="inherit" />
			) : (
				<>
					<FusePageSimple content={content} />
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
							onConfirm={handleDelete}
							type="delete"
							title="Do you want to delete this file?"
						/>
					</Modal>
				</>
			)}
		</div>
	);
}

export default OrderDetailsPage;
