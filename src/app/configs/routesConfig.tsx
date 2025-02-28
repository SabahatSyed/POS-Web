import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import { Navigate } from 'react-router-dom';
import settingsConfig from 'app/configs/settingsConfig';
import { FuseRouteConfigsType, FuseRoutesType } from '@fuse/utils/FuseUtils';
import SignInConfig from '../main/sign-in/SignInConfig';
import ProfileConfig from '../main/profile/profileConfig';
import SettingConfig from '../main/setting/settingConfig';
import SignUpConfig from '../main/sign-up/SignUpConfig';
import SignOutConfig from '../main/sign-out/SignOutConfig';
import Error404Page from '../main/404/Error404Page';
import DashboardsConfigs from '../main/dashboards/dashboardsConfigs';
import userManagementConfigs from '../main/general-management/generalManagementConfigs';
import formulaManagementConfigs from '../main/formula-management/formulaManagementConfigs';
// import chatConfig from '../main/chat/chatConfig';
import notificationsConfigs from '../main/notifications/notificationsConfigs';
import setupConfigs from '../main/setup/setupConfig'
import entryConfigs from '../main/entry/entryConfig';
import utilitiesConfigs from '../main/utilities/utilitiesConfig';
import reportsConfig from '../main/reports/reportsConfig';
import keypointsConfig from '../main/keypoints/keyPointsConfig'

const routeConfigs: FuseRouteConfigsType = [
  SignOutConfig,
  SignInConfig,
  SignUpConfig,
  // ExampleConfig,
  //DashboardConfig,
  ProfileConfig,
  SettingConfig,
  ...DashboardsConfigs,
  ...userManagementConfigs,
  ...formulaManagementConfigs,
  // chatConfig,
//   ...notificationsConfigs,
  setupConfigs,
  entryConfigs,
  utilitiesConfigs,
  reportsConfig,
  keypointsConfig,
];

/**
 * The routes of the application.
 */
const routes: FuseRoutesType = [
  ...FuseUtils.generateRoutesFromConfigs(
    routeConfigs,
    settingsConfig.defaultAuth
  ),
  {
    path: "/",
    element: <Navigate to="/profile" />,
  },
  {
    path: "loading",
    element: <FuseLoading />,
  },
  {
    path: "404",
    element: <Error404Page />,
  },
  {
    path: "*",
    element: <Navigate to="404" />,
  },
];

export default routes;
