import { Controller, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import InputAdornment from "@mui/material/InputAdornment";
import _ from "@lodash";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormHelperText from "@mui/material/FormHelperText";
import { DateTimePicker } from "@mui/x-date-pickers";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import InputLabel from "@mui/material/InputLabel";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
// import { addRole } from '../store/dataSlice';
// import { PermissionData } from '../Permissions'
import { useAuth } from "../../../auth/AuthContext";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { useMemo } from "react";
import { motion } from "framer-motion";
import CircularProgress from "@mui/material/CircularProgress";
import {
  addRecord,
  getSubscriptionRecords,
  updateRecord,
} from "../store/subscriptionSlice";
import { SubscriptionType } from "../types/SubscriptionType";
import { showMessage } from "app/store/fuse/messageSlice";
import axios from "axios";

/**
 * RolesFormPage
 */
function PlansFormPage() {
  /**
   * Form Validation Schema
   */

  const title = "Add Subscription";

  const defaultValues = {
    title: "Plan",
    description: "xyz",
    daily_price: 0,
    monthly_price: 0,
    yearly_price: 0,
    trial_days: 0,
    feature_line: "abc",
    feature_01: "1",
    feature_02: "2",
    feature_03: "3",
    feature_04: "4",
    feature_05: "5",
    popular: false,
    is_active: true,
    // DateTimePicker: '',
  };

  const schema = yup.object().shape({
    title: yup.string().required("You must enter a value"),
    description: yup.string().required("You must enter a value"),
    daily_price: yup
      .number()
      .typeError("Must be a number")
      .required("You must select a value"),
    monthly_price: yup
      .number()
      .typeError("value is required")
      .required("You must select a value"),
    yearly_price: yup
      .number()
      .typeError("value is required")
      .required("You must select a value"),
    trial_days: yup
      .number()
      .typeError("value is required")
      .required("You must select a value"),
    feature_line: yup.string().required("You must select a value"),
    feature_01: yup.string().required("You must select a value"),
    feature_02: yup.string().required("You must select a value"),
    feature_03: yup.string().required("You must select a value"),
    feature_04: yup.string().required("You must select a value"),
    feature_05: yup.string().required("You must select a value"),
    popular: yup.boolean().oneOf([true, false], "value is required"),
    is_active: yup.boolean().oneOf([true, false], "value is required"),
    // DateTimePicker: yup.string().nullable().required('You must select a date'),
    // permissions: yup
    // 	.array()
    // 	.of(yup.string()),
  });

  const { handleSubmit, register, reset, control, watch, formState, setValue } =
    useForm({
      defaultValues,
      mode: "all",
      resolver: yupResolver(schema),
    });

  const { id } = useParams();

  const dispatch = useDispatch<any>();
  const [rowData, setRowData] = useState<SubscriptionType | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isValid, dirtyFields, errors, touchedFields } = formState;

  const [selectedRole, setSelectedRole] = useState("Admin");

  const onSubmit = async (data: SubscriptionType) => {
    const formData = {
      ...data,
      id,
    };
    console.log("form", formData);
    try {
      setLoading(true);
      if (id) {
        await dispatch(updateRecord({ id, payload: formData })).then(
          (resp: any) => {
            console.log(resp);
            if (resp.error) {
              dispatch(
                showMessage({ message: resp.error.message, variant: "error" })
              );
            } else {
              dispatch(showMessage({ message: "Success", variant: "success" }));
              navigate("/plans/table");
            }
          }
        );
      } else {
        try {
          const response = await axios.post(`/api/subscriptions/`, formData).then((res)=>{
          dispatch(showMessage({ message: "Success", variant: "success" }));
          navigate("/plans/table");
        })
        } catch (error) {
          console.log(error);
          
          dispatch(showMessage({ message: JSON.parse(error.request.response).message, variant: "error" }));
        }
        // await dispatch(addRecord({ payload: formData })).then((resp: any) => {
        //   if (resp.error) {
        //     dispatch(
        //       showMessage({ message: resp.error.message, variant: "error" })
        //     );
        //   } else {
        //     dispatch(showMessage({ message: "Success", variant: "success" }));
        //     navigate("/plans/table");
        //   }
        // });
      }

      setLoading(false);
    } catch (error) {
      console.error("Error handling form submission:", error);
      dispatch(showMessage({ message: error?.message, variant: "error" }));
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
          const response = await dispatch(getSubscriptionRecords({ id }));
          if (response.payload.records.length > 0) {
            const data = response.payload.records[0];
            setRowData(data);

            for (const field in schema.fields) {
              const fieldName: any = field;
              setValue(fieldName, data[fieldName]);
            }
          }
        } catch (error) {
          console.error("Error fetching role data:", error);
        }
      };

      fetchData();
    }
  }, [dispatch, id]);

  const data = watch();

  const formContent = (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <Typography className="font-medium tracking-tight" color="text.secondary">
        Basic Information
      </Typography>
      <div className="grid lg:grid-cols-2 gap-16 gap-y-40 gap-x-12 w-full my-32 border-b pb-36">
        {/* First row */}

        <div className="sm:col-span-1 ">
          <Controller
            render={({ field }) => (
              <TextField
                {...field}
                label="Title"
                variant="outlined"
                className=" bg-white"
                error={!!errors.title}
                helperText={errors?.title?.message}
                required
                fullWidth
              />
            )}
            name="title"
            control={control}
          />
        </div>

        <div className="sm:col-span-1 ">
          <Controller
            render={({ field }) => (
              <TextField
                {...field}
                label="Monthly Price ($)"
                variant="outlined"
                className=" bg-white"
                error={!!errors.monthly_price}
                helperText={errors?.monthly_price?.message}
                required
                fullWidth
              />
            )}
            name="monthly_price"
            control={control}
          />
        </div>

        <div className="sm:col-span-1 ">
          <Controller
            render={({ field }) => (
              <TextField
                {...field}
                label="Yearly Price ($)"
                variant="outlined"
                className=" bg-white"
                error={!!errors.yearly_price}
                helperText={errors?.yearly_price?.message}
                required
                fullWidth
              />
            )}
            name="yearly_price"
            control={control}
          />
        </div>

        <div className="sm:col-span-1 ">
          <Controller
            render={({ field }) => (
              <TextField
                {...field}
                label="Trial Period (Days)"
                variant="outlined"
                className=" bg-white"
                error={!!errors.trial_days}
                helperText={errors?.trial_days?.message}
                required
                fullWidth
              />
            )}
            name="trial_days"
            control={control}
          />
        </div>

        <div className="sm:col-span-2 ">
          <Controller
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                variant="outlined"
                className=" bg-white"
                error={!!errors.description}
                helperText={errors?.description?.message}
                required
                fullWidth
                multiline // Set multiline to true for a text area
                rows={5}
              />
            )}
            name="description"
            control={control}
          />
        </div>
      </div>

      <Typography className="font-medium tracking-tight" color="text.secondary">
        Features
      </Typography>
      <div className="grid lg:grid-cols-2 gap-16 gap-y-40 gap-x-12 w-full my-32 pb-36">
        {/* First row */}

        <div className="sm:col-span-2 ">
          <Controller
            render={({ field }) => (
              <TextField
                {...field}
                label="Feature Line"
                variant="outlined"
                className=" bg-white"
                error={!!errors.feature_line}
                helperText={errors?.feature_line?.message}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FuseSvgIcon size={20}>heroicons-solid:key</FuseSvgIcon>
                    </InputAdornment>
                  ),
                }}
              />
            )}
            name="feature_line"
            control={control}
          />
        </div>
        <div className="sm:col-span-1 ">
          <Controller
            render={({ field }) => (
              <TextField
                {...field}
                label="Feature 01"
                variant="outlined"
                className=" bg-white"
                error={!!errors.feature_01}
                helperText={errors?.feature_01?.message}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FuseSvgIcon size={20}>heroicons-solid:key</FuseSvgIcon>
                    </InputAdornment>
                  ),
                }}
              />
            )}
            name="feature_01"
            control={control}
          />
        </div>

        <div className="sm:col-span-1 ">
          <Controller
            render={({ field }) => (
              <TextField
                {...field}
                label="Feature 02"
                variant="outlined"
                className=" bg-white"
                error={!!errors.feature_02}
                helperText={errors?.feature_02?.message}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FuseSvgIcon size={20}>heroicons-solid:key</FuseSvgIcon>
                    </InputAdornment>
                  ),
                }}
              />
            )}
            name="feature_02"
            control={control}
          />
        </div>

        <div className="sm:col-span-1 ">
          <Controller
            render={({ field }) => (
              <TextField
                {...field}
                label="Feature 03"
                variant="outlined"
                className=" bg-white"
                error={!!errors.feature_03}
                helperText={errors?.feature_03?.message}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FuseSvgIcon size={20}>heroicons-solid:key</FuseSvgIcon>
                    </InputAdornment>
                  ),
                }}
              />
            )}
            name="feature_03"
            control={control}
          />
        </div>

        <div className="sm:col-span-1 ">
          <Controller
            render={({ field }) => (
              <TextField
                {...field}
                label="feature 04"
                variant="outlined"
                className=" bg-white"
                error={!!errors.feature_04}
                helperText={errors?.feature_04?.message}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FuseSvgIcon size={20}>heroicons-solid:key</FuseSvgIcon>
                    </InputAdornment>
                  ),
                }}
              />
            )}
            name="feature_04"
            control={control}
          />
        </div>

        <div className="sm:col-span-1 ">
          <Controller
            render={({ field }) => (
              <TextField
                {...field}
                label="feature 05"
                variant="outlined"
                className=" bg-white"
                error={!!errors.feature_05}
                helperText={errors?.feature_05?.message}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FuseSvgIcon size={20}>heroicons-solid:key</FuseSvgIcon>
                    </InputAdornment>
                  ),
                }}
              />
            )}
            name="feature_05"
            control={control}
          />
        </div>
      </div>
      {/* <Typography className="font-medium tracking-tight" color="text.secondary">
        Control Flags
      </Typography>
      <div className="flex gap-36 mt-32">
        <div className="flex gap-8 items-center">
          <Controller
            name="popular"
            control={control}
            // defaultValue={false}
            render={({ field: { onChange, value } }) => (
              <Checkbox
                //tabIndex={-1}
                checked={value}
                onChange={(ev) => onChange(ev.target.checked)}
                disableRipple
              />
            )}
          />
          <p>Popular</p>
        </div>
        <div className="flex gap-8 items-center">
          <Controller
            name="is_active"
            control={control}
            // defaultValue={false}
            render={({ field: { onChange, value } }) => (
              <Checkbox
                //tabIndex={-1}
                checked={value}
                onChange={(ev) => onChange(ev.target.checked)}
                disableRipple
              />
            )}
          />
          <p>Active</p>
        </div>
      </div> */}

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
              <div className="grid grid-cols-1 gap-32 w-full mt-32">
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

export default PlansFormPage;
