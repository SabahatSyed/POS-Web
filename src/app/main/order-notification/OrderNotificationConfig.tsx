import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import authRoles from '../../auth/authRoles';
import lazyWithReducer from 'app/store/lazyWithReducer';
import reducer from './store';
const NotificationsTable = lazyWithReducer('orders', () =>import('./order-notification/NotificationList'),reducer)
const OrderNotificationConfig: FuseRouteConfigType = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
   
    {
      path: "/order/notifications",
      element: <NotificationsTable />,
      auth: ["Prep Center Admin","Prep Center Staff"],
    },
   
  ],
};

export default OrderNotificationConfig;
