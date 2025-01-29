import { combineReducers } from '@reduxjs/toolkit';

import salesbill from "./SalesBillSlice"
import purchaseBill from "./PurchaseBillSlice"


/**
 * The Setting dashboard reducer.
 */
const reducer = combineReducers({
	
	salesbill,
	purchaseBill
	
});

export default reducer;
