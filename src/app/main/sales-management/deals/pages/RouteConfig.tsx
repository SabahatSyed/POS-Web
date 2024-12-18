import lazyWithReducer from 'app/store/lazyWithReducer';
import reducer from '../store';


const DealsTablePage = lazyWithReducer('dealManagement', () => import('./DealsTable'), reducer);

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
			path: 'sales/requests',
			element: <DealsTablePage />,
			auth: ['Customer'],
		},		
	]
};

export default RouteConfig;
