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

//import { addUser, EditUser, getUserById } from '../../store/dataSlice';
//import userRecordsType from '../../types/UserManagementTypes';
import { useAppDispatch, useAppSelector } from 'app/store';
import { Box } from '@mui/system';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Autocomplete, Avatar, Checkbox, IconButton } from '@mui/material';

let renderCount = 0;


const defaultValues = {
	name: '',
	image: '',
	members: [],
};

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	name: yup.string().required('You must enter a value'),
	image: yup.string(),
	members: yup.array().of(yup.string().required()),
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
	useEffect(() => {
		//dispatch(getUsers());
	}, [dispatch]);
	const { isValid, dirtyFields, errors, touchedFields } = formState;


	const onSubmit = async (formData) => {
		try {
				// Dispatch addUser action
				//await dispatch(addUser(formData));
		
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

				<div className="grid sm:grid-cols-1 gap-16 gap-y-40 gap-x-12 lg:w-full w-full  lg:ml-28  ml-28">
					{/* First row */}
					<div className='sm:col-span-1 '>
					<Controller
							control={control}
							name="image"
							render={({ field: { onChange, value } }) => (
								<Box
									sx={{
										borderWidth: 4,
										borderStyle: 'solid',
										borderColor: 'background.paper'
									}}
									className="relative flex items-center justify-center w-128 h-128 rounded-full overflow-hidden"
								>
									<div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
									<div className="absolute inset-0 flex items-center justify-center z-20">
										<div>
											<label
												htmlFor="image"
												className="flex p-8 cursor-pointer"
											>
												<input
													accept="image/*"
													className="hidden"
													id="image"
													type="file"
													onChange={async (e) => {
														function readFileAsync() {
															return new Promise((resolve, reject) => {
																const file = e?.target?.files?.[0];
																if (!file) {
																	return;
																}
																const reader: FileReader = new FileReader();

																reader.onload = () => {
																	if (typeof reader.result === 'string') {
																		resolve(
																			`data:${file.type};base64,${btoa(
																				reader.result
																			)}`
																		);
																	} else {
																		reject(
																			new Error(
																				'File reading did not result in a string.'
																			)
																		);
																	}
																};

																reader.onerror = reject;

																reader.readAsBinaryString(file);
															});
														}

														const newImage = await readFileAsync();

														onChange(newImage);
													}}
												/>
												<FuseSvgIcon className="text-white">
													heroicons-outline:camera
												</FuseSvgIcon>
											</label>
										</div>
										<div>
											<IconButton
												onClick={() => {
													onChange('');
												}}
											>
												<FuseSvgIcon className="text-white">heroicons-solid:trash</FuseSvgIcon>
											</IconButton>
										</div>
									</div>
									<Avatar
										sx={{
											backgroundColor: 'background.default',
											color: 'text.secondary'
										}}
										className="object-cover w-full h-full text-64 font-bold"
										src={value}
									>
									</Avatar>
								</Box>
							)}
						/>
					</div>
					<div className="sm:col-span-1">
					<Controller
					control={control}
					name="members"
					render={({ field: { onChange, value } }) => (
						<Autocomplete
							multiple
							id="members"
							className="mt-32"
							options={[{id:"hello",name:"gu"},{id:'67890',name:"hi"}] || []}
							disableCloseOnSelect
							getOptionLabel={(option) => option.name}
							renderOption={(_props, option, { selected }) => (
								<li {..._props}>
									<Checkbox
										style={{ marginRight: 8 }}
										checked={selected}
									/>
									{option.name}
								</li>
							)}
							value={value ? (value.map((id) => _.find([{id:"hello",name:"gu"},{id:'67890',name:"hi"}], { id }))) : ([])}
							onChange={(event, newValue) => {
								onChange(newValue.map((item) => item.id));
							}}
							fullWidth
							renderInput={(params) => (
								<TextField
									{...params}
									label="Tags"
									placeholder="Tags"
								/>
							)}
						/>
					)}
				/>

					</div>
					<div className="sm:col-span-1  ">
						<Controller
							render={({ field }) => (
								<TextField
									{...field}
									label="Channel Name"
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
