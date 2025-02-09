import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootStateType } from 'app/store/types';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import { User } from '../../general-management/types/dataTypes';

type AppRootStateType = RootStateType<dataSliceType>;

type DataType = {
	[key: string]: unknown;
};

const storeName = 'user';
const apiEndPoint = '/api/user';

export const getRecords = createAppAsyncThunk(`${storeName}/getRecords`, async ({page, limit, id, search}: {page?: number, limit?: number, id?: string, search?: string}) => {
	
	const response = await axios.get(`${apiEndPoint}?page=${page ? page : ''}&limit=${limit ? limit : ''}&id=${id ? id : ''}&text=${search ? search : ''}`);

	const data = (await response.data) as DataType;

	return data.data;
});

/**
 * The add user.
 */
export const addRecord = createAppAsyncThunk(`${storeName}/addRecord`, async ({payload}: {payload: User}) => {

	const response = await axios.post(`${apiEndPoint}/add`, payload);

	const data = (await response.data) as DataType;

	return data;
});

export const updateRecord = createAppAsyncThunk(`${storeName}/updateRecord`, async ({payload , id}: {payload: User , id:string}) => {

	const response = await axios.put(`${apiEndPoint}/${id}`, payload);

	const data = (await response.data) as DataType;

	return data;
});


export const deleteRecord = createAppAsyncThunk(`${storeName}/deleteRecord`, async ({ id}: { id:string}) => {

	const response = await axios.delete(`${apiEndPoint}/${id}`);

	const data = (await response.data) as DataType;

	return data;
});
const initialState: DataType = {};

/**
 * The finance dashboard widgets slice.
 */
export const dataSlice = createSlice({
	name: `${storeName}`,
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getRecords.fulfilled, (state, action) => action.payload);
	}
});

export const selectRecords = (state: AppRootStateType) => state.users[storeName];

export type dataSliceType = typeof dataSlice;

export default dataSlice.reducer;
