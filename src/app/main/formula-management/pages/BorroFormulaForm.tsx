

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
import CircularProgress from '@mui/material/CircularProgress';
import { yupResolver } from '@hookform/resolvers/yup';
import _ from '@lodash';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { DateTimePicker } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers';
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
import moment from 'moment';
import { addRecord, getRecords, updateRecord } from '../store/borroFormulaDataSlice';
import { BorroFormula } from '../types/dataTypes';
import { useAppSelector } from 'app/store';
import { useDebounce } from '@fuse/hooks';
import DropdownWidget from 'app/shared-components/DropdownWidget';
import { showMessage } from 'app/store/fuse/messageSlice';


/**
 * BorroFormulaFormPage
 */
function BorroFormulaFormPage() {

	/**
	 * Form Validation Schema
	 */

	const title = 'Borro Formula';

	const defaultValues = {
		min_days: '',
		max_days: '',
		ltv_multiplier: '',
		ir_multiplier: '',
		term_table: '',
		term_multiplier: '',
	};

	const schema = yup.object().shape({
		min_days: yup.string().required('You must enter a value'),
		max_days: yup.string().required('You must enter a value'),
		ltv_multiplier: yup.string().required('You must enter a value'),
		ir_multiplier: yup.string().required('You must enter a value'),
		term_table: yup.string().required('You must enter a value'),
		term_multiplier: yup.string().required('You must enter a value'),
	});

	const { handleSubmit, register, reset, control, watch, formState, setValue } = useForm({
		defaultValues,
		mode: 'all',
		resolver: yupResolver(schema)
	});

	const { id } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch<any>()
	const [rowData, setRowData] = useState<BorroFormula | undefined>(undefined);
	const [loading, setLoading] = useState(false);
	const { isValid, dirtyFields, errors, touchedFields } = formState;

	const onSubmit = async (formData: BorroFormula) => {

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
						console.log(resp);
						if (resp.error) {
							dispatch(showMessage({ message: resp.error.message, variant: 'error' }));
						}
						else {
							dispatch(showMessage({ message: 'Success', variant: 'success' }));
						}
					});
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
					console.error('Error fetching data:', error);
				}
			};

			fetchData();
		}
	}, [dispatch, id]);

	const data = watch();

	const formContent = (
		<form
			className="w-full"
			onSubmit={handleSubmit(onSubmit)}
		>

			<div className="grid sm:grid-cols-2 gap-16 gap-y-40 gap-x-12 lg:w-full w-full  lg:ml-10">

				<div className="sm:col-span-1 ">
					<Controller
						render={({ field }) => (
							<TextField
								{...field}
								label="From Days"
								variant="outlined"
								className='bg-white'
								error={!!errors.min_days}
								helperText={errors?.min_days?.message}
								required
								fullWidth
							/>
						)}
						name="min_days"
						control={control}
					/>
				</div>

				<div className="sm:col-span-1 ">
					<Controller
						render={({ field }) => (
							<TextField
								{...field}
								label="To Days"
								variant="outlined"
								className='bg-white'
								error={!!errors.max_days}
								helperText={errors?.max_days?.message}
								required
								fullWidth
							/>
						)}
						name="max_days"
						control={control}
					/>
				</div>

				<div className="sm:col-span-1 ">
					<Controller
						render={({ field }) => (
							<TextField
								{...field}
								label="Estimated LTV (%)"
								variant="outlined"
								className='bg-white'
								error={!!errors.ltv_multiplier}
								helperText={errors?.ltv_multiplier?.message}
								required
								fullWidth
							/>
						)}
						name="ltv_multiplier"
						control={control}
					/>
				</div>

				<div className="sm:col-span-1 ">
					<Controller
						render={({ field }) => (
							<TextField
								{...field}
								label="Estimated Interest (%)"
								variant="outlined"
								className='bg-white'
								error={!!errors.ir_multiplier}
								helperText={errors?.ir_multiplier?.message}
								required
								fullWidth
							/>
						)}
						name="ir_multiplier"
						control={control}
					/>
				</div>

				<div className="sm:col-span-1 ">
					<Controller
						render={({ field }) => (
							<TextField
								{...field}
								label="Term Length"
								variant="outlined"
								className='bg-white'
								error={!!errors.term_table}
								helperText={errors?.term_table?.message}
								required
								fullWidth
							/>
						)}
						name="term_table"
						control={control}
					/>
				</div>

				<div className="sm:col-span-1 ">
					<Controller
						render={({ field }) => (
							<TextField
								{...field}
								label="Term Multiplier (%)"
								variant="outlined"
								className='bg-white'
								error={!!errors.term_multiplier}
								helperText={errors?.term_multiplier?.message}
								required
								fullWidth
							/>
						)}
						name="term_multiplier"
						control={control}
					/>
				</div>

				
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
					disabled={!isValid || loading}
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
						// startIcon={<FuseSvgIcon size={20}>heroicons-solid:cross</FuseSvgIcon>}
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

export default BorroFormulaFormPage;