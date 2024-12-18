import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootStateType } from 'app/store/types';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';

type AppRootStateType = RootStateType<InvoicesSliceType>;

type InvoicesType = {
	[key: string]: unknown;
};

export const getInvoicesRecords = createAppAsyncThunk('subscription/invoices/getInvoices', async ({page, limit, id, search, userId}: {page?: number, limit?: number, id?: string, search?: string, userId?:string}) => {
	const response = await axios.get(`/api/invoices/?page=${page ? page : ''}&limit=${limit ? limit : ''}&id=${id ? id : ''}&text=${search ? search : ''}&user_id=${!!userId ? userId : null}`);

	const data = (await response.data) as InvoicesType;

	return data;
});

const initialState: InvoicesType = {};

/**
 * The finance dashboard widgets slice.
 */
export const invoicesSlice = createSlice({
	name: 'subscription/invoices',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getInvoicesRecords.fulfilled, (state, action) => action.payload);
	}
});
// export const addRecord = createAppAsyncThunk(`subscription/invoices/addRecord`, async ({payload}: {payload: PaymentPayload}) => {

// 	const response = await axios.post(`/api/invoices/`, payload);

// 	const data = (await response.data) as InvoicesType;

// 	return data;
// });

// export const deleteRecord = createAppAsyncThunk(`subscription/invoices/deleteRecord`, async ({id}: {id:string}) => {

// 	const response = await axios.delete(`/api/invoices/${id}`);

// 	const data = (await response.data) as InvoicesType;

// 	return data;
// });
export const selectInvoices = (state: AppRootStateType) => state.subscription.invoices;

export type InvoicesSliceType = typeof invoicesSlice;

export default invoicesSlice.reducer;
