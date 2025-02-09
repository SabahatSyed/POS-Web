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

import KeypointsTablePage from './pages/KeypointsTable';


const KeypointsForm = lazyWithReducer(
  'keypoints',
  () => import('./pages/KeypointsForm'),
  reducer,
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
      path: '/keypoints',
      element: < KeypointsTablePage/>,
      auth: null,
    },
    {
      path: '/keypoints/form',
      element: <KeypointsForm />,
      auth: null,
    },
    {
      path: '/keypoints/form/:id',
      element: <KeypointsForm />,
      auth: null,
    },
    
  ],
};

export default MainGroupConfig;
