import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootStateType } from 'app/store/types';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import { OrderDataType, OrderPayload, OrderType } from '../types/OrderType';

type AppRootStateType = RootStateType<OrderNotificationsSliceType>;

type OrderNotificationsType = {
	[key: string]: unknown;
};

export const getOrdersRecords = createAppAsyncThunk('orders/notificationslist/getOrders', async ({page, limit, id}: {page?: number, limit?: number, id?: string}) => {
	const status= JSON.stringify(['Placed'])
	const response = await axios.get(
    `/api/order_list/?page=${page ? page : ""}&limit=${limit ? limit : ""}&id=${
      id ? id : ""
    }&status=${status || null}`
  );
	const data = (await response.data) as OrderNotificationsType;
	return data;
});

// export const getActiveOrder = createAppAsyncThunk('subscription/orders/active', async (userId?: string) => {
// 	const response = await axios.get(`/api/orders/active?user_id=${!!userId ? userId : null}`);
// 	const data = (await response.data) as OrderType;
// 	return data;
// });

// export const updateBillingCycle = createAppAsyncThunk('subscription/orders/update', async ({payload}: {payload: any}) => {
// 	const response = await axios.post(`/api/orders/update`, payload);
// 	const data = (await response.data) as OrderType;
// 	return data;
// });


// export const updateAutoRenewal = createAppAsyncThunk('subscription/orders/toggle_renewal', async ({payload}: {payload: any}) => {
// 	const response = await axios.post(`/api/orders/toggle_renewal`, payload);
// 	const data = (await response.data) as OrderType;
// 	return data;
// });


// export const renewSubscription = createAppAsyncThunk('subscription/orders/renew', async ({payload}: {payload: any}) => {
// 	const response = await axios.post(`/api/orders/renew`, payload);
// 	const data = (await response.data) as OrderType;
// 	return data;
// });


const initialState: OrderNotificationsType = {};

/**
 * The finance dashboard widgets slice.
 */
export const OrderNotificationsSlice = createSlice({
	name: 'orders/notificationslist',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getOrdersRecords.fulfilled, (state, action) => 
			action.payload);
	}
});
// export const addRecord = createAppAsyncThunk(`subscription/orders/addRecord`, async ({payload}: {payload: OrderPayload}) => {

// 	const response = await axios.post(`/api/orders/subscribe`, payload);

// 	const data = (await response.data) as OrdersType;

// 	return data;
// });

// export const Unsubscribe = createAppAsyncThunk(`subscription/orders/deleteRecord`, async () => {

// 	const response = await axios.post(`/api/orders/unsubscribe`);

// 	const data = (await response.data) as OrdersType;

// 	return data;
// });

// export const deleteRecord = createAppAsyncThunk(`subscription/invoices/deleteRecord`, async ({id}: {id:string}) => {

// 	const response = await axios.delete(`/api/invoices/${id}`);

// 	const data = (await response.data) as InvoicesType;

// 	return data;
// });
export const selectOrders = (state: AppRootStateType) => state.orders.notificationslist as OrderDataType;

export type OrderNotificationsSliceType = typeof OrderNotificationsSlice;

export default OrderNotificationsSlice.reducer;
