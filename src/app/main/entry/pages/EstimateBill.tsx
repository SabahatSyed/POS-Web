import { Controller, useForm } from "react-hook-form";
// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
import Checkbox from "@mui/material/Checkbox";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
// import Typography from '@mui/material/Typography';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
// import CloseIcon from "@mui/icons-material/Close";

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
import A4Print from "./A4PrintDialog";
import ThermalPrintDialog from "./ThermalPrintDialog";

/**
 * UsersFormPage
 */
function EstimateBill() {
  /**
   * Form Validation Schema
   */

  const title = "Estimate Bill";

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
  const [open, setOpen] = useState(false);
  const [openThermal, setOpenThermal] = useState(false);
  const [discount, setDiscount] = useState("");

  const handleOpen = () => {
    console.log("dshjhskjsds");
    setOpen(true);
    setOpenThermal(false);
  };
  const handleClose = () => {
    setOpenThermal(false);
    setOpen(false);
  };

  const handleOpenThermal = () => {
    setOpenThermal(true);
    setOpen(false);
  };
  const handleCloseThermal = () => {
    setOpen(false);
    setOpenThermal(false);
  };

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

  // const handleCancel = () => {
  //   navigate(-1);
  // };

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
    <>
      {/* Full-screen dialog */}
      {/* <div className="flex flex-col justify-center items-start"> */}
     {open && <A4Print discount={discount} open={open} handleClose={handleClose} handleOpenThermal={handleOpenThermal} handleCloseThermal={handleCloseThermal} /> }
      {/* </div> */}

      {openThermal && <ThermalPrintDialog openThermal={openThermal} handleCloseThermal={handleCloseThermal} handleOpenThermal={handleOpenThermal} handleOpen={handleOpen} />}

      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-16 gap-y-40 gap-x-12 lg:w-full w-full  lg:ml-10">
          {/* First row */}
         

          {/* Top Fields */}
           

          {/* Purchase and Balance Information */}
          {/* <div className="flex gap-24 my-10 w-full justify-between  border border-t-1 border-b-1 border-l-0 border-r-0 py-40">
            <TextField
              label="Purchase Rate"
              variant="outlined"
              size="small"
              className="bg-white w-full"
            />
            <TextField
              label="O/A Balance"
              variant="outlined"
              size="small"
              className="bg-white w-full"
            />
            <TextField
              label="Batch Balance"
              variant="outlined"
              size="small"
              className="bg-white w-full"
            />
          </div> */}

          {/* <FormControl component="fieldset">
              <RadioGroup row>
                <div className="flex justify-center items-center gap-6">
                <Typography className="text-lg  mr-2">Payment Type:</Typography>
                <FormControlLabel value="Cash" control={<Radio />} label="Cash" />
                <FormControlLabel value="Credit" control={<Radio />} label="Credit" />
                </div>
              </RadioGroup>
            </FormControl> */}

          {/* Product Details */}
          <div className="w-full overflow-auto">
  <div className="min-w-[1200px]">
    <div className="grid grid-cols-12 gap-4 mb-4  pb-2">
      <Typography>Product Code</Typography>
      <Typography className="col-span-2">Product Name</Typography>
      <Typography>Batch Code</Typography>
      <Typography className="col-span-2">Batch Description</Typography>
      <Typography>Qty</Typography>
      <Typography>Trade Rate</Typography>
      <Typography>Disc. (%)</Typography>
      <Typography>Disc. Value</Typography>
      <Typography>Net Rate</Typography>
      <Typography>Amount</Typography>
    </div>

    <div className="grid grid-cols-12 gap-4 mb-6">
      {/* Product Code */}
      <Controller
        name="productCode"
        control={control}
        render={({ field }) => (
          <FormControl variant="outlined" size="small" className="bg-white">
            <Select {...field} defaultValue="01001">
              <MenuItem value="01001">ACTIVE VIT</MenuItem>
            </Select>
          </FormControl>
        )}
      />

      {/* Product Name */}
      <Controller
        name="productName"
        control={control}
        render={({ field }) => (
          <FormControl
            variant="outlined"
            size="small"
            className="bg-white col-span-2"
          >
            <Select {...field} defaultValue="ACTIVE VIT">
              <MenuItem value="ACTIVE VIT">ACTIVE VIT</MenuItem>
            </Select>
          </FormControl>
        )}
      />

      {/* Batch Code */}
      <Controller
        name="batchCode"
        control={control}
        render={({ field }) => (
          <FormControl variant="outlined" size="small" className="bg-white">
            <Select {...field} defaultValue="001">
              <MenuItem value="001">001</MenuItem>
            </Select>
          </FormControl>
        )}
      />

      {/* Batch Description */}
      <TextField
      label="Batch Description"
        variant="outlined"
        size="small"
        className="bg-white col-span-2"
      />
      {/* Qty */}
      <TextField variant="outlined" size="small" label="Qty" className="bg-white" />
      {/* Trade Rate */}
      <TextField variant="outlined" size="small" label="Trade Rate" className="bg-white" />
      {/* Disc (%) */}
      <TextField variant="outlined" size="small" label="Disc. (%)" className="bg-white" />
      {/* Disc Value */}
      <TextField variant="outlined" size="small" label="Disc. Value" className="bg-white" />
      {/* Net Rate */}
      <TextField variant="outlined" size="small" label="Net Rate" className="bg-white" />
      {/* Amount */}
      <TextField variant="outlined" size="small" label="Amount" className="bg-white" />
    </div>
  </div>
</div>


          {/* Footer Fields */}

          <div className="flex gap-4 flex-wrap my-12 items-center justify-center">
            <Button variant="contained" className="rounded-md" color="primary">
              Edit
            </Button>
            <Button
              variant="contained"
              className="rounded-md"
              color="secondary"
            >
              Delete
            </Button>
            <Button variant="contained" className="rounded-md">
              Update
            </Button>
            <Button variant="outlined" className="rounded-md">
              Add
            </Button>
            <Button variant="outlined" className="rounded-md" color="primary">
              Cancel
            </Button>
            {/* <Button variant="contained" className="rounded-md" color="success">
              Close Bill
            </Button>
            <Button variant="contained" className="rounded-md">
              Return
            </Button> */}
            <Button variant="outlined" className="rounded-md">
              Back
            </Button>
          </div>
          {/* Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 justify-center">
                      <TextField
                        label="Total Amount"
                        variant="outlined"
                        size="small"
                        className="bg-white col-span-1"
                      />
                      <TextField
                        label="Disc (%)"
                        variant="outlined"
                        size="small"
                        className="bg-white col-span-1"
                      />
                      <TextField
                        label="Disc Amount"
                        variant="outlined"
                        size="small"
                        className="bg-white col-span-1"
                      />
                      <TextField
                        label="Net Amount"
                        variant="outlined"
                        size="small"
                        className="bg-white col-span-1"
                      />
                      {/* <TextField
                      label="From"
                      variant="outlined"
                      size="small"
                      className="bg-white"
                    />
                    <TextField
                      label="To"
                      variant="outlined"
                      size="small"
                      className="bg-white"
                    /> */}
                      <Button
                        // size={small}
                        variant="contained"
                        className="rounded-md col-span-1"
                        onClick={handleOpen}
                      >
                        Report
                      </Button>
                    </div>
        </div>
      </form>
    </>
  );

  const header = (
    <div className="flex w-full container">
      <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 p-24 md:p-32 pb-0 md:pb-0">
        <div className="flex flex-col flex-auto">
          <Typography className="text-3xl font-semibold tracking-tight leading-8">
            {title}
          </Typography>
        </div>
        {/* <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
          <Button
            className="whitespace-nowrap"
            color="secondary"
            // startIcon={<FuseSvgIcon size={20}>heroicons-solid:cross</FuseSvgIcon>}
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

export default EstimateBill;
