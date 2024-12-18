import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useParams, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import _ from '@lodash';

import FormControl from '@mui/material/FormControl';

import FormHelperText from '@mui/material/FormHelperText';

import InputLabel from '@mui/material/InputLabel';

import { addUser, EditUser, getUserById } from '../../store/dataSlice';
import userRecordsType from '../../types/UserManagementTypes';
import { useAppDispatch, useAppSelector } from 'app/store';
import { getRoles, selectRolesRecords, selectUsersRecords } from '../../store/dataSlice';

let renderCount = 0;

const options = [
	{
		value: 'chocolate',
		label: 'Chocolate'
	},
	{
		value: 'strawberry',
		label: 'Strawberry'
	},
	{
		value: 'vanilla',
		label: 'Vanilla'
	}
];

const defaultValues = {
	name: '',
	role: '',
	email: '',
	password: '',
	phone: '',
	address: ''
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	name: yup.string().required('You must enter a value'),
	role: yup.string(),
	email: yup.string().required('You must enter a value'),
	address: yup.string().required('You must enter a value'),
	phone: yup.string().required('You must enter a value'),
	password: yup.string().required('You must enter a value')
});
/**
 * Simple Form Page
 */
function SimpleFormPage() {
	const { handleSubmit, register, reset, control, watch, formState, setValue } = useForm({
		defaultValues,
		mode: 'all',
		resolver: yupResolver(schema)
	});
	const dispatch = useAppDispatch();
	const { userId } = useParams();
	console.log("userId", userId)
	const [editMode, setEditMode] = useState<userRecordsType | undefined>(undefined);;
	console.log("editMode", editMode)
	const roleData = useAppSelector(selectRolesRecords);
	const userData = useAppSelector(selectUsersRecords);
	console.log("roless", roleData)
	useEffect(() => {
		dispatch(getRoles());
	}, [dispatch]);
	useEffect(() => {
		const fetchData = async () => {
			// Fetch user details if in edit mode
			if (userId) {
				try {
					// Use await to wait for the asynchronous dispatch to complete
					const userDetailResponse = await dispatch(getUserById({ id: userId }));

					// Check if user details are fetched successfully
					if (userDetailResponse.payload) {
						// Set editMode based on the fetched user details
						setEditMode(userDetailResponse.payload);
					}
				} catch (error) {
					console.error('Error fetching user details:', error);
				}
			}
		};

		fetchData(); // Invoke the fetchData function directly

		// Cleanup function (no need to return anything specific in this case)
	}, [dispatch, userId, setEditMode]);
	useEffect(() => {
		if (editMode) {
			setValue('name', editMode.name);
			setValue('role', editMode.role);
			setValue('email', editMode.email);
			//setValue('password', editMode.password);
			setValue('phone', editMode.phone);
			setValue('address', editMode.address);
			// Set values for other fields
		}
	}, [editMode, setValue]);
	const { isValid, dirtyFields, errors, touchedFields } = formState;
	const onSelectUser = (selectedUser) => {
		console.log('Selected User:', selectedUser);
		setEditMode(selectedUser);
	};


	const onSubmit = async (formData) => {
		try {
			if (editMode) {
				// Dispatch editUser action with user ID
				await dispatch(EditUser({ id: userId, data: formData }));
			} else {
				// Dispatch addUser action
				await dispatch(addUser(formData));
			}
			// Reset the form after submission
			reset();
		} catch (error) {
			console.error('Error:', error);
		}
	};
	renderCount += 1;

	const data = watch();

	return (
		<div className="flex w-full  justify-start items-start">
			<form
				className="lg:w-11/12 w-11/12  mt-20 lg:ml-40 "
				onSubmit={handleSubmit(onSubmit)}
			>

				<div className="grid sm:grid-cols-2 gap-16 gap-y-40 gap-x-12 lg:w-full w-full  lg:ml-28  ml-28">
					{/* First row */}
					
					<div className="sm:col-span-1">
						<Controller
							render={({ field }) => (
								<FormControl
									error={!!errors.role}
									required
									fullWidth
								>
									<InputLabel htmlFor="role">Ticker</InputLabel>
									<Select
										{...field}
										variant="outlined"
										className=' bg-white'
										//value={watch('role') || ''}
										//onChange={(e) => setValue('role', e.target.value)}
										fullWidth
									>
										<MenuItem value="">Select Role</MenuItem>
										{Array.isArray(roleData.records.rows) && roleData.records.rows.map((role) => (
											<MenuItem
												key={role._id}
												value={role._id}
											>
												{role.name}
											</MenuItem>
										))}
									</Select>
									<FormHelperText>{errors?.role?.message}</FormHelperText>
								</FormControl>
							)}
							name="role"
							control={control}
						/>
					</div>
					<div className="sm:col-span-1  ">
						<Controller
							render={({ field }) => (
								<TextField
									{...field}
									label="Owned Shares"
									variant="outlined"
									className='bg-white'
									error={!!errors.name}
									helperText={errors?.name?.message}
									required
									fullWidth
								/>
							)}
							name="name"
							control={control}
						/>
					</div>

					{/* Second row */}
					 {/* <div className="sm:col-span-1"> 
						<Controller
							render={({ field }) => (
								<TextField
									{...field}
									label="Email"
									variant="outlined"
									className=' bg-white'

									error={!!errors.email}
									helperText={errors?.email?.message}
									required
									fullWidth
								/>
							)}
							name="email"
							// onChange={handleInputChange}
							control={control}
						/>
					</div>
					<div className="sm:col-span-1">
						<Controller
							render={({ field }) => (
								<TextField
									{...field}
									label="password"
									variant="outlined"
									className='bg-white'

									error={!!errors.password}
									helperText={errors?.password?.message}
									required
									fullWidth
								/>
							)}
							name="password"
							// onChange={handleInputChange}
							control={control}
						/>
					</div>

					{/* Third row  
					<div className="sm:col-span-1">
						<Controller
							render={({ field }) => (
								<TextField
									{...field}
									label="address"
									variant="outlined"
									error={!!errors.address}
									helperText={errors?.address?.message}
									required
									className=' bg-white'

									fullWidth
								/>
							)}
							name="address"
							// onChange={handleInputChange}
							control={control}
						/>
					</div>
					<div className="sm:col-span-1">
						<Controller
							render={({ field }) => (
								<TextField
									{...field}
									label="phone"
									variant="outlined"
									error={!!errors.phone}
									helperText={errors?.phone?.message}
									required
									fullWidth
									className=' bg-white'
								/>
							)}
							name="phone"
							// onChange={handleInputChange}
							control={control}
						/>
					</div> */}
				</div>
				
				<div className="flex my-48 items-center justify-end  -mx-8 mt-8 px-8 py-5 ">
					<Button
						className="mx-8 text-black"
						type="button"
						//onClick={handleCancel}
					>
						Close
					</Button>
					<Button
						className="mx-8 bg-[#334155]"
						variant="contained"
						//color="secondary"
						type="submit"
						disabled={_.isEmpty(dirtyFields) || !isValid}
					>
						Submit Query
					</Button>
				</div>
				
			</form>
		</div>
	);
}

export default SimpleFormPage;
