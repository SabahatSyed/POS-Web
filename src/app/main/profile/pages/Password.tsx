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
 * Change Password
 */
function PasswordTab() {

    /**
     * Form Validation Schema
     */


    const defaultValues = {
        newPassword: '',
        currentPassword: '',
        confirmPassword: '',
    };

    const schema = yup.object().shape({
        newPassword: yup
		.string()
		.required('Please enter your password.')
		.min(8, 'Password is too short - should be 8 chars minimum.'),
	    confirmPassword: yup.string().oneOf([yup.ref('newPassword'), null], 'Passwords must match')   
    });




    const user = useAppSelector(selectUser)
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

   

    const onSubmit = async (formData: any) => {
        try {
            setLoading(true);

            // Assuming your API endpoint is /api/auth/update
            const response = await axios.put('/api/common/change_password', {newPassword: formData.newPassword,currentPassword:formData.currentPassword});

            // Handle the response as needed
            console.log('API Response:', response.data);
            dispatch(setUser(response.data))
            // Example: show a success message
            dispatch(showMessage({ message: 'Update successful', variant: 'success' }));

            setLoading(false);
        } catch (error) {
            console.error('Error handling form submission:', error);

            // Example: show an error message
            dispatch(showMessage({ message: JSON.parse(error?.request?.response).message || 'Error updating profile', variant: 'error' }));

            setLoading(false);
        }
    };

    const data = watch();

    const formContent = (
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid sm:grid-cols-2 gap-16 gap-y-20 gap-x-12 lg:w-full w-full  lg:ml-10">
          {/* First row */}
          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className=""
                label="New Password"
                type="password"
                error={!!errors.newPassword}
                helperText={errors?.newPassword?.message}
                variant="outlined"
                required
                fullWidth
              />
            )}
          />

          <Controller
            name="currentPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className=""
                label="Current Password"
                type="password"
                error={!!errors.currentPassword}
                helperText={errors?.currentPassword?.message}
                variant="outlined"
                required
                fullWidth
              />
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="mb-24"
                label="Confirm New Password"
                type="password"
                error={!!errors.confirmPassword}
                helperText={errors?.confirmPassword?.message}
                variant="outlined"
                required
                fullWidth
              />
            )}
          />
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
                    ${
                      loading
                        ? "w-100 pointer-events-none opacity-70"
                        : "w-auto"
                    }
                    `}
            variant="contained"
            color="secondary"
            type="submit"
            disabled={!isValid || loading}
          >
            <div className="flex items-center">
              {loading && (
                <div className="mr-2">
                  <CircularProgress size={16} color="inherit" />
                </div>
              )}
              <span>{loading ? "Saving..." : "Update"}</span>
            </div>
          </Button>
        </div>
      </form>
    );



    return (
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
                            className="w-full mt-10"
                            variants={container}
                            initial="hidden"
                            animate="show"
                        >
                            
                            <div className="grid grid-cols-1 gap-32 w-full mt-72">
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

}

export default PasswordTab;

