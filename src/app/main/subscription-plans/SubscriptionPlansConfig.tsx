import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import authRoles from '../../auth/authRoles';
import lazyWithReducer from 'app/store/lazyWithReducer';
import reducer from '../subscription/store';
const TablePricingPage = lazyWithReducer('subscription', () =>import('./table/TablePricingPage'),reducer)
const SignInConfig: FuseRouteConfigType = {
	settings: {
		layout: {
			config: {
				navbar: {
					display: false
				},
				toolbar: {
					display: false
				},
				footer: {
					display: false
				},
				leftSidePanel: {
					display: false
				},
				rightSidePanel: {
					display: false
				}
			}
		}
	},
	routes: [
		{
			path: 'subscription',
			element: <TablePricingPage/>,
			auth: ['Customer', 'Admin'],

		},
	]
};

export default SignInConfig;
