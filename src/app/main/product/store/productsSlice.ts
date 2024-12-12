import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootStateType } from 'app/store/types';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import { BuyListPayloadType, ProductPayloadType } from '../types/ProductTypes';

type AppRootStateType = RootStateType<widgetsSliceType>;

type WidgetsType = {
	[key: string]: unknown;
};

export const getWidgets = createAppAsyncThunk('product/getproduct', async () => {
	const response = await axios.get('/api/dashboards/finance/widgets');

	const data = (await response.data) as WidgetsType;

	return data;
});

export const addRecord = createAppAsyncThunk('product/products/addBuyList', async ({payload}: {payload: BuyListPayloadType}) => {
	const response = await axios.post(`/api/buylist/`,payload);

	const data = (await response.data) as BuyListPayloadType;

	return data;
});
const initialState: WidgetsType = {};

/**
 * The finance dashboard widgets slice.
 */
export const widgetsSlice = createSlice({
	name: 'financeDashboardApp/widgets',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getWidgets.fulfilled, (state, action) => action.payload);
	}
});

export const selectWidgets = (state: AppRootStateType) => state.financeDashboardApp.widgets;

export type widgetsSliceType = typeof widgetsSlice;

export default widgetsSlice.reducer;
