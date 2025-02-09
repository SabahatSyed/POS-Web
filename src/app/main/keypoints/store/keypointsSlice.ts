import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootStateType } from 'app/store/types';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import SettingType from '../types/keypoints';


type AppRootStateType = RootStateType<dataSliceType>;

type DataType = {
  [key: string]: unknown;
};

const storeName = 'keypoints';
const apiEndPoint = '/api/keypoints';

export const getRecords = createAppAsyncThunk(
  `${storeName}/getRecords`,
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
      `${apiEndPoint}?page=${page ? page : ""}&limit=${limit ? limit : ""}&id=${
        id ? id : ""
      }&text=${search ? search : ""}`
    );

    const data = (await response.data) as DataType;
    console.log("data",data);

    return data?.data;
  }
);

/**
 * The add user.
 */
export const addRecord = createAppAsyncThunk(
  `${storeName}/addRecord`,
  async ({ payload }: { payload: SettingType }) => {
    const response = await axios.post(`${apiEndPoint}/`, payload);
    console.log('r', response);
    const data = (await response.data._doc) as DataType;
    console.log('data', data);
    return data;
  },
);

export const updateRecord = createAppAsyncThunk(
  `${storeName}/updateRecord`,
  async ({ payload, id }: { payload: SettingType; id: string }) => {
    const response = await axios.put(`${apiEndPoint}/${id}`, payload);

    const data = (await response.data._doc) as DataType;

    return data;
  },
);

export const deleteRecord = createAppAsyncThunk(
  `company/${storeName}/deleteCompany`,
  async ({ id }: { id: string }) => {
    const response = await axios.delete(`${apiEndPoint}/${id}`);

    const data = (await response.data) as DataType;

    return data;
  }
);

const initialState: DataType = {};

/**
 * The setting dashboard widgets slice.
 */
export const dataSlice = createSlice({
  name: `keypoints`,
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

export const selectRecords = (state: AppRootStateType) => state.keypoints[storeName];

export type dataSliceType = typeof dataSlice;

export default dataSlice.reducer;