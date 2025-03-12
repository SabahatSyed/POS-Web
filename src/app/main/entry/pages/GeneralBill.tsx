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
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Autocomplete from "@mui/material/Autocomplete";
import * as yup from "yup";
import CircularProgress from "@mui/material/CircularProgress";
import { yupResolver } from "@hookform/resolvers/yup";
import _ from "@lodash";
import React, { useCallback, useEffect, useState } from "react";
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
  selectRecords,
} from "../../entry/store/GeneralBillSlice";
import { getRecords as getInventoryInformationRecords } from "../../setup/store/inventoryInformationSlice";
import { getRecords as getKeypointsRecords } from "../../keypoints/store/keypointsSlice";

import { getRecords as getBatchRecords } from "../../setup/store/batchSlice";
import { getRecords as getSalesmenRecords } from "../../setup/store/salesmenSlice";
import { useAppDispatch, useAppSelector } from "app/store";
import { showMessage } from "app/store/fuse/messageSlice";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ThermalPrintDialog from "./ThermalPrintDialog";
import A4Print from "./A4PrintDialog";

const defaultProduct = {
  inventoryInformation: "",
  batch: "",
  description: "",
  revisedQuantity: 0,
  tradeRate: 0,
  discount: 0,
  discountValue: 0,
  netRate: 0,
  amount: 0,
};

const defaultValues = {
  saleBill: "",
  keyPoints: "",
  salesmen: "",
  date: new Date(),
  paymentType: "cash",
  balance: 0,
  remarks: "",
  return: false,
  products: [defaultProduct],
  lastBill: "",
};

const schema = yup.object().shape({
  saleBill: yup.string(),
  lastBill: yup.string(),
  keyPoints: yup.string().required("Customer is required"),
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
      description: yup.string(),
      revisedQuantity: yup.number().required("Quantity is required").min(1),
      tradeRate: yup.number().required("Trade Rate is required").min(0),
      discount: yup.number().min(0),
      discountValue: yup.number().min(0),
      netRate: yup.number().required("Net Rate is required").min(0),
      amount: yup.number().required("Amount is required").min(0),
    })
  ),
});

function SalesBillFormPage() {
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
  const [loading, setLoading] = useState(false);
  const { isValid, errors } = formState;
  const [salesMenOptions, setSalesMenOptions] = useState([]);
  const [chartOfAccounts, setChartOfAccounts] = useState([]);
  const [inventoryInformationOptions, setInventoryInformationOptions] =
    useState([]);
  const [batchOptions, setBatchOptions] = useState([]);
  const [fetchingBill, setFetchingBill] = useState(false);
  const [billFlag, setBillFlag] = useState(true);
  const formData = watch();
  const [open, setOpen] = useState(false);
  const [openThermal, setOpenThermal] = useState(false);
  const records = useAppSelector(selectRecords);
  const dispatch = useAppDispatch();
  const [totalAmount, setTotalAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [netAmount, setNetAmount] = useState(0);

  const handleOpen = () => {
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

  useEffect(() => {
    if (formData.saleBill) {
      fetchExistingBill(formData.saleBill);
    }
  }, [formData.saleBill]);

  useEffect(() => {
    if (!records?.records) dispatch(getRecords({}));
  }, [dispatch, getRecords]);

  console.log("records",records)
  const getNextCode = useCallback(() => {
    if (records) {
      console.log("records", records);
      if (!records?.records || records?.records?.length == 0) return "0001"; // Start from "0001" if no records exist
      const lastCode = records.records
        ?.map((record) => parseInt(record.bill, 10))
        ?.filter((num) => !isNaN(num))
        ?.sort((a, b) => b - a)[0]; // Get the highest existing code
      return String(lastCode + 1).padStart(4, "0"); // Increment and pad to 4 digits
    }
    return "0001";
  }, [records]);

  const getLastCode = useCallback(() => {
    if (records) {
      if (!records?.records || records?.records?.length === 0) return ""; // Start from "0001" if no records exist
      const lastCode = records.records
        ?.map((record) => parseInt(record.bill))
        ?.filter((num) => !isNaN(num))
        ?.sort((a, b) => b - a)[0]; // Get the highest existing code
      return String(lastCode).padStart(4, "0"); // Increment and pad to 4 digits
    }
  }, [records?.records]);

  useEffect(() => {
    if (!getValues("return")) {
      setValue("saleBill", getNextCode()); // Auto-set the code on form load
    }
  }, [getValues("return")]);

  useEffect(() => {
    setValue("lastBill", getLastCode()); // Auto-set the code on form load
  }, [records]);

  const fetchExistingBill = async (billId: string) => {
    try {
      setFetchingBill(true);
      const params = { id: billId };
      const response = await dispatch(getRecordById(params));
      if (response?.payload) {
        const billData = response.payload;
        reset({
          ...billData,
          date: moment(billData.date).toDate(), // Convert to valid Date object
          products: billData.products,
          return: true,
          salesmen: billData.salesmen?._id,
          keyPoints: billData.keyPoints?._id || "Customer",
          saleBill: billId,
        });

        dispatch(
          showMessage({
            message: "Bill attached successfully",
            variant: "success",
          })
        );
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
    const { keyPoints, ...formdata } = data;
    const payload = {
      ...(keyPoints !== "Customer" ? { keyPoints } : {}),
      ...formdata,
      products: formdata?.products?.map((product) => ({
        ...product,
        quantity: formdata.return
          ? Number(product.quantity)
          : Number(product.revisedQuantity),
        tradeRate: Number(product.tradeRate),
        discount: Number(product.discount),
        discountValue: Number(product.discountValue),
        netRate: Number(product.netRate),
        amount: Number(product.amount),
        revisedQuantity: Number(product.revisedQuantity),
      })),
    };

    try {
      setLoading(true);
      if (data.return) {
        const data = await dispatch(
          updateRecord({ id: payload.saleBill, payload })
        ).unwrap();
        dispatch(showMessage({ message: "Success", variant: "success" }));
        dispatch(getRecords({}));
      } else {
        const data = await dispatch(
          addRecord({ payload: { ...payload, bill: getNextCode() } })
        ).unwrap();
        dispatch(showMessage({ message: "Success", variant: "success" }));
      }
      reset();
      setValue("lastBill", getLastCode());
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
        dispatch(getKeypointsRecords({ limit: 100 })),
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
          quantity: parseInt(item.quantity),
          inventoryInformation: item.inventoryInformation,
        }))
      );
      setSalesMenOptions(
        salesmenResponse.payload.records.map((item) => ({
          value: item._id,
          name: `${item.code}: ${item.name}`,
          saleman: item.name,
        }))
      );
      setChartOfAccounts([
        ...chartResponse.payload.records.map((item) => ({
          value: item._id,
          name: `${item.keypoints.name}`,
          customer: item.keypoints.name,
        })),
        {
          value: "Customer", // You can adjust the value if needed
          name: "Customer",
          customer: "Customer",
        },
      ]);
    };
    loadOptions();
  }, []);

  useEffect(() => {
    // Add any custom logic here
    setBillFlag((prev) => !prev);
    setValue("saleBill", "");
  }, [getValues("return")]); // Still watch the value change

  const calculateProductFields = (index: number) => {
    const product = formData.products[index];
    const tradeRate = Number(product.tradeRate) || 0;
    const quantity = Number(product.revisedQuantity) || 0;
    const discount = Number(product.discount) || 0;
    const batch = batchOptions.find((batch) => batch.value === product.batch);
    const existingBillProduct = formData.products.find(
      (p) =>
        p.inventoryInformation === product.inventoryInformation &&
        p.batch === product.batch
    );

    if (batch && quantity > batch.quantity) {
      setValue(`products.${index}.revisedQuantity`, batch.quantity);
      dispatch(
        showMessage({
          message: "Quantity exceeds batch amount",
          variant: "error",
        })
      );
      return;
    }
    if (
      formData.return &&
      existingBillProduct &&
      quantity > Number(existingBillProduct.quantity)
    ) {
      setValue(
        `products.${index}.revisedQuantity`,
        existingBillProduct.quantity
      );
      dispatch(
        showMessage({
          message: "Quantity exceeds existing bill quantity",
          variant: "error",
        })
      );
      return;
    }

    const discountValue = (tradeRate * discount) / 100;
    const netRate = tradeRate - discountValue;
    const amount = netRate * quantity;

    setValue(`products.${index}.discountValue`, discountValue);
    setValue(`products.${index}.netRate`, netRate);
    setValue(`products.${index}.amount`, amount);
    calculateTotals();
  };

  const calculateTotals = () => {
    const products = getValues("products");
    const balance = Number(getValues("balance")) || 0;
    const discountPercentage = Number(discount) || 0;

    const totalAmount = products.reduce(
      (sum, product) => sum + Number(product.amount),
      0
    );
    const discountAmount = (totalAmount * discountPercentage) / 100;
    const netAmount = totalAmount - discountAmount - balance;

    setTotalAmount(totalAmount);
    setDiscountAmount(discountAmount);
    setNetAmount(netAmount);
  };

  useEffect(() => {
    calculateTotals();
  }, [formData.products, formData.balance, discount]);

  const data = watch();
  const formContent = (
    <>
      {open && (
        <A4Print
          discount={discount}
          discountAmount={discountAmount}
          netAmount={netAmount}
          totalAmount={totalAmount}
          products={formData.products}
          invoice={formData.saleBill}
          customer={
            chartOfAccounts.find((c) => c.value === formData?.keyPoints)
              ?.customer
          }
          salesman={
            salesMenOptions.find((s) => s.value === formData.salesmen)?.saleman
          }
          date={formData.date}
          remarks={formData.remarks}
          balance={formData.balance}
          open={open}
          handleClose={handleClose}
          handleOpenThermal={handleOpenThermal}
          handleCloseThermal={handleCloseThermal}
        />
      )}
      {/* </div> */}

      {openThermal && (
        <ThermalPrintDialog
          discount={discount}
          discountAmount={discountAmount}
          netAmount={netAmount}
          totalAmount={totalAmount}
          products={formData.products}
          openThermal={openThermal}
          handleCloseThermal={handleCloseThermal}
          handleOpenThermal={handleOpenThermal}
          handleOpen={handleOpen}
          customer={
            chartOfAccounts.find((c) => c.value === formData?.keyPoints)
              ?.customer
          }
          salesman={
            salesMenOptions.find((s) => s.value === formData.salesmen)?.saleman
          }
          date={formData.date}
          invoice={formData.saleBill}
          remarks={formData.remarks}
          balance={formData.balance}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="p-24 w-full">
        <Box className="grid gap-24 mb-10">
          <Box className="grid grid-cols-3 gap-16 ">
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
              name="keyPoints"
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
          <hr className="my-4 border border-gray-300" />

          {/* Product Fields */}
          {fields.map((field, index) => (
            <Box key={field.id} className="border  rounded-8">
              <Box className="grid grid-cols-4 space-y-4 md:flex md:items-center md:justify-between mb-16 gap-4">
                <Box>
                  <Typography variant="h6" className="mr-10">
                    {index + 1}
                  </Typography>
                </Box>

                {/* <Box className="grid grid-cols-4 gap-16"> */}
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
                        {batchOptions
                          .filter(
                            (batch) =>
                              batch.inventoryInformation ===
                              getValues(
                                `products.${index}.inventoryInformation`
                              )
                          )
                          .filter(
                            (batch) =>
                              !formData.products.some(
                                (p, i) => i !== index && p.batch === batch.value
                              )
                          )
                          .map((option) => (
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
                  name={`products.${index}.revisedQuantity`}
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

                {/* Trade Rate Input */}
                <Controller
                  name={`products.${index}.tradeRate`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Trade Rate"
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
                {/* </Box> */}
                <IconButton onClick={() => remove(index)}>
                  <RemoveIcon />
                </IconButton>
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

        <hr className=" border border-gray-300 my-20" />

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
            ) : getValues("return") ? (
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
        <hr className=" border border-gray-300 my-20" />

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 justify-center mt-10">
          <TextField
            label="Total Amount"
            variant="outlined"
            size="small"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            className=" col-span-1"
          />
          <TextField
            label="Disc (%)"
            variant="outlined"
            size="small"
            onChange={(e) => setDiscount(e.target.value)}
            value={discount}
            className=" col-span-1"
          />
          <TextField
            label="Disc Amount"
            variant="outlined"
            size="small"
            value={discountAmount}
            onChange={(e) => setDiscountAmount(e.target.value)}
            className="col-span-1"
          />
          <TextField
            label="Net Amount"
            variant="outlined"
            size="small"
            value={netAmount}
            onChange={(e) => setNetAmount(e.target.value)}
            className="col-span-1"
          />

          <Button
            // size={small}
            variant="contained"
            className="rounded-md col-span-1"
            onClick={handleOpen}
          >
            Report
          </Button>
        </div>
      </form>
    </>
  );

  const header = (
    <Box className="flex items-center justify-between w-full">
      <Box className="flex flex-col container p-24">
        <Typography variant="h4">General Bill</Typography>
        <Box className="flex items-center justify-between w-full">
          <Box className="flex gap-16 mt-16">
            <Controller
              name="return"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  row
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    if (e.target.value === "false") {
                      reset(defaultValues); // Reset the form to default values
                      setValue("saleBill", getNextCode()); // Auto-set the code on form load
                    }
                  }}
                >
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
            {watch("return") && (
              <Controller
                name="saleBill"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Bill ID"
                    disabled={fetchingBill && !watch("return")}
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
          <Typography variant="body1">
            Last Bill : {getValues("lastBill")}
          </Typography>
        </Box>
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

export default SalesBillFormPage;
