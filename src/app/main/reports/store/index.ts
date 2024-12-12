import { combineReducers } from '@reduxjs/toolkit';

import reportSlice from "./ReportsSlice"


/**
 * The Setting dashboard reducer.
 */
const reducer = combineReducers({
	
	reportSlice,
	
});

export default reducer;
