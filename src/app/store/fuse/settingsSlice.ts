import { createTheme, getContrastRatio } from '@mui/material/styles';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from '@lodash';
import {
	defaultSettings,
	defaultThemeOptions,
	extendThemeWithMixins,
	getParsedQuerySettings,
	mustHaveThemeOptions
} from '@fuse/default-settings';
import settingsConfig from 'app/configs/settingsConfig';
import themeLayoutConfigs from 'app/theme-layouts/themeLayoutConfigs';
import { setUser, updateUserSettings } from 'app/store/user/userSlice';
import { darkPaletteText, lightPaletteText } from 'app/configs/themesConfig';
import { RootStateType, AppThunkType } from 'app/store/types';
import { FuseSettingsConfigType, FuseThemeType } from '@fuse/core/FuseSettings/FuseSettings';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import { ThemeOptions } from '@mui/material/styles/createTheme';
import { PartialDeep } from 'type-fest';

type AppRootStateType = RootStateType<settingsSliceType>;
const defaultColors = {
	warning: {
	  light: '#ffb74d',
	  main: '#ff9800',
	  dark: '#f57c00',
	  contrastText: '#000',
	},
	error: {
	  light: '#e57373',
	  main: '#f44336',
	  dark: '#d32f2f',
	  contrastText: '#fff',
	},
	info: {
	  light: '#64b5f6',
	  main: '#2196f3',
	  dark: '#1976d2',
	  contrastText: '#fff',
	},
	success: {
	  light: '#81c784',
	  main: '#4caf50',
	  dark: '#388e3c',
	  contrastText: '#fff',
	},
  };


  const generateCustomTheme = (
	primary: string,
	secondary: string,
	background: string,
	mode: 'light' | 'dark' = 'light' // Default to dark mode
  ): FuseThemeType => {
	// Define text colors based on the mode
	const textColors = {
	  primary: mode === 'dark' ? 'rgb(255,255,255)' : 'rgb(17, 24, 39)',
	  secondary: mode === 'dark' ? 'rgb(148, 163, 184)' : 'rgb(107, 114, 128)',
	  disabled: mode === 'dark' ? 'rgb(156, 163, 175)' : 'rgb(149, 156, 169)',
	};
  
	// Define common colors
	const commonColors = {
	  black: 'rgb(17, 24, 39)',
	  white: 'rgb(255, 255, 255)',
	};
  
	// Define error colors
	const errorColors = {
	  light: '#ffcdd2',
	  main: '#f44336',
	  dark: '#b71c1c',
	};
  
	// Define divider color based on the mode
	const dividerColor = mode === 'dark' ? 'rgba(241,245,249,.12)' : '#e2e8f0';
  
	// Generate the theme object
	return {
	  palette: {
		mode,
		text: textColors,
		common: commonColors,
		primary: {
		  light: background, // Use the provided primary color for light
		  main: background, // Use the provided primary color for main
		  dark: background, // Use the provided primary color for dark
		  contrastDefaultColor: 'light', // Default contrast color
		  contrastText: textColors.primary, // Use text color for contrast
		},
		secondary: {
		  light: secondary, // Use the provided secondary color for light
		  main: secondary, // Use the provided secondary color for main
		  dark: secondary, // Use the provided secondary color for dark
		  contrastText: textColors.primary, // Use text color for contrast
		},
		background: {
		  paper: primary, // Use the provided background color for paper
		  default: primary, // Use the provided background color for default
		},
		error: errorColors,
		divider: dividerColor,
	  },
	};
  };
export const changeFuseTheme =
	(theme: FuseThemeType): AppThunkType<void> =>
	(dispatch, getState) => {
		const AppState = getState() as AppRootStateType;
		const { settings } = AppState.fuse;
		const customTheme = generateCustomTheme(theme?.primary, theme?.secondary, theme?.background);
		console.log("customTheme",customTheme)
		const newSettings: FuseSettingsConfigType = {
			...settings.current,
			theme: {
				main: customTheme,
				navbar: customTheme,
				toolbar: customTheme,
				footer: customTheme
			}
		};


		return dispatch(setDefaultSettings(newSettings));
	};

type layoutProps = {
	style: string;
	config: unknown;
};

/**
 * Gets the initial settings for the application.
 */
function getInitialSettings(): FuseSettingsConfigType {
	const defaultLayoutStyle =
		settingsConfig.layout && settingsConfig.layout.style ? settingsConfig.layout.style : 'layout1';

	const layout: layoutProps = {
		style: defaultLayoutStyle,
		config: themeLayoutConfigs[defaultLayoutStyle].defaults
	};

	return _.merge({}, defaultSettings, { layout }, settingsConfig, getParsedQuerySettings());
}

/**
 * Generates the settings object by merging the default settings with the new settings.
 */
export function generateSettings(
	_defaultSettings: PartialDeep<FuseSettingsConfigType>,
	_newSettings: FuseSettingsConfigType
) {
	return _.merge(
		{},
		_defaultSettings,
		{ layout: { config: themeLayoutConfigs[_newSettings?.layout?.style]?.defaults } },
		_newSettings
	);
}

const initialSettings = getInitialSettings();

/**
 * The type definition for the initial state.
 */
type initialStateProps = {
	initial: FuseSettingsConfigType;
	defaults: FuseSettingsConfigType;
	current: FuseSettingsConfigType;
};

/**
 * The initial state.
 */
const initialState: initialStateProps = {
	initial: initialSettings,
	defaults: _.merge({}, initialSettings),
	current: _.merge({}, initialSettings)
};

/**
 * Sets the default settings for the application.
 */
export const setDefaultSettings = createAppAsyncThunk(
	'fuse/settings/setDefaultSettings',
	async (val: PartialDeep<FuseSettingsConfigType>, { dispatch, getState }) => {
		const AppState = getState() as AppRootStateType;

		const { settings } = AppState.fuse;
		// const user = AppState.user;
		// console.log("user",user)

		const defaults = generateSettings(settings.defaults, val as FuseSettingsConfigType);
		await dispatch(updateUserSettings(defaults));


		return {
			...settings,
			defaults: _.merge({}, defaults),
			current: _.merge({}, defaults)
		};
	}
);

/**
 * The settings slice.
 */
export const settingsSlice = createSlice({
	name: 'fuse/settings',
	initialState,
	reducers: {
		setSettings: (state, action: PayloadAction<FuseSettingsConfigType>) => {
			const current = generateSettings(state.defaults, action.payload);

			return {
				...state,
				current
			};
		},

		setInitialSettings: () => _.merge({}, initialState),
		resetSettings: (state) => ({
			...state,
			defaults: _.merge({}, state.defaults),
			current: _.merge({}, state.defaults)
		})
	},
	extraReducers: (builder) => {
		builder
			.addCase(setDefaultSettings.fulfilled, (state, action) => action.payload)
			.addCase(setUser.fulfilled, (state, action) => {
				const defaults = generateSettings(
					state.defaults,
					action.payload?.data?.settings as FuseSettingsConfigType
				);
				return {
					...state,
					defaults: _.merge({}, defaults),
					current: _.merge({}, defaults)
				};
			});
	}
});

type directionType = 'ltr' | 'rtl';

const getDirection = (state: AppRootStateType) => state.fuse.settings.current.direction;
const getMainTheme = (state: AppRootStateType) => state.fuse.settings.current.theme.main;
const getNavbarTheme = (state: AppRootStateType) => state.fuse.settings.current.theme.navbar;
const getToolbarTheme = (state: AppRootStateType) => state.fuse.settings.current.theme.toolbar;
const getFooterTheme = (state: AppRootStateType) => state.fuse.settings.current.theme.footer;

/**
 * Generates the MUI theme object.
 */
function generateMuiTheme(theme: FuseThemeType, direction: directionType) {
	const data = _.merge({}, defaultThemeOptions, theme, mustHaveThemeOptions) as ThemeOptions;

	return createTheme(
		_.merge({}, data, {
			mixins: extendThemeWithMixins(data),
			direction
		} as ThemeOptions)
	);
}

/**
 * Selects the contrast theme based on the background color.
 */
export const selectContrastMainTheme = (bgColor: string) => {
	function isDark(color: string) {
		return getContrastRatio(color, '#ffffff') >= 3;
	}
	return isDark(bgColor) ? selectMainThemeDark : selectMainThemeLight;
};

/**
 * Changes the theme mode.
 */
function changeThemeMode(theme: FuseThemeType, mode: 'dark' | 'light'): FuseThemeType {
	const modes = {
		dark: {
			palette: {
				mode: 'dark',
				divider: 'rgba(241,245,249,.12)',
				background: {
					paper: '#1E2125',
					default: '#121212'
				},
				text: darkPaletteText
			}
		},
		light: {
			palette: {
				mode: 'light',
				divider: '#e2e8f0',
				background: {
					paper: '#FFFFFF',
					default: '#F7F7F7'
				},
				text: lightPaletteText
			}
		}
	};

	return _.merge({}, theme, modes[mode]);
}

export const selectMainTheme = createSelector([getMainTheme, getDirection], (theme, direction) =>
	generateMuiTheme(theme, direction)
);

export const selectMainThemeDark = createSelector([getMainTheme, getDirection], (theme, direction) =>
	generateMuiTheme(changeThemeMode(theme, 'dark'), direction)
);

export const selectMainThemeLight = createSelector([getMainTheme, getDirection], (theme, direction) =>
	generateMuiTheme(changeThemeMode(theme, 'light'), direction)
);

export const selectNavbarTheme = createSelector([getNavbarTheme, getDirection], (theme, direction) =>
	generateMuiTheme(theme, direction)
);

export const selectNavbarThemeDark = createSelector([getNavbarTheme, getDirection], (theme, direction) =>
	generateMuiTheme(changeThemeMode(theme, 'dark'), direction)
);

export const selectNavbarThemeLight = createSelector([getNavbarTheme, getDirection], (theme, direction) =>
	generateMuiTheme(changeThemeMode(theme, 'light'), direction)
);

export const selectToolbarTheme = createSelector([getToolbarTheme, getDirection], (theme, direction) =>
	generateMuiTheme(theme, direction)
);

export const selectToolbarThemeDark = createSelector([getToolbarTheme, getDirection], (theme, direction) =>
	generateMuiTheme(changeThemeMode(theme, 'dark'), direction)
);

export const selectToolbarThemeLight = createSelector([getToolbarTheme, getDirection], (theme, direction) =>
	generateMuiTheme(changeThemeMode(theme, 'light'), direction)
);

export const selectFooterTheme = createSelector([getFooterTheme, getDirection], (theme, direction) =>
	generateMuiTheme(theme, direction)
);

export const selectFooterThemeDark = createSelector([getFooterTheme, getDirection], (theme, direction) =>
	generateMuiTheme(changeThemeMode(theme, 'dark'), direction)
);

export const selectFooterThemeLight = createSelector([getFooterTheme, getDirection], (theme, direction) =>
	generateMuiTheme(changeThemeMode(theme, 'light'), direction)
);

export const selectFuseCurrentSettings = (state: AppRootStateType) => state.fuse.settings.current;

export const selectFuseCurrentLayoutConfig = (state: AppRootStateType) => state.fuse.settings.current.layout.config;

export const selectFuseDefaultSettings = (state: AppRootStateType) => state.fuse.settings.defaults;

export const selectCustomScrollbarsEnabled = (state: AppRootStateType) => state.fuse.settings.current.customScrollbars;

// export const selectFuseThemesSettings = (state: RootState) => state.fuse.settings.themes;

export const { resetSettings, setInitialSettings, setSettings } = settingsSlice.actions;

export type settingsSliceType = typeof settingsSlice;

export default settingsSlice.reducer;
