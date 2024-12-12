import i18next from 'i18next';
import { lazy } from 'react';
// import en from './i18n/en';
// import tr from './i18n/tr';
// import ar from './i18n/ar';

// i18next.addResourceBundle('en', 'dashboardPage', en);
// i18next.addResourceBundle('tr', 'dashboardPage', tr);
// i18next.addResourceBundle('ar', 'dashboardPage', ar);

const Chat = lazy(() => import('./Chat'));

/**
 * The Example page config.
 */
const chatConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/chats',
			element: <Chat />,
			auth: ['Admin'],
		}
	]
};

export default chatConfig;
