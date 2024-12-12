import lazyWithReducer from 'app/store/lazyWithReducer';
import reducer from '../store';

const RolesTablePage = lazyWithReducer('UserManagement', () => import('./ProspectsTablePage'), reducer);

const RoleForm = lazyWithReducer('UserManagement', () => import('./prospectsForm'), reducer);

//const UsersForm = lazyWithReducer('UsersForm', () => import('./UsersForm'), reducer);
/**
 * The finance dashboard app config.
 */
const RolesConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	
	routes: [
		{
			path: 'roles/table',
			element: <RolesTablePage />,
			auth: ['Admin'],
		},
		
		{
			path: 'roles/form',
			element: <RoleForm />,
			auth: ['Admin'],
			
		 }
	]
};

export default RolesConfig;
