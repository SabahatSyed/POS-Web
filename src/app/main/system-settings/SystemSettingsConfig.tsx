import SystemSettingsPage from './SystemSettingsPage';

/**
 * The finance dashboard app config.
 */
const SystemSettingsConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'system-settings',
			element: <SystemSettingsPage />,
			auth: ['Admin']
		}
	]
};

export default SystemSettingsConfig;
