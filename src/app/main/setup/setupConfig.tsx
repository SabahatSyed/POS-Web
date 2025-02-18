import i18next from "i18next";
import { lazy } from "react";
// import en from './i18n/en';
// import tr from './i18n/tr';
// import ar from './i18n/ar';
import lazyWithReducer from "app/store/lazyWithReducer";
// i18next.addResourceBundle('en', 'examplePage', en);
// i18next.addResourceBundle('tr', 'examplePage', tr);
// i18next.addResourceBundle('ar', 'examplePage', ar);
import reducer from "./store";
import InventoryGroupForm from "./pages/InventoryGroupForm";
import InventoryGroupTable from "./pages/InventoryGroupTable";
import InventoryInformationTable from "./pages/InventoryInformationTable";
import InventoryInformationForm from "./pages/InventoryInformationForm";
import SalesmanTable from "./pages/SalesmenTable";
import SalesmenForm from "./pages/SalesmenForm";
import CompaniesTable from "./pages/CompaniesTable";
import CompaniesForm from "./pages/CompaniesForm";
import SalesmenTable from "./pages/SalesmenTable";
import BatchTable from "./pages/BatchTable";
import BatchForm from "./pages/BatchForm";
import ProtectedRoute from "app/shared-components/ProtectedRoute";

const MainGroupPage = lazyWithReducer(
  "maingroup",
  () => import("./pages/MainGroupTable"),
  reducer
);
const MainGroupForm = lazyWithReducer(
  "maingroup",
  () => import("./pages/MainGroupForm"),
  reducer
);

const ChartAccountsPage = lazyWithReducer(
  "chartaccounts",
  () => import("./pages/ChartAccountsTable"),
  reducer
);
const ChartAccountsForm = lazyWithReducer(
  "chartaccounts",
  () => import("./pages/ChartAccountsForm"),
  reducer
);
const OpeningBalances = lazyWithReducer(
  "openingbalances",
  () => import("./pages/OpeningBalancesTable"),
  reducer
);
const OpeningBalancesForm = lazyWithReducer(
  "openingbalancesform",
  () => import("./pages/OpeningBalancesForm"),
  reducer
);

const ExpiryDates = lazyWithReducer(
  "expirydatestable",
  () => import("./pages/ExpiryDatesTable"),
  reducer
);
const ExpiryDatesForm = lazyWithReducer(
  "expirydatesform",
  () => import("./pages/ExpiryDatesForm"),
  reducer
);

/**
 * The setting page config.
 */
const MainGroupConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "/setup/main-group",
      element: (
        <ProtectedRoute pageId="setup-maingroup">
          <MainGroupPage />
        </ProtectedRoute>
      ),
      auth: null,
    },
    {
      path: "/setup/main-group/form",
      element: <MainGroupForm />,
      auth: null,
    },
    {
      path: "/setup/main-group/form/:id",
      element: <MainGroupForm />,
      auth: null,
    },
    {
      path: "/setup/chart-of-accounts",
      element: <ChartAccountsPage />,
      auth: null,
    },
    {
      path: "/setup/chart-of-accounts/form",
      element: <ChartAccountsForm />,
      auth: null,
    },
    {
      path: "/setup/chart-of-accounts/form/:id",
      element: <ChartAccountsForm />,
      auth: null,
    },
    {
      path: "/setup/inventory-group",
      element: <InventoryGroupTable />,
      auth: null,
    },
    {
      path: "/setup/inventory-group/form",
      element: <InventoryGroupForm />,
      auth: null,
    },
    {
      path: "/setup/inventory-group/form/:id",
      element: <InventoryGroupForm />,
      auth: null,
    },
    {
      path: "/setup/inventory",
      element: <InventoryInformationTable />,
      auth: null,
    },
    {
      path: "/setup/inventory/form",
      element: <InventoryInformationForm />,
      auth: null,
    },
    {
      path: "/setup/inventory/form/:id",
      element: <InventoryInformationForm />,
      auth: null,
    },
    {
      path: "/setup/salesmen",
      element: <SalesmenTable />,
      auth: null,
    },
    {
      path: "/setup/salesmen/form",
      element: <SalesmenForm />,
      auth: null,
    },
    {
      path: "/setup/salesmen/form/:id",
      element: <SalesmenForm />,
      auth: null,
    },
    {
      path: "/setup/company-names",
      element: <CompaniesTable />,
      auth: null,
    },
    {
      path: "/setup/company-names/form",
      element: <CompaniesForm />,
      auth: null,
    },
    {
      path: "/setup/batch",
      element: <BatchTable />,
      auth: null,
    },
    {
      path: "/setup/batch/form",
      element: <BatchForm />,
      auth: null,
    },
    {
      path: "/setup/batch/form/:id",
      element: <BatchForm />,
      auth: null,
    },
    {
      path: "/setup/opening-balances",
      element: <OpeningBalances />,
      auth: null,
    },
    {
      path: "/setup/opening-balances/form",
      element: <OpeningBalancesForm />,
      auth: null,
    },
    {
      path: "/setup/opening-balances/form/:id",
      element: <OpeningBalancesForm />,
      auth: null,
    },
    {
      path: "/setup/expiry-dates",
      element: <ExpiryDates />,
      auth: null,
    },
    {
      path: "/setup/expiry-dates/form",
      element: <ExpiryDatesForm />,
      auth: null,
    },
  ],
};

export default MainGroupConfig;
