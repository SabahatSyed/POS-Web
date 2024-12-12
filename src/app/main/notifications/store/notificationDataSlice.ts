import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootStateType } from 'app/store/types';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import { Notification } from '../types/dataTypes';

type AppRootStateType = RootStateType<dataSliceType>;

type DataType = {
	[key: string]: unknown;
};

const storeName = 'notifications';
const apiEndPoint = '/api/notifications';


export const getRecords = createAppAsyncThunk(`notificationManagement/${storeName}/getRecords`, async ({page, limit, id, search}: {page?: number, limit?: number, id?: string, search?: string}) => {
	
	const response = await axios.get(`${apiEndPoint}?page=${page ? page : ''}&limit=${limit ? limit : ''}&id=${id ? id : ''}&text=${search ? search : ''}`);

	const data = (await response.data) as DataType;

	return data;
});

/**
 * The add user.
 */
export const addRecord = createAppAsyncThunk(`notificationManagement/${storeName}/addRecord`, async ({payload}: {payload: Notification}) => {

	const response = await axios.post(`${apiEndPoint}/add`, payload);

	const data = (await response.data) as DataType;

	return data;
});

export const updateRecord = createAppAsyncThunk(`notificationManagement/${storeName}/updateRecord`, async ({payload , id}: {payload: Notification , id:string}) => {

	const response = await axios.put(`${apiEndPoint}/update?id=${id}`, payload);

	const data = (await response.data) as DataType;

	return data;
});

const initialState: DataType = {};

/**
 * The finance dashboard widgets slice.
 */
export const dataSlice = createSlice({
	name: `notificationManagement/${storeName}`,
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getRecords.fulfilled, (state, action) => action.payload);
	}
});

export const selectRecords = (state: AppRootStateType) => state.notificationManagement[storeName];

export type dataSliceType = typeof dataSlice;

export default dataSlice.reducer;
