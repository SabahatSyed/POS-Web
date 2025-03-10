import lazyWithReducer from 'app/store/lazyWithReducer';
import reducer from './store';

const ProjectDashboardApp = lazyWithReducer('projectDashboardApp', () => import('./ProjectDashboardApp'), reducer);

/**
 * The ProjectDashboardApp configuration.
 */
const ProjectDashboardAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'dashboard',
			element: <ProjectDashboardApp />
		}
	]
};

export default ProjectDashboardAppConfig;
