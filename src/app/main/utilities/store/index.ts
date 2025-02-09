import { combineReducers } from "@reduxjs/toolkit";

import company from "./utilitiesGroupSlice";
import user from "./userDataSlice";

/**
 * The Setting dashboard reducer.
 */
const reducer = combineReducers({
  company,
  user,
});

export default reducer;
