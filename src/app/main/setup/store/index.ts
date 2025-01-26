import { combineReducers } from '@reduxjs/toolkit';

import maingroup from "./mainGroupSlice"
import chartOfAccount from "./chartOfAccountSlice"
import inventoryInformation from "./inventoryInformationSlice"
import salesmen from "./salesmenSlice"
import batch from "./batchSlice"
import batchWiseOpening from "./batchWiseOpeningSlice"


/**
 * The Setting dashboard reducer.
 */
const reducer = combineReducers({
	
	maingroup,
	chartOfAccount,
	inventoryInformation,
	salesmen,
	batch,
	batchWiseOpening
	
});

export default reducer;
