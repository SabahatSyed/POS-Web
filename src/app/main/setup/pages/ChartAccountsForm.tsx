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
import React, { useCallback, useEffect, useState } from 'react';
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
import {
  addRecord,
  getRecords,
  updateRecord,
  selectRecords,
} from '../store/chartOfAccountSlice';
import { User } from '../../general-management/types/dataTypes';
import { getRecords as getRolesRecords } from '../../general-management/store/roleDataSlice'; 
import { getRecords as getMainGroupRecords } from '../store/mainGroupSlice';

import { useAppDispatch, useAppSelector } from 'app/store';
import { useDebounce } from '@fuse/hooks';
import DropdownWidget from 'app/shared-components/DropdownWidget';
import { showMessage } from 'app/store/fuse/messageSlice';


/**
 * UsersFormPage
 */
function UsersFormPage() {

	/**
	 * Form Validation Schema
	 */
	const { id } = useParams();

  const records = useAppSelector(selectRecords);
  const dispatch = useAppDispatch();
  // Find the highest existing code and increment it
  const getNextCode = useCallback(() => {
    if (records) {
      console.log(records);
      if (records?.records?.length === 0) return "0001"; // Start from "0001" if no records exist
      const lastCode = records.records
        ?.map((record) => parseInt(record.code, 10))
        ?.filter((num) => !isNaN(num))
        ?.sort((a, b) => b - a)[0]; // Get the highest existing code
      return String(lastCode + 1).padStart(4, "0"); // Increment and pad to 4 digits
    }
  }, [records]);

  useEffect(() => {
    const params = { page: 1, limit: 10, search: "" };
    dispatch(getRecords(params));
  }, [dispatch, getRecords]);
  
  useEffect(() => {
    if (!id) {
      setValue("code", getNextCode()); // Auto-set the code on form load
    }
  }, [records, id]);

	const title = 'Chart of Accounts';

	const defaultValues = {
		mainGroup: '',
		code: '',
		description: '',
		cnic:'',
		phone:'',
		mobile:'',
		balanceBF:'',
		creditLimit:'',
		address:'',
		TPB:'',
		NTN:'',
		STRN:''
	};

	const schema = yup.object().shape({
		mainGroup: yup.string().required('You must enter a value'),
		code: yup.string().required('You must enter a value'),
		description: yup.string().required('You must enter a value'),
		cnic: yup.string().required('You must enter a value'),
		phone: yup.string().required('You must enter a value'),
		mobile: yup.string().required('You must enter a value'),
		balanceBF: yup.string().required('You must enter a value'),
		creditLimit: yup.string().required('You must enter a value'),
		address: yup.string().required('You must enter a value'),
		TPB: yup.string().required('You must enter a value'),
		NTN: yup.string().required('You must enter a value'),
		STRN: yup.string().required('You must enter a value')
	});

	const { handleSubmit, register, reset, control, watch, formState, setValue } = useForm({
		defaultValues,
		mode: 'all',
		resolver: yupResolver(schema)
	});

	const navigate = useNavigate();
	const [rowData, setRowData] = useState<{} | undefined>(undefined);
	const [loading, setLoading] = useState(false);
	const { isValid, dirtyFields, errors, touchedFields } = formState;
  const [mainGroupOptions, setMainGroupOptions] = useState([]);

	const onSubmit = async (formData: any) => {

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
              reset()
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
              reset()
						}
					});
			}
			setLoading(false);
      navigate(-1)

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
	}, [dispatch, id]);

  useEffect(()=>{
    const fetchMainGroupsData = async () => {
      try {
        const response = await dispatch(getMainGroupRecords({limit: 100}));
        console.log(response);
        if (response.payload.records.length > 0) {
          const data = response.payload.records;
          const options = data.map((item: any) => ({
            name:  `${item.code}: (${item.description})`,
            value: item._id,
          }));
          setMainGroupOptions(options);
        }
      } catch (error) {
        console.error('Error fetching role data:', error);
      }
    };
    fetchMainGroupsData();
  },[])

	const data = watch();

	const formContent = (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid sm:grid-cols-2 gap-16 gap-y-40 gap-x-12 lg:w-full w-full  lg:ml-10">
        {/* First row */}
        <div className="sm:col-span-1 ">
          <Controller
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Main Group"
                variant="outlined"
                className=" bg-white"
                error={!!errors.mainGroup}
                helperText={errors?.mainGroup?.message}
                required
                fullWidth
              >
                {
                  mainGroupOptions.map((option: any) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.name}
                    </MenuItem>
                  ))
                }
              </TextField>
            )}
            name="mainGroup"
            control={control}
          />
        </div>
        <div className="sm:col-span-1 ">
          <Controller
            render={({ field }) => (
              <TextField
                {...field}
                label="Code"
                variant="outlined"
                className="bg-white"
                error={!!errors.code}
                helperText={errors?.code?.message}
                required
                fullWidth
                disabled={true}
              />
            )}
            name="code"
            control={control}
          />
        </div>

        <div className="sm:col-span-1 ">
          <Controller
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                variant="outlined"
                className="bg-white"
                error={!!errors.description}
                helperText={errors?.description?.message}
                required
                fullWidth
              />
            )}
            name="description"
            control={control}
          />
        </div>

        <div className="sm:col-span-1 ">
          <Controller
            render={({ field }) => (
              <TextField
                {...field}
                label="CNIC"
                variant="outlined"
                className="bg-white"
                error={!!errors.cnic}
                helperText={errors?.cnic?.message}
                required
                fullWidth
              />
            )}
            name="cnic"
            control={control}
          />
        </div>

        <div className="sm:col-span-1 ">
          <Controller
            render={({ field }) => (
              <TextField
                {...field}
                label="Phone"
                variant="outlined"
                className="bg-white"
                error={!!errors.phone}
                helperText={errors?.phone?.message}
                required
                fullWidth
              />
            )}
            name="phone"
            control={control}
          />
        </div>

        <div className="sm:col-span-1 ">
          <Controller
            render={({ field }) => (
              <TextField
                {...field}
                label="Mobile"
                variant="outlined"
                className="bg-white"
                error={!!errors.mobile}
                helperText={errors?.mobile?.message}
                required
                fullWidth
              />
            )}
            name="mobile"
            control={control}
          />
        </div>

        <div className="sm:col-span-1 ">
          <Controller
            render={({ field }) => (
              <TextField
                {...field}
                label="Bal B/F"
                variant="outlined"
                className="bg-white"
                error={!!errors.balanceBF}
                helperText={errors?.balanceBF?.message}
                required
                fullWidth
              />
            )}
            name="balanceBF"
            control={control}
          />
        </div>

        <div className="sm:col-span-1 ">
          <Controller
            render={({ field }) => (
              <TextField
                {...field}
                label="CR Limit"
                variant="outlined"
                className="bg-white"
                error={!!errors.creditLimit}
                helperText={errors?.creditLimit?.message}
                required
                fullWidth
              />
            )}
            name="creditLimit"
            control={control}
          />
        </div>

        <div className="sm:col-span-1 ">
          <Controller
            render={({ field }) => (
              <TextField
                {...field}
                label="Address"
                variant="outlined"
                className="bg-white"
                error={!!errors.address}
                helperText={errors?.address?.message}
                required
                fullWidth
              />
            )}
            name="address"
            control={control}
          />
        </div>

        <div className="sm:col-span-1 ">
          <Controller
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="T/P/B"
                variant="outlined"
                className=" bg-white"
                error={!!errors.TPB}
                helperText={errors?.TPB?.message}
                required
                fullWidth
              >
                <MenuItem value={'T'}>T</MenuItem>
                <MenuItem value={'P'}>P</MenuItem>
                <MenuItem value={'B'}>B</MenuItem>
              </TextField>
            )}
            name="TPB"
            control={control}
          />
        </div>

        <div className="sm:col-span-1 ">
          <Controller
            render={({ field }) => (
              <TextField
                {...field}
                label="NTN"
                variant="outlined"
                className="bg-white"
                error={!!errors.NTN}
                helperText={errors?.NTN?.message}
                required
                fullWidth
              />
            )}
            name="NTN"
            control={control}
          />
        </div>

        <div className="sm:col-span-1 ">
          <Controller
            render={({ field }) => (
              <TextField
                {...field}
                label="STRN"
                variant="outlined"
                className="bg-white"
                error={!!errors.STRN}
                helperText={errors?.STRN?.message}
                required
                fullWidth
              />
            )}
            name="STRN"
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

export default UsersFormPage;