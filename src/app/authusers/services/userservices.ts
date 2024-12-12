import FuseUtils from '@fuse/utils/FuseUtils';
import axios, { AxiosError, AxiosResponse } from 'axios';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import userRecordsType from '../../main/Sales/types/UserManagementTypes';
import { PartialDeep } from 'type-fest';
import userServiceConfig from './userservicesconfig';
/* eslint-disable camelcase, class-methods-use-this */

/**
 * The JwtService class is a utility class for handling JSON Web Tokens (JWTs) in the Fuse application.
 * It provides methods for initializing the service, setting interceptors, and handling authentication.
 */
class userService extends FuseUtils.EventEmitter {
	/**
	 * Initializes the JwtService by setting interceptors and handling authentication.
	 */
	init() {
		this.setInterceptors();
		//this.handleAuthentication();
	}

	/**
	 * Sets the interceptors for the Axios instance.
	 */
	setInterceptors = () => {
		axios.interceptors.response.use(
			(response: AxiosResponse<unknown>) => response,
			(err: AxiosError) =>
				new Promise(() => {
					if (err?.response?.status === 401 && err.config) {
						// if you ever get an unauthorized response, logout the user
						this.emit('onAutoLogout', 'Invalid access_token');
						//_setSession(null);
					}
					throw err;
				})
		);
	};

	/**
	 * Handles authentication by checking for a valid access token and emitting events based on the result.
	 */
	
	/**
	 * Creates a new user account.
	 */
	AddUser = (data: {
		name: string;
		password: string;
        address: string;
        phone: string;
        RoleId: string;
		email: string;
	}) =>
		new Promise((resolve, reject) => {
			axios.post(userServiceConfig.addUser, data).then(
				(
					response: AxiosResponse<{
						user: userRecordsType;
						
						error?: {
							type: 'email' | 'password' | `root.${string}` | 'root';
							message: string;
						}[];
					}>
				) => {
					if (response.data.user) {
					
						resolve(response.data.user);
						//this.emit('onLogin', response.data.user);
					} else {
						reject(response.data.error);
					}
				}
			);
		});

	
	/**
	 * Updates the user data.
	 */
	updateUserData = (user: PartialDeep<userRecordsType>) =>
		axios.post(userServiceConfig.updateUser, {
			user
		});

	
}






const instance = new userService();

export default instance;
