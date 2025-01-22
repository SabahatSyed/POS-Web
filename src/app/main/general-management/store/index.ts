import { combineReducers } from '@reduxjs/toolkit';
import roles from './roleDataSlice';
import users from './userDataSlice';
import customers from './customerDataSlice';
import checklist from './checklistDataSlice';
import labels from './labelDataSlice';
import newsletter from './newsletterDataSlice';
import contactus from './contactUsDataSlice';
import InventoryGroup from './inventoryGroupSlice';

/**
 * The Finance dashboard reducer.
 */
const reducer = combineReducers({
	roles,
	users,
	customers,
	checklist,
	labels,
	newsletter,
	contactus,
	InventoryGroup
});

export default reducer;
