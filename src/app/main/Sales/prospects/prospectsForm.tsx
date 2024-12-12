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
import clsx from 'clsx';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { DateTimePicker } from '@mui/x-date-pickers';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import InputLabel from '@mui/material/InputLabel';
import userService from '../../../../authusers/services/userservices';
import { useDispatch } from 'react-redux';
import { addRole } from '../store/dataSlice';
import { PermissionData } from '../Permissions'
import { useAuth } from '../../../auth/AuthContext';

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
	Checkbox: false,
	permissions: [],


};

/**
 * Form Validation Schema
 */

const schema = yup.object().shape({
	name: yup.string().required('You must enter a value'),
	Checkbox: yup.boolean(),
	permissions: yup
		.array()
		.of(yup.string()),

});
/**
 * Simple role Page
 */
function RoleForm() {
	const { handleSubmit, register, reset, control, watch, formState } = useForm({
		defaultValues,
		mode: 'all',
		resolver: yupResolver(schema)
	});
	const dispatch = useDispatch();

	const { isValid, dirtyFields, errors, touchedFields } = formState;
	const onSubmit = async (formData: typeof defaultValues) => {
		console.log("formData", formData)
		try {

			await dispatch(addRole(formData));


		} catch (error) {

			console.error('Error adding role:', error);
		}
	};
	const handleCheckboxChange = (permissionName) => {
		// Check if the permission is already in the array
		const hasPermission = data.permissions.includes(permissionName);

		// If the permission is selected, remove it; otherwise, add it
		const updatedPermissions = hasPermission
			? data.permissions.filter((p) => p !== permissionName)
			: [...data.permissions, permissionName];

		// Update the form state
		reset({ ...data, permissions: updatedPermissions });
	};

	renderCount += 1;

	const data = watch();
	return (
		<div className="flex w-11/12  justify-start items-start">
			<form
				className="w-full  mt-20 ml-40 "
				onSubmit={handleSubmit(onSubmit)}
			>
				<Typography className="mb-24 text-heading text-2xl   "> Add Role</Typography>
				<div className="mt-40 mb-10">
					<Typography className="mb-4 font-medium text-14">Basic information</Typography>
					<Typography className="mb-4 font-medium text-14">
						Assign specific roles to users, enabling them to perform designated tasks within the system.
					</Typography>
				</div>
				<div className="grid sm:grid-cols-1 gap-16 gap-y-40 gap-x-12 w-full mt-32 ml-10">
					{/* First row */}
					<div className="sm:col-span-1 ">
						<Controller
							render={({ field }) => (
								<TextField
									{...field}
									label="Role"
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
				</div>
				<div className="grid sm:grid-cols-2 gap-16 gap-y-40 gap-x-12 w-full mt-32 ml-10">
					{PermissionData.map((permission) => (
						<div key={permission.name} className="sm:col-span-1 w-full">
							<FormControlLabel
								label={permission.name}
								className="bg-white w-full border border-neutral-300 gap-2"
								control={
									<Checkbox
										className='text-red-500'
										checked={data.permissions.includes(permission.name)}
										style={{ color: 'red' }}
										onChange={() => handleCheckboxChange(permission.name)}
									/>
								}
							/>
						</div>
					))}
				</div>



				<div className="flex my-48 items-center justify-end border-t -mx-8 mt-8 px-8 py-5 ">
					<Button
						className="mx-8 text-black"
						type="button"
					//onClick={handleCancel}
					>
						Cancel
					</Button>
					<Button
						className="mx-8"
						variant="contained"
						color="secondary"
						type="submit"
					// disabled={_.isEmpty(dirtyFields) || !isValid}
					>
						Save
					</Button>
				</div>
			</form>
		</div>
	);
}

export default RoleForm;