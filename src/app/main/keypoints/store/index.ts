import { combineReducers } from '@reduxjs/toolkit';

import keypoints from "./keypointsSlice"


/**
 * The Setting dashboard reducer.
 */
const reducer = combineReducers({
	
	keypoints,
});

export default reducer;
