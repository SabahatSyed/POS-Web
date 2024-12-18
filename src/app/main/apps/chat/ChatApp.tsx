import { styled } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { createContext, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import FusePageSimple from '@fuse/core/FusePageSimple';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { useAppDispatch } from 'app/store';
import MainSidebar from './sidebars/main/MainSidebar';
import ContactSidebar from './sidebars/contact/ContactSidebar';
import UserSidebar from './sidebars/user/UserSidebar';
import { StreamChat } from "stream-chat";
import {
  Chat,
} from "stream-chat-react";
import "stream-chat-react/dist/css/index.css";

import { useSelector } from "react-redux";
import { selectUser } from 'app/store/user/userSlice';


const drawerWidth = 400;

type ChatAppContextType = {
	setMainSidebarOpen: (isOpen?: boolean) => void;
	setContactSidebarOpen: (isOpen?: boolean) => void;
	setUserSidebarOpen: (isOpen?: boolean) => void;
};

export const ChatAppContext = createContext<ChatAppContextType>({
	setMainSidebarOpen: () => {},
	setContactSidebarOpen: () => {},
	setUserSidebarOpen: () => {}
});

const Root = styled(FusePageSimple)(() => ({
	'& .FusePageSimple-content': {
		display: 'flex',
		flexDirection: 'column',
		flex: '1 1 100%',
		height: '100%'
	}
}));

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
	'& .MuiDrawer-paper': {
		width: drawerWidth,
		maxWidth: '100%',
		overflow: 'hidden',
		[theme.breakpoints.up('md')]: {
			position: 'relative'
		}
	}
}));

/**
 * The chat app.
 */
function ChatApp() {
	const dispatch = useAppDispatch();
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const [mainSidebarOpen, setMainSidebarOpen] = useState(!isMobile);
	const [contactSidebarOpen, setContactSidebarOpen] = useState(false);
	const [userSidebarOpen, setUserSidebarOpen] = useState(false);
	const location = useLocation();

	const userData = useSelector(selectUser);	
	console.log("u", userData);

	const apiKey = process.env.REACT_APP_API_KEY;
	console.log("apikey",apiKey)
	const userId = userData.uuid;
	console.log("user", userId);

	const userName = userData.data.displayName;
	const user = {
	  id: userId,
	  name: userName,
	  image: `https://getstream.io/random_png/?id=${userId}&name=${userName}`,
	};
  
	const [client, setClient] = useState(null);

	async function init() {
		const chatClient = StreamChat.getInstance(apiKey);
		await chatClient.connectUser(user, chatClient.devToken(user.id));
  
		setClient(chatClient);
	  }

	useEffect(() => {
		// dispatch(getUserData());
		// dispatch(getContacts());
		// dispatch(getChatList());

		init();

		if (client) return () => client.disconnectUser();

	}, [dispatch]);

	// if (!client) return <LoadingIndicator />;

	useEffect(() => {
		setMainSidebarOpen(!isMobile);
	}, [isMobile]);

	useEffect(() => {
		if (isMobile) {
			setMainSidebarOpen(false);
		}
	}, [location, isMobile]);

	useEffect(() => {
		if (isMobile && userSidebarOpen) {
			setMainSidebarOpen(false);
		}
	}, [isMobile, userSidebarOpen]);

	const ChatAppContextData = useMemo(
		() => ({
			setMainSidebarOpen,
			setContactSidebarOpen,
			setUserSidebarOpen
		}),
		[setMainSidebarOpen, setContactSidebarOpen, setUserSidebarOpen]
	);

	// return (
	// 	<Chat client={client} theme="messaging light">
	// 		<ChatAppContext.Provider value={ChatAppContextData as ChatAppContextType}>			
	// 			<Root
	// 				content={<Outlet />}
	// 				leftSidebarContent={<MainSidebar />}
	// 				leftSidebarOpen={mainSidebarOpen}
	// 				leftSidebarOnClose={() => {
	// 					setMainSidebarOpen(false);
	// 				}}
	// 				leftSidebarWidth={400}
	// 				rightSidebarContent={<ContactSidebar />}
	// 				rightSidebarOpen={contactSidebarOpen}
	// 				rightSidebarOnClose={() => {
	// 					setContactSidebarOpen(false);
	// 				}}
	// 				rightSidebarWidth={400}
	// 				scroll="content"
	// 			/>
	// 			<StyledSwipeableDrawer
	// 				className="h-full absolute z-9999"
	// 				variant="temporary"
	// 				anchor="left"
	// 				open={userSidebarOpen}
	// 				onOpen={() => {}}
	// 				onClose={() => setUserSidebarOpen(false)}
	// 				classes={{
	// 					paper: 'absolute left-0'
	// 				}}
	// 				style={{ position: 'absolute' }}
	// 				ModalProps={{
	// 					keepMounted: false,
	// 					disablePortal: true,
	// 					BackdropProps: {
	// 						classes: {
	// 							root: 'absolute'
	// 						}
	// 					}
	// 				}}
	// 			>
	// 				<UserSidebar />
	// 			</StyledSwipeableDrawer>
	// 		</ChatAppContext.Provider>
	// 	</Chat>		
	// );

	return (
			<ChatAppContext.Provider value={ChatAppContextData as ChatAppContextType}>	
				{client && (
				<Chat client={client} theme="messaging light">

				<Root
					content={<Outlet />}
					leftSidebarContent={<MainSidebar />}
					leftSidebarOpen={mainSidebarOpen}
					leftSidebarOnClose={() => {
						setMainSidebarOpen(false);
					}}
					leftSidebarWidth={400}
					rightSidebarContent={<ContactSidebar />}
					rightSidebarOpen={contactSidebarOpen}
					rightSidebarOnClose={() => {
						setContactSidebarOpen(false);
					}}
					rightSidebarWidth={400}
					scroll="content"
				/>
				<StyledSwipeableDrawer
					className="h-full absolute z-9999"
					variant="temporary"
					anchor="left"
					open={userSidebarOpen}
					onOpen={() => {}}
					onClose={() => setUserSidebarOpen(false)}
					classes={{
						paper: 'absolute left-0'
					}}
					style={{ position: 'absolute' }}
					ModalProps={{
						keepMounted: false,
						disablePortal: true,
						BackdropProps: {
							classes: {
								root: 'absolute'
							}
						}
					}}
				>
					<UserSidebar />
				</StyledSwipeableDrawer>
				</Chat>	
				)}

			</ChatAppContext.Provider>
	);
}

export default ChatApp;
