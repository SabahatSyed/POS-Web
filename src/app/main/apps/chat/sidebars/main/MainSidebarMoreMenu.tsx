import { useContext, useState } from 'react';
import { ChatAppContext } from '../../ChatApp';
import { Button, Typography } from '@mui/material';

type MainSidebarMoreMenuProps = {
	className?: string;
};

/**
 * The main sidebar more menu.
 */
function MainSidebarMoreMenu(props: MainSidebarMoreMenuProps) {
	const { className } = props;

	const { setUserSidebarOpen } = useContext(ChatAppContext);


	

	return (
		<div className={className}>
				<Typography
					variant="subtitle1"
					color="text.secondary">
					Chat
				</Typography>
				<Button
					className="text-white bg-blue-900"
					type="button"
					onClick={()=>setUserSidebarOpen(true)
					}
					>
					Add
				</Button>

			{/*<Menu
				id="chats-more-menu"
				anchorEl={moreMenuEl}
				open={Boolean(moreMenuEl)}
				onClose={handleMoreMenuClose}
			>
				<MenuItem
					onClick={() => {
						setUserSidebarOpen(true);
						handleMoreMenuClose();
					}}
				>
					Profile
				</MenuItem>
				<MenuItem onClick={handleMoreMenuClose}>Logout</MenuItem>
				</Menu>*/}
		</div>
	);
}

export default MainSidebarMoreMenu;
