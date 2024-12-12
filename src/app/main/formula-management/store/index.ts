import { combineReducers } from '@reduxjs/toolkit';
import borroformulas from './borroFormulaDataSlice';
import blockPurchaseFormulas from './blockPurchaseFormulaDataSlice';
import elcFormulas from './elcFormulaDataSlice';

/**
 * The Finance dashboard reducer.
 */
const reducer = combineReducers({
	borroformulas,
	blockPurchaseFormulas,
	elcFormulas,
});

export default reducer;
