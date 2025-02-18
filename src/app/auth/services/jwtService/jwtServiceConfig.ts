/**
 * Configuration object containing the authentication service API endpoints
 */
const jwtServiceConfig = {
	validate: 'api/auth/validate',
	signInWithIdToken: 'api/auth/loginWithIdToken',
	signIn: 'api/auth/login',
	accessToken: 'api/auth/loginWithToken',
	updateUser: 'api/auth/update',
	signUp: 'api/auth/login',
	forgotPassword: 'api/auth/forgot-password',
	resetPassword: 'api/auth/reset-password',
};

export default jwtServiceConfig;
