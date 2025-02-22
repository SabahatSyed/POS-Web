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
import CircularProgress from "@mui/material/CircularProgress";
import { yupResolver } from "@hookform/resolvers/yup";
import _ from "@lodash";
import React, { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormHelperText from "@mui/material/FormHelperText";
import { DateTimePicker } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers";
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
import moment from "moment";
import {
  addRecord,
  getRecords,
  updateRecord,
  selectRecords
} from "../../setup/store/batchWiseOpeningSlice";
import { User } from "../../general-management/types/dataTypes";
import { getRecords as getRolesRecords } from "../../general-management/store/roleDataSlice";
import { getRecords as getBatchRecords } from "../store/batchSlice";
import { getRecords as getInventoryInformationRecords } from "../../setup/store/inventoryInformationSlice";

import { useAppDispatch, useAppSelector } from "app/store";
import { useDebounce } from "@fuse/hooks";
import DropdownWidget from "app/shared-components/DropdownWidget";
import { showMessage } from "app/store/fuse/messageSlice";

/**
 * UsersFormPage
 */
function UsersFormPage() {
  /**
   * Form Validation Schema
   */

  const title = " Batch Wise Opening Stock";

  const defaultValues = {
    batch: "",
    inventoryInformation: "",
    code: "",
    description: "",
    quantity: 0,
  };

  const schema = yup.object().shape({
    batch: yup.string().required("You must enter a value"),
    inventoryInformation: yup.string().required("You must enter a value"),

    code: yup.string().required("You must enter a value"),
    description: yup.string().required("You must enter a value"),
    quantity: yup.number().required("you must enter some value"),
  });

  const { handleSubmit, register, reset, control, watch, formState, setValue } =
    useForm({
      defaultValues,
      mode: "all",
      resolver: yupResolver(schema),
    });

  const { id } = useParams();
  const navigate = useNavigate();
  const [rowData, setRowData] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [inventoryInformationOptions, setInventoryInformationOptions] =
    useState([]);
  const [batchOptions, setBatchOptions] = useState([]);
  const { isValid, dirtyFields, errors, touchedFields } = formState;
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
  const onSubmit = async (formData: User) => {
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
              reset()
            }
          }
        );
      } else {
        await dispatch(addRecord({ payload: formData })).then((resp: any) => {
          console.log(resp);
          if (resp.error) {
            dispatch(
              showMessage({ message: resp.error.message, variant: "error" })
            );
          } else {
            dispatch(showMessage({ message: "Success", variant: "success" }));
            reset()
          }
        });
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
          console.error("Error fetching role data:", error);
        }
      };

      fetchData();
    }
  }, [dispatch, id]);

  useEffect(() => {
    const fetchInventoryGroupsData = async () => {
      try {
        const response = await dispatch(
          getInventoryInformationRecords({ limit: 100 })
        );
        const batches = await dispatch(getBatchRecords({ limit: 100 }));
        console.log(response);
        if (response.payload.records.length > 0) {
          const data = response.payload.records;
          const options = data.map((item: any) => ({
            name: `${item.code}: (${item.description})`,
            value: item._id,
          }));
          setInventoryInformationOptions(options);
        }
        if (batches.payload.records.length > 0) {
          const data = batches.payload.records;
          const options = data.map((item: any) => ({
            name: `${item.code}: (${item.description})`,
            value: item._id,
          }));
          setBatchOptions(options);
        }
      } catch (error) {
        console.error("Error fetching role data:", error);
      }
    };
    fetchInventoryGroupsData();
  }, []);

  const data = watch();

  const formContent = (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-16  gap-x-12 lg:w-full w-full  lg:ml-10">
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-12 gap-10 items-center">
            <Typography className="col-span-1">Batch Code </Typography>
            <Controller
              name="batch"
              control={control}
              render={({ field }) => (
                <FormControl
                  variant="outlined"
                  size="small"
                  className="bg-white w-full col-span-5"
                >
                  <Select {...field}>
                    {batchOptions.map((option: any) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            <Typography className="col-span-1">
              Inventory Information{" "}
            </Typography>
            <Controller
              name="inventoryInformation"
              control={control}
              error={!!errors.inventoryInformation}
              helperText={errors?.inventoryInformation?.message}
              required
              render={({ field }) => (
                <FormControl
                  variant="outlined"
                  size="small"
                  className="bg-white col-span-5"
                >
                  <Select {...field}>
                    {inventoryInformationOptions.map((option: any) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </div>
        </div>
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-12 gap-10 items-center">
            <Typography className="col-span-1">Code </Typography>
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <FormControl
                  variant="outlined"
                  size="small"
                  className="bg-white w-full col-span-3"
                >
                  <TextField
                    {...field}
                    label="Code"
                    variant="outlined"
                    className="bg-white"
                    error={!!errors.code}
                    helperText={errors?.code?.message}
                    required
                    fullWidth
                    disabled
                  />
                </FormControl>
              )}
            />
            <Typography className="col-span-1">Description </Typography>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <FormControl
                  variant="outlined"
                  size="small"
                  className="bg-white col-span-3"
                >
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
                </FormControl>
              )}
            />
            <Typography className="col-span-1">Quantity </Typography>
            <Controller
              name="quantity"
              control={control}
              // Initial value for the field
              rules={{
                required: "Quantity is required",
                min: { value: 1, message: "Must be at least 1" },
              }} // Validation rules
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field} // Spread Controller's field props
                  label="Quantity" // Label for the input
                  type="number" // Number input type
                  inputProps={{ min: 1 }} // Ensure only positive numbers are entered
                  variant="outlined" // Styling
                  error={!!error} // Highlight field red if there's an error
                  helperText={error?.message} // Display validation error messages
                  fullWidth // Makes the field take the full width of its container
                />
              )}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 my-32 items-center justify-center">
        {/* <Button variant="contained" className="rounded-md" color="primary">
          Add
        </Button>
        <Button variant="contained" className="rounded-md" color="primary">
          Edit
        </Button>
        <Button variant="contained" className="rounded-md" color="secondary">
          Delete
        </Button> */}
        <Button
          variant="contained"
          className="rounded-md"
          type="submit"
          disabled={!isValid || loading}
        >
          Save
          {loading && (
            <div className="ml-8 mt-2">
              <CircularProgress size={16} color="inherit" />
            </div>
          )}
        </Button>
        <Button
          variant="outlined"
          className="rounded-md"
          color="primary"
          type="button"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        {/* <Button variant="contained" className="rounded-md" color="success">
          Report
        </Button> */}
        <Button
          variant="outlined"
          className="rounded-md"
          type="button"
          onClick={handleCancel}
        >
          Back
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

  return <FusePageSimple header={header} content={content} />;
}

export default UsersFormPage;
