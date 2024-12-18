import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import authRoles from '../../auth/authRoles';
import PasswordResetLinkSentPage from './PasswordResetLinkSentPage';
import ResetPasswordPage from './ResetPasswordPage';
import PasswordResetSuccessPage from './PasswordResetSuccessPage';

/**
 * Route Configuration for Forgot Password Pages.
 */
const ResetPasswordConfig: FuseRouteConfigType = {
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
			path: 'reset-link-sent',
			element: <PasswordResetLinkSentPage />
		},
		{
			path: 'reset-password/:token',
			element: <ResetPasswordPage />
		},
		{
			path: 'password-reset-success',
			element: <PasswordResetSuccessPage />
		}
	]
};

export default ResetPasswordConfig;
