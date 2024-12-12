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

const HeadLedger = lazyWithReducer(
  'headledger',
  () => import('./pages/HeadLedger'),
  reducer,
);
const DayBook = lazyWithReducer(
  'daybook',
  () => import('./pages/DayBook'),
  reducer,
);
const OneItemLedger = lazyWithReducer(
  'oneitemledger',
  () => import('./pages/OneItemLedger'),
  reducer,
);
const AccountReports = lazyWithReducer(
  'accountreports',
  () => import('./pages/AccountReports'),
  reducer,
);


/*
 * The setting page config.
 */
const MainGroupConfig = {
  settings: {
    layout: {},
  },
  routes: [
 
    {
      path: '/reports/head-ledger',
      element: <HeadLedger />,
      auth: null,
    },
    {
      path: '/reports/day-book',
      element: <DayBook />,
      auth: null,
    },
    {
      path: '/reports/item-ledger',
      element: <OneItemLedger />,
      auth: null,
    },
    {
      path: '/reports/accounts-report',
      element: <AccountReports />,
      auth: null,
    },
  ],
};

export default MainGroupConfig;
