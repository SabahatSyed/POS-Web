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
import React, { useEffect, useState } from "react";
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
} from "../../general-management/store/userDataSlice";
import { User } from "../../general-management/types/dataTypes";
import { getRecords as getRolesRecords } from "../../general-management/store/roleDataSlice";

import { useAppSelector } from "app/store";
import { useDebounce } from "@fuse/hooks";
import DropdownWidget from "app/shared-components/DropdownWidget";
import { showMessage } from "app/store/fuse/messageSlice";
import { FormGroup } from "@mui/material";

/**
 * UsersFormPage
 */
function UsersFormPage() {
  /**
   * Form Validation Schema
   */

  const title = "DayBook Report";

  const defaultValues = {
    code: "",
    description: "",
  };

  const schema = yup.object().shape({
    code: yup.string().required("You must enter a value"),
    description: yup.string().email().required("You must enter a value"),
  });

  const { handleSubmit, register, reset, control, watch, formState, setValue } =
    useForm({
      defaultValues,
      mode: "all",
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
                showMessage({ message: resp.error.message, variant: "error" })
              );
            } else {
              dispatch(showMessage({ message: "Success", variant: "success" }));
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

  const data = watch();

  const formContent = (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-16  gap-x-12 lg:w-full w-full  lg:ml-10">
        {/* Top Fields */}
        {/* <div className="grid grid-cols-1 gap-y-10">
          <div className="flex flex-col gap-10">
            <div className="grid grid-cols-10 gap-10 items-center">
              <Typography className="">Company </Typography>
              <Controller
                name="company"
                control={control}
                render={({ field }) => (
                  <FormControl
                    variant="outlined"
                    size="small"
                    className="bg-white col-span-3"
                  >
                    <Select {...field} defaultValue="Anb International">
                      <MenuItem value="Anb International">
                        ANB International
                      </MenuItem>
                      <MenuItem value="test">test</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                name="count"
                control={control}
                render={({ field }) => (
                  <FormControl
                    variant="outlined"
                    size="small"
                    className="bg-white w-full col-span-6"
                  >
                    <Select {...field} defaultValue="01">
                      <MenuItem value="01">01</MenuItem>
                      <MenuItem value="02">02</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-10">
            <div className="grid grid-cols-10 gap-10 items-center">
              <Typography className="">Group </Typography>
              <Controller
                name="group"
                control={control}
                render={({ field }) => (
                  <FormControl
                    variant="outlined"
                    size="small"
                    className="bg-white col-span-3"
                  >
                    <Select {...field} defaultValue="Administrator">
                      <MenuItem value="Administrator">Administrator</MenuItem>
                      <MenuItem value="Operator">Operator</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                name="count"
                control={control}
                render={({ field }) => (
                  <FormControl
                    variant="outlined"
                    size="small"
                    className="bg-white w-full col-span-6"
                  >
                    <Select {...field} defaultValue="01">
                      <MenuItem value="01">01</MenuItem>
                      <MenuItem value="02">02</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-10">
            <div className="grid grid-cols-10 gap-10 items-center">
              <Typography className="">Username </Typography>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <FormControl
                    variant="outlined"
                    size="small"
                    className="bg-white col-span-9"
                  >
                    <Select {...field} defaultValue="admin">
                      <MenuItem value="admin">admin</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </div>
          </div>
        </div> */}

        <div className="flex justify-center items-center">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1"></div>
            <FormControl component="fieldset" className="col-span-1">
              <RadioGroup row name="vouchers">
                <FormControlLabel
                  value="bankvouchers"
                  control={<Radio />}
                  label="Bank Vouchers"
                />
                <FormControlLabel
                  value="cashvouchers"
                  control={<Radio />}
                  label="Cash Vouchers"
                />
                <FormControlLabel
                  value="generalvouchers"
                  control={<Radio />}
                  label="General Vouchers"
                />
                <FormControlLabel
                  value="allvouchers"
                  control={<Radio />}
                  label="All Vouchers"
                />
              </RadioGroup>
            </FormControl>
          </div>
        </div>

        <div className="flex flex-col gap-10">
         
          <div className="grid grid-cols-2 gap-10 ">
            <Controller
              name="fromdate"
              control={control}
              defaultValue={new Date()} // Set a default value
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  className="col-span-1"
                  value={value ? new Date(value) : null} // Ensure value is either a Date or null
                  onChange={onChange}
                  slotProps={{
                    textField: {
                      label: "From Date",
                      error: false, // Prevent the initial red border
                    },
                  }}
                />
              )}
            />
            <Controller
              name="todate"
              control={control}
              defaultValue={new Date()}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  className="col-span-1"
                  value={value ? new Date(value) : null}
                  onChange={onChange}
                  slotProps={{
                    textField: {
                      label: "To Date",
                      error: false,
                      // variant: 'outlined'
                    },
                  }}
                  // maxDate={end}
                />
              )}
            />
          </div>
        </div>

        {/* Footer Fields */}

        <div className="flex gap-10  items-center justify-center">
          <Button variant="contained" className="rounded-md mt-16" color="primary">
            Day Book
          </Button>

          <Button variant="outlined" className="rounded-md mt-16">
            Trans Reg.
          </Button>
        </div>

        <div className="flex gap-4 items-center justify-center">
        <Button variant="outlined" className="rounded-md mt-16">
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
