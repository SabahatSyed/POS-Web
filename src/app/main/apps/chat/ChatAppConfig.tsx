import lazyWithReducer from 'app/store/lazyWithReducer';
import Chat from './chat/Chat';
import ChatFirstScreen from './ChatFirstScreen';
import reducer from './store';

const ChatApp = lazyWithReducer('chatApp', () => import('./ChatApp'), reducer);

/**
 * The chat app config.
 */
const ChatAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'apps/chat',
			element: <ChatApp />,
			auth: ['Admin', 'Customer'],
			children: [
				{
					path: '',
					element: <Chat />,
				},
				{
					path: ':id',
					element: <Chat />
				}
			]
		}
	]
};

export default ChatAppConfig;
