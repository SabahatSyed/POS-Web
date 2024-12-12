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
const SalesBill = lazyWithReducer(
  'salesbill',
  () => import('./pages/SalesBill'),
  reducer,
);
const SalesReturnBill = lazyWithReducer(
  'salesreturnbill',
  () => import('./pages/SalesReturnBill'),
  reducer,
);
const PurchaseBill = lazyWithReducer(
  'purchasebill',
  () => import('./pages/PurchaseBill'),
  reducer,
);
const PurchaseReturnBill = lazyWithReducer(
  'purchasereturnbill',
  () => import('./pages/PurchaseReturnBill'),
  reducer,
);
const GeneralBill = lazyWithReducer(
  'generalbill',
  () => import('./pages/GeneralBill'),
  reducer,
);
const PaymentReciept = lazyWithReducer(
  'paymentreciept',
  () => import('./pages/PaymentReceiptTable'),
  reducer,
);
const EstimateBill = lazyWithReducer(
  'estimatebill',
  () => import('./pages/EstimateBill'),
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
      path: '/entry/sales-bill',
      element: <SalesBill />,
      auth: null,
    },
    {
      path: '/entry/sales-return-bill',
      element: <SalesReturnBill />,
      auth: null,
    },
    {
      path: '/entry/purchase-bill',
      element: <PurchaseBill />,
      auth: null,
    },
    {
      path: '/entry/purchase-return-bill',
      element: <PurchaseReturnBill />,
      auth: null,
    },
    {
      path: '/entry/general-bill',
      element: <GeneralBill />,
      auth: null,
    },
    {
      path: '/entry/payment-receipt',
      element: <PaymentReciept />,
      auth: null,
    },
    {
      path: '/entry/estimate-bill',
      element: <EstimateBill />,
      auth: null,
    },
  ],
};

export default MainGroupConfig;
