import Button from '@mui/material/Button';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import BoardTitle from './BoardTitle';
import {  useAppSelector } from 'app/store';
import { selectUserPermissions } from 'app/store/user/userSlice';
type BoardHeaderProps = {
	onSetSidebarOpen: (open: boolean) => void;
};

/**
 * The board header component.
 */
function BoardHeader(props: BoardHeaderProps) {
	const { onSetSidebarOpen } = props;
	const permission = useAppSelector(selectUserPermissions)
	const canManagePermission = permission.includes('Manage Pipelines')
	return (
		<div className="p-24 sm:p-32 w-full border-b-1 flex flex-col sm:flex-row items-center justify-between container">
			<div className="flex items-center mb-12 sm:mb-0">
				<BoardTitle />
			</div>
			
			<div className="flex items-center justify-end space-x-12">
				<Button
					className="whitespace-nowrap"
					component={NavLinkAdapter}
					to="/sales/pipelines/"
					startIcon={<FuseSvgIcon size={20}>heroicons-outline:view-boards</FuseSvgIcon>}
				>
					Pipelines
				</Button>
				{canManagePermission && (
				<Button
					className="whitespace-nowrap"
					variant="contained"
					color="secondary"
					onClick={() => onSetSidebarOpen(true)}
					startIcon={<FuseSvgIcon size={20}>heroicons-outline:cog</FuseSvgIcon>}
				>
					Settings
				</Button>
				)}
			</div>
			
		</div>
	);
}

export default BoardHeader;
