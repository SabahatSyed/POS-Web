import i18next from "i18next";
import { FuseNavigationType } from "@fuse/core/FuseNavigation/types/FuseNavigationType";
import ar from "./navigation-i18n/ar";
import en from "./navigation-i18n/en";
import tr from "./navigation-i18n/tr";

i18next.addResourceBundle("en", "navigation", en);
i18next.addResourceBundle("tr", "navigation", tr);
i18next.addResourceBundle("ar", "navigation", ar);

/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */
const navigationConfig: FuseNavigationType = [
  // {
  // 	id: 'example-component',
  // 	title: 'Example',
  // 	translate: 'EXAMPLE',
  // 	type: 'item',
  // 	icon: 'heroicons-outline:star',
  // 	url: 'example',
  // 	auth: ['Admin', 'Customer']
  // },
  {
    id: "setup",
    title: "Setup",
    type: "collapse",
    icon: "heroicons-outline:cash",
    translate: "Setup",
    auth: ["Admin", "SuperAdmin", "Employee"],
    children: [
      {
        id: "setup-maingroup",
        title: "Main Group",
        type: "item",
        url: "setup/main-group",
        end: true,
        auth: ["Admin", "SuperAdmin", "Employee"],
      },
      {
        id: "setup-chartofaccounts",
        title: "Chart Of Accounts",
        type: "item",
        url: "setup/chart-accounts",
        end: true,
        auth: ["Admin", "SuperAdmin", "Employee"],
      },
      {
        id: "setup-inventorygroup",
        title: "Inventory Group",
        type: "item",
        url: "setup/inventory-group",
        end: true,
        auth: ["Admin", "SuperAdmin", "Employee"],
      },
      {
        id: "setup-inventory",
        title: "Inventory Information",
        type: "item",
        url: "setup/inventory-information",
        end: true,
        auth: ["Admin", "SuperAdmin", "Employee"],
      },
      {
        id: "setup-salesmen",
        title: "Salesmen",
        type: "item",
        url: "setup/salesmen",
        end: true,
        auth: ["Admin", "SuperAdmin", "Employee"],
      },
      // {
      //   id: "setup-companynames",
      //   title: "Company Names",
      //   type: "item",
      //   url: "setup/company-names",
      //   end: true,
      //   auth: ["Admin", "SuperAdmin", "Employee"],
      // },
      {
        id: "setup-batch",
        title: "Batch",
        type: "item",
        url: "setup/batch",
        end: true,
        auth: ["Admin", "SuperAdmin", "Employee"],
      },
      {
        id: "setup-opening-balances",
        title: "Opening Balances",
        type: "item",
        url: "setup/opening-balances",
        end: true,
        auth: ["Admin", "SuperAdmin", "Employee"],	
      },
      {
        id: "setup-expiry-dates",
        title: "Expiry Dates",
        type: "item",
        url: "setup/expiry-dates",
        end: true,
        auth: ["Admin", "SuperAdmin", "Employee"],
      },
    ],
  },

  {
    id: "utilities",
    title: "Utilities",
    type: "collapse",
    icon: "heroicons-outline:menu",
    auth: ["Admin", "SuperAdmin", "Employee"],
    children: [
      {
        id: "utilities-newuser",
        title: "Add New User",
        type: "item",
        url: "utilities/new-user",
        end: true,
        auth: ["Admin"],
      },
      {
        id: "utilities-userlist",
        title: "All Users",
        type: "item",
        url: "utilities/users",
        end: true,
        auth: ["Admin", "SuperAdmin"],
      },
      // {
      //   id: 'utilities-formname',
      //   title: 'Form Names',
      //   type: 'item',
      //   url: 'utilities/form-names',
      //   end: true,
      // },
      // {
      //   id: 'utilities-permissions',
      //   title: 'Permissions',
      //   type: 'item',
      //   url: 'utilities/permissions',
      //   end: true,
      // },
      {
        id: "utilities-company-info",
        title: "Company Info",
        type: "item",
        url: "utilities/company-info",
        end: true,
        auth: ["SuperAdmin", "Admin"],
      },
      {
        id: "utilities-opening-balances",
        title: "Carry Opening Balances",
        type: "item",
        url: "utilities/carry-opening-balances",
        end: true,
        auth: ["Admin", "SuperAdmin", "Employee"],
      },
    ],
  },
  {
    id: "entry",
    title: "Entry",
    type: "collapse",
    icon: "heroicons-outline:menu",
    auth: ["Admin", "SuperAdmin", "Employee"],
    children: [
      {
        id: "entry-salesbill",
        title: "Sales Bill",
        type: "item",
        url: "entry/sales-bill",
        end: true,
        auth: ["Admin", "SuperAdmin", "Employee"],
      },
      {
        id: "entry-purchasebill",
        title: "Purchase Bill",
        type: "item",
        url: "entry/purchase-bill",
        end: true,
        auth: ["Admin", "SuperAdmin", "Employee"],
      },
      {
        id: "entry-paymentreceipt",
        title: "Payment Receipt ",
        type: "item",
        url: "entry/payment-receipt",
        end: true,
        auth: ["Admin", "SuperAdmin", "Employee"],
      },
      {
        id: "entry-estimatebill",
        title: "Estimate Bill ",
        type: "item",
        url: "entry/estimate-bill",
        end: true,
        auth: ["Admin", "SuperAdmin", "Employee"],
      },
      // {
      //   id: 'entry-salesreturnbill',
      //   title: 'Sales Return Bill',
      //   type: 'item',
      //   url: 'entry/sales-return-bill',
      //   end: true,
      // },
      // {
      //   id: 'entry-purchasereturnbill',
      //   title: 'Purchase Return Bill',
      //   type: 'item',
      //   url: 'entry/purchase-return-bill',
      //   end: true,
      // },
      {
        id: "entry-generalbill",
        title: "General Bill",
        type: "item",
        url: "entry/general-bill",
        end: true,
        auth: ["Admin", "SuperAdmin", "Employee"],
      },
    ],
  },
  {
    id: "reports",
    title: "Reports",
    type: "collapse",
    icon: "heroicons-outline:menu",
    auth: ["Admin", "SuperAdmin", "Employee"],
    children: [
      {
        id: "one-a/c-head-ledger",
        title: "One A/C Head Ledger",
        type: "item",
        url: "reports/head-ledger",
        end: true,
        auth: ["Admin", "SuperAdmin", "Employee"],
      },
      {
        id: "day-book-for-date",
        title: "Day Book For Date",
        type: "item",
        url: "reports/day-book",
        end: true,
        auth: ["Admin", "SuperAdmin", "Employee"],
      },
      {
        id: "one-item-ledger",
        title: "One Item Ledger",
        type: "item",
        url: "reports/item-ledger",
        end: true,
        auth: ["Admin", "SuperAdmin", "Employee"],
      },
      {
        id: "accounts-reports",
        title: "Accounts Report",
        type: "item",
        url: "reports/accounts-report",
        end: true,
        auth: ["Admin", "SuperAdmin", "Employee"],
      },
    ],
  },
  {
    id: "dashboards.projects",
    title: "Dashboard",
    type: "item",
    icon: "heroicons-outline:cash",
    url: "/dashboard",
    auth: ["Admin"],
  },
  {
    id: "keypoints",
    title: "Keypoints",
    type: "item",
    icon: "heroicons-outline:cash",
    url: "/keypoints",
    auth: ["Admin", "Employee"],
  },
];

export default navigationConfig;
