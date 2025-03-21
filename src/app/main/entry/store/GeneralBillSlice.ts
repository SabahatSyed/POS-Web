import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootStateType } from 'app/store/types';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import SettingType from '../types/setting';


type AppRootStateType = RootStateType<dataSliceType>;

type DataType = {
  [key: string]: unknown;
};

const storeName = 'generalBill';
const apiEndPoint = '/api/generalBill';

export const getRecords = createAppAsyncThunk(
  `generalbill/${storeName}/getRecords`,
  async ({
    page,
    limit,
    id,
    search,
  }: {
    page?: number;
    limit?: number;
    id?: string;
    search?: string;
  }) => {
    const response = await axios.get(
      `${apiEndPoint}?page=${page ? page : ''}&limit=${limit ? limit : ''}&id=${
        id ? id : ''
      }&text=${search ? search : ''}`,
    );
    const data = (await response.data.data) as DataType;

    return data;
  },
);

export const getRecordById = createAppAsyncThunk(
  `generalbill/${storeName}/getRecordById`,
  async ({
    id,
  }: {
    id?: string;
  }) => {
    const response = await axios.get(
      `${apiEndPoint}/record?id=${id ? id : ''}`,
    );
    const data = (await response.data.data) as DataType;

    return data;
  },
);

/**
 * The add user.
 */
export const addRecord = createAppAsyncThunk(
  `generalbill/${storeName}/addRecord`,
  async ({ payload }: { payload: SettingType }) => {
    const response = await axios.post(`${apiEndPoint}/`, payload);
    const data = (await response.data._doc) as DataType;
    return data;
  },
);

export const updateRecord = createAppAsyncThunk(
  `generalbill/${storeName}/updateRecord`,
  async ({ payload, id }: { payload: SettingType; id: string }) => {
    const response = await axios.put(`${apiEndPoint}/${id}`, payload);

    const data = (await response.data._doc) as DataType;

    return data;
  },
);

const initialState: DataType = {};

/**
 * The setting dashboard widgets slice.
 */
export const dataSlice = createSlice({
  name: `generalbill/${storeName}`,
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

export const selectRecords = (state: AppRootStateType) => state.generalbill[storeName];

export type dataSliceType = typeof dataSlice;

export default dataSlice.reducer;