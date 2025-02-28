import i18next from 'i18next';
import { lazy } from 'react';
// import en from './i18n/en';
// import tr from './i18n/tr';
// import ar from './i18n/ar';

// i18next.addResourceBundle('en', 'examplePage', en);
// i18next.addResourceBundle('tr', 'examplePage', tr);
// i18next.addResourceBundle('ar', 'examplePage', ar);

const ProfilePage = lazy(() => import('./pages/ProfilePage'));

/**
 * The profile page config.
 */
const ProfileConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/profile',
			element: <ProfilePage />,
			auth: ['Admin', 'SuperAdmin', 'Employee'],
		}
	]
};

export default ProfileConfig;
