/**
 * Configuration object containing the authentication service API endpoints
 */
const userServiceConfig = {
	signIn: 'api/auth/login',
	accessToken: 'api/auth/loginWithToken',
	updateUser: 'api/auth/update',
	addUser: 'api/users/add',
};

export default userServiceConfig;
