import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import SignInPage from './SignInPage';
import PhoneSignInPage from './PhoneSignInPage';
import authRoles from '../../auth/authRoles';
import ForgotPasswordPage from '../forgot-password/ForgotPasswordPage';
import PasswordResetLinkSentPage from '../reset-password/PasswordResetLinkSentPage';
import ResetPasswordPage from '../reset-password/ResetPasswordPage';
import PasswordResetSuccessPage from '../reset-password/PasswordResetSuccessPage';

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
	auth: authRoles.onlyGuest,
	routes: [
		{
			path: 'sign-in',
			element: <SignInPage />
		},
		{
			path: 'forgot-password',
			element: <ForgotPasswordPage />
		},
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

export default SignInConfig;
