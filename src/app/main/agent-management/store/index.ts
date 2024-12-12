import { combineReducers } from '@reduxjs/toolkit';
import agentInvite from './agentInviteDataSlice';
import agentRequest from './agentRequestDataSlice';
import agents from './agentDataSlice';

/**
 * The Finance dashboard reducer.
 */
const reducer = combineReducers({
	agentInvite,
	agentRequest,
	agents
});

export default reducer;
