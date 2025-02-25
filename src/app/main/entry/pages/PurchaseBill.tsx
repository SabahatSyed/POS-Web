import { Controller, useFieldArray, useForm } from "react-hook-form";
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
  getRecordById
} from "../../entry/store/PurchaseBillSlice";
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
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const defaultProduct = {
  inventoryInformation: "",
  batch: "",
  description: "",
  quantity: 0,
  purchaseRate: 0,
  discount: 0,
  discountValue: 0,
  netRate: 0,
  amount: 0,
};

const defaultValues = {
  purchaseBill: "",
  chartOfAccount: "",
  salesmen: "",
  date: new Date(),
  paymentType: "cash",
  balance: 0,
  remarks: "",
  return: true,
  products: [defaultProduct],
};

const schema = yup.object().shape({
  purchaseBill: yup.string(),
  chartOfAccount: yup.string().required("Chart of Account is required"),
  salesmen: yup.string().required("Salesman is required"),
  date: yup.date().required("Date is required"),
  paymentType: yup.string().required("Payment Type is required"),
  balance: yup.number().required("Balance is required").min(0),
  remarks: yup.string(),
  return: yup.boolean(),
  products: yup.array().of(
    yup.object().shape({
      inventoryInformation: yup.string().required("Product is required"),
      batch: yup.string().required("Batch is required"),
      description: yup.string().required("Description is required"),
      quantity: yup.number().required("Quantity is required").min(1),
      purchaseRate: yup.number().required("Purchase Rate is required").min(0),
      discount: yup.number().min(0),
      discountValue: yup.number().min(0),
      netRate: yup.number().required("Net Rate is required").min(0),
      amount: yup.number().required("Amount is required").min(0),
    })
  ),
});

function PurchaseBillFormPage() {
  const {
    handleSubmit,
    reset,
    control,
    watch,
    formState,
    setValue,
    getValues,
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const { id } = useParams();
  const dispatch = useDispatch<any>();
  const [loading, setLoading] = useState(false);
  const { isValid, errors } = formState;
  console.log(errors);
  const [salesMenOptions, setSalesMenOptions] = useState([]);
  const [chartOfAccounts, setChartOfAccounts] = useState([]);
  const [inventoryInformationOptions, setInventoryInformationOptions] =
    useState([]);
  const [batchOptions, setBatchOptions] = useState([]);
  const [fetchingBill, setFetchingBill] = useState(false);
  const [billFlag, setBillFlag] = useState(true);
  const formData = watch();
  console.log(formData);

  useEffect(() => {
    if (formData.purchaseBill) {
      fetchExistingBill(formData.purchaseBill);
    }
  }, [formData.purchaseBill]);

  const fetchExistingBill = async (billId: string) => {
    try {
      setFetchingBill(true);
      const params = { id: billId };
      const response = await dispatch(getRecordById(params));
      if (response?.payload) {
        const billData = response.payload
        reset({
          ...billData,
          purchaseBill:billId,
          date: moment(billData.date).toDate(), // Convert to valid Date object
          products: billData.products,
          return:true
        });
        dispatch(showMessage({ message: "Bill attached successfully", variant: "success" }));
      } else {
        dispatch(showMessage({ message: "Bill not found", variant: "error" }));
      }
    } catch (error) {
      dispatch(
        showMessage({ message: "Error fetching bill", variant: "error" })
      );
    } finally {
      setFetchingBill(false);
    }
  };

  const onSubmit = async (data: any) => {

    const payload = {
      ...data,
      products: data?.products?.map((product) => ({
        ...product,
        quantity: Number(product.quantity),
        purchaseRate: Number(product.purchaseRate),
        discount: Number(product.discount),
        discountValue: Number(product.discountValue),
        netRate: Number(product.netRate),
        amount: Number(product.amount),
      })),
    };

    try {
      setLoading(true);
      if (id) {
        await dispatch(updateRecord({ id, payload }));
      } else {
        await dispatch(addRecord({ payload }));
      }
      reset();
      dispatch(showMessage({ message: "Success", variant: "success" }));
    } catch (error) {
      dispatch(showMessage({ message: error.message, variant: "error" }));
    } finally {
      setLoading(false);
    }
  };

  // Load initial data for dropdowns
  useEffect(() => {
    const loadOptions = async () => {
      const [
        inventoryResponse,
        batchesResponse,
        salesmenResponse,
        chartResponse,
      ] = await Promise.all([
        dispatch(getInventoryInformationRecords({ limit: 100 })),
        dispatch(getBatchRecords({ limit: 100 })),
        dispatch(getSalesmenRecords({ limit: 100 })),
        dispatch(getChartOfAccountsRecords({ limit: 100 })),
      ]);

      setInventoryInformationOptions(
        inventoryResponse.payload.records.map((item) => ({
          value: item._id,
          name: `${item.code}: ${item.name}`,
        }))
      );
      setBatchOptions(
        batchesResponse.payload.records.map((item) => ({
          value: item._id,
          name: `${item.code}: ${item.description}`,
        }))
      );
      setSalesMenOptions(
        salesmenResponse.payload.records.map((item) => ({
          value: item._id,
          name: `${item.code}: ${item.name}`,
        }))
      );
      setChartOfAccounts(
        chartResponse.payload.records.map((item) => ({
          value: item._id,
          name: `${item.code}: ${item.description}`,
        }))
      );
    };
    loadOptions();
  }, []);

  useEffect(() => {
    // Add any custom logic here
    setBillFlag((prev) => !prev);
    setValue("purchaseBill", "");
    if(!getValues("return")){
      reset({...defaultValues, return: false})
    }
  }, [getValues("return")]); // Still watch the value change

  const calculateProductFields = (index: number) => {
    const product = formData.products[index];
    const purchaseRate = Number(product.purchaseRate) || 0;
    const quantity = Number(product.quantity) || 0;
    const discount = Number(product.discount) || 0;

    const discountValue = (purchaseRate * discount) / 100;
    const netRate = purchaseRate - discountValue;
    const amount = netRate * quantity;

    setValue(`products.${index}.discountValue`, discountValue);
    setValue(`products.${index}.netRate`, netRate);
    setValue(`products.${index}.amount`, amount);
  };

  const data = watch();

  const formContent = (
    <form onSubmit={handleSubmit(onSubmit)} className="p-24 w-full">
      <Box className="grid gap-24 mb-24">
        <Box className="grid grid-cols-3 gap-16">
          {/* Date Picker */}
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Date"
                value={field.value}
                onChange={field.onChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            )}
          />

          {/* Customer Select */}
          <Controller
            name="chartOfAccount"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                {/* <InputLabel>Customer</InputLabel> */}
                <Select
                  {...field}
                  // label="Customer"
                  displayEmpty
                  // renderValue={(value) => value || "Select Customer..."}
                >
                  <MenuItem disabled value="">
                    <em>Select Customer...</em>
                  </MenuItem>
                  {chartOfAccounts.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          {/* Salesman Select */}
          <Controller
            name="salesmen"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                {/* <InputLabel>Salesman</InputLabel> */}
                <Select
                  {...field}
                  // label="Salesman"
                  displayEmpty
                  // renderValue={(value) => value || "Select Salesman..."}
                >
                  <MenuItem disabled value="">
                    <em>Select Salesman...</em>
                  </MenuItem>
                  {salesMenOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Box>

        {/* Product Fields */}
        {fields.map((field, index) => (
          <Box key={field.id} className="border p-16 rounded-8">
            <Box className="flex justify-between mb-16">
              <Typography variant="h6">Product {index + 1}</Typography>
              <IconButton onClick={() => remove(index)}>
                <RemoveIcon />
              </IconButton>
            </Box>

            <Box className="grid grid-cols-4 gap-16">
              {/* Product Select */}
              <Controller
                name={`products.${index}.inventoryInformation`}
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    {/* <InputLabel>Product</InputLabel> */}
                    <Select
                      {...field}
                      // label="Product"
                      displayEmpty
                      // renderValue={(value) => value || "Select Product..."}
                    >
                      <MenuItem disabled value="">
                        <em>Select Product...</em>
                      </MenuItem>
                      {inventoryInformationOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />

              {/* Batch Select */}
              <Controller
                name={`products.${index}.batch`}
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    {/* <InputLabel>Batch</InputLabel> */}
                    <Select
                      {...field}
                      // label="Batch"
                      displayEmpty
                      // renderValue={(value) => value || "Select Batch..."}
                    >
                      <MenuItem disabled value="">
                        <em>Select Batch...</em>
                      </MenuItem>
                      {batchOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              {/* Description Input */}


              <Controller
                name={`products.${index}.description`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    type="text"
                    fullWidth
                    onChange={(e) => {
                      field.onChange(e);
                      calculateProductFields(index);
                    }}
                  />
                )}
              />

              {/* Quantity Input */}
              <Controller
                name={`products.${index}.quantity`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Quantity"
                    type="number"
                    fullWidth
                    onChange={(e) => {
                      field.onChange(e);
                      calculateProductFields(index);
                    }}
                  />
                )}
              />

              {/* Purchase Rate Input */}
              <Controller
                name={`products.${index}.purchaseRate`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Purchase Rate"
                    type="number"
                    fullWidth
                    onChange={(e) => {
                      field.onChange(e);
                      calculateProductFields(index);
                    }}
                  />
                )}
              />

              {/* Discount Input */}
              <Controller
                name={`products.${index}.discount`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Discount %"
                    type="number"
                    fullWidth
                    onChange={(e) => {
                      field.onChange(e);
                      calculateProductFields(index);
                    }}
                  />
                )}
              />

              {/* Discount Value Input */}
              <Controller
                name={`products.${index}.discountValue`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Discount Value"
                    disabled
                    type="number"
                    fullWidth
                  />
                )}
              />

              {/* Net Rate Input */}
              <Controller
                name={`products.${index}.netRate`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Net Rate"
                    disabled
                    type="number"
                    fullWidth
                  />
                )}
              />

              {/* Amount Input */}
              <Controller
                name={`products.${index}.amount`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Amount"
                    disabled
                    type="number"
                    fullWidth
                  />
                )}
              />
            </Box>
          </Box>
        ))}

        {/* Add Product Button */}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => append(defaultProduct)}
        >
          Add Product
        </Button>

        {/* Payment Section */}
        <Box className="grid grid-cols-3 gap-16">
          {/* Payment Type Select */}
          <Controller
            name="paymentType"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Payment Type</InputLabel>
                <Select
                  {...field}
                  label="Payment Type"
                  displayEmpty
                  // renderValue={(value) => value || "Select Payment Type..."}
                >
                  <MenuItem disabled value="">
                    <em>Select Payment Type...</em>
                  </MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="credit">Credit</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          {/* Balance Input */}
          <Controller
            name="balance"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Balance" type="number" fullWidth />
            )}
          />

          {/* Remarks Input */}
          <Controller
            name="remarks"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Remarks" fullWidth />
            )}
          />
        </Box>
      </Box>

      {/* Action Buttons */}
      {/* Action Buttons */}
      <Box className="flex gap-16">
        <Button
          variant="contained"
          className="rounded-md"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : !billFlag ? (
            "Return Bill"
          ) : (
            "Close Bill"
          )}
        </Button>
        <Button
          variant="outlined"
          onClick={() => reset(defaultValues)}
          color="secondary"
        >
          Reset
        </Button>
      </Box>
    </form>
  );

  const header = (
    <Box className="flex flex-col container p-24">
      <Typography variant="h4">Purchase Bill</Typography>
      <Box className="flex gap-16 mt-16">
        <Controller
          name="return"
          control={control}
          render={({ field }) => (
            <RadioGroup row {...field}>
              <FormControlLabel
                value={false}
                control={<Radio />}
                label="New Bill"
              />
              <FormControlLabel
                value={true}
                control={<Radio />}
                label="Old Bill"
              />
            </RadioGroup>
          )}
        />
        {!billFlag && (
          <Controller
            name="purchaseBill"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Bill ID"
                disabled={fetchingBill}
                InputProps={{
                  endAdornment: fetchingBill && <CircularProgress size={20} />,
                }}
              />
            )}
          />
        )}
      </Box>
    </Box>
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
export default PurchaseBillFormPage;
