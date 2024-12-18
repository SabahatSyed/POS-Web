import { combineReducers } from '@reduxjs/toolkit';
import widgets from './dataSlice';
import data from './dataSlice';
/**
 * The Finance dashboard reducer.
 */
const reducer = combineReducers({
	widgets,
	data
});

export default reducer;
