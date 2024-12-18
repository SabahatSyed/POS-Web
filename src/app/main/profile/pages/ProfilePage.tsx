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
import Avatar from '@mui/material/Avatar';
import PhoneInput from 'react-phone-input-2'
import { yupResolver } from '@hookform/resolvers/yup';
import _ from '@lodash';
import React, { useEffect, useState, useRef } from 'react';
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
import axios from 'axios'
import FusePageSimple from '@fuse/core/FusePageSimple';
import { useAppDispatch, useAppSelector } from 'app/store';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import CircularProgress from '@mui/material/CircularProgress';
import { selectUser, setUser } from 'app/store/user/userSlice';
import { UserType } from 'app/store/user/UserType';
import { showMessage } from 'app/store/fuse/messageSlice';


/**
 * ProfileFormPage
 */
function ProfilePage() {

    /**
     * Form Validation Schema
     */

    const title = 'Update Profile';

    const defaultValues = {
        displayName: '',
        email: '',
        phone: '',
    };

    const schema = yup.object().shape({
        displayName: yup.string().required('You must enter a value'),
        email: yup.string().required('You must enter a value'),
        phone: yup.string().required('You must enter a value'),
      
    });




    const user = useAppSelector(selectUser)
    console.log("user", user)
    const [formData, setFormData] = useState(defaultValues);
    const formPhone = useForm({
        mode: 'onChange',
        defaultValues: defaultValues,
        resolver: yupResolver(schema)
    });
    const { handleSubmit, register, reset, control, watch, formState, setValue } = useForm({
        defaultValues,
        mode: 'all',
        resolver: yupResolver(schema)
    });

    const [fetchDataFlag, setFetchDataFlag] = useState(true);
    const dispatch = useDispatch<any>()

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { isValid, dirtyFields, errors, touchedFields } = formState;


    const handleCancel = () => {
        navigate(-1);
    };

    const defaultValuesRef = useRef(defaultValues);

    useEffect(() => {
        console.log('useEffect triggered');
        console.log('user:', user);
        console.log('defaultValues:', defaultValuesRef.current);

        const fetchData = async () => {
            try {
                if (user && user.data) {
                    console.log('User data:', user.data);

                    // Check and log individual fields
                    console.log('displayName in user.data:', user.data.displayName);
                    console.log('email in user.data:', user.data.email);

                    // Set values based on user data
                    setValue('displayName', user.data.displayName);
                    setValue('email', user.data.email);
                    formPhone.setValue('phone', user.data.phone);


                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, [user, setValue, formPhone]);

    const onSubmit = async (formData: UserType) => {
        console.log("ayesha")
        try {
            setLoading(true);



            // Assuming your API endpoint is /api/auth/update
            const response = await axios.put('/api/auth/update', formData);

            // Handle the response as needed
            console.log('API Response:', response.data);

            // Example: show a success message
            dispatch(showMessage({ message: 'Update successful', variant: 'success' }));

            setLoading(false);
        } catch (error) {
            console.error('Error handling form submission:', error);

            // Example: show an error message
            dispatch(showMessage({ message: error?.message || 'Error updating profile', variant: 'error' }));

            setLoading(false);
        }
    };

    const data = watch();

    const formContent = (
        <form
            className="w-full"
            onSubmit={handleSubmit(onSubmit)}
        >

            <div className="grid sm:grid-cols-2 gap-16 gap-y-40 gap-x-12 lg:w-full w-full  lg:ml-10">
                {/* First row */}
                <div className="sm:col-span-1 ">
                    <Controller
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Name"
                                variant="outlined"
                                className=' bg-white'
                                error={!!errors.displayName}
                                helperText={errors?.displayName?.message}
                                required
                                fullWidth
                            />
                        )}
                        name="displayName"
                        control={control}
                        defaultValue={defaultValues.displayName} // Add this line
                    />
                </div>

                <div className="sm:col-span-1 ">
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
                        control={control}
                        defaultValue={defaultValues.email}
                    />
                </div>
                <div className="sm:col-span-1">
                    <Controller
                        name="phone"
                        control={formPhone.control}
                        render={({ field: { ref, ...field } }) => (
                            <PhoneInput
                                {...field}
                                inputStyle={{
                                    width: '100% !important',
                                    padding: '16.5px 14px 16.5px 58px; !important',
                                }}
                                inputProps={{
                                    ref,
                                    required: true,
                                    autoFocus: true,
                                    readOnly: true, // Initially set to read-only
                                }}
                                isValid={(value, country) => {
                                    return formPhone.formState.isValid;
                                }}
                                specialLabel={""}
                                country={'us'}
                            />
                        )}
                        defaultValue={defaultValues.phone}
                    />
                    {formPhone.formState.errors.phone && (
                        <p style={{
                            color: '#ffffff',
                            fontWeight: 400,
                            fontSize: '1.2rem',
                            lineHeight: 1.66,
                            textAlign: 'left',
                            marginTop: '3px',
                            marginRight: '14px',
                            marginBottom: 0,
                            marginLeft: '14px',
                        }}>{formPhone.formState.errors.phone?.message}</p>
                    )}

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
                    className={`
       mx-8 
       ${loading ? 'w-100 pointer-events-none opacity-70' : 'w-auto'}
    `}
                    variant="contained"
                    color="secondary"
                    type="submit"

                >
                    <div className="flex items-center">
                        {loading && (
                            <div className="mr-2">
                                <CircularProgress size={16} color="inherit" />
                            </div>
                        )}
                        <span>{loading ? 'Saving...' : 'Update'}</span>
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
                        className="font-semibold  text-xs tracking-tight mt-10 ml-4"
                        color="text.secondary"
                    >
                        Personal information
                    </Typography>

                    <Typography
                        className="font-bold tracking-tight mt-10 text-xl  ml-2"
                        color="text.secondary"

                    >
                        Avatar
                        <Avatar
                            className="md:mx-8"
                            alt="user photo"
                            src='/avatar.png'
                            sx={{ width: 90, height: 90 }} // Adjust the size as needed
                        />
                    </Typography>


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

export default ProfilePage;

function fetchData() {
    throw new Error('Function not implemented.');
}
