import { combineReducers } from '@reduxjs/toolkit';

import maingroup from "./utilitiesGroupSlice"


/**
 * The Setting dashboard reducer.
 */
const reducer = combineReducers({
	
	maingroup,
	
});

export default reducer;
