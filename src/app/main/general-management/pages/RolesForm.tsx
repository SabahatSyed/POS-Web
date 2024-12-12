import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import _ from '@lodash';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { DateTimePicker } from '@mui/x-date-pickers';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import InputLabel from '@mui/material/InputLabel';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
// import { addRole } from '../store/dataSlice';
// import { PermissionData } from '../Permissions'
import { useAuth } from '../../../auth/AuthContext';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import CircularProgress from '@mui/material/CircularProgress';
import { addRecord, getRecords , updateRecord } from '../store/roleDataSlice';
import { Role } from '../types/dataTypes';
import { showMessage } from 'app/store/fuse/messageSlice';


/**
 * RolesFormPage
 */
function RolesFormPage() {

	/**
	 * Form Validation Schema
	 */

	const title = 'Role';

	const defaultValues = {
		name: '',
		role: 'Admin',
		permissions: [],
		// DateTimePicker: '',
	};

	const schema = yup.object().shape({
		name: yup.string().required('You must enter a value'),
		role: yup.string().required('You must select a value'),
		// DateTimePicker: yup.string().nullable().required('You must select a date'),
		permissions: yup
			.array()
			.of(yup.string()),
	});

	const { handleSubmit, register, reset, control, watch, formState, setValue } = useForm({
		defaultValues,
		mode: 'all',
		resolver: yupResolver(schema)
	});

	const { id } = useParams();

	const dispatch = useDispatch<any>()
	const [rowData, setRowData] = useState<Role | undefined>(undefined);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const { isValid, dirtyFields, errors, touchedFields } = formState;

	const [selectedRole, setSelectedRole] = useState('Admin');

	const onSubmit = async (formData: Role) => {
		
		try {
			setLoading(true);
		  	if (id) {
				await dispatch(updateRecord({ id, payload: formData }))
				.then((resp: any) => {
					console.log(resp);
					if (resp.error) {
						dispatch(showMessage({ message: resp.error.message, variant: 'error' }));
					}
					else {
						dispatch(showMessage({ message: 'Success', variant: 'success' }));
					}
				});

			} else {
				await dispatch(addRecord({ payload: formData }))
				.then((resp: any) => {
					if (resp.error) {
						dispatch(showMessage({ message: resp.error.message, variant: 'error' }));
					}
					else {
						dispatch(showMessage({ message: 'Success', variant: 'success' }));
					}
				});;
			}
			
			setLoading(false);
		
		} catch (error) {
		  	console.error('Error handling form submission:', error);
			dispatch(showMessage({ message: error?.message, variant: 'error' }));
			setLoading(false);
		}
	};

	const handleCancel = () => {
        navigate(-1);
    };

	useEffect(() => {
		if (id) {
		
		  const fetchData = async () => {
			try {
			  const response = await dispatch(getRecords({ id }));
			  if (response.payload.records.length > 0) {
				
				const data = response.payload.records[0];
				setRowData(data);

				for (const field in schema.fields) {
					const fieldName: any = field;
					setValue(fieldName, data[fieldName]);
				}
				  }
			 
			} catch (error) {
			  console.error('Error fetching role data:', error);
			}
		  };
	  
		  fetchData();
		}
	}, [dispatch, id ]);

	const PermissionData = {
		'Admin': [
			{
				name: 'Manage Pipelines'
			},
			{
				name: 'Manage Settings'
			}
		],
		'Agent': [
			{
				name: 'Generate Termsheet'
			},
		],
		'Customer': [
			{
				name: 'Able to download termsheet'
			},
		]
	};

	const handleCheckboxChange = (name: string) => {
		console.log('Checking', data);

		// Check if the permission is already in the array
		const hasPermission = data.permissions.includes(name);

		// If the permission is selected, remove it; otherwise, add it
		const updatedPermissions = hasPermission
			? data.permissions.filter((p) => p !== name)
			: [...data.permissions, name];

		// Update the form state
		setValue('permissions', updatedPermissions, {
			shouldValidate: true, // trigger validation
			shouldTouch: true, // update touched fields form state
			shouldDirty: true, // update dirty and dirty fields form state
		});
	};

	const data = watch();

	const formContent = (
		<form
			className="w-full"
			onSubmit={handleSubmit(onSubmit)}
		>

			<div className="grid sm:grid-cols-1 gap-16 gap-y-40 gap-x-12 w-full">
				{/* First row */}
				<div className="sm:col-span-1 ">
					<Controller
						render={({ field }) => (
							<TextField
								{...field}
								label="Name"
								variant="outlined"
								className=' bg-white'
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
				{/* First row */}
				<div className="sm:col-span-1 ">
					<Controller
						render={({ field }) => (

							<TextField
								{...field}
								select
								label="Role"
								variant="outlined"
								className=' bg-white'
								error={!!errors.name}
								helperText={errors?.name?.message}
								required
								fullWidth
								onChange={(event) => {
									if (data.role !== event.target.value ) {
										setSelectedRole(event.target.value);
										field.onChange(event.target.value);
	
										setValue('permissions', [], {
											shouldValidate: true, // trigger validation
											shouldTouch: true, // update touched fields form state
											shouldDirty: true, // update dirty and dirty fields form state
										});
									}
								}}
								value={selectedRole}
							>
								<MenuItem value={'Admin'}>Admin</MenuItem>
								<MenuItem value={'Agent'}>Agent</MenuItem>
								<MenuItem value={'Customer'}>Customer</MenuItem>

							</TextField>
						)}
						name="role"
						control={control}
					/>
				</div>
				<div className="sm:col-span-1">
				
					{/* <Controller
						name="DateTimePicker"
						control={control}
						render={({ field: { onChange, value } }) => (
							<DateTimePicker
								value={new Date(value)}
								onChange={onChange}
								slotProps={{
									textField: {
										id: 'Date',
										label: 'Date',
										className: 'bg-white',
										InputLabelProps: {
											shrink: true
										},
										fullWidth: true,
										variant: 'outlined',
										error: !!errors.DateTimePicker,
										helperText: errors?.DateTimePicker?.message,
										
									},
									inputAdornment: {
										position: 'start',
										children: <FuseSvgIcon size={20}>heroicons-solid:cake</FuseSvgIcon>
									}
								}}
							/>
						)}
					/> */}
				</div>
			</div>

			<div className="flex flex-col flex-auto">
					{/* <Typography className="text-3xl font-semibold tracking-tight leading-8">
						{title}
					</Typography> */}
					<Typography
						className="font-medium tracking-tight"
						color="text.secondary"
					>
						Manage Permissions
					</Typography>
				</div>

			<div className="grid sm:grid-cols-2 gap-16 w-full mt-32 mx-16">
				{PermissionData[selectedRole].map((permission) => (
					<div key={permission.name} className="sm:col-span-1 w-full">
						<FormControlLabel
							label={permission.name}
							className="bg-white w-full border border-neutral-300 gap-2"
							control={
								<Checkbox
									className='text-primary'
									checked={data.permissions && data.permissions.includes(permission.name)}
									style={{ color: 'primary' }}
									onChange={() => handleCheckboxChange(permission.name)}
								/>
							}
						/>
					</div>
				))}
			</div>

			<div className="flex my-48 items-center justify-end border-t mx-8 mt-32 px-8 py-5">
				<Button
					className="mx-8 text-black"
					type="button"
					onClick={handleCancel}
				>
					Cancel
				</Button>
				<Button
					variant="contained"
					color="secondary"
					type="submit"
					disabled={ !isValid || loading}
					>
					<div className="flex items-center">
						Save
						{loading && (
							<div className="ml-8 mt-2">
								<CircularProgress size={16} color="inherit" />
							</div>
						)}
					</div>
				</Button>
			</div>
		</form>
	);

	const header = (
		<div className="flex w-full container">
			<div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 p-24 md:p-32 pb-0 md:pb-0">
				<div className="flex flex-col flex-auto">
					<Typography className="text-3xl font-semibold tracking-tight leading-8">
						{title}
					</Typography>
					<Typography
						className="font-medium tracking-tight"
						color="text.secondary"
					>
						Keep track of your data
					</Typography>
				</div>
				<div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
					<Button
						className="whitespace-nowrap"
						color="secondary"
						// startIcon={<FuseSvgIcon size={20}>heroicons-solid:close</FuseSvgIcon>}
						onClick={handleCancel}
					>
						Close
					</Button>
				</div>
			</div>
		</div>
	);	

	const content = (
		<div className="w-full px-24 md:px-32 pb-24">
			{useMemo(() => {
				const container = {
					show: {
						transition: {
							staggerChildren: 0.06
						}
					}
				};

				const item = {
					hidden: { opacity: 0, y: 20 },
					show: { opacity: 1, y: 0 }
				};

				return (
					!_.isEmpty(data) && (
						<motion.div
							className="w-full"
							variants={container}
							initial="hidden"
							animate="show"
						>

							<div className="grid grid-cols-1 xl:grid-cols-3 gap-32 w-full mt-32">
								<motion.div
									variants={item}
									className="xl:col-span-2 flex flex-col flex-auto"
								>
									{/* form content here */}

									{formContent}

								</motion.div>

							</div>
						</motion.div>
					)
				);
			}, [data])}
		</div>
	);

	return (
		<FusePageSimple
			header={header}
			content={content}
		/>
	);

}

export default RolesFormPage;