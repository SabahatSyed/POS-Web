import { FuseRouteConfigsType } from '@fuse/utils/FuseUtils';
import UsersConfig from './Borrow/BorrowConfig';
import RolesConfig from './prospects/ProspectsConfig';
/**
 * User management
 */
const userManagementConfigs: FuseRouteConfigsType = [
	UsersConfig,
	RolesConfig,
];

export default userManagementConfigs;
