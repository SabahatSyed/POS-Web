import { lighten, styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useContext, useEffect, useRef, useState } from 'react';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Toolbar from '@mui/material/Toolbar';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useAppDispatch, useAppSelector } from 'app/store';
import { getChat, selectChat, sendMessage } from '../store/chatMessagesSlice';
import { selectContactById } from '../store/contactsSlice';
import { selectUser } from '../store/userSlice';
import UserAvatar from '../UserAvatar';
import ChatMoreMenu from './ChatMoreMenu';
import { ChatAppContext } from '../ChatApp';
import { ChatMessageType } from '../types/ChatMessageType';
import Error404Page from '../../../404/Error404Page';


import {
	Channel,
	Window,
	ChannelHeader,
	MessageList,
	MessageInput,
	Thread,
	LoadingIndicator,
	ChannelList,
	useChannelStateContext,
	TypingIndicator,
	ChannelHeaderProps,
  } from "stream-chat-react";


const StyledMessageRow = styled('div')(({ theme }) => ({
	'&.contact': {
		'& .bubble': {
			backgroundColor: theme.palette.secondary.light,
			color: theme.palette.secondary.contrastText,
			borderTopLeftRadius: 5,
			borderBottomLeftRadius: 5,
			borderTopRightRadius: 20,
			borderBottomRightRadius: 20,
			'& .time': {
				marginLeft: 12
			}
		},
		'&.first-of-group': {
			'& .bubble': {
				borderTopLeftRadius: 20
			}
		},
		'&.last-of-group': {
			'& .bubble': {
				borderBottomLeftRadius: 20
			}
		}
	},
	'&.me': {
		paddingLeft: 40,

		'& .bubble': {
			marginLeft: 'auto',
			backgroundColor: theme.palette.primary.light,
			color: theme.palette.primary.contrastText,
			borderTopLeftRadius: 20,
			borderBottomLeftRadius: 20,
			borderTopRightRadius: 5,
			borderBottomRightRadius: 5,
			'& .time': {
				justifyContent: 'flex-end',
				right: 0,
				marginRight: 12
			}
		},
		'&.first-of-group': {
			'& .bubble': {
				borderTopRightRadius: 20
			}
		},

		'&.last-of-group': {
			'& .bubble': {
				borderBottomRightRadius: 20
			}
		}
	},
	'&.contact + .me, &.me + .contact': {
		paddingTop: 20,
		marginTop: 20
	},
	'&.first-of-group': {
		'& .bubble': {
			borderTopLeftRadius: 20,
			paddingTop: 13
		}
	},
	'&.last-of-group': {
		'& .bubble': {
			borderBottomLeftRadius: 20,
			paddingBottom: 13,
			'& .time': {
				display: 'flex'
			}
		}
	}
}));

type ChatPropsType = {
	className?: string;
};

/**
 * The Chat App.
 */
function Chat(props: ChatPropsType) {
	const { setMainSidebarOpen, setContactSidebarOpen } = useContext(ChatAppContext);
	const dispatch = useAppDispatch();
	const chat = useAppSelector(selectChat);
	const routeParams = useParams();
	const contactId = routeParams.id;
	const chatRef = useRef<HTMLDivElement>(null);
	const [messageText, setMessageText] = useState('');

	useEffect(() => {
		dispatch(getChat(contactId));
	}, [contactId, dispatch]);

	useEffect(() => {
		if (chat) {
			setTimeout(scrollToBottom);
		}
	}, [chat]);

	function scrollToBottom() {
		if (!chatRef.current) {
			return;
		}
		chatRef.current.scrollTo({
			top: chatRef.current.scrollHeight,
			behavior: 'smooth'
		});
	}
	
	const CustomChannelHeader = (props: ChannelHeaderProps) => {
		console.log("title",props)
		const { channel,loading } = useChannelStateContext();
		const { name,image } = channel.data || {};
		console.log("channel",channel)
		if (!loading && (!channel)) {
			// Render an alternative component or show a message
			return <div>No channels available.</div>;
		  }
		return (


			<Box
				className="w-full border-b-1"
				sx={{
					backgroundColor: (theme) =>
						theme.palette.mode === 'light'
							? lighten(theme.palette.background.default, 0.4)
							: lighten(theme.palette.background.default, 0.02)
				}}
			>
				<Toolbar className="flex items-center justify-between px-16 w-full">
					<div className="flex items-center">
						<IconButton
							aria-label="Open drawer"
							onClick={() => setMainSidebarOpen(true)}
							className="flex lg:hidden"
							size="large"
						>
							<FuseSvgIcon>heroicons-outline:chat</FuseSvgIcon>
						</IconButton>
						<div
							className="flex items-center cursor-pointer"
							onClick={() => {
								setContactSidebarOpen(true);
							}}
							onKeyDown={() => setContactSidebarOpen(true)}
							role="button"
							tabIndex={0}
						>
							<UserAvatar
								className="relative mx-8"
								user={{name: name, avatar: image}}
							/>

							<Typography
								color="inherit"
								className="text-16 font-semibold px-4"
							>
								{name}
							</Typography>
						</div>
					</div>
					<ChatMoreMenu className="-mx-8" />
				</Toolbar>
			</Box>
					  
		);
	  };

	return (
      <div className="w-full -translate-y-6 lg:-translate-y-16">
        <Channel TypingIndicator={() => null}>
          <Window>
            <CustomChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </div>
    
  );
}

export default Chat;
