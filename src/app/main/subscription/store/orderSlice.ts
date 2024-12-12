import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootStateType } from 'app/store/types';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import { OrderDataType, OrderPayload, OrderType } from '../types/OrderType';

type AppRootStateType = RootStateType<OrdersSliceType>;

type OrdersType = {
	[key: string]: unknown;
};

export const getOrdersRecords = createAppAsyncThunk('subscription/orders/getOrders', async ({page, limit, id, search}: {page?: number, limit?: number, id?: string, search?: string}) => {
	const response = await axios.get(`/api/orders/?page=${page ? page : ''}&limit=${limit ? limit : ''}&id=${id ? id : ''}&text=${search ? search : ''}`);
	const data = (await response.data) as OrdersType;
	return data;
});

export const getActiveOrder = createAppAsyncThunk('subscription/orders/active', async (userId?: string) => {
	const response = await axios.get(`/api/orders/active?user_id=${!!userId ? userId : null}`);
	const data = (await response.data) as OrderType;
	return data;
});

export const updateBillingCycle = createAppAsyncThunk('subscription/orders/update', async ({payload}: {payload: any}) => {
	const response = await axios.post(`/api/orders/update`, payload);
	const data = (await response.data) as OrderType;
	return data;
});


export const updateAutoRenewal = createAppAsyncThunk('subscription/orders/toggle_renewal', async ({payload}: {payload: any}) => {
	const response = await axios.post(`/api/orders/toggle_renewal`, payload);
	const data = (await response.data) as OrderType;
	return data;
});


export const renewSubscription = createAppAsyncThunk('subscription/orders/renew', async ({payload}: {payload: any}) => {
	const response = await axios.post(`/api/orders/renew`, payload);
	const data = (await response.data) as OrderType;
	return data;
});


const initialState: OrdersType = {};

/**
 * The finance dashboard widgets slice.
 */
export const ordersSlice = createSlice({
	name: 'subscription/orders',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getOrdersRecords.fulfilled, (state, action) => action.payload);
		builder.addCase(updateAutoRenewal.fulfilled, (state, action) => action.payload);
	}
});
export const addRecord = createAppAsyncThunk(`subscription/orders/addRecord`, async ({payload}: {payload: OrderPayload}) => {

	const response = await axios.post(`/api/orders/subscribe`, payload);

	const data = (await response.data) as OrdersType;

	return data;
});

export const Unsubscribe = createAppAsyncThunk(`subscription/orders/deleteRecord`, async () => {

	const response = await axios.post(`/api/orders/unsubscribe`);

	const data = (await response.data) as OrdersType;

	return data;
});

// export const deleteRecord = createAppAsyncThunk(`subscription/invoices/deleteRecord`, async ({id}: {id:string}) => {

// 	const response = await axios.delete(`/api/invoices/${id}`);

// 	const data = (await response.data) as InvoicesType;

// 	return data;
// });
export const selectOrders = (state: AppRootStateType) => state.subscription.orders as OrderDataType;

export type OrdersSliceType = typeof ordersSlice;

export default ordersSlice.reducer;
