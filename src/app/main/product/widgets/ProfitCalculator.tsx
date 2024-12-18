import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo, useEffect, useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useAppSelector } from 'app/store';
import { selectWidgets } from '../store/productsSlice';
import PreviousStatementWidgetType from '../types/PreviousStatementWidgetType';
import { Button, Checkbox, CircularProgress, FormControlLabel, Input, Radio, RadioGroup, TextField } from '@mui/material';
import history from '@history';
import * as yup from 'yup';
import { getRecords, selectRecords } from '../../setting/store/settingSlice';
import { useDispatch } from 'react-redux';
import { SettingType, SettingsType } from '../../setting/types/setting';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { showMessage } from 'app/store/fuse/messageSlice';
import axios from 'axios';
import FeeCalculation from './FeeCalculation';

/**
 * The ProfitCalculatorWidget.
 */
function ProfitCalculatorWidget({ data, caldata, setCalData, feeCalData, setValue, getValues, quantity, watch, setQuantity, register, control, calcLoading, reset, handleFulfillmentOptionChange, selectedFulfillmentOption}) {
    // console.log("saira",data);
    // const [selectedOption, setSelectedOption] = useState('Lowest');
    // const [customFieldDisabled, setCustomFieldDisabled] = useState(true);

    // useEffect(() => {
    //   // Enable or disable the custom field based on the selected option
    //   // setCustomFieldDisabled(getValues("priceOption") !== 'Custom');
    //   console.log(getValues())

    // }, [customFieldDisabled]);

    // console.log("ProfitCalculatorWidget", data)
    // console.log("quantity", quantity);
    // const defaultValues = {
    // option: 'FBA',
    //   salePrice: 0,
    //   costPrice: 0,
    //   storage: 1,
    //   maxCost: 0,
    //   roi: 0,
    //   totalProfit: 0,
    // };
    // const dispatch = useDispatch<any>()
    // // const [loading, setLoading] = useState(false);
    // useEffect(() => {
    //       dispatch(getRecords());
    //   }, [dispatch]);

    // const schema = yup.object().shape({
    //     cost_of_goods: yup.number().typeError('value is required').required('value is required'),
    //     // sale_price: yup.number().typeError('value is required').required('value is required'),
    //     storage_months: yup.number().typeError('value is required').required('value is required'),
    //     number_of_units: yup.number().typeError('value is required').required('value is required'),
    //     // roi: yup.number().typeError('value is required').required('value is required'),
    //     // max_cost: yup.number().typeError('value is required').required('value is required'),
    // 	is_fba: yup.boolean().oneOf([true, false], 'Please select a valid fulfillment method'),
    // });

    // const { control, formState, handleSubmit,watch,getValues, setValue, register } = useForm({
    //       defaultValues,
    //       mode: 'onChange',
    //       // resolver: yupResolver(schema)
    //   });
    //   const editableFields = watch(["costPrice", "storage"]);

    // useEffect(() => {
    // 	// Set the value of "salePrice" input field when receivedSalePrice changes
    // 	setValue('salePrice',data?.product_data?.sale_price.toFixed(2) );
    // 	setValue('costPrice',data?.product_data?.sale_price.toFixed(2) );

    //   }, [data?.product_data, setValue]);

    //   const { isValid, dirtyFields, errors } = formState;

    // const records = useAppSelector(selectRecords) as SettingType;

    // useEffect(() => {
    //   // Call your API when editable fields change
    //   const fetchData = async () => {
    //     try {
    //       // Get the current values of editable fields
    //       const costPricee = getValues("costPrice");
    //       const storagee = +getValues("storage");
    //       const isFBA = getValues("option") === "FBA";
    //       const payload = {
    //         product_id: data.product_id,
    //         cost_of_goods: +costPricee,
    //         is_fba: isFBA,
    //         storage_months: storagee,
    //         number_of_units: quantity,
    //       };

    //       // Make an API call using Axios
    //       const response = await axios.post("/api/panels/calculate", payload);

    //       // Update the readOnly fields with the response from the API
    //       setValue(
    //         "maxCost",
    //         response?.data?.calculator_output?.max_cost.toFixed(4)
    //       );
    //       setValue("roi", response?.data?.calculator_output?.roi);
    //       setValue("totalProfit", response?.data?.calculator_output?.total_profit);
    //     } catch (error) {
    //       console.error("Error fetching data:", error);
    //     }
    //   };

    //   fetchData();
    // }, [editableFields]);

    // const onSubmit = async (formData) => {
    //   // setLoading(true);

    //   // // console.log("inputs", formData.costPrice);
    //   // // const isFBA = formData.shippingMethod === "fba";
    //   // const isFBA = formData.option === "FBA";

    //   // // console.log("fbaaa", isFBA);
    //   // const payload = {
    //   //   product_id: data.product_id,
    //   //   cost_of_goods: +(formData.costPrice),
    //   //   is_fba: isFBA,
    //   //   storage_months: formData.storage,
    //   //   number_of_units: quantity,
    //   // };

    //   // try {
    //   //   const response = await axios.post("/api/panels/calculate", payload);
    //   // // console.log("responseee",response);
    //   // setValue("maxCost", response?.data?.calculator_output?.max_cost.toFixed(4));
    //   // setValue("roi", response?.data?.calculator_output?.roi.toFixed(4));
    //   // setValue("totalProfit", response?.data?.calculator_output?.total_profit.toFixed(4));
    //   // setCalData(response);
    //   //   setLoading(false);
    //   //   // console.log(response)
    //   // } catch (error) {
    //   //   console.error("Error sending form data:", error);
    //   //   setLoading(false);
    //   //   return {};
    //   // }
    // };

    //   useEffect(() => {
    //     setValue("maxCost", caldata?.calculator_output?.max_cost);
    //     setValue("roi", caldata?.calculator_output?.roi);
    //     setValue("totalProfit", caldata?.calculator_output?.total_profit);
    //   }, [caldata, setValue]);
    function formatCurrency(value) {
      const isNegative = value < 0;
      const absoluteValue = Math.abs(value).toFixed(2); // Ensures two decimal places
      return isNegative ? `-$${absoluteValue}` : `$${absoluteValue}`;
    }

    const handleIncrement = () => {
        const currentStorage = parseInt(getValues("storage"));
        setValue("storage", currentStorage + 1);
        // console.log("storage increment ", currentStorage + 1);
    };

    const handleDecrement = () => {
        const currentStorage = parseInt(getValues("storage"));
        if (currentStorage > 1) {
            setValue("storage", currentStorage - 1);
            // console.log("storage decrement ", currentStorage - 1);
        }
    };
    const handleInputChange = (e) => {
        const newQuantity = parseInt(e.target.value);
        if (e.target.value === '1') {
            setQuantity(0); // or any default value you prefer when the input is the initial quantity
        } else if (!isNaN(newQuantity)) {
            setQuantity(newQuantity);
        }
    };

    useEffect(()=>{
        if(getValues("storage") && parseInt(getValues("storage")) < 1){
            setValue("storage", 1);
        }
    },watch['storage'])
    
    // useEffect(() => {
    //     reset();
    //     setCalData({});
    // }, []);
    
    return (
      <Paper className="relative flex flex-col rounded-2xl  overflow-hidden h-full">
        <div className="flex items-center justify-between p-24 bg-[#D5E6E9]">
          <div className="flex flex-col gap-8 ">
            <Typography className="text-2xl font-bold tracking-tight leading-6 truncate text-secondary">
              Profit Calculator
            </Typography>
          </div>
          {calcLoading && <CircularProgress size={20} color="secondary" />}
        </div>
        <div className="flex  flex-col sm:p-24 p-4">
          {/* <Paper className="flex p-4 items-center w-full px-16 py-4 border-1 border-gray-A100 h-40 rounded-full shadow-md">
							

							<Input
								placeholder="Enter product name or Product SSID"
								className="flex flex-1 px-8 placeholder:text-black"
								disableUnderline
								fullWidth
								//value={searchText}
								inputProps={{
									'aria-label': 'Search'
								}}
								onKeyDown={handleKeyDown}

								//onChange={handleSearchText}
							/>
							<FuseSvgIcon
								color="secondary"
								size={20}
								onClick={handleSearch}

							>
								heroicons-solid:search
							</FuseSvgIcon>
				</Paper> */}
          <form
            name="Settings"
            noValidate
            className=" w-full "
            // onSubmit={handleSubmit(onSubmit)}
          >
            <div className="">
              <div className="flex flex-col gap-20 w-full my-4 ">
                {/* <div className="w-full flex justify-around items-center">
                                <label>
                                    <input
                                        type="radio"
                                        value="FBA"
                                        {...register("option")}
                                        className="mr-8"
                                        onChange={() => setIsFBA(true)}
                                    />
                                    FBA
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="FBM"
                                        {...register("option")}
                                        className="mr-8"
                                        onChange={() => setIsFBA(false)}
                                    />
                                    FBM
                                </label>
                            </div> */}
                <div className="flex justify-between sm:flex-row xsm:flex-col gap-10 items-center">
                  <div className=" sm:w-[49%] xsm:w-full flex justify-center">
                    <div
                      className="rounded-lg bg-secondary flex p-1 w-88 h-24 self-center"
                      // style={{ marginTop: "12px" }}
                    >
                      <div
                        className={`rounded-lg bg-white flex p-1 w-88 cursor-pointer`}
                        onClick={() => {
                          handleFulfillmentOptionChange(
                            !selectedFulfillmentOption
                          );
                        }}
                      >
                        <div
                          className={` w-1/2 bg-secondary text-white align-middle text-center p-3 rounded-lg text-xs transition-transform duration-300 ease-in-out ${
                            selectedFulfillmentOption
                              ? "translate-x-0"
                              : "translate-x-full"
                          }`}
                        >
                          {selectedFulfillmentOption ? "FBA" : "FBM"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center items-center  sm:w-[49%] xsm:w-full">
                    <label
                      htmlFor="number_of_units"
                      className="w-2/5 text-black font-semibold"
                    >
                      Quantity:
                    </label>

                    <input
                      className="w-3/5 rounded-md px-4 py-8 text-center bg-white border border-grey-500 shadow-grey-600 shadow-sm"
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => {
                        setQuantity(Number(e.target.value));
                      }}
                      onClick={(e) => e.target.select()}
                    />
                  </div>
                </div>
                {/* <div className="flex flex-col gap-20 w-full my-12"> */}
                <div className="flex justify-between sm:flex-row xsm:flex-col gap-10">
                  <div className="flex justify-center items-center  sm:w-[49%] xsm:w-full">
                    <label
                      htmlFor="salePrice"
                      className="w-2/5 text-black font-semibold"
                    >
                      Storage (months):
                    </label>
                    <div className="w-3/5 flex">
                      <div
                        className="w-3/12 px-8 py-8 mx-4 rounded-l-lg bg-secondary text-white cursor-pointer text-center shadow-grey-600 shadow-sm"
                        onClick={handleDecrement}
                      >
                        -
                      </div>
                      <input
                        id="storage"
                        className="w-6/12 text-center rounded-md px-4 py-8 bg-white border border-grey-500 shadow-grey-600 shadow-sm"
                        type="number"
                        onClick={(e) => e.target.select()}
                        // value={quantity}

                        {...register("storage")} // register the input for React Hook Form
                      />
                      <div
                        className="w-3/12 px-8 py-8 mx-4 rounded-r-lg bg-secondary text-white cursor-pointer text-center shadow-grey-600 shadow-sm"
                        onClick={handleIncrement}
                      >
                        +
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center items-center  sm:w-[49%] xsm:w-full ">
                    <label
                      htmlFor="priceOption"
                      className="w-2/5 text-black font-semibold"
                    >
                      Price Source:
                    </label>
                    <Controller
                      name="priceOption"
                      control={control}
                      // defaultValue="Lowest" // Set the default value
                      render={({ field }) => (
                        <select
                          id="priceOption"
                          className="w-3/5 rounded-md px-4 py-2 bg-white border border-grey-500 shadow-grey-600 shadow-sm"
                          {...field}
                          // value={selectedOption}
                          onChange={(e) => {
                            setValue("priceOption", e.target.value);
                            if (e.target.value === "Lowest") {
                              setValue(
                                "salePrice",
                                data?.listing_stats?.lowest_price
                              );
                              // setCustomFieldEnabled((prev) => !prev);
                            } else if (e.target.value === "FBM") {
                              setValue(
                                "salePrice",
                                data?.listing_stats?.lowest_fbm_price
                              );
                            } else if (e.target.value === "FBA") {
                              setValue(
                                "salePrice",
                                data?.listing_stats?.lowest_fba_price
                              );
                            } else if (e.target.value === "BuyBox") {
                              setValue(
                                "salePrice",
                                data?.listing_stats?.buy_box_price
                              );
                            } else {
                              // handleInputChange("price_option",e.target.value);
                              // setCustomFieldEnabled(false);
                            }
                            // field.onChange(e);
                            // setValue("priceOption" ,(e.target.value)
                          }}
                        >
                          <option value="Lowest">Lowest</option>
                          {data?.listing_stats?.lowest_fba_price && (
                            <option value="FBA">FBA</option>
                          )}
                          {data?.listing_stats?.lowest_fbm_price && (
                            <option value="FBM">FBM</option>
                          )}
                          {data?.listing_stats?.buy_box_price && (
                            <option value="BuyBox">BuyBox</option>
                          )}
                          <option value="Custom">Custom</option>
                        </select>
                      )}
                    />
                  </div>
                </div>
                <div className="flex justify-between sm:flex-row xsm:flex-col gap-10">
                  <div className="flex justify-center items-center sm:w-[49%] xsm:w-full">
                    <label
                      htmlFor="costPrice"
                      className="w-2/5 text-black font-semibold"
                    >
                      Cost price:
                    </label>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "60%",
                      }}
                    >
                      <span style={{ marginLeft: "8px", position: "absolute" }}>
                        $
                      </span>
                      <Controller
                        name="costPrice"
                        control={control}
                        render={({ field }) => (
                          <input
                            style={{ paddingLeft: "20px" }}
                            className="w-full rounded-md px-4 py-8 bg-white border border-grey-500 shadow-grey-600 shadow-sm"
                            type="number"
                            id="costPrice"
                            {...field}
                            onBlur={(event) => {
                              // Parse the entered value as a float
                              let enteredCostPrice = parseFloat(
                                event.target.value
                              );

                              // Convert the value to a whole number
                              enteredCostPrice = enteredCostPrice.toFixed(2);

                              // Update the input value
                              // event.target.value = enteredCostPrice;

                              // Update form value
                              setValue("costPrice", enteredCostPrice);
                            }}
                            onClick={(e) => e.target.select()}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex justify-center items-center  sm:w-[49%] xsm:w-full">
                    <label
                      htmlFor="salePrice"
                      className="w-2/5 text-black font-semibold"
                    >
                      Sale price:
                    </label>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "60%",
                      }}
                    >
                      <span style={{ marginLeft: "8px", position: "absolute" }}>
                        $
                      </span>
                      <Controller
                        name="salePrice"
                        control={control}
                        render={({ field }) => (
                          <input
                            style={{ paddingLeft: "20px" }}
                            className="w-full rounded-md px-4 py-8 bg-white border border-grey-500 shadow-grey-600 shadow-sm"
                            // type="number"
                            id="salePrice"
                            type="number"
                            {...field}
                            onBlur={(e) => {
                              // Parse the entered value as a float
                              let enteredSalePrice = parseFloat(e.target.value);

                              // Convert the value to a whole number
                              enteredSalePrice = enteredSalePrice.toFixed(2);

                              // Update the input value
                              // e.target.value = enteredSalePrice;

                              // Update form value
                              setValue("salePrice", enteredSalePrice);
                            }}
                            onClick={(e) => e.target.select()}
                            onChange={(e) => {
                              const enteredSalePrice = parseFloat(
                                e.target.value
                              );
                              setValue("salePrice", enteredSalePrice);

                              if (
                                e.target.value !=
                                  data?.listing_stats?.lowest_fba_price &&
                                e.target.value !=
                                  data?.listing_stats?.lowest_fbm_price &&
                                e.target.value !=
                                  data?.listing_stats?.amazon_price &&
                                e.target.value !=
                                  data?.listing_stats?.buy_box_price
                              ) {
                                setValue("priceOption", "Custom");
                              }
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between sm:flex-row xsm:flex-col gap-10">
                  <div className="flex justify-center items-center  sm:w-[49%] xsm:w-full">
                    <label
                      htmlFor="miscFee"
                      className="w-2/5 text-black font-semibold"
                    >
                      Misc Fee:
                    </label>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "60%",
                      }}
                    >
                      <span style={{ marginLeft: "8px", position: "absolute" }}>
                        $
                      </span>
                      <Controller
                        name="miscFee"
                        control={control}
                        render={({ field }) => (
                          <input
                            style={{ paddingLeft: "20px" }}
                            className="w-full rounded-md px-4 py-8 bg-white border border-grey-500 shadow-grey-600 shadow-sm"
                            type="number"
                            id="miscFee"
                            {...field}
                            onBlur={(event) => {
                              // Parse the entered value as a float
                              let enteredMiscFee = parseFloat(
                                event.target.value
                              );

                              // Convert the value to a whole number
                              enteredMiscFee = enteredMiscFee.toFixed(2);

                              // Update the input value
                              // event.target.value = enteredMiscFee;

                              // Update form value
                              setValue("miscFee", enteredMiscFee);
                            }}
                            onClick={(e) => e.target.select()}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex justify-center items-center  sm:w-[49%] xsm:w-full">
                    <label
                      htmlFor="miscFeePerc"
                      className="w-2/5 text-black font-semibold"
                    >
                      Misc Fee:
                    </label>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "60%",
                      }}
                    >
                      <span className='ml-[8px] right-[10%] sm:right-[6%] absolute'
                        // style={{
                        //   marginLeft: "8px",
                        //   position: "absolute",
                        //   right: "6%",
                        // }}
                      >
                        %
                      </span>
                      <Controller
                        name="miscFeePerc"
                        control={control}
                        render={({ field }) => (
                          <input
                            className="w-full rounded-md px-4 py-8 bg-white border border-grey-500 shadow-grey-600 shadow-sm"
                            type="number"
                            id="miscFeePerc"
                            {...field}
                            onBlur={(event) => {
                              // Parse the entered value as a float
                              let enteredMiscPercFee = parseFloat(
                                event.target.value
                              );

                              // Convert the value to a whole number
                              enteredMiscPercFee =
                                enteredMiscPercFee.toFixed(2);
                              // console.log(enteredMiscPercFee);

                              // Update the input value
                              // event.target.value = enteredMiscPercFee;

                              // Update form value
                              setValue("miscFeePerc", enteredMiscPercFee);
                            }}
                            onClick={(e) => e.target.select()}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* <div className="flex justify-center items-center">
                <label
                  htmlFor="storage"
                  className="w-2/5 text-black font-semibold"
                >
                  Storage:
                </label>
                <Controller
                  name="storage"
                  control={control}
                  render={({ field }) => (
                    <input
                      className="w-3/5 rounded-md px-4 py-8 bg-white border border-grey-500 shadow-grey-600 shadow-sm"
                      // type="number"
                      id="storage"
                      {...field}
                    />
                  )}
                />
              </div> */}

                {/* <div className="flex justify-center items-center">
                                <label
                                    htmlFor="priceOption"
                                    className="w-2/5 text-black font-semibold"
                                >
                                    Price Option
                                </label>
                                <Controller
                                    name="priceOption"
                                    control={control}
                                    // defaultValue="Lowest" // Set the default value
                                    render={({ field }) => (
                                        <select
                                            id="priceOption"
                                            className="w-3/5 rounded-md px-4 py-2 bg-white border border-grey-500 shadow-grey-600 shadow-sm"
                                            {...field}
                                            // value={selectedOption}
                                            onChange={(e) => {
                                                if (e.target.value === "Custom") {
                                                    setCustomFieldEnabled(prev => !prev);
                                                }
                                                else {
                                                    setCustomFieldEnabled(false);
                                                }
                                                field.onChange(e);
                                                // setValue("priceOption" ,(e.target.value)
                                            }}
                                        >
                                            <option value="Lowest">Lowest</option>
                                            <option value="FBA">FBA</option>
                                            <option value="FBM">FBM</option>
                                            <option value="BuyBox">BuyBox</option>
                                            <option value="Custom">Custom</option>
                                        </select>
                                    )}
                                />
                            </div> */}
                {/* <div className="flex justify-center items-center">
                                <label
                                    htmlFor="priceOption"
                                    className="w-2/5 text-black font-semibold"
                                >
                                    Custom ($):
                                </label>
                                <Controller
                                    name="priceOption"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            className={`w-3/5 rounded-md px-4 py-8 ${!customFieldEnabled ? 'bg-grey-400 border border-black' : 'bg-white border border-grey-500 shadow-grey-600 shadow-sm'} `}
                                            type="number"
                                            id="custom"
                                            {...field}
                                            disabled={!customFieldEnabled}
                                        />
                                    )}
                                />
                            </div> */}
                <div className="flex flex-row flex-wrap gap-6">
                  <div className="flex justify-between gap-10 border rounded-lg p-9  text-sm shadow items-center sm:w-[49%] w-full ">
                    <div>Total Profit: </div>
                    <div
                      className={`rounded-4 text-sm p-4 ${
                        caldata?.total_profit >= caldata?.min_profit
                          ? "text-green-700 "
                          : "text-red-700"
                      }`}
                    >
                      {caldata?.total_profit
                        ? `${formatCurrency(
                            caldata?.total_profit?.toFixed(2).toLocaleString()
                          )}`
                        : "$0.00"}
                    </div>
                  </div>
                  <div className="flex justify-between gap-10 border rounded-lg p-9  text-sm shadow items-center sm:w-[49%] w-full">
                    <div>ROI: </div>
                    <div
                      className={` rounded-4 text-sm p-4 ${
                        caldata?.simple_roi >= caldata?.min_roi * 100
                          ? "text-green-700 "
                          : "text-red-700"
                      } `}
                    >
                      {" "}
                      {typeof caldata?.simple_roi === 'string'? `${caldata?.simple_roi}%`: 
                      caldata?.simple_roi
                        ? `${caldata?.simple_roi?.toFixed(2).toLocaleString()}%`
                        : "0.00%"}
                    </div>
                  </div>

                  <div className="flex justify-between gap-10 border rounded-lg p-9  text-sm shadow items-center sm:w-[49%] w-full">
                    <div>Max Cost: </div>
                    <div className=" rounded-4 text-sm p-4">
                      {caldata?.max_cost
                        ? `${formatCurrency(
                            caldata?.max_cost?.toFixed(2).toLocaleString()
                          )}`
                        : "$0.00"}
                    </div>
                  </div>
                  <div className="flex justify-between  gap-10 border rounded-lg p-9  text-sm shadow items-center sm:w-[49%] w-full">
                    <div>Breakeven Price: </div>
                    <div className=" rounded-4 text-sm p-4">
                      {caldata?.cost_per_unit
                        ? `${formatCurrency(
                            caldata?.break_even_price
                              .toFixed(2)
                              .toLocaleString()
                          )}`
                        : "$0.00"}
                    </div>
                  </div>
                  <FeeCalculation
                    data={feeCalData}
                    listingStats={data?.listing_stats}
                    caldata={caldata}
                    register={register}
                    control={control}
                    setValue={setValue}
                    selectedFulfillmentOption={selectedFulfillmentOption}
                    handleFulfillmentOptionChange={
                    handleFulfillmentOptionChange
                    }
                  />
                  {/* <div className='flex justify-between border rounded-lg p-9  text-sm shadow items-center'>
                                      <div >ROI: </div>
                                      <div className=' rounded-4 text-sm p-4'> {caldata?.roi ? `${new Intl.NumberFormat('en-US', {
                                          notation: 'compact',
                                          compactDisplay: 'short',
                                      }).format(caldata?.roi?.toFixed(
                                          2
                                      ))}`: "to be calculated"}</div>
                              </div> */}
                  {/* <div className='flex justify-between border rounded-lg p-9  text-sm shadow items-center'>
                                      <div >Min ROI: </div>
                                      <div className=' rounded-4 text-sm p-4'> {caldata?.min_roi ? `${caldata?.min_roi?.toFixed(2).toLocaleString()}%` : "to be calculated"}</div>
                              </div>
                              <div className='flex justify-between border rounded-lg p-9  text-sm shadow items-center'>
                                      <div >Min Profit: </div>
                                      <div className=' rounded-4 text-sm p-4'> {caldata?.min_profit ? `$${caldata?.min_profit?.toFixed(2).toLocaleString()}` : "to be calculated"}</div>
                              </div> */}
                </div>

                {/* </div> */}
                {/* <Typography
								color="text.secondary"
								className="text-base font-medium leading-none"
							>
								Cost Price
							</Typography> */}
                {/* <div className="flex text-black w-full justify-center items-center  px-8 rounded-8 mt-8 ">
                <Typography className="font-normal text-lg leading-none">

								$
							</Typography>
                <Controller
                  render={({ field }) => (
                    <TextField
                      className="mt-32  bg-white "
                      {...field}
                      label="Cost Price"
                      error={!!errors.cost_of_goods}
                      helperText={errors?.cost_of_goods?.message}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  )}
                  control={control}
                  name="cost_of_goods"
                />
              </div> */}
              </div>
              {/* <div className="flex flex-col w-full   ">
						
						<div className='flex text-black w-full justify-center items-center  px-8 rounded-8 mt-8  '>
						
						<Controller
							render={({ field }) => (
								<TextField
									className="mt-32  bg-white "
									{...field}
									label="max cost"
									
									error={!!errors.max_cost}
									helperText={errors?.max_cost?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
							control={control}
							name="max_cost"
						/>
						</div>
						</div> */}
              {/* <div className="flex flex-col w-full   ">
						
						<div className='flex text-black w-full justify-center items-center  px-8 rounded-8 mt-8  '>
						
						<Controller
							render={({ field }) => (
								<TextField
									className="mt-32  bg-white "
									{...field}
									label="sale price"
									
									error={!!errors.sale_price}
									helperText={errors?.sale_price?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
							control={control}
							name="sale_price"
						/>
						</div>
						</div> */}
              {/* <div className="flex flex-col w-full   "> */}
              {/* <Typography
							color="text.secondary"
							className="text-base font-medium leading-none"
						>
							Profit
						</Typography> */}
              {/* <div className="flex text-black w-full justify-center items-center  px-8 rounded-8 mt-8  ">
                <Controller
                  render={({ field }) => (
                    <TextField
                      className="mt-32  bg-white "
                      {...field}
                      label="Quantity"
                      error={!!errors.number_of_units}
                      helperText={errors?.number_of_units?.message}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  )}
                  control={control}
                  name="number_of_units"
                />
              </div> */}
              {/* </div> */}
              {/* <div className="flex flex-col w-full ">
              <div className="flex flex-col w-full justify-between  my-8">
                <Typography
									color="text.secondary"
									className="text-base font-medium leading-none"
								>
									Storage (Months)
								</Typography>
                <div className="flex text-black w-full justify-center items-center  px-8 rounded-8 mt-8  ">
                  <Controller
                    render={({ field }) => (
                      <TextField
                        className="mt-32  bg-white "
                        {...field}
                        label="Storage"
                        error={!!errors.storage_months}
                        helperText={errors?.storage_months?.message}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    )}
                    control={control}
                    name="storage_months"
                  />
                </div>
              </div>
            </div> */}

              {/* <div className='flex flex-col w-full '>
							<div className="flex flex-col w-full justify-between  my-8">
								
								<div className='flex text-black w-full justify-center items-center  px-8 rounded-8 mt-8  '>
									
									<Controller
										render={({ field }) => (
										<TextField
										className="mt-32  bg-white "
										{...field}
										label="Roi"
										
										error={!!errors.roi}
										helperText={errors?.roi?.message}
										variant="outlined"
										required
										fullWidth
									/>
							)}
							control={control}
							name="roi"
						/>
								</div>
							</div>
						</div> */}

              {/* <div className="flex flex-col w-full justify-end">
              <div className="flex text-black w-full  items-center px-8 rounded-8 mt-8">
                <Controller
                  name="is_fba"
                  control={control}
                  // defaultValue={false}
                  render={({ field: { onChange, value } }) => (
                    <Checkbox
                      //tabIndex={-1}
                      checked={value}
                      onChange={(ev) => onChange(ev.target.checked)}
                      disableRipple
                      required
                    />
                  )}
                />
                <p>is FBA</p>
              </div>
            </div> */}

              {/* <div className='col-span-2'>
					<div>
						<Typography
							color="text.secondary"
							className="text-sm font-medium leading-none "
						>
							Max Cost
						</Typography>
						<Typography className="mt-8 font-bold text-xl leading-none">
							
							$5.72
						</Typography>
					</div>

					</div> */}
            </div>

            {/* <div className="flex items-center justify-center">
            <div className="">
              <Button
                variant="contained"
                color="secondary"
                type="submit"
                disabled={loading}
              >
                <div className="flex items-center">
                  Calculate
                  {loading && (
                    <div className="ml-8 mt-2">
                      <CircularProgress size={16} color="inherit" />
                    </div>
                  )}
                </div>
              </Button>
            </div>
          </div> */}
          </form>
          {/* <div className='flex flex-col gap-9 my-16'>
					<div className='flex justify-between border rounded-lg p-9  text-sm shadow'>
						<div >Referral Fee</div>
						<div>${data?.referral_fee}</div>
					</div>
					<div className='flex justify-between border rounded-lg p-9  text-sm shadow'>
						<div >Fulfillment (FBA)</div>
						<div>${data?.fulfillment_fee}</div>
					</div>
					<div className='flex justify-between border rounded-lg p-9  text-sm shadow'>
						<div >Clothing Fee</div>
						<div>$34</div>
					</div>
					<div className='flex justify-between border rounded-lg p-9  text-sm shadow'>
						<div >Storage</div>
						<div>${data?.storage_fee}</div>
					</div>
					<div className='flex justify-between border rounded-lg p-9  text-sm shadow'>
						<div >Prep Fee</div>
						<div>${records.setting_json?.prep_fee}</div>
					</div>
					<div className='flex justify-between border rounded-lg p-9  text-sm shadow'>
						<div >Inbound Shipping</div>
						<div>${data?.inbound_shipping}</div>
					</div>
					<div className='flex justify-between border rounded-lg p-9  text-sm shadow'>
						<div >Misc Fee</div>
						<div>${records?.setting_json?.misc_fee}</div>
					</div>
					<div className='flex justify-between border rounded-lg p-9  text-sm shadow'>
						<div >Misc Fee (% of cost)</div>
						<div>${records?.setting_json?.misc_fee_perc}</div>
					</div>
				</div>
				<div className='flex justify-between w-full text-lg '>
					<div className='font-medium'>Discount</div>
					<div className='font-bold'>$0.00</div>
				</div> */}
          {/* <div className='flex flex-col gap-9 my-16'>
					<div className='flex justify-between border rounded-lg p-9  text-sm shadow'>
						<div >Profit Margin</div>
						<div>$43.02</div>
					</div>
					<div className='flex justify-between border rounded-lg p-9  text-sm shadow'>
						<div >Breakeven Sale Price</div>
						<div>$43.02</div>
					</div>
					<div className='flex justify-between border rounded-lg p-9  text-sm shadow'>
						<div >Est.Arn Payout</div>
						<div>$43.02</div>
					</div>
				</div> */}
        </div>
        {/* <div className="absolute top-0 ltr:right-0 rtl:left-0 w-96 h-96 -m-24">
					<FuseSvgIcon
						size={96}
						className="opacity-25 text-green-500 dark:text-green-400"
					>
						heroicons-outline:check-circle
					</FuseSvgIcon>
				
			</div>  */}
      </Paper>
    );
}

export default memo(ProfitCalculatorWidget);
