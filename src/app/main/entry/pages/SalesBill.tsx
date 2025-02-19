import { Controller, useForm, useFieldArray } from "react-hook-form";
import Checkbox from "@mui/material/Checkbox";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
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
  Collapse,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Autocomplete from "@mui/material/Autocomplete";
import * as yup from "yup";
import CircularProgress from "@mui/material/CircularProgress";
import { yupResolver } from "@hookform/resolvers/yup";
import _ from "@lodash";
import React, { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormHelperText from "@mui/material/FormHelperText";
import { DateTimePicker } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { useMemo } from "react";
import { motion } from "framer-motion";
import moment from "moment";
import {
  addRecord,
  getRecords,
  updateRecord,
  getRecordById,
} from "../../entry/store/SalesBillSlice";
import { getRecords as getInventoryInformationRecords } from "../../setup/store/inventoryInformationSlice";
import { getRecords as getBatchRecords } from "../../setup/store/batchSlice";
import { getRecords as getSalesmenRecords } from "../../setup/store/salesmenSlice";
import { getRecords as getChartOfAccountsRecords } from "../../setup/store/chartOfAccountSlice";
import { useAppSelector } from "app/store";
import { showMessage } from "app/store/fuse/messageSlice";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const defaultProduct = {
  inventoryInformation: "",
  batch: "",
  description: "",
  quantity: 0,
  tradeRate: 0,
  discount: 0,
  discountValue: 0,
  netRate: 0,
  amount: 0,
};

const defaultValues = {
  saleBill: "",
  chartOfAccount: "",
  salesmen: "",
  date: new Date(),
  paymentType: "cash",
  balance: 0,
  remarks: "",
  return: false,
  products: [defaultProduct],
};

const schema = yup.object().shape({
  saleBill: yup.string(),
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
      tradeRate: yup.number().required("Trade Rate is required").min(0),
      discount: yup.number().min(0),
      discountValue: yup.number().min(0),
      netRate: yup.number().required("Net Rate is required").min(0),
      amount: yup.number().required("Amount is required").min(0),
    })
  ),
});

function SalesBillFormPage() {
  const { handleSubmit, reset, control, watch, formState, setValue,getValues } = useForm({
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
  const [salesMenOptions, setSalesMenOptions] = useState([]);
  const [chartOfAccounts, setChartOfAccounts] = useState([]);
  const [inventoryInformationOptions, setInventoryInformationOptions] = useState([]);
  const [batchOptions, setBatchOptions] = useState([]);
  const [fetchingBill, setFetchingBill] = useState(false);
  const [billFlag,setBillFlag]=useState(true)
  const formData = watch();
  console.log(formData)
  
  useEffect(() => {
    if (formData.saleBill) {
      fetchExistingBill(formData.saleBill);
    }
  }, [formData.saleBill]);

  const fetchExistingBill = async (billId: string) => {
    try {
      setFetchingBill(true);
      const params = { id:billId }
      const response = await dispatch(getRecordById(params));
      if (response?.payload?.records.length > 0) {
        const billData = response.payload.records[0];
        reset({
          ...billData,
          products: billData.products,
          return: false,
        });
      }else{
        dispatch(showMessage({ message: "Bill not found", variant: "error" }));
      }
    } catch (error) {
      dispatch(showMessage({ message: "Error fetching bill", variant: "error" }));
    } finally {
      setFetchingBill(false);
    }
  };

  const onSubmit = async (data: any) => {
    const payload = {
      ...data,
      products: data?.products?.map(product => ({
        ...product,
        quantity: Number(product.quantity),
        tradeRate: Number(product.tradeRate),
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
      dispatch(showMessage({ message: "Success", variant: "success" }));
      reset();
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
        dispatch(getBatchRecords({ limit: 100})),
        dispatch(getSalesmenRecords({ limit: 100})),
        dispatch(getChartOfAccountsRecords({ limit: 100})),
      ]);

      setInventoryInformationOptions(inventoryResponse.payload.records.map(item => ({
        value: item._id,
        name: `${item.code}: ${item.name}`,
      })));
      setBatchOptions(batchesResponse.payload.records.map(item => ({
        value: item._id,
        name: `${item.code}: ${item.description}`,
      })));
      setSalesMenOptions(salesmenResponse.payload.records.map(item => ({
        value: item._id,
        name: `${item.code}: ${item.name}`,
      })));
      setChartOfAccounts(chartResponse.payload.records.map(item => ({
        value: item._id,
        name: `${item.code}: ${item.description}`,
      })));
    };
    loadOptions();
  }, []);

  useEffect(() => {
    // Add any custom logic here
    setBillFlag(prev=> !prev);
    setValue("saleBill","")
  }, [getValues("return")]); // Still watch the value change

  const calculateProductFields = (index: number) => {
    const product = formData.products[index];
    const tradeRate = Number(product.tradeRate) || 0;
    const quantity = Number(product.quantity) || 0;
    const discount = Number(product.discount) || 0;
    
    const discountValue = (tradeRate * discount) / 100;
    const netRate = tradeRate - discountValue;
    const amount = netRate * quantity;

    setValue(`products.${index}.discountValue`, discountValue);
    setValue(`products.${index}.netRate`, netRate);
    setValue(`products.${index}.amount`, amount);
  };

  return (
    <FusePageSimple
      header={
        <Box className="flex flex-col container p-24">
          <Typography variant="h4">Sales Bill</Typography>
          <Box className="flex gap-16 mt-16">
            <Controller
              name="return"
              control={control}
              render={({ field }) => (
                <RadioGroup row {...field}>
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label="New Bill"
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label="Old Bill"
                  />
                </RadioGroup>
              )}
            />
            {!billFlag && (
              <Controller
                name="saleBill"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Bill ID"
                    disabled={fetchingBill}
                    InputProps={{
                      endAdornment: fetchingBill && (
                        <CircularProgress size={20} />
                      ),
                    }}
                  />
                )}
              />
            )}
          </Box>
        </Box>
      }
      content={
        <form onSubmit={handleSubmit(onSubmit)} className="p-24">
          <Box className="grid gap-24 mb-24">
            <Box className="grid grid-cols-3 gap-16">
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Date"
                    value={field.value}
                    onChange={field.onChange}
                    renderInput={(params) => <TextField {...params} />}
                  />
                )}
              />
              <Controller
                name="chartOfAccount"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Customer">
                    {chartOfAccounts.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <Controller
                name="salesmen"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Salesman">
                    {salesMenOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </Box>

            {fields.map((field, index) => (
              <Box key={field.id} className="border p-16 rounded-8">
                <Box className="flex justify-between mb-16">
                  <Typography variant="h6">Product {index + 1}</Typography>
                  <IconButton onClick={() => remove(index)}>
                    <RemoveIcon />
                  </IconButton>
                </Box>
                
                <Box className="grid grid-cols-4 gap-16">
                  <Controller
                    name={`products.${index}.inventoryInformation`}
                    control={control}
                    render={({ field }) => (
                      <Select {...field} label="Product">
                        {inventoryInformationOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  <Controller
                    name={`products.${index}.batch`}
                    control={control}
                    render={({ field }) => (
                      <Select {...field} label="Batch">
                        {batchOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  <Controller
                    name={`products.${index}.quantity`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Quantity"
                        type="number"
                        onChange={(e) => {
                          field.onChange(e);
                          calculateProductFields(index);
                        }}
                      />
                    )}
                  />
                  <Controller
                    name={`products.${index}.tradeRate`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Trade Rate"
                        type="number"
                        onChange={(e) => {
                          field.onChange(e);
                          calculateProductFields(index);
                        }}
                      />
                    )}
                  />
                  <Controller
                    name={`products.${index}.discount`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Discount %"
                        type="number"
                        onChange={(e) => {
                          field.onChange(e);
                          calculateProductFields(index);
                        }}
                      />
                    )}
                  />
                  <Controller
                    name={`products.${index}.discountValue`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Discount Value"
                        disabled
                        type="number"
                      />
                    )}
                  />
                  <Controller
                    name={`products.${index}.netRate`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Net Rate"
                        disabled
                        type="number"
                      />
                    )}
                  />
                  <Controller
                    name={`products.${index}.amount`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Amount"
                        disabled
                        type="number"
                      />
                    )}
                  />
                </Box>
              </Box>
            ))}

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => append(defaultProduct)}
            >
              Add Product
            </Button>

            <Box className="grid grid-cols-3 gap-16">
              <Controller
                name="paymentType"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Payment Type">
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="credit">Credit</MenuItem>
                  </Select>
                )}
              />
              <Controller
                name="balance"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Balance" type="number" />
                )}
              />
              <Controller
                name="remarks"
                control={control}
                render={({ field }) => <TextField {...field} label="Remarks" />}
              />
            </Box>
          </Box>

          <Box className="flex gap-16">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading }
            >
              {loading ? <CircularProgress size={24} /> : !billFlag ? "Return Bill" :"Close Bill" }
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
      }
    />
  );
}

export default SalesBillFormPage;