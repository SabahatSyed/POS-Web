import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootStateType } from 'app/store/types';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import SettingType from '../types/setting';


type AppRootStateType = RootStateType<dataSliceType>;

type DataType = {
  [key: string]: unknown;
};

const storeName = 'settings';
const apiEndPoint = '/api/settings';

export const getRecords = createAppAsyncThunk(`settingsManagement/${storeName}/getRecords`, async ({ page, limit, id, search }: { page?: number, limit?: number, id?: string, search?: string }) => {

  const response = await axios.get(`${apiEndPoint}?page=${page ? page : ''}&limit=${limit ? limit : ''}&id=${id ? id : ''}&text=${search ? search : ''}`);
  console.log("re", response)
  const data = (await response.data.records) as DataType;

  return data;
});

/**
 * The add user.
 */
export const addRecord = createAppAsyncThunk(`settingsManagement/${storeName}/addRecord`, async ({ payload }: { payload: SettingType }) => {

  const response = await axios.post(`${apiEndPoint}/add`, payload);
  console.log("r", response)
  const data = (await response.data._doc) as DataType;
  console.log("data", data)
  return data;
});

export const updateRecord = createAppAsyncThunk(`settingsManagement/${storeName}/updateRecord`, async ({ payload, id }: { payload: SettingType, id: string }) => {

  const response = await axios.put(`${apiEndPoint}/update?id=${id}`, payload);

  const data = (await response.data._doc) as DataType;

  return data;
});

const initialState: DataType = {};

/**
 * The setting dashboard widgets slice.
 */
export const dataSlice = createSlice({
  name: `settingsManagement/${storeName}`,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRecords.fulfilled, (state, action) => {

      return {
        ...state,
        ...action.payload,
      };
    });
  },
});

export const selectRecords = (state: AppRootStateType) => state.settingsManagement[storeName];

export type dataSliceType = typeof dataSlice;

export default dataSlice.reducer;