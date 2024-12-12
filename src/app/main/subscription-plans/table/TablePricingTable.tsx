import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import TablePricingTableHead from './TablePricingTableHead';
import { SubscriptionType } from '../../subscription/types/SubscriptionType';
import { useState, useEffect } from 'react';
import ConfirmationDialog from '../../../shared-components/ConfirmationDialog';
import { Unsubscribe, addRecord, getOrdersRecords } from '../../subscription/store/orderSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { getInvoicesRecords, selectInvoices } from '../../subscription/store/InvoiceSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectPayments } from '../../subscription/store/paymentsSlice';
import { useAppSelector } from 'app/store';
import { Button, CircularProgress } from '@mui/material';
/**
 * The table data item type.
 */
export type TableDataItemType = {
	
	subscriptions:[SubscriptionType],
	// features?: {
	// 	unlimitedProjects: boolean;
	// 	unlimitedStorage: boolean;
	// 	customDomainSupport: boolean;
	// 	dedicatedHardware: boolean;
	// };
	// payments?: {
	// 	fraudAnalysis: boolean;
	// 	rateForInHouse: string;
	// 	rateForOther: string;
	// 	additionalFees: string;
	// };
};

/**
 * The table data.
 */


type TablePricingTableProps = {
	period: string;
	data: SubscriptionType[];
	payment_method_id: string;
	order_exists: boolean
	subscription_id: string;
};

/**
 * The pricing table.
 */
function TablePricingTable(props: TablePricingTableProps) {
	const { period, data: tableData, payment_method_id, order_exists, subscription_id} = props;
	const [selectedPlan, setSelectedPlan]= useState<SubscriptionType>()
	const dispatch = useDispatch<any>()
	const [loading,setLoading]=useState(false)
	const [pdfloading,setPdfLoading]=useState(false)
	const [dialogOpen, setDialogOpen] = useState(false);
	const paymentData = useAppSelector(selectPayments);
	const InvoiceData = useAppSelector(selectInvoices);
	// console.log("dsfsfd",InvoiceData)

	const url = process.env.REACT_APP_BASE_URL;
	useEffect(()=>{
		console.log(tableData)
		if(order_exists){
			setSelectedPlan(tableData?.find((item)=>item.id === subscription_id))
		}
	},[order_exists])
	const handleCloseDialog = () => {
		setDialogOpen(false);
	};

	const handleConfirmDialog =() => {
    if(order_exists){
      unsubscribe()
    }
    else if(paymentData.count > 0) {
      subscribe()}
    else{
      dispatch(showMessage({ message: 'You need to configure Payment Method First', variant: 'warning' }))
      // setTimeout(()=>{
      //   history.push('paymentMethod')
      // },100)
    }
    
    handleCloseDialog();
	

	};
  const unsubscribe=async()=>{
    setLoading(true)
		await dispatch(Unsubscribe())
        .then((resp: any) => {
          if (resp.error) {
            dispatch(showMessage({ message: resp.error.message, variant: 'error' }));
            setLoading(false)
          }
          else {
            dispatch(showMessage({ message: 'Success', variant: 'success' }));
            setLoading(false)

          }
        });
    dispatch(getInvoicesRecords({id:null}));
    dispatch(getOrdersRecords({id:null}));
	}
 
  const subscribe=async()=>{
    setLoading(true)

		const formData={subscription_id:selectedPlan.id,yearly:period=="month"?false:true,payment_method_id}
		await dispatch(addRecord({ payload: formData }))
        .then((resp: any) => {
          if (resp.error) {
            dispatch(showMessage({ message: resp.error.message, variant: 'error' }));
            setLoading(false)
          }
          else {
            dispatch(showMessage({ message: 'Success', variant: 'success' }));
            setLoading(false)

          }
        });
    dispatch(getInvoicesRecords({id:null}));
    dispatch(getOrdersRecords({id:null}));
	}

	const pdfOpen = async() => {
		setPdfLoading(true)

		const pdfUrl = url+InvoiceData.records[0].payment_file_url.replace("/","");
		window.open(pdfUrl, "_blank")
		setPdfLoading(false)
	}
	return (
		<div className="mt-40 flex flex-col justify-center sm:mt-24">

			<Paper className="w-full flex-col overflow-x-auto overflow-y-hidden lg:max-w-7xl lg:flex-row">
				<div className="grid min-w-max grid-flow-col divide-x lg:min-w-0 lg:grid-flow-row lg:divide-x-0 lg:divide-y">
					<div className="sticky left-0 auto-rows-fr divide-y overflow-hidden  shadow-lg lg:max-w-none lg:auto-cols-fr lg:grid-flow-col lg:divide-x lg:divide-y-0 lg:rounded-l-none lg:border-r-0 lg:shadow-none bg-transparent  rounded-4 w-full p-28 flex flex-col gap-20">
						
						{!order_exists && tableData && tableData.map((item, index) => (
							<TablePricingTableHead
								key = {index}
								data = {{...item,order_exists}}
								payment_method_id = {payment_method_id}
								period = {period}
								sub_id = {subscription_id}
								setSelectedPlan = {setSelectedPlan}
								selectedPlan = {selectedPlan}
							/>
						))}
						{order_exists && selectedPlan && 
							<TablePricingTableHead
								data = {{...selectedPlan,order_exists}}
								payment_method_id = {payment_method_id}
								period = {period}
								sub_id = {subscription_id}
								setSelectedPlan = {setSelectedPlan}
								selectedPlan = {selectedPlan}
							/>
						}
							<div className=" flex justify-between items-center pt-20 px-10 ">
							
								<Typography className="text-lg" color="text.secondary">
									Billed At Renewal
								</Typography>
								{selectedPlan ? 
									<Typography className="text-lg" color="text.secondary">
										USD {period === "month" && selectedPlan.monthly_price}
										{period === "year" && selectedPlan.yearly_price}
									</Typography>
									:
									<Typography>---</Typography>
								}
							</div>

						</div>
						

					{/*{order_exists && <><Box
						sx={{ backgroundColor: 'background.default' }}
						className="col-span-full hidden p-16 lg:block"
					>
						<Typography className="text-md font-semibold">FEATURES</Typography>
					</Box>
 
					<div className="grid grid-flow-row auto-rows-fr divide-y lg:auto-cols-fr lg:grid-flow-col lg:divide-x lg:divide-y-0">
						<Typography className="flex max-w-128 items-center p-16 text-center font-medium lg:max-w-none lg:items-start lg:text-left lg:font-normal">
							Unlimited projects
						</Typography>

						{/* {tableData
							.map((item) => item.features.unlimitedProjects)
							.map((val, index) => (
								<TableCell
									value={val}
									key={index}
								/>
							))} 
					</div>

					<div className="grid grid-flow-row auto-rows-fr divide-y lg:auto-cols-fr lg:grid-flow-col lg:divide-x lg:divide-y-0">
						<Typography className="flex max-w-128 items-center p-16 text-center font-medium lg:max-w-none lg:items-start lg:text-left lg:font-normal">
							Unlimited storage
						</Typography>

						{/* {tableData
							.map((item) => item.features.unlimitedStorage)
							.map((val, index) => (
								<TableCell
									value={val}
									key={index}
								/>
							))} 
					</div>

					<div className="grid grid-flow-row auto-rows-fr divide-y lg:auto-cols-fr lg:grid-flow-col lg:divide-x lg:divide-y-0">
						<Typography className="flex max-w-128 items-center p-16 text-center font-medium lg:max-w-none lg:items-start lg:text-left lg:font-normal">
							Custom domain support
						</Typography>

						{/* {tableData
							.map((item) => item.features.customDomainSupport)
							.map((val, index) => (
								<TableCell
									value={val}
									key={index}
								/>
							))} 
					</div>

					<div className="grid grid-flow-row auto-rows-fr divide-y lg:auto-cols-fr lg:grid-flow-col lg:divide-x lg:divide-y-0">
						<Typography className="flex max-w-128 items-center p-16 text-center font-medium lg:max-w-none lg:items-start lg:text-left lg:font-normal">
							Dedicated hardware
						</Typography>

						{/* {tableData
							.map((item) => item.features.dedicatedHardware)
							.map((val, index) => (
								<TableCell
									value={val}
									key={index}
								/>
							))} 
					</div> 
					</>*/}
				
					

					
				</div>
			</Paper>
			
			{/* {!order_exists && 
				<Button
					onClick={()=>setDialogOpen(true)}
					className="my-12 h-32 min-h-32 px-16 py-6 lg:my-24 lg:h-40 lg:min-h-40"
					variant="contained"
					color={"secondary"}
					disabled={loading}
				>          
					Get Started
					{loading && (
						<div className="ml-8 mt-2">
						<CircularProgress size={16} color="inherit" />
						</div>
					)}
				</Button>
			}
                
			{order_exists && <div className="h-0.5 w-full bg-grey-500 my-40"/>}
			<div className=" flex flex-col gap-20">
				{order_exists && 
				<>
					<Typography className="text-xl text-black font-600">Cancel Subscription</Typography>
					<Typography className="text-lg text-black font-400">You are currently on <span className="font-600">{selectedPlan && selectedPlan.name}</span> Plan</Typography>
				</>
				}
				<div className=" flex justify-between items-center px-10 ">
						{order_exists &&  
									<Button
										onClick={()=>setDialogOpen(true)}
										className="my-12 px-16 py-6 -mx-10"
										variant="contained"
										color={"secondary"}
										disabled={pdfloading}
									>          
										I am Sure i want to Cancel
										{pdfloading && (
											<div className="ml-8 mt-2">
											<CircularProgress size={16} color="inherit" />
											</div>
										)}
									</Button>
						}
						{order_exists &&  
									<Button
										onClick={pdfOpen}
										className="my-12 px-16 py-6 -mx-10"
										variant="contained"
										color={"secondary"}
										disabled={loading}
									>          
										Invoice Pdf
										{loading && (
											<div className="ml-8 mt-2">
											<CircularProgress size={16} color="inherit" />
											</div>
										)}
									</Button>
						}
								<ConfirmationDialog
									open={dialogOpen}
									onClose={handleCloseDialog}
									onConfirm={handleConfirmDialog}
									title="Confirmation"
									content="Are you sure you want to perform this action?"
									/>
				</div>
			</div> */}
		</div>
	);
}

type TableCellProps = {
	value: boolean | string;
};



export default TablePricingTable;
