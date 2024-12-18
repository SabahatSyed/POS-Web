import lazyWithReducer from 'app/store/lazyWithReducer';
import reducer from '../store';

import RolesFormPage from './RolesForm';
import UsersFormPage from './UsersForm';
import ChecklistFormPage from './ChecklistForm';
import LabelFormPage from './LabelForm';
import CustomersFormPage from './CustomersForm';

const RolesTablePage = lazyWithReducer('generalManagement', () => import('./RolesTable'), reducer);
const UsersTablePage = lazyWithReducer('generalManagement', () => import('./UsersTable'), reducer);

const CustomersTablePage = lazyWithReducer('generalManagement', () => import('./CustomersTable'), reducer);
const ChecklistTablePage = lazyWithReducer('generalManagement', () => import('./ChecklistTable'), reducer);
const LabelTablePage = lazyWithReducer('generalManagement', () => import('./LabelTable'), reducer);

const NewsletterTablePage = lazyWithReducer('generalManagement', () => import('./NewsletterTable'), reducer);
const ContactUsTablePage = lazyWithReducer('generalManagement', () => import('./ContactUsTable'), reducer);

/**
 * The route config.
 */
const RouteConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'roles/table',
      element: <RolesTablePage />,
      auth: null,
      // ['Admin'],
    },
    {
      path: 'users/table',
      element: <UsersTablePage />,
      auth: null,
      //['Admin'],
    },

    {
      path: 'customers/table',
      element: <CustomersTablePage />,
      auth: null,
      //['Admin'],
    },
    {
      path: 'checklist/table',
      element: <ChecklistTablePage />,
      auth: null,
      //['Admin'],
    },
    {
      path: 'labels/table',
      element: <LabelTablePage />,
      auth: ['Admin'],
    },
    {
      path: 'newsletter/table',
      element: <NewsletterTablePage />,
      auth: ['Admin'],
    },
    {
      path: 'contactus/table',
      element: <ContactUsTablePage />,
      auth: ['Admin'],
    },

    {
      path: 'roles/form',
      element: <RolesFormPage />,
      auth: null,
      //['Admin'],
    },
    {
      path: 'roles/form/:id',
      element: <RolesFormPage />,
      auth: null,
      //['Admin'],
    },
    {
      path: 'users/form',
      element: <UsersFormPage />,
      auth: null,
      //['Admin'],
    },
    {
      path: 'users/form/:id',
      element: <UsersFormPage />,
      auth: null,
      //['Admin'],
    },

    {
      path: 'customers/form',
      element: <CustomersFormPage />,
      auth: ['Admin'],
    },
    {
      path: 'customers/form/:id',
      element: <CustomersFormPage />,
      auth: ['Admin'],
    },

    {
      path: 'checklist/form',
      element: <ChecklistFormPage />,
      auth: ['Admin'],
    },
    {
      path: 'checklist/form/:id',
      element: <ChecklistFormPage />,
      auth: ['Admin'],
    },

    {
      path: 'labels/form',
      element: <LabelFormPage />,
      auth: ['Admin'],
    },
    {
      path: 'labels/form/:id',
      element: <LabelFormPage />,
      auth: ['Admin'],
    },
  ],
};

export default RouteConfig;
