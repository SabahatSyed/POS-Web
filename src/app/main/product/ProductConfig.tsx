import lazyWithReducer from 'app/store/lazyWithReducer';
import reducer from './store';

const ProductApp = lazyWithReducer('Product', () => import('./ProductApp'), reducer);

/**
 * The finance dashboard app config.
 */
const FinanceDashboardAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'product/:asin',
			element: <ProductApp />,
			auth: ['Admin','Customer'],
		}
	]
};

export default FinanceDashboardAppConfig;
