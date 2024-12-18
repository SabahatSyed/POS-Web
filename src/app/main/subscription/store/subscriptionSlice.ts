import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootStateType } from 'app/store/types';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import { SubscriptionDataType, SubscriptionType } from '../types/SubscriptionType';

type AppRootStateType = RootStateType<subscriptionsSliceType>;

type SubscriptionsType = {
	[key: string]: unknown;
};

export const getSubscriptionRecords = createAppAsyncThunk('subscription/subscriptions/getSubscriptions', async ({page, limit, id, search}: {page?: number, limit?: number, id?: string, search?: string}) => {
	const response = await axios.get(`/api/subscriptions/?page=${page ? page : ''}&limit=${limit ? limit : ''}&id=${id ? id : ''}&text=${search ? search : ''}`);

	const data = (await response.data) as SubscriptionsType;

	return data;
});

export const getPublicSubscriptionRecords = createAppAsyncThunk('subscription/subscriptions/getPublicSubscriptions', async ({page, limit, id, search}: {page?: number, limit?: number, id?: string, search?: string}) => {
	const response = await axios.get(`/api/auth/subscription-plans?page=${page ? page : ''}&limit=${limit ? limit : ''}&id=${id ? id : ''}&text=${search ? search : ''}`);

	const data = (await response.data) as SubscriptionsType;

	return data;
});
const initialState: SubscriptionsType = {};

/**
 * The finance dashboard widgets slice.
 */
export const subscriptionsSlice = createSlice({
	name: 'subscription/subscriptions',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getPublicSubscriptionRecords.fulfilled, (state, action) => action.payload);
		builder.addCase(getSubscriptionRecords.fulfilled, (state, action) => action.payload);
	}
});
export const addRecord = createAppAsyncThunk(`subscription/subscriptions/addRecord`, async ({payload}: {payload: SubscriptionType}) => {

	const response = await axios.post(`/api/subscriptions/`, payload);

	const data = (await response.data) as SubscriptionsType;

	return data;
});

export const updateRecord = createAppAsyncThunk(`subscription/subscriptions/updateRecord`, async ({payload , id}: {payload: SubscriptionType , id:string}) => {

	const response = await axios.put(`/api/subscriptions/${id}`, payload);

	const data = (await response.data) as SubscriptionsType;

	return data;
});


export const deleteRecord = createAppAsyncThunk(`subscription/subscriptions/deleteRecord`, async ({id}: {id: string}) => {
	
	const response = await axios.delete(`/api/subscriptions/${id}`);

	const data = (await response.data) as SubscriptionsType;

	return data;
});
export const selectSubscriptions = (state: AppRootStateType) => state.subscription.subscriptions as SubscriptionDataType;

export type subscriptionsSliceType = typeof subscriptionsSlice;

export default subscriptionsSlice.reducer;
