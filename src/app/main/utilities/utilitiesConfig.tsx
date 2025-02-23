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
const CompanyTable = lazyWithReducer('companyinfo',()=> import('./pages/CompaniesTable'),reducer)





/**
 * The setting page config.
 */
const MainGroupConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: '/utilities/users/form',
      element: <Users />,
      auth: null,
    },
    {
      path: '/utilities/users',
      element: <UsersTable />,
      auth: null,
    },
    {
      path: '/utilities/users/form/:id',
      element: <Users />,
      auth: null,
    },

    {
      path: '/utilities/form-names',
      element: <FormNames />,
      auth: null,
    },
    {
      path: '/utilities/form-names/form',
      element: <FormNamesForm />,
      auth: null,
    },
    {
      path: '/utilities/carry-opening-balances',
      element: <CarryOpeningBalances />,
      auth: null,
    },
    {
      path: '/utilities/permissions',
      element: <Permissions />,
      auth: null,
    },
    {
      path: '/utilities/company-info',
      element: <CompanyInfo />,
      auth: ['SuperAdmin', 'Admin'],
    },
  
    {
      path: '/utilities/company-info/:id',
      element: <CompanyInfo />,
      auth: null,
    },
    {
      path: '/utilities/companies',
      element: <CompanyTable />,
      auth: null,
    },
  
  ],
};

export default MainGroupConfig;
