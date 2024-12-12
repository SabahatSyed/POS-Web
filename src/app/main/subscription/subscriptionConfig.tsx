import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import authRoles from '../../auth/authRoles';
import lazyWithReducer from 'app/store/lazyWithReducer';
import reducer from './store';
const Subscription = lazyWithReducer('paymentMethod', () => import('./Subscription'), reducer);
const TablePricingPage = lazyWithReducer('subscription', () =>import('./table/TablePricingPage'),reducer)
const PlansTable = lazyWithReducer('plans', () =>import('./plans/plansTable'),reducer)
const PlansForm = lazyWithReducer('plans', () =>import('./plans/plansForm'),reducer)
const SubscriptionTable = lazyWithReducer('subscription', () =>import('./Subscriptions/subscriptionsTable'),reducer)
const SignInConfig: FuseRouteConfigType = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		// {
		// 	path: 'subscription',
		// 	element: <TablePricingPage/>,
		// 	auth: ['Customer'],

		// },
		{
			path: 'paymentMethod',
			element: <Subscription/>,
			auth: ['Customer', 'Admin'],

		},
		{
			path: '/subscriptions/table',
			element: <SubscriptionTable/>,
			auth: ['Admin'],

		},
		{
			path: '/plans/table',
			element: <PlansTable/>,
			auth: ['Admin'],

		},
		{
			path: '/plans/form',
			element: <PlansForm/>,
			auth: ['Admin'],

		},
		{
			path: '/plans/form/:id',
			element: <PlansForm/>,
			auth: ['Admin'],

		}
	]
};

export default SignInConfig;
