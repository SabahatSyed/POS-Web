import { combineReducers } from '@reduxjs/toolkit';

import utilities from "./utilitiesGroupSlice"


/**
 * The Setting dashboard reducer.
 */
const reducer = combineReducers({
	
	utilities,
	
});

export default reducer;
