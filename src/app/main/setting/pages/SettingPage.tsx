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
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import PhoneInput from 'react-phone-input-2'
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
// import { useAuth } from '../../../auth/AuthContext';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { useAppDispatch, useAppSelector } from 'app/store';
import { selectRecords, getRecords, addRecord, updateRecord } from '../store/settingSlice';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector } from 'react-redux';
// import { SettingType } from '../types/setting';
import { showMessage } from 'app/store/fuse/messageSlice';
import SettingType from '../types/setting';

/**
 * SettingsFormPage
 */
function SettingPage() {

    /**
     * Form Validation Schema
     */

    const title = 'Settings';

    const defaultValues = {
        CompanyRates: '',
        DocumentationCharges: '',
        LegacySplitShare: '',
    };

    const schema = yup.object().shape({
        CompanyRates: yup.string().required('You must enter a value'),
        DocumentationCharges: yup.string().required('You must enter a value'),
        LegacySplitShare: yup.string().required('You must enter a value'),
    });


    const { handleSubmit, register, reset, control, watch, formState, setValue } = useForm({
        defaultValues,
        mode: 'all',
        resolver: yupResolver(schema)
    });


    const dispatch = useDispatch<any>()

    const id = "6584060d5629146b7c120c87";
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { isValid, dirtyFields, errors, touchedFields } = formState;

    const [isUpdate, setIsUpdate] = useState(false);
    const records = useAppSelector(selectRecords);


    console.log(records);

    const handleCancel = () => {
        navigate(-1);
    };
    useEffect(() => {

        dispatch(getRecords({ id: id }));
    }, [dispatch, id]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (records) {

                    const firstRecord: {
                        CompanyRates?: string;
                        DocumentationCharges?: string;
                        LegacySplitShare?: string;
                    } = records[0];

                    setValue('CompanyRates', firstRecord.CompanyRates || '');
                    setValue('DocumentationCharges', firstRecord.DocumentationCharges || '');
                    setValue('LegacySplitShare', firstRecord.LegacySplitShare || '');
                    setIsUpdate(!!firstRecord);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, [records, setValue]);

    const onSubmit = async (formData: SettingType) => {
        try {
            setLoading(true);

            let response;

            if (isUpdate) {

                response = await dispatch(updateRecord({ id, payload: formData }))
            } else {

                response = await dispatch(addRecord({ payload: formData }));
            }


            console.log('API Response:', response.payload);


            dispatch(showMessage({ message: 'Operation successful', variant: 'success' }));

            setLoading(false);
        } catch (error) {
            console.error('Error handling form submission:', error);


            dispatch(showMessage({ message: error?.message || 'Error processing operation', variant: 'error' }));

            setLoading(false);
        }
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
                                label="CompanyRates"
                                variant="outlined"
                                className=' bg-white'
                                error={!!errors.CompanyRates}
                                helperText={errors?.CompanyRates?.message}
                                required
                                fullWidth
                            />
                        )}
                        name="CompanyRates"
                        control={control}
                    />
                </div>

                <div className="sm:col-span-1 ">
                    <Controller
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="DocumentationCharges"
                                variant="outlined"
                                className=' bg-white'
                                error={!!errors.DocumentationCharges}
                                helperText={errors?.DocumentationCharges?.message}
                                required
                                fullWidth
                            />
                        )}
                        name="DocumentationCharges"
                        control={control}
                    />
                </div>
                <div className="sm:col-span-1 ">
                    <Controller
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="LegacySplitShare"
                                variant="outlined"
                                className=' bg-white'
                                error={!!errors.DocumentationCharges}
                                helperText={errors?.DocumentationCharges?.message}
                                required
                                fullWidth
                            />
                        )}
                        name="LegacySplitShare"
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
                    {/* <Typography
                        className="font-medium tracking-tight mt-10"
                        color="text.secondary"
                    >
                        Personal information
                    </Typography> */}
                    {/* <div className='mt-20'>
                    <Avatar src="/path/to/avatar-image.jpg" alt="Avatar" />
                    </div> */}
                </div>



                {/* <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
                    <Button
                        className="whitespace-nowrap"
                        color="secondary"
                        // startIcon={<FuseSvgIcon size={20}>heroicons-solid:close</FuseSvgIcon>}
                        onClick={handleCancel}
                    >
                        Close
                    </Button>
                </div> */}
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

                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-32 w-full mt-72">
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

export default SettingPage;