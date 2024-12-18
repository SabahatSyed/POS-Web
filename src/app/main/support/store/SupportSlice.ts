import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootStateType } from 'app/store/types';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import { MessagePayloadType, ReplyPayload } from '../types/SupportTypes';
//import { ProductPayload } from '../types/OrderType';

type AppRootStateType = RootStateType<SupportSliceType>;

type SupportType = {
	[key: string]: unknown;
};

export const getRecords = createAppAsyncThunk('supportApp/support/getMessages', async () => {
	const response = await axios.get(`/api/support/`);

	const data = (await response.data) as SupportType;

	return data;
});

export const addRecord = createAppAsyncThunk('supportApp/support/addMessages', async ({payload}: {payload: MessagePayloadType}) => {
	const response = await axios.post(`/api/support/send_message`,payload);

	const data = (await response.data) as SupportType;

	return data;
});

// export const updateRecord = createAppAsyncThunk(`supportApp/support/updateRecord`, async ({payload}: {payload: ReplyPayload}) => {

// 	const response = await axios.put(`/api/support/`, payload);

// 	const data = (await response.data) as SupportType;

// 	return data;
// });

export const addComment = createAppAsyncThunk(`supportApp/support/addComment`, async ({payload}: {payload: ReplyPayload}) => {

	const response = await axios.post(`/api/support/send_reply`, payload);

	const data = (await response.data) as SupportType;

	return data;
});


// export const getSingleProduct = createAppAsyncThunk('history/products/getProduct', async ({id}) => {
// 	const response = await axios.get(`/api/panels/${id}`);

// 	const data = (await response.data) as HistoryProductsType;

// 	return data;
// });

const initialState: SupportType = {};

/**
 * The finance dashboard widgets slice.
 */
export const supportSlice = createSlice({
	name: 'supportApp/support',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getRecords.fulfilled, (state, action) => action.payload);
	}
});

export const selectMessages = (state: AppRootStateType) => state.supportApp.support;

export type SupportSliceType = typeof supportSlice;

export default supportSlice.reducer;
