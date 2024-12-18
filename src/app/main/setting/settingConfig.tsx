import i18next from 'i18next';
import { lazy } from 'react';
// import en from './i18n/en';
// import tr from './i18n/tr';
// import ar from './i18n/ar';
import lazyWithReducer from 'app/store/lazyWithReducer';
// i18next.addResourceBundle('en', 'examplePage', en);
// i18next.addResourceBundle('tr', 'examplePage', tr);
// i18next.addResourceBundle('ar', 'examplePage', ar);
import reducer from './store';
const SettingPage = lazyWithReducer('settingsManagement', () => import('./pages/SettingPage'), reducer);

/**
 * The setting page config.
 */
const SettingsConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/setting',
			element: <SettingPage />,
			auth: ['Admin'],
		}
	]
};

export default SettingsConfig;
