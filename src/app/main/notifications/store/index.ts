import { combineReducers } from '@reduxjs/toolkit';
import notifications from './notificationDataSlice';

/**
 * The deals reducer.
 */
const reducer = combineReducers({
	notifications
});

export default reducer;
