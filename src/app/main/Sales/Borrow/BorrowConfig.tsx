import lazyWithReducer from 'app/store/lazyWithReducer';
import reducer from '../store';

const UsersTablePage = lazyWithReducer('UserManagement', () => import('./BorrowTable'), reducer);

const UsersForm = lazyWithReducer('UserManagement', () => import('./BorrowForm'), reducer);
const EditForm = lazyWithReducer('UserManagement', () => import('./EditBorrow'), reducer);
/**
 * The finance dashboard app config.
 */
const UsersConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'users/table',
			element: <UsersTablePage />,
			auth: ['Admin'],
		},
		{
			path: 'users/form',
			element: <UsersForm />,
			auth: ['Admin'],
		 },
		 {
			path: 'users/form/:userId',
			element: <EditForm />,
			auth: ['Admin'],
		  },
	]
};

export default UsersConfig;
