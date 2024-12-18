import { combineReducers } from '@reduxjs/toolkit';
import payments from './paymentsSlice';
import subscriptions from './prepCenterSlice'
import invoices from './InvoiceSlice'
import orders from './orderSlice'


/**
 * The Finance dashboard reducer.
 */
const reducer = combineReducers({
	// payments,
	subscriptions,
	// invoices,
	// orders

});

export default reducer;
