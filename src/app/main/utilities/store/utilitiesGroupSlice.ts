import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootStateType } from "app/store/types";
import createAppAsyncThunk from "app/store/createAppAsyncThunk";

type AppRootStateType = RootStateType<dataSliceType>;

type DataType = {
  [key: string]: unknown;
};

const storeName = "company";
const companyApiEndPoint = "/api/company";
const userApiEndPoint = "/api/user";

export const createCompany = createAppAsyncThunk(
  `${storeName}/createCompany`,
  async ({ payload }: { payload: any }) => {
    const response = await axios.post(`${companyApiEndPoint}/`, payload);
    const data = (await response.data) as DataType;
    return data;
  }
);

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
      `${companyApiEndPoint}?page=${page ? page : ""}&limit=${
        limit ? limit : ""
      }&id=${id ? id : ""}&text=${search ? search : ""}`
    );

    const data = (await response.data) as DataType;
    console.log("response", data);

    return data.data;
  }
);

export const createUser = createAppAsyncThunk(
  `${storeName}/createUser`,
  async ({ payload }: { payload: DataType }) => {
    const response = await axios.post(`${userApiEndPoint}/add`, payload);
    const data = (await response.data) as DataType;
    return data;
  }
);

export const updateCompany = createAppAsyncThunk(
  `${storeName}/updateCompany`,
  async ({ payload, id }: { payload: any; id: string }) => {
    const response = await axios.put(`${companyApiEndPoint}/${id}`, payload);

    const data = (await response.data) as DataType;

    return data;
  }
);

const initialState: DataType = {};

/**
 * The company slice.
 */
export const companySlice = createSlice({
  name: `${storeName}`,
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
    builder.addCase(getRecords.fulfilled, (state, action) => action.payload);

  },
});

export const selectCompany = (state: AppRootStateType) =>
  state.companyinfo[storeName];

export type dataSliceType = typeof companySlice;

export default companySlice.reducer;
