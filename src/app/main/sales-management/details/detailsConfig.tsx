import i18next from 'i18next';
import { lazy } from 'react';
// import en from './i18n/en';
// import tr from './i18n/tr';
// import ar from './i18n/ar';

// i18next.addResourceBundle('en', 'examplePage', en);
// i18next.addResourceBundle('tr', 'examplePage', tr);
// i18next.addResourceBundle('ar', 'examplePage', ar);

const Details = lazy(() => import('./details'));

/**
 * The Example page config.
 */
const detailConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'sales/details/:cardId',
			element: <Details />,
			auth: ['Admin', 'Staff'],
		}
	]
};

export default detailConfig;
