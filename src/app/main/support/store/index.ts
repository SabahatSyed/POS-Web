import { combineReducers } from '@reduxjs/toolkit';
import support from './SupportSlice';

/**
 * The Finance dashboard reducer.
 */
const reducer = combineReducers({
	support
});

export default reducer;
