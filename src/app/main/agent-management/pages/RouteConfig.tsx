import lazyWithReducer from 'app/store/lazyWithReducer';
import reducer from '../store';

import AgentInviteFormPage from './AgentInviteForm';
import AgentsFormPage from '../../agent-management/pages/AgentsForm';


const AgentInviteTablePage = lazyWithReducer('agentManagement', () => import('./AgentInviteTable'), reducer);
const AgentRequestTablePage = lazyWithReducer('agentManagement', () => import('./AgentRequestTable'), reducer);
const AgentsTablePage = lazyWithReducer('generalManagement', () => import('./AgentsTable'), reducer);

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
			path: 'agentinvite/table',
			element: <AgentInviteTablePage />,
			auth: ['Admin'],
		},		
		{
			path: 'agentinvite/form',
			element: <AgentInviteFormPage />,
			auth: ['Admin'],
		},
		{
			path: 'agentinvite/form/:id',
			element: <AgentInviteFormPage />,
			auth: ['Admin'],
		},
		{
			path: 'agentrequest/table',
			element: <AgentRequestTablePage />,
			auth: ['Admin'],
		},

		{
			path: 'agents/table',
			element: <AgentsTablePage />,
			auth: ['Admin'],
		},
		{
			path: 'agents/form',
			element: <AgentsFormPage />,
			auth: ['Admin'],
		},
		{
			path: 'agents/form/:id',
			element: <AgentsFormPage />,
			auth: ['Admin'],
		},
	]
};

export default RouteConfig;
