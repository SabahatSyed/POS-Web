import axios from 'axios';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import { getSystemSettings } from './settingSlice';


/**
 * The DashboardAppHeader component.
 */
function SystemSettingsPage() {
	const [loading, setLoading] = useState(false);
	const defaultValues = {
		api_call_limit_per_day: 0,
		api_call_limit_per_minute: 0
	};

	const schema = yup.object().shape({
		api_call_limit_per_day: yup.string().required('You must enter a value'),
		api_call_limit_per_minute: yup.string().required('You must enter a value')
	});

	const { handleSubmit, register, reset, control, watch, formState, setValue } = useForm({
		defaultValues,
		mode: 'all',
		resolver: yupResolver(schema)
	});
	const { isValid, dirtyFields, errors, touchedFields } = formState;

	const dispatch = useDispatch<any>();

	useEffect(() => {
		const fetchData = async () => {
			try {
				dispatch(getSystemSettings()).then((resp) => {
						setValue('api_call_limit_per_day', resp.payload.setting_json.api_call_limit_per_day);
						setValue('api_call_limit_per_minute', resp.payload.setting_json.api_call_limit_per_minute);
					})
				;
			} catch (error) {
				console.error('Error fetching user data:', error);
			}
		};

		fetchData();
	}, []);

	const onSubmit = async (formData) => {
		setLoading(true);
		try {
			const response = await axios.put('/api/settings/', formData);
			console.log(response);
			dispatch(showMessage({ message: 'Update successful', variant: 'success' }));

			setLoading(false);
		} catch (error) {
			console.error('Error handling form submission:', error);

			// Example: show an error message
			dispatch(showMessage({ message: error?.message || 'Error Updating System Settings', variant: 'error' }));
			setLoading(false);
		}
	};

	const header = (
		<div className="flex w-full container">
			<div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 p-24 md:p-32 pb-0 md:pb-0">
				<div className="flex flex-col flex-auto">
					<Typography className="text-3xl font-semibold tracking-tight leading-8">System Settings</Typography>
					<Typography
						className="font-medium tracking-tight mt-10"
						color="text.secondary"
					>
						Set Default API Limits
					</Typography>
				</div>
			</div>
		</div>
	);

	const formContent = (
		<form
			className="w-full m-20"
			onSubmit={handleSubmit(onSubmit)}
		>
			<div className="grid sm:grid-cols-2 gap-16 gap-y-40 gap-x-12 lg:w-full w-full  lg:ml-10">
				{/* First row */}
				<div className="sm:col-span-1 ">
					<Controller
						render={({ field }) => (
							<TextField
								{...field}
								label="API Limit Per Day"
								type='number'
								variant="outlined"
								className="bg-white"
								error={!!errors.api_call_limit_per_day}
								helperText={errors?.api_call_limit_per_day?.message}
								required
								fullWidth
							/>
						)}
						name="api_call_limit_per_day"
						control={control}
						defaultValue={defaultValues.api_call_limit_per_day} // Add this line
					/>
				</div>

				<div className="sm:col-span-1 ">
					<Controller
						render={({ field }) => (
							<TextField
								{...field}
								label="API Limit Per Minute"
								type='number'
								variant="outlined"
								className=' bg-white'
								error={!!errors.api_call_limit_per_minute}
								helperText={errors?.api_call_limit_per_minute?.message}
								required
								fullWidth
							/>
						)}
						name="api_call_limit_per_minute"
						control={control}
						defaultValue={defaultValues.api_call_limit_per_minute}
					/>
				</div>
			</div>
			<div className="w-full flex items-center justify-end border-t mx-10 my-28">
				<Button
					className={`
					mt-20
					${loading ? 'w-100 pointer-events-none opacity-70' : 'w-auto'}
					`}
					variant="contained"
					color="secondary"
					type="submit"
					disabled={!isValid || loading}
				>
					<div className="flex items-center">
						{loading && (
							<div className="mr-2">
								<CircularProgress
									size={16}
									color="inherit"
								/>
							</div>
						)}
						<span>{loading ? 'Saving...' : 'Update'}</span>
					</div>
				</Button>
			</div>
		</form>
	);

	return (
		<FusePageSimple
			header={header}
			content={formContent}
		/>
	);
}

export default SystemSettingsPage;
