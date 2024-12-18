import { combineReducers } from '@reduxjs/toolkit';

import notificationslist from './orderSlice'

/**
 * The Finance dashboard reducer.
 */
const reducer = combineReducers({
	notificationslist
});

export default reducer;
