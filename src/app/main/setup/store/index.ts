import { combineReducers } from '@reduxjs/toolkit';

import maingroup from "./mainGroupSlice"
import chartOfAccount from "./chartOfAccountSlice"
import inventoryInformation from "./inventoryInformationSlice"


/**
 * The Setting dashboard reducer.
 */
const reducer = combineReducers({
	
	maingroup,
	chartOfAccount,
	inventoryInformation
	
});

export default reducer;
