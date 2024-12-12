import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootStateType } from 'app/store/types';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import { PaymentDataType, PaymentPayload } from '../types/PaymentMethodType';

type AppRootStateType = RootStateType<paymentsSliceType>;

type PaymentsType = {
	[key: string]: unknown;
};

export const getRecords = createAppAsyncThunk('subscription/payments/getPayments', async (userId?: string) => {
	const response = await axios.get(`/api/payment_methods/?user_id=${!!userId ? userId : null}`);

	const data = (await response.data) as PaymentsType;

	return data;
});

const initialState: PaymentsType = {};

/**
 * The finance dashboard widgets slice.
 */
export const paymentsSlice = createSlice({
	name: 'subscription/payments',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getRecords.fulfilled, (state, action) => action.payload);
	}
});
export const addRecord = createAppAsyncThunk(`subscription/payments/addRecord`, async ({payload}: {payload: PaymentPayload}) => {

	const response = await axios.post(`/api/payment_methods/`, payload);

	const data = (await response.data) as PaymentsType;

	return data;
});

export const deleteRecord = createAppAsyncThunk(`subscription/payments/deleteRecord`, async ({id}: {id:string}) => {

	const response = await axios.delete(`/api/payment_methods/${id}`);

	const data = (await response.data) as PaymentsType;

	return data;
});
export const selectPayments = (state: AppRootStateType) => state.subscription.payments as PaymentDataType;

export type paymentsSliceType = typeof paymentsSlice;

export default paymentsSlice.reducer;
