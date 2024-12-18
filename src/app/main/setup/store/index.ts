import { combineReducers } from '@reduxjs/toolkit';

import maingroup from "./mainGroupSlice"


/**
 * The Setting dashboard reducer.
 */
const reducer = combineReducers({
	
	maingroup,
	
});

export default reducer;
