import { combineReducers } from '@reduxjs/toolkit';

import settings from './settingSlice';


/**
 * The Setting dashboard reducer.
 */
const reducer = combineReducers({
	
	settings,
	
});

export default reducer;
