import { combineReducers } from '@reduxjs/toolkit';
import deals from './dealDataSlice';

/**
 * The deals reducer.
 */
const reducer = combineReducers({
	deals
});

export default reducer;
