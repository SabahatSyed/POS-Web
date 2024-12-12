import '@mock-api';
import BrowserRouter from '@fuse/core/BrowserRouter';
import FuseLayout from '@fuse/core/FuseLayout';
import FuseTheme from '@fuse/core/FuseTheme';
import { SnackbarProvider } from 'notistack';
import { useSelector } from 'react-redux';
import rtlPlugin from 'stylis-plugin-rtl';
import createCache, { Options } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { selectCurrentLanguageDirection } from 'app/store/i18nSlice';
import { selectUserPermissions, selectUserRole } from 'app/store/user/userSlice';
import themeLayouts from 'app/theme-layouts/themeLayouts';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import FuseAuthorization from '@fuse/core/FuseAuthorization';
import settingsConfig from 'app/configs/settingsConfig';
import { useAppSelector } from 'app/store';
import withAppProviders from './withAppProviders';
import { AuthProvider } from './auth/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

import axios from 'axios';
/**
 * Axios HTTP Request defaults
 */
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
// "http://127.0.0.1:5000";
// axios.defaults.baseURL = "https://api-liqueous-stg.logixsy.com";
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';

const emotionCacheOptions = {
	rtl: {
		key: 'muirtl',
		stylisPlugins: [rtlPlugin],
		insertionPoint: document.getElementById('emotion-insertion-point')
	},
	ltr: {
		key: 'muiltr',
		stylisPlugins: [],
		insertionPoint: document.getElementById('emotion-insertion-point')
	}
};

/**
 * The main App component.
 */
function App() {
	/**
	 * The user object from the Redux store.
	 */
	const userRole = useAppSelector(selectUserRole);

	const userPermissions = useAppSelector(selectUserPermissions);

	/**
	 * The language direction from the Redux store.
	 */
	const langDirection = useSelector(selectCurrentLanguageDirection);

	/**
	 * The main theme from the Redux store.
	 */
	const mainTheme = useSelector(selectMainTheme);

	return (
		<CacheProvider value={createCache(emotionCacheOptions[langDirection] as Options)}>
			<FuseTheme
				theme={mainTheme}
				direction={langDirection}
			>
				<GoogleOAuthProvider clientId="806620983559-ao7dmmhrtmcs7vldfrlu20gcmdm83h11.apps.googleusercontent.com">
					<AuthProvider>
						<BrowserRouter>
							<FuseAuthorization
								userRole={userRole}
								permissions={userPermissions}
								loginRedirectUrl={settingsConfig.loginRedirectUrl}
							>
								<SnackbarProvider
									maxSnack={5}
									anchorOrigin={{
										vertical: 'bottom',
										horizontal: 'right'
									}}
									classes={{
										containerRoot: 'bottom-0 right-0 mb-52 md:mb-68 mr-8 lg:mr-80 z-99'
									}}
								>
									<FuseLayout layouts={themeLayouts} />
								</SnackbarProvider>
							</FuseAuthorization>
						</BrowserRouter>
					</AuthProvider>
				</GoogleOAuthProvider>
			</FuseTheme>
		</CacheProvider>
	);
}

export default withAppProviders(App);
