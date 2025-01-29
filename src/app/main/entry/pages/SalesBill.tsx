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
} from "../../entry/store/SalesBillSlice";
import { User } from "../../general-management/types/dataTypes";
import { getRecords as getRolesRecords } from "../../general-management/store/roleDataSlice";
import { getRecords as getBatchRecords } from "../../setup/store/batchSlice";
import { getRecords as getInventoryInformationRecords } from "../../setup/store/inventoryInformationSlice";
import { getRecords as getSalesmenRecords } from "../../setup/store/salesmenSlice";
import { getRecords as getChartOfAccountsRecords } from "../../setup/store/chartOfAccountSlice";

import { useAppSelector } from "app/store";
import { useDebounce } from "@fuse/hooks";
import DropdownWidget from "app/shared-components/DropdownWidget";
import { showMessage } from "app/store/fuse/messageSlice";
import A4Print from "./A4PrintDialog";
import ThermalPrintDialog from "./ThermalPrintDialog";
import { C } from "@fullcalendar/core/internal-common";

/**
 * UsersFormPage
 */
function UsersFormPage() {
  /**
   * Form Validation Schema
   */

  const title = "Sales Bill";

  const defaultValues = {
    batch: "",
    inventoryInformation: "",
    salesmen: "",
    description: "",
    quantity: 0,
    saleBill: "",
    chartOfAccount: "",
    date: "",
    paymentType: "cash",
    balance: "",
    remarks: "",
    tradeRate: "",
    discount: "",
    discountValue: "",
    netRate: "",
    amount: "",
    return: false,
  };

  const schema = yup.object().shape({
    description: yup.string().required("Description is required"),
    chartOfAccount: yup.string().required("Chart of Account is required"),
    salesmen: yup.string().required("Salesman is required"),
    inventoryInformation: yup
      .string()
      .required("Inventory Information is required"),
    batch: yup.string().required("Batch is required"),
    quantity: yup.number().required("Quantity is required").min(1),
    tradeRate: yup.number().required("Trade Rate is required").min(0),
    discount: yup.number().min(0),
    discountValue: yup.number().min(0),
    netRate: yup.number().required("Net Rate is required").min(0),
    amount: yup.number().required("Amount is required").min(0),
    return: yup.boolean(),
    balance: yup.number().required("Balance is required").min(0),
    remarks: yup.string(),
    date: yup.date().required("Date is required"),
    paymentType: yup.string().required("Payment Type is required"),
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
  console.log(isValid, errors);
  const [open, setOpen] = useState(false);
  const [openThermal, setOpenThermal] = useState(false);
  const [discount, setDiscount] = useState("");
  const [salesMenOptions, setSalesMenOptions] = useState([]);
  const [chartOfAccounts, setChartOfAccounts] = useState([]);
  const [inventoryInformationOptions, setInventoryInformationOptions] =
    useState([]);
  const [batchOptions, setBatchOptions] = useState([]);

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

  const onSubmit = async (data: any) => {

    const formData = {
      chartOfAccount: data.chartOfAccount,
      salesmen: data.salesmen,
      products: [
        {
          inventoryInformation: data.inventoryInformation,
          batch: data.batch,
        },
      ],
      quantity: data.quantity,
      tradeRate: data.tradeRate,
      discount: data.discount,
      discountValue: data.discountValue,
      netRate: data.netRate,
      amount: data.amount,
      return: data.return,
      balance: data.balance,
      remarks: data.remarks,
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      paymentType: data.paymentType,
    };

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
              reset()
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
            reset()
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

  useEffect(() => {
    const fetchInventoryGroupsData = async () => {
      try {
        const response = await dispatch(
          getInventoryInformationRecords({ limit: 100 })
        );
        const batches = await dispatch(getBatchRecords({ limit: 100 }));
        const salesmen = await dispatch(getSalesmenRecords({ limit: 100 }));
        const chartOfAccounts = await dispatch(
          getChartOfAccountsRecords({ limit: 100 })
        );
        console.log(response);
        if (response.payload.records.length > 0) {
          const data = response.payload.records;
          const options = data.map((item: any) => ({
            name: `${item.code}: (${item.name})`,
            value: item._id,
            code: item.code,
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
        if (salesmen.payload.records.length > 0) {
          const data = salesmen.payload.records;
          const options = data.map((item: any) => ({
            name: `${item.code}: (${item.name})`,
            value: item._id,
          }));
          setSalesMenOptions(options);
        }
        if (chartOfAccounts.payload.records.length > 0) {
          const data = chartOfAccounts.payload.records;
          const options = data.map((item: any) => ({
            name: `${item.code}: (${item.description})`,
            value: item._id,
          }));
          setChartOfAccounts(options);
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
      <div className="flex flex-col gap-16 gap-y-40 gap-x-12 lg:w-full w-full  lg:ml-10">
        {/* First row */}
        <div className="flex items-center gap-28 ">
          {" "}
          {/* <FormControl component="fieldset">
              <RadioGroup row>
                <FormControlLabel value="new" control={<Radio />} label="New" />
                <FormControlLabel value="old" control={<Radio />} label="Old" />
              </RadioGroup>
            </FormControl>
            <Typography className="text-base font-medium">
              Last Bill : 349839
            </Typography> */}
          {/* <Controller
              name="voucher"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Voucher"
                  variant="outlined"
                  size="small"
                  className="bg-white w-1/3"
                />
              )}
            />
            <Button variant="contained" className="rounded-md" color="primary">
              Print Voucher
            </Button> */}
        </div>

        {/* Top Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-4 mb-6">
          <div className="flex flex-col md:col-span-1 gap-10">
            {/* <Controller
                name="saleBill"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Sale Bill#"
                    variant="outlined"
                    size="small"
                    className="bg-white md:w-1/2"
                  />
                )}
              /> */}

            {/* <Controller
                name="lastBill"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Last Bill#"
                    variant="outlined"
                    size="small"
                    disabled
                    className="bg-white w-1/2"
                  />
                )}
              /> */}

            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  className="md:w-1/2"
                  {...field}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Date"
                      variant="outlined"
                      size="small"
                      className="bg-white md:w-1/2"
                    />
                  )}
                />
              )}
            />
          </div>
          <div className="flex flex-col md:col-span-2 gap-10">
            <div className="grid grid-cols-10 gap-10 items-center">
              <Typography className="col-span-2 lg:col-span-1  whitespace-nowrap text-ellipsis">
                Party:{" "}
              </Typography>
              <Controller
                name="chartOfAccount"
                control={control}
                render={({ field }) => (
                  <FormControl
                    variant="outlined"
                    size="small"
                    className="bg-white w-full col-span-5"
                  >
                    <Select {...field}>
                      {chartOfAccounts.map((option: any) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              {/* <Controller
                  name="party"
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      variant="outlined"
                      size="small"
                      className="bg-white w-full col-span-6"
                    >
                      <Select {...field} defaultValue="010020">
                        <MenuItem value="010020">AL SHIFA MEDICOS</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                /> */}
            </div>
            <div className="grid grid-cols-10 gap-10 items-center">
              <Typography className="col-span-2 lg:col-span-1  whitespace-nowrap text-ellipsis">
                Balance:{" "}
              </Typography>

              <Controller
                name="balance"
                control={control}
                render={({ field }) => (
                  <FormControl
                    variant="outlined"
                    size="small"
                    className="bg-white w-full col-span-3"
                  >
                    <TextField
                      {...field}
                      label="Balance"
                      variant="outlined"
                      className="bg-white"
                      error={!!errors.balance}
                      helperText={errors?.balance?.message}
                      required
                      fullWidth
                    />
                  </FormControl>
                )}
              />
            </div>
            <div className="grid grid-cols-10 gap-10 items-center">
              <Typography className="col-span-2 lg:col-span-1  whitespace-nowrap text-ellipsis">
                Salesman:{" "}
              </Typography>
              <Controller
                name="salesmen"
                control={control}
                render={({ field }) => (
                  <FormControl
                    variant="outlined"
                    size="small"
                    className="bg-white w-full col-span-5"
                  >
                    <Select {...field}>
                      {salesMenOptions.map((option: any) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </div>
            <div className="grid grid-cols-10 gap-10 items-center">
              <Typography className="col-span-2 lg:col-span-1  whitespace-nowrap text-ellipsis">
                Remarks:{" "}
              </Typography>

              <Controller
                name="remarks"
                control={control}
                render={({ field }) => (
                  <FormControl
                    variant="outlined"
                    size="small"
                    className="bg-white w-full col-span-3"
                  >
                    <TextField
                      {...field}
                      label="Remarks"
                      variant="outlined"
                      className="bg-white"
                      error={!!errors.remarks}
                      helperText={errors?.remarks?.message}
                      required
                      fullWidth
                    />
                  </FormControl>
                )}
              />
            </div>
          </div>
        </div>

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
        <div className="flex gap-24 my-10 w-full border border-t-1 border-b-1 border-l-0 border-r-0 py-40">
          <FormControl component="fieldset">
            <RadioGroup row>
              <div className="flex justify-center items-center gap-6">
                <Typography className="text-lg  mr-2">Payment Type:</Typography>
                <Controller
                  name="paymentType"
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      variant="outlined"
                      size="small"
                      className="bg-white w-full col-span-5"
                    >
                      <Select {...field} defaultValue="cash">
                        <MenuItem value="cash">Cash</MenuItem>
                        <MenuItem value="credit">Credit</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </div>
            </RadioGroup>
          </FormControl>

          <FormControl component="fieldset">
            <RadioGroup row>
              <div className="flex justify-center items-center gap-6">
                <Typography className="text-lg  mr-2">Return:</Typography>
                <Controller
                  name="return"
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      variant="outlined"
                      size="small"
                      className="bg-white w-full col-span-5"
                    >
                      <Select {...field} defaultValue={false}>
                        <MenuItem value="true">True</MenuItem>
                        <MenuItem value="false">False</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </div>
            </RadioGroup>
          </FormControl>
        </div>

        {/* Product Details */}
        <div className="w-full overflow-auto">
          {/* Main Grid for all fields */}
          <div className="min-w-[1200px] md:p-4">
            <div className="grid grid-cols-10 gap-4 mb-6">
              {/* Product Code */}
              {/* <div className="flex flex-col ">
                <Typography className="text-sm font-medium mb-1 text-left md:text-center">
                  Product Code
                </Typography>
                <Controller
                  name="ProductCode"
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      variant="outlined"

                      size="small"
                      className="bg-white w-full col-span-5"
                    >
                      <Select {...field}>
                        {inventoryInformationOptions.map((option: any) => (
                          <MenuItem key={option.code} value={option.code}>
                            {option.code}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </div> */}

              {/* Product Name */}
              <div className="flex flex-col ">
                <Typography className="text-sm font-medium mb-1 text-left md:text-center">
                  Product
                </Typography>
                <Controller
                  name="inventoryInformation"
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      variant="outlined"
                      label="Product"
                      size="small"
                      className="bg-white w-full col-span-5"
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

              {/* Batch Code */}
              <div className="flex flex-col ">
                <Typography className="text-sm font-medium mb-1 text-left md:text-center">
                  Batch
                </Typography>
                <Controller
                  name="batch"
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      variant="outlined"
                      size="small"
                      label="Batch"
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
              </div>

              {/* Batch Description */}
              <div className="flex flex-col ">
                <Typography className="text-sm font-medium mb-1 text-left md:text-center">
                  Description
                </Typography>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      variant="outlined"
                      size="small"
                      className="bg-white w-full col-span-3"
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
              </div>

              {/* Quantity */}
              <div className="flex flex-col ">
                <Typography className="text-sm font-medium mb-1 text-left md:text-center">
                  Qty
                </Typography>
                <Controller
                  name="quantity"
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      variant="outlined"
                      size="small"
                      className="bg-white w-full col-span-3"
                    >
                      <TextField
                        {...field}
                        label="Quantity"
                        variant="outlined"
                        className="bg-white"
                        error={!!errors.quantity}
                        helperText={errors?.quantity?.message}
                        required
                        fullWidth
                      />
                    </FormControl>
                  )}
                />
              </div>

              {/* Trade Rate */}
              <div className="flex flex-col ">
                <Typography className="text-sm font-medium mb-1 text-left md:text-center">
                  Trade Rate
                </Typography>
                <Controller
                  name="tradeRate"
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      variant="outlined"
                      size="small"
                      className="bg-white w-full col-span-3"
                    >
                      <TextField
                        {...field}
                        label="Trade Rate"
                        variant="outlined"
                        className="bg-white"
                        error={!!errors.tradeRate}
                        helperText={errors?.tradeRate?.message}
                        required
                        fullWidth
                      />
                    </FormControl>
                  )}
                />
              </div>

              {/* Discount (%) */}
              <div className="flex flex-col ">
                <Typography className="text-sm font-medium mb-1 text-left md:text-center">
                  Disc. (%)
                </Typography>
                <Controller
                  name="discount"
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      variant="outlined"
                      size="small"
                      className="bg-white w-full col-span-3"
                    >
                      <TextField
                        {...field}
                        label="Discount"
                        variant="outlined"
                        className="bg-white"
                        error={!!errors.discount}
                        helperText={errors?.discount?.message}
                        required
                        fullWidth
                      />
                    </FormControl>
                  )}
                />
              </div>

              {/* Discount Value */}
              <div className="flex flex-col ">
                <Typography className="text-sm font-medium mb-1 text-left md:text-center">
                  Disc. Value
                </Typography>
                <Controller
                  name="discountValue"
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      variant="outlined"
                      size="small"
                      className="bg-white w-full col-span-3"
                    >
                      <TextField
                        {...field}
                        label="Discount Value"
                        variant="outlined"
                        className="bg-white"
                        error={!!errors.discountValue}
                        helperText={errors?.discountValue?.message}
                        required
                        fullWidth
                      />
                    </FormControl>
                  )}
                />
              </div>

              {/* Net Rate */}
              <div className="flex flex-col ">
                <Typography className="text-sm font-medium mb-1 text-left md:text-center">
                  Net Rate
                </Typography>
                <Controller
                  name="netRate"
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      variant="outlined"
                      size="small"
                      className="bg-white w-full col-span-3"
                    >
                      <TextField
                        {...field}
                        label="Net Rate"
                        variant="outlined"
                        className="bg-white"
                        error={!!errors.netRate}
                        helperText={errors?.netRate?.message}
                        required
                        fullWidth
                      />
                    </FormControl>
                  )}
                />
              </div>

              {/* Amount */}
              <div className="flex flex-col ">
                <Typography className="text-sm font-medium mb-1 text-left md:text-center">
                  Amount
                </Typography>
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      variant="outlined"
                      size="small"
                      className="bg-white w-full col-span-3"
                    >
                      <TextField
                        {...field}
                        label="Amount"
                        variant="outlined"
                        className="bg-white"
                        error={!!errors.amount}
                        helperText={errors?.amount?.message}
                        required
                        fullWidth
                      />
                    </FormControl>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Fields */}

        <div className="flex gap-4 mb-6 flex-wrap items-center justify-center">
          {/* <Button variant="contained" className="rounded-md" color="primary">
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
            </Button> */}
          <Button
            variant="contained"
            className="rounded-md"
            type="submit"
            disabled={!isValid && loading}
            onClick={() => console.log("Loading")}
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
            onClick={handleClose}
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
            onClick={handleClose}
          >
            Back
          </Button>
          {/* <Button variant="contained" className="rounded-md" color="success">
              Close Bill
            </Button>
            <Button variant="contained" className="rounded-md">
              Return
            </Button> */}
          {/* <Button variant="outlined" className="rounded-md">
              Back
            </Button> */}
        </div>
        {/* Buttons */}
        {/* <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 justify-center">
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
             <TextField
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
                   />
            <Button
              // size={small}
              variant="contained"
              className="rounded-md col-span-1"
              onClick={handleOpen}
            >
              Report
            </Button>
          </div> */}
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

export default UsersFormPage;
