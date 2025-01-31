import i18next from 'i18next';
import { lazy } from 'react';
// import en from './i18n/en';
// import tr from './i18n/tr';
// import ar from './i18n/ar';
import lazyWithReducer from 'app/store/lazyWithReducer';
// i18next.addResourceBundle('en', 'examplePage', en);
// i18next.addResourceBundle('tr', 'examplePage', tr);
// i18next.addResourceBundle('ar', 'examplePage', ar);
import reducer from './store';



const FormNames = lazyWithReducer('formnames', () => import('./pages/FormNamesTable'), reducer);
const FormNamesForm = lazyWithReducer(
  'formnames',
  () => import('./pages/FormNamesForm'),
  reducer,
);
const CarryOpeningBalances = lazyWithReducer('carryopeningbalances', () => import('./pages/CarryOpeningBalances'), reducer);
const Permissions = lazyWithReducer('permissions', () => import('./pages/Permissions'), reducer);
const Users = lazyWithReducer('users', () => import('./pages/UsersForm'), reducer);
const UsersTable = lazyWithReducer('users', () => import('./pages/UsersTable'), reducer);
const CompanyInfo = lazyWithReducer('companyinfo', () => import('./pages/CompanyInfo'), reducer);






/**
 * The setting page config.
 */
const MainGroupConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: '/utilities/new-user',
      element: <Users />,
      auth: ['Admin'],
    },
    {
      path: '/utilities/users',
      element: <UsersTable />,
      auth: ['Admin'],
    },

    {
      path: '/utilities/form-names',
      element: <FormNames />,
      auth: ['Admin'],
    },
    {
      path: '/utilities/form-names/form',
      element: <FormNamesForm />,
      auth: ['Admin'],
    },
    {
      path: '/utilities/carry-opening-balances',
      element: <CarryOpeningBalances />,
      auth: ['Admin'],
    },
    {
      path: '/utilities/permissions',
      element: <Permissions />,
      auth: ['Admin'],
    },
    {
      path: '/utilities/company-info',
      element: <CompanyInfo />,
      auth: ['Admin'],
    },
  
  ],
};

export default MainGroupConfig;
