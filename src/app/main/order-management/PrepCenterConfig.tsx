import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import authRoles from '../../auth/authRoles';
import lazyWithReducer from 'app/store/lazyWithReducer';
import reducer from './store';
import OrderDetailsPage from './ordered-list/OrderDetailPage';
import PrepCenterUsers from './prepcenter/PrepCenterUsers';
// const TablePricingPage = lazyWithReducer('subscription', () =>import('./table/TablePricingPage'),reducer)
const PlansTable = lazyWithReducer('plans', () =>import('./prepcenter/PrepCenterTable'),reducer)
const PlansForm = lazyWithReducer('plans', () =>import('./prepcenter/plansForm'),reducer)
const OrderedList = lazyWithReducer('subscription', () =>import('./ordered-list/OrderedList'),reducer)

const PrepCenterConfig: FuseRouteConfigType = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    // {
    // 	path: 'subscription',
    // 	element: <TablePricingPage/>,
    // 	auth: ['Customer'],

    // },
    // {
    // 	path: 'paymentMethod',
    // 	element: <Subscription/>,
    // 	auth: ['Customer', 'Admin'],

    // },
    {
      path: "/orders/table",
      element: <OrderedList />,
      auth: ["Admin", "Prep Center Admin", "Customer", "Prep Center Staff"],
    },
    
    {
      path: "/prepcenter/users",
      element: <PrepCenterUsers />,
      auth: ["Prep Center Admin"],
    },
    {
      path: "/orders/table/:id",
      element: <OrderDetailsPage />,
      auth: ["Admin", "Prep Center Admin", "Customer"],
    },
    {
      path: "/prep-center/table",
      element: <PlansTable />,
      auth: ["Admin", "Staff"],
    },
    {
      path: "/prep-center/form",
      element: <PlansForm />,
      auth: ["Admin"],
    },
    {
      path: "/prep-center/form/:id",
      element: <PlansForm />,
      auth: ["Admin"],
    },
  ],
};

export default PrepCenterConfig;
