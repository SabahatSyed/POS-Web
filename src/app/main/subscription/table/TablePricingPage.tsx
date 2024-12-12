import history from '@history';
import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { darken } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import TablePricingFeatureItem from './TablePricingFeatureItem';
import TablePricingTable from './TablePricingTable';
import { Avatar } from '@mui/material';
import { getRecords, selectPayments } from '../store/paymentsSlice';
import { useAppDispatch, useAppSelector } from 'app/store';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { PaymentDataType } from '../types/PaymentMethodType';
import PaymentsMethodTable from '../widgets/PaymentMethodsTable';
import { getSubscriptionRecords, selectSubscriptions } from '../store/subscriptionSlice';
import { getInvoicesRecords, selectInvoices } from '../store/InvoiceSlice';
import { getOrdersRecords, selectOrders } from '../store/orderSlice';

/**
 * The table pricing page.
 */
function TablePricingPage() {
	const [period, setPeriod] = useState<'month' | 'year'>('month');
	const [payments, setPayments] = useState<PaymentDataType>()
	const [order_exists, setOrderExists] = useState([])
	const dispatch = useAppDispatch();

	
	const paymentData = useAppSelector(selectPayments);
	const subscriptions = useAppSelector(selectSubscriptions);
	const Invoices = useAppSelector(selectInvoices);
	const Orders = useAppSelector(selectOrders);
	useEffect(() => {
		dispatch(getRecords());
		dispatch(getSubscriptionRecords({id: null}))
		dispatch(getInvoicesRecords({id:null}))
		dispatch(getOrdersRecords({id:null}))

	}, [dispatch]);
	useEffect(() => {
		setPayments(paymentData)
	}, [paymentData]);
	useEffect(() => {
		if (Orders.records)
			setOrderExists(Orders.records.filter((item) => item.order_status !== "Cancelled"))
	}, [Orders])
	console.log("order",Orders)
	const content = (
		<div className="relative flex min-w-0 flex-auto flex-col overflow-hidden">
			<div className="relative overflow-hidden px-24 pb-48 pt-32 sm:px-64 sm:pb-96 sm:pt-80 flex flex-col gap-4">
				<svg
					className="pointer-events-none absolute inset-0 -z-1"
					viewBox="0 0 960 540"
					width="100%"
					height="100%"
					preserveAspectRatio="xMidYMax slice"
					xmlns="http://www.w3.org/2000/svg"
				>
					<Box
						component="g"
						sx={{ color: 'divider' }}
						className="opacity-20"
						fill="none"
						stroke="currentColor"
						strokeWidth="100"
					>
						<circle
							r="234"
							cx="196"
							cy="23"
						/>
						<circle
							r="234"
							cx="790"
							cy="491"
						/>
					</Box>
				</svg>

				<div className="flex flex-col -mx-24 ">


					<div
						// initial={{ opacity: 0, y: 40 }}
						// animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
						className='flex justify-between items-center'
					>
						<div>
							<Typography className="text-3xl font-semibold tracking-tight leading-8">
								Subscription
							</Typography>
							<Typography
								className="font-medium tracking-tight"
								color="text.secondary"
							>
								Navigate Your Smart Sourcing Journey
							</Typography>
						</div>
						
					</div>

					{order_exists.length == 0 &&
						<div
							className='flex justify-end '
						// initial={{ opacity: 0 }}
						// animate={{ opacity: 1, transition: { delay: 0.2 } }}
						>
							<Box
								className="mt-4 flex items-center overflow-hidden rounded-full p-2 sm:mt-24"
								sx={{ backgroundColor: (theme) => darken(theme.palette.background.default, 0.05) }}
							>
								<Box
									component="button"
									className={clsx(
										'h-40 cursor-pointer items-center rounded-full px-16 font-medium',
										period === 'year' && 'shadow'
									)}
									onClick={() => setPeriod('year')}
									sx={{ backgroundColor: period === 'year' ? 'background.paper' : '' }}
									type="button"
								>
									Yearly billing
								</Box>

								<Box
									component="button"
									className={clsx(
										'h-40 cursor-pointer items-center rounded-full px-16 font-medium',
										period === 'month' && 'shadow'
									)}
									onClick={() => setPeriod('month')}
									sx={{ backgroundColor: period === 'month' ? 'background.paper' : '' }}
									type="button"
								>
									Monthly billing
								</Box>
							</Box>
						</div>
					}

					{/* {order_exists.length == 0 && ( */}

						<TablePricingTable 
							period = {period} 
							data = {subscriptions?.records} 
							payment_method_id = {payments?.records && payments.records[0]?.id} 
							order_exists = {order_exists.length > 0 ? true : false} 
							subscription_id = {Orders?.records?.length > 0 ? Orders?.records[0]?.subscription_id : ""}
							/>

					{/* )} */}

				</div>

				

			</div>

		</div>
	);
	return (
		<FusePageSimple
			content={content}
		/>
	);
}

export default TablePricingPage;
