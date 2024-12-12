import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootStateType } from 'app/store/types';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import { Role } from '../types/dataTypes';

type AppRootStateType = RootStateType<dataSliceType>;

type DataType = {
	[key: string]: unknown;
};

const storeName = 'roles';
const apiEndPoint = '/api/roles';

export const getRecords = createAppAsyncThunk(`generalManagement/${storeName}/getRecords`, async ({page, limit, id, search}: {page?: number, limit?: number, id?: string, search?: string}) => {
	
	const response = await axios.get(`${apiEndPoint}?page=${page ? page : ''}&limit=${limit ? limit : ''}&id=${id ? id : ''}&text=${search ? search : ''}`);

	const data = (await response.data) as DataType;

	return data;
});

/**
 * The add role.
 */
export const addRecord = createAppAsyncThunk(`generalManagement/${storeName}/addRecord`, async ({payload}: {payload: Role}) => {

	const response = await axios.post(`${apiEndPoint}/add`, payload);

	const data = (await response.data) as DataType;

	return data;
});

export const updateRecord = createAppAsyncThunk(`generalManagement/${storeName}/updateRecord`, async ({payload , id}: {payload: Role , id:string}) => {

	const response = await axios.put(`${apiEndPoint}/update?id=${id}`, payload);

	const data = (await response.data) as DataType;

	return data;
});

const initialState: DataType = {};

/**
 * The finance dashboard widgets slice.
 */
export const dataSlice = createSlice({
	name: `generalManagement/${storeName}`,
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getRecords.fulfilled, (state, action) => action.payload);
		// builder.addCase(addRecord.fulfilled, (state, action) => action.payload);
		// builder.addCase(updateRecord.fulfilled, (state, action) => action.payload);
	}
});

export const selectRecords = (state: AppRootStateType) => state.generalManagement[storeName];

export type dataSliceType = typeof dataSlice;

export default dataSlice.reducer;
