import { FuseRouteConfigsType } from '@fuse/utils/FuseUtils';

import ScrumboardAppConfig from './scrumboard/ScrumboardAppConfig';
import detailsConfig from './details/detailsConfig';
import dealsConfigs from './deals/dealsConfigs';
/**
 * sales management
 */
const salesManagementConfigs: FuseRouteConfigsType = [
	ScrumboardAppConfig,
	detailsConfig,
	...dealsConfigs
];

export default salesManagementConfigs;
