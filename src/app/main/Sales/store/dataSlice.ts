import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootStateType } from 'app/store/types';
import createAppAsyncThunk from 'app/store/createAppAsyncThunk';
import UserManagementTypes from '../types/UserManagementTypes';


type AppRootStateType = RootStateType<dataSliceType>;

type DataType = {
	[key: string]: unknown;
};

const desiredColumns = ['_id', 'name', 'email', 'address', 'phone', 'date'];
export const getUsers = createAppAsyncThunk('UserTablePage/getUsers', async ({ pages, limit }: { pages:string, limit:string, userData: UserManagementTypes["userRecordsType"] }) => {
	try {
		const response = await axios.get(`/api/users?page=${pages}&limit=${limit}`);
		console.log("response", response)
		const records = response.data.records as DataType[];

		const filteredColumns = Object.keys(records[0]).filter((column) => desiredColumns.includes(column));
		const filteredRows = records.map((row) =>
			Object.fromEntries(Object.entries(row).filter(([key]) => desiredColumns.includes(key)))
		);

		const paginationData = {
			page: response.data.page,
			limit: response.data.limit,
			pages: response.data.pages,
			total: response.data.total,
		};

		const data: UserManagementTypes['userRecordsType'] = {
			records: {
				columns: filteredColumns,
				rows: filteredRows,
			},
			pagination: paginationData,
		};

		console.log('Filtered Columns:', filteredColumns);
		console.log('Filtered Rows:', filteredRows);
		console.log('Pagination Data:', paginationData);
		console.log('Received data:', data);

		return data;
	} catch (error) {
		console.error('Error fetching widgets:', error);
		throw error;
	}
});
/**
 * The add user.
 */
export const addUser = createAppAsyncThunk('usertable/addUser', async (userData: UserManagementTypes["userRecordsType"]) => {
	console.log("userData", userData)
	try {
		const response = await axios.post('/api/users/add', userData);
		console.log('response', response);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		const addedUser = response.data.users as DataType;
		console.log('addUser', addedUser);
		return addedUser;
	} catch (error) {
		console.error('Error adding user:', error);
		throw error;
	}
});
/**
 * The update user.
 */
export const EditUser = createAppAsyncThunk(
	'usertable/EditUser',
	async ({ id, userData }: { id: string; userData: UserManagementTypes["userRecordsType"] }) => {
		console.log('userData', userData);
		try {
			const response = await axios.put(`/api/users/update/?id=${id}`, userData);
			console.log('editresponse', response);
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			const updateUser = response.data.user as DataType;
			console.log('updateUser', updateUser);
			return updateUser;
		} catch (error) {
			console.error('Error adding user:', error);
			throw error;
		}
	});
export const getUserById = createAppAsyncThunk(
	'usertable/getUser',
	async ({ id, userData }: { id: string; userData: UserManagementTypes["userRecordsType"] }) => {
		console.log('userData', userData);
		try {
			const response = await axios.get(`/api/users/Users/?id=${id}`, userData);
			console.log('response', response);
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			const getUser = response.data._doc as DataType;
			console.log('getUser', getUser);
			return getUser;
		} catch (error) {
			console.error('Error adding user:', error);
			throw error;
		}
	});
/**
 * The add role.
 */
export const addRole = createAppAsyncThunk('Roles/addRole', async (roleData: UserManagementTypes["roleRecordsType"]) => {
	console.log("roleData", roleData)
	try {
		const response = await axios.post('/api/roles/add', roleData);
		console.log('response', response);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		const addedRole = response.data.roles as DataType;
		console.log('addRole', addedRole);
		return addedRole;
	} catch (error) {
		console.error('Error adding user:', error);
		throw error;
	}
});

export const getRoles = createAppAsyncThunk('Roles/getRoles', async () => {
	try {
		const response = await axios.get('/api/roles');

		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		const records = response.data.records as DataType[];

		const filteredColumns = Object.keys(records[0]).filter((column) => desiredColumns.includes(column));

		const filteredRows = records.map((row) =>
			Object.fromEntries(Object.entries(row).filter(([key]) => desiredColumns.includes(key)))
		);

		// eslint-disable-next-line no-console
		console.log('Filtered Columns:', filteredColumns);
		console.log('Filtered Rows:', filteredRows);

		const roledata: UserManagementTypes["roleRecordsType"] = {
			records: {
				columns: filteredColumns,
				rows: filteredRows,
			},
		};

		// eslint-disable-next-line no-console
		console.log('Received role data:', roledata);
		return roledata;
	} catch (error) {
		console.error('Error fetching widgets:', error);
		throw error;
	}
});
const initialState: {
	userData: UserManagementTypes["userRecordsType"];
	roleData: UserManagementTypes["roleRecordsType"];
} = {
	userData: {
		records: {
			columns: [],
			rows: [],
		},
	},
	roleData: {
		records: {
			columns: [],
			rows: [],
		},
	},
};

/**
 * The User  table widgets slice.
 */
export const dataSlice = createSlice({
	name: 'UserTablePage',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getUsers.fulfilled, (state, action) => {
			state.userData = action.payload;
		});
		builder.addCase(getRoles.fulfilled, (state, action) => {
			state.roleData = action.payload;
		});
		builder.addCase(addUser.fulfilled, (state, action) => {
			const { name, email, address, phone, password } = action.payload;

			// Create a new row using the added user data
			const newRow: UserManagementTypes["userRecordsType"]['records']['rows'][0] = {
				name,
				email,
				address,
				phone,
				password,
			};

			// Update the state by adding the new row to the existing rows in userData
			state.userData.records.rows = [...state.userData.records.rows, newRow];

			// Update the columns in userData
			state.userData.records.columns = Object.keys(newRow);
		});

		builder.addCase(addRole.fulfilled, (state, action) => {
			const { name, permissions } = action.payload;


			const newRow: UserManagementTypes["roleRecordsType"]['records']['rows'][0] = {
				name,
				permissions
			};


			state.roleData.records.rows = [...state.roleData.records.rows, newRow];

			state.roleData.records.columns = Object.keys(newRow);
		});
		builder.addCase(EditUser.fulfilled, (state, action) => {
			const updatedUser = action.payload;
			console.log("updatedUser", updatedUser)
			const index = state.userData.records.rows.findIndex((user) => user._id === updatedUser._id);
			if (index !== -1) {
				state.userData.records.rows = [
					...state.userData.records.rows.slice(0, index),
					updatedUser,
					...state.userData.records.rows.slice(index + 1),
				];
			}
			// Reset loading state
			state.loading = false;
		})
		builder.addCase(getUserById.fulfilled, (state, action) => {

			const id = action.payload;
			console.log('User fetched:', id);
			state.selectedUser = id;
		});


	},
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
export const selectUsersRecords = (state: AppRootStateType) => state.UserManagement?.data.userData;
export const selectRolesRecords = (state: AppRootStateType) => state.UserManagement?.data.roleData;
export type dataSliceType = typeof dataSlice;

export default dataSlice.reducer;
