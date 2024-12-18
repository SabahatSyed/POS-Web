import { useEffect, useMemo, useState } from 'react';
import _ from '@lodash';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from 'app/store';
import SubscriptionHeader from './SubscriptionHeader';
import PaymentsMethodTable from './widgets/PaymentMethodsTable';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import FormPayment from './PaymentForm'
import {selectUser} from 'app/store/user/userSlice'
import { getRecords } from './store/paymentsSlice';
import { getInvoicesRecords } from './store/InvoiceSlice';
import { getSubscriptionRecords } from './store/subscriptionSlice';
/**
 * The finance dashboard app.
 */
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY);
function Subscription({onClose}) {
	
	const content = (
		<div className="w-full px-24 md:px-32 pb-24">
			
						<div
							className="w-full"
							
						>
							<div className="grid grid-cols-1 gap-32 w-full mt-32">
								<div className="grid gap-32 sm:grid-flow-col xl:grid-flow-row">
									

									<div className="flex flex-col">
									<Elements stripe={stripePromise} >
										<FormPayment onClose={onClose}/>
									</Elements>
									{/* <PaymentsMethodTable/> */}
									</div>

								</div>
								
							</div>
							
						</div>
				
		</div>
	);

	return (
		<FusePageSimple
			header={<SubscriptionHeader onClose={onClose} />}
			content={content}
		/>
	);
}

export default Subscription;
