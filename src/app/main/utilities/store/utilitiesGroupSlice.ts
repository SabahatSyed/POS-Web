import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootStateType } from 'app/store/types';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';

type AppRootStateType = RootStateType<dataSliceType>;

type DataType = {
  [key: string]: unknown;
};

const storeName = 'company';
const companyApiEndPoint = '/api/company';
const userApiEndPoint = '/api/user';

export const createCompany = createAppAsyncThunk(
  `company/${storeName}/createCompany`,
  async ({ payload }: { payload: any }) => {
    const response = await axios.post(`${companyApiEndPoint}/`, payload);
    const data = (await response.data) as DataType;
    return data;
  },
);

export const createUser = createAppAsyncThunk(
  `company/${storeName}/createUser`,
  async ({ payload }: { payload: DataType }) => {
    const response = await axios.post(`${userApiEndPoint}/add`, payload);
    const data = (await response.data) as DataType;
    return data;
  },
);

const initialState: DataType = {};

/**
 * The company slice.
 */
export const companySlice = createSlice({
  name: `company/${storeName}`,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createCompany.fulfilled, (state, action) => {
      return {
        ...state,
        company: action.payload,
      };
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      return {
        ...state,
        user: action.payload,
      };
    });
  },
});

export const selectCompany = (state: AppRootStateType) => state.company[storeName];

export type dataSliceType = typeof companySlice;

export default companySlice.reducer;