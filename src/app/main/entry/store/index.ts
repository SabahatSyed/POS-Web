import { combineReducers } from "@reduxjs/toolkit";

import salesbill from "./SalesBillSlice";
import purchaseBill from "./PurchaseBillSlice";
import generalBill from "./GeneralBillSlice";

/**
 * The Setting dashboard reducer.
 */
const reducer = combineReducers({
  salesbill,
  purchaseBill,
  generalBill,
});

export default reducer;
