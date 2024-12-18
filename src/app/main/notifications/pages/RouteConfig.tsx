import lazyWithReducer from 'app/store/lazyWithReducer';
import reducer from '../store';


const NotificationsTablePage = lazyWithReducer('notificationManagement', () => import('./NotificationsTable'), reducer);

/**
 * The route config.
 */
const RouteConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'notifications',
			element: <NotificationsTablePage />,
			auth: ['Admin', 'Agent', 'Customer'],
		},		
	]
};

export default RouteConfig;
