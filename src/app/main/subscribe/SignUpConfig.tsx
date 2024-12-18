import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import SubscribePage from './SubscribePage';
import authRoles from '../../auth/authRoles';

const SignUpConfig: FuseRouteConfigType = {
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
	auth: authRoles.onlyGuest,
	routes: [
		{
			path: 'freetrial',
			element: <SubscribePage />
		},
		// {
		// 	path: 'confirmation',
		// 	element: <ClassicConfirmationRequiredPage />
		// }
	]
};

export default SignUpConfig;
