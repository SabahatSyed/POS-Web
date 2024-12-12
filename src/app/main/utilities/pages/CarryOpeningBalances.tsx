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
import {
  addRecord,
  getRecords,
  updateRecord,
} from '../../general-management/store/userDataSlice';
import { User } from '../../general-management/types/dataTypes';
import { getRecords as getRolesRecords } from '../../general-management/store/roleDataSlice';

import { useAppSelector } from 'app/store';
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

  const title = 'Carry Opening Balances';

  const defaultValues = {
    code: '',
    description: '',
  };

  const schema = yup.object().shape({
    code: yup.string().required('You must enter a value'),
    description: yup.string().email().required('You must enter a value'),
  });

  const { handleSubmit, register, reset, control, watch, formState, setValue } =
    useForm({
      defaultValues,
      mode: 'all',
      resolver: yupResolver(schema),
    });

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const [rowData, setRowData] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const { isValid, dirtyFields, errors, touchedFields } = formState;

  const onSubmit = async (formData: User) => {
    try {
      setLoading(true);
      if (id) {
        await dispatch(updateRecord({ id, payload: formData })).then(
          (resp: any) => {
            console.log(resp);
            if (resp.error) {
              dispatch(
                showMessage({ message: resp.error.message, variant: 'error' }),
              );
            } else {
              dispatch(showMessage({ message: 'Success', variant: 'success' }));
            }
          },
        );
      } else {
        await dispatch(addRecord({ payload: formData })).then((resp: any) => {
          console.log(resp);
          if (resp.error) {
            dispatch(
              showMessage({ message: resp.error.message, variant: 'error' }),
            );
          } else {
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
          console.error('Error fetching role data:', error);
        }
      };

      fetchData();
    }
  }, [dispatch, id]);

  const data = watch();

  const formContent = (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-y-10   gap-x-12 lg:w-full w-full  lg:ml-10">
        

        {/* Top Fields */}
        <div className="grid grid-cols-1  gap-y-10">
         
          <div className="flex flex-col gap-10">
            <div className="grid grid-cols-10 gap-10 items-center">
              <Typography className="">From Year: </Typography>
              <Controller
                name="fromyear"
                control={control}
                render={({ field }) => (
                  <FormControl
                    variant="outlined"
                    size="small"
                    className="bg-white col-span-3"
                  >
                    <Select {...field} defaultValue="01">
                      <MenuItem value="01">01</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                name="account"
                control={control}
                render={({ field }) => (
                  <FormControl
                    variant="outlined"
                    size="small"
                    className="bg-white w-full col-span-6"
                  >
                    <Select {...field} defaultValue="Account 2022-24">
                      <MenuItem value="Account 2022-24">Account 2022-24</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </div>
           
           
           
          </div>
        </div>
        <div className="grid grid-cols-1 gap-y-10">
         
          <div className="flex flex-col gap-10">
            <div className="grid grid-cols-10 gap-10 items-center">
              <Typography className="">To Year: </Typography>
              <Controller
                name="toyear"
                control={control}
                render={({ field }) => (
                  <FormControl
                    variant="outlined"
                    size="small"
                    className="bg-white col-span-3"
                  >
                    <Select {...field} defaultValue="01">
                      <MenuItem value="01">01</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                name="account"
                control={control}
                render={({ field }) => (
                  <FormControl
                    variant="outlined"
                    size="small"
                    className="bg-white w-full col-span-6"
                  >
                    <Select {...field} defaultValue="Account 2022-24">
                      <MenuItem value="Account 2022-24">Account 2022-24</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </div>
           
           
           
          </div>
        </div>


        {/* Footer Fields */}

        <div className="flex gap-4 mb-6 mt-10 items-center justify-center">
          <Button variant="contained" className="rounded-md" color="primary">
            Run
          </Button>

          <Button variant="outlined" className="rounded-md">
            Back
          </Button>
        </div>
        {/* Buttons */}
        
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
              staggerChildren: 0.06,
            },
          },
        };

        const item = {
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0 },
        };

        return (
          !_.isEmpty(data) && (
            <motion.div
              className="w-full"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <div className="grid grid-cols-1  gap-32 w-full mt-32">
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

  return <FusePageSimple header={header} content={content} />;
}

export default UsersFormPage;
