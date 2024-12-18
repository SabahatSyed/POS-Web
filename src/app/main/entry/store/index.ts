import { combineReducers } from '@reduxjs/toolkit';

import salesbill from "./SalesBillSlice"


/**
 * The Setting dashboard reducer.
 */
const reducer = combineReducers({
	
	salesbill,
	
});

export default reducer;
