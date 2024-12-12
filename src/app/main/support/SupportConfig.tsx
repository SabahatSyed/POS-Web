import lazyWithReducer from 'app/store/lazyWithReducer';

import reducer from './store';

const SupportApp = lazyWithReducer('supportApp', () => import('./SupportQuestionsPage'), reducer);

/**
 * The help center app config.
 */
const SupportConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'support',
			element: <SupportApp/>,
			auth: ['Admin', 'Customer'],
		}
	]
};

export default SupportConfig;
