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
import { use } from 'i18next';

/**
 * The ProfitCalculatorWidget.
 */
function FeeCalculationWidget({ data, caldata, register, control,listingStats={}, setValue , handleFulfillmentOptionChange , selectedFulfillmentOption}) {
    // console.log('hhhhhhhh',caldata);
  const [inboundPlacement, setInboundPlacement]=useState([]);
  const [clickedIndex, setClickedIndex] = useState(0);
    useEffect(()=>{
    if(typeof listingStats?.inbound_placement_fees ===
                        "object" &&
                      Object.keys(listingStats?.inbound_placement_fees).length >
                        0){
                          setInboundPlacement(Object.keys(listingStats.inbound_placement_fees))
                        }
  },[listingStats])
  // useEffect(()=>{
  //   if(inboundPlacement.length>0 && clickedIndex===0){
  //     setValue('inbound_placement_split',inboundPlacement[0])
  //     console.log('in');
      
  //   }
  // },[inboundPlacement])
    // const dispatch = useDispatch<any>()
    // // const [loading, setLoading] = useState(false);
    // useEffect(() => {
    //     dispatch(getRecords());
    // }, [dispatch]);
function formatCurrency(value) {
  const isNegative = value < 0;
  const absoluteValue = Math.abs(value).toFixed(2); // Ensures two decimal places
  return isNegative ? `-$${absoluteValue}` : `$${absoluteValue}`;
}

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
    //     // defaultValues,
    //     mode: 'onChange',
    //     // resolver: yupResolver(schema)
    // });
    // const editableFields = watch(["option"]);
    // console.log(data);

    useEffect(() => {
        // console.log(data);
        // console.log(data?.referral_fee)
        // Set the value of "salePrice" input field when receivedSalePrice changes
        if (data) {
            setValue('referralFee', data?.referral_fee?.toFixed(4));
            setValue('fullfillmentFee', data?.fulfillment_fee?.toFixed(4));
            setValue('monthsStorage', data?.months_in_storage);
            setValue('inboundShipping', data?.inbound_shipping?.toFixed(4));
            setValue('outboundShipping', data?.outbound_shipping?.toFixed(4));
            setValue('fixedFee', data?.fixed_fee);
            setValue('variableFee', data?.variable_fee);
            setValue('totalFee', data?.total_fee);
        }

    }, []);

    // const { isValid, dirtyFields, errors } = formState;

    // const records = useAppSelector(selectRecords) as SettingType;

    //   useEffect(() => {
    //     // Call your API when editable fields change
    //     const fetchData = async () => {
    //       try {
    //         // Get the current values of editable fields
    //         const costPricee = getValues("costPrice");
    //         const storagee = +getValues("storage");
    //         const isFBA = getValues("option") === "FBA";
    //         const payload = {
    //           product_id: data.product_id,
    //           cost_of_goods: +costPricee,
    //           is_fba: isFBA,
    //           storage_months: storagee,
    //           number_of_units: quantity,
    //         };

    //         // Make an API call using Axios
    //         const response = await axios.post("/api/panels/calculate", payload);

    //         // Update the readOnly fields with the response from the API
    //         setValue(
    //           "maxCost",
    //           response?.data?.calculator_output?.max_cost.toFixed(4)
    //         );
    //         setValue("roi", response?.data?.calculator_output?.roi);
    //         setValue("totalProfit", response?.data?.calculator_output?.total_profit);
    //       } catch (error) {
    //         console.error("Error fetching data:", error);
    //       }
    //     };

    //     fetchData();
    //   }, [editableFields]);

    // const onSubmit = async (formData) => {
    // setLoading(true);

    // // console.log("inputs", formData.costPrice);
    // // const isFBA = formData.shippingMethod === "fba";
    // const isFBA = formData.option === "FBA";

    // // console.log("fbaaa", isFBA);
    // const payload = {
    //   product_id: data.product_id,
    //   cost_of_goods: +(formData.costPrice),
    //   is_fba: isFBA,
    //   storage_months: formData.storage,
    //   number_of_units: quantity,
    // };

    // try {
    //   const response = await axios.post("/api/panels/calculate", payload);
    // // console.log("responseee",response);
    // setValue("maxCost", response?.data?.calculator_output?.max_cost.toFixed(4));
    // setValue("roi", response?.data?.calculator_output?.roi.toFixed(4));
    // setValue("totalProfit", response?.data?.calculator_output?.total_profit.toFixed(4));
    // setCalData(response);
    //   setLoading(false);
    //   // console.log(response)
    // } catch (error) {
    //   console.error("Error sending form data:", error);
    //   setLoading(false);
    //   return {};
    // }
    //   };

    //   useEffect(() => {
    //     setValue("maxCost", caldata?.calculator_output?.max_cost);
    //     setValue("roi", caldata?.calculator_output?.roi);
    //     setValue("totalProfit", caldata?.calculator_output?.total_profit);
    //   }, [caldata, setValue]);
// console.log(data);
const totalfee=data?.referral_fee+
data?.fulfillment_fee+
data?.storage_fee+
// calculatorData?.calculator_output?.prep_fees+
data?.inbound_shipping+
data?.outbound_shipping+
data?.fixed_fee+
data?.variable_fee
console.log(totalfee);

    return (
      <div className="relative flex flex-col h-full  overflow-hidden">
        {/* <div className="flex flex-col gap-16 justify-between ">
                <div className="flex flex-col gap-8">
                    <Typography className="text-2xl font-bold tracking-tight leading-6 truncate">
                        Fee Breakdown
                    </Typography>

                </div>
            </div> */}

        <div className="flex flex-col">
          <form
            name="Settings"
            noValidate
            className=" w-full "
            //   onSubmit={handleSubmit(onSubmit)}
          >
            <div className="">
              {/* <div className="rounded-xl bg-blue-400 flex p-1 w-88 self-end">
                          <div className={`rounded-xl bg-white flex p-3 w-88 cursor-pointer`} onClick={()=>{ handleFulfillmentOptionChange(!selectedFulfillmentOption)}}>
                          <div className={` w-1/2 bg-secondary text-white p-3 text-center rounded-xl text-xs transition-transform duration-300 ease-in-out ${selectedFulfillmentOption ? "translate-x-0":"translate-x-full"}`} >{selectedFulfillmentOption ? "FBA":"FBM"}</div>
                        </div>
                    </div> */}
              {data ? (
                <div className="flex flex-row  gap-6 w-full flex-wrap">
                  {/* <div className="w-full flex justify-around items-center">
                                <Typography className="text-2xl font-bold tracking-tight leading-6 truncate">
                                    Fullfillment Method
                                </Typography>
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
                  {/* <div className="flex flex-col gap-20 w-full my-12"> */}
                  {/* <div className="rounded-xl bg-blue-400 flex p-1 w-88 self-end">
                                    <div className={`rounded-xl bg-white flex p-3 w-88 cursor-pointer`} onClick={()=>{ handleFulfillmentOptionChange(!selectedFulfillmentOption)}}>
                                    <div className={` w-1/2 bg-secondary text-white p-3 text-center rounded-xl text-xs transition-transform duration-300 ease-in-out ${selectedFulfillmentOption ? "translate-x-0":"translate-x-full"}`} >{selectedFulfillmentOption ? "FBA":"FBM"}
                                    </div>
                             </div>
                             </div> */}
                  <div className="flex justify-between border rounded-lg p-9  text-sm shadow items-center sm:w-[49%] w-full">
                    <div>Referral Fee:</div>
                    <div className=" rounded-4 text-sm p-4">
                      {data?.referral_fee
                        ? formatCurrency(
                            data?.referral_fee?.toFixed(2).toLocaleString()
                          )
                        : "0.00"}
                    </div>
                  </div>

                  <div className="flex justify-between border rounded-lg p-9  text-sm shadow items-center sm:w-[49%] w-full">
                    <div> FullFillment Fee:</div>
                    <div className=" rounded-4 text-sm p-4">
                      {data?.fulfillment_fee
                        ? formatCurrency(
                            data?.fulfillment_fee?.toFixed(2).toLocaleString()
                          )
                        : "0.00"}
                    </div>
                  </div>
                  <div className="flex justify-between border rounded-lg p-9  text-sm shadow items-center sm:w-[49%] w-full">
                    <div>Storage Fee:</div>
                    <div className=" rounded-4 text-sm p-4">
                      {data?.storage_fee
                        ? formatCurrency(
                            data?.storage_fee?.toFixed(2).toLocaleString()
                          )
                        : "0.00"}
                    </div>
                  </div>

                  <div className="flex justify-between border rounded-lg p-9  text-sm shadow items-center sm:w-[49%] w-full">
                    <div> Prep Fee:</div>
                    <div className=" rounded-4 text-sm p-4">
                      {caldata?.prep_fees
                        ? formatCurrency(caldata?.prep_fees.toFixed(2))
                        : "0.00"}
                    </div>
                  </div>

                  <div className="flex justify-between border rounded-lg p-9  text-sm shadow items-center sm:w-[49%] w-full">
                    <div>Inbound shipping:</div>
                    <div className=" rounded-4 text-sm p-4">
                      {data?.inbound_shipping
                        ? formatCurrency(
                            data?.inbound_shipping?.toFixed(2).toLocaleString()
                          )
                        : "0.00"}
                    </div>
                  </div>

                  <div className="flex justify-between border rounded-lg p-9  text-sm shadow items-center sm:w-[49%] w-full">
                    <div>Outbound shipping:</div>
                    <div className=" rounded-4 text-sm p-4">
                      {data?.outbound_shipping
                        ? formatCurrency(
                            data?.outbound_shipping?.toFixed(2).toLocaleString()
                          )
                        : "0.00"}
                    </div>
                  </div>

                  <div
                    className={
                      "flex justify-between border rounded-lg p-9  text-sm shadow items-center sm:w-[49%] w-full cursor-pointer"
                    }
                    onClick={
                     ( typeof listingStats?.inbound_placement_fees ===
                        "object" &&
                      Object.keys(listingStats?.inbound_placement_fees).length >
                        0) ?()=>{
                          if(clickedIndex===inboundPlacement.length-1){
                            setClickedIndex(0);
                            setValue("inbound_placement_split",inboundPlacement[0]);
                          }else{

                            setClickedIndex(clickedIndex+1)
                            setValue(
                              "inbound_placement_split",
                              
                                inboundPlacement[clickedIndex+1]
                              
                            );

                            }
                        }:()=>{}
                    }
                  >
                    <div className='underline'> {inboundPlacement && inboundPlacement.length>0 && `Inbound Placement (${inboundPlacement[clickedIndex].charAt(0).toUpperCase()}):`}</div>
                    <div className=" rounded-4 text-sm p-4">
                      {inboundPlacement && inboundPlacement.length>0 
                        ? formatCurrency(
                            listingStats?.inbound_placement_fees[inboundPlacement[clickedIndex]]
                              ?.toFixed(2)
                              .toLocaleString()
                          )
                        : "0.00"}
                    </div>
                  </div>

                  {/* <div className="flex justify-between border rounded-lg p-9  text-sm shadow items-center w-[49%]">
                    <div>Misc Fee:</div>
                    <div className=" rounded-4 text-sm p-4">
                      {data?.fixed_fee
                        ? formatCurrency(
                            data?.fixed_fee?.toFixed(2).toLocaleString()
                          )
                        : "0.00"}
                    </div>
                  </div>

                  <div className="flex justify-between border rounded-lg p-9  text-sm shadow items-center w-[49%]">
                    <div>Misc Fee (%):</div>
                    <div className=" rounded-4 text-sm p-4">
                      {data?.variable_fee
                        ? 
                            data?.variable_fee?.toFixed(2).toLocaleString()
                          
                        : "0.00"}
                      %
                    </div>
                  </div> */}

                  <div className="flex justify-between border rounded-lg p-9  text-sm shadow items-center sm:w-[49%] w-full">
                    <div>Total Fee:</div>
                    <div className=" rounded-4 text-sm p-4">
                      {formatCurrency(totalfee?.toFixed(2))}
                    </div>
                  </div>

                  <div className="flex justify-between border rounded-lg p-9  text-sm shadow items-center sm:w-[49%] w-full">
                    <div>Profit Margin:</div>
                    <div className=" rounded-4 text-sm p-4">
                      {caldata?.profit_margin
                        ? caldata?.profit_margin?.toFixed(2).toLocaleString()
                        : "0.00"}
                      %
                    </div>
                  </div>

                  {/* <div className='flex justify-between border rounded-lg p-9  text-sm shadow items-center w-[49%]'>
                                <div >Breakeven Sale Price:</div>
                                <div className=' rounded-4 text-sm p-4'>${caldata?.cost_per_unit ? caldata?.cost_per_unit?.toFixed(2).toLocaleString() : "0.00"}</div>
                            </div>
                             */}
                  <div className="flex justify-between border rounded-lg p-9  text-sm shadow items-center sm:w-[49%] w-full">
                    <div>Amazon Payout:</div>
                    <div className=" rounded-4 text-sm p-4">
                      {caldata?.amazon_payout
                        ? formatCurrency(
                            caldata?.amazon_payout?.toFixed(2).toLocaleString()
                          )
                        : "0.00"}
                    </div>
                  </div>

                  {/* <div className='flex justify-between border rounded-lg p-9  text-sm shadow items-center w-[49%]'>
                                <div >Max Cost:</div>
                                <div className={`rounded-4 text-sm p-4`}>${caldata?.max_cost ? caldata?.max_cost?.toFixed(2).toLocaleString() : "0.00"}</div>
                            </div>
                             */}
                  {/* <div className='flex justify-between border rounded-lg p-9  text-sm shadow items-center w-[49%]'>
                                <div >ROI:</div>
                                <div className={`rounded-4 text-sm p-4 ${caldata?.simple_roi >= caldata?.min_roi ? "text-green-700" : "text-red-700"}`}>${caldata?.simple_roi ? caldata?.simple_roi?.toFixed(2).toLocaleString() : "0.00"}%</div>
                            </div> */}

                  {/* {caldata?.total_profit >= 0 && <div className='flex justify-between border rounded-lg p-9  text-sm shadow items-center w-[49%]'>
                                <div >Total Profit:</div>
                                <div className={`rounded-4 text-sm p-4 ${caldata?.total_profit >= caldata?.min_profit ? "text-green-700" : "text-red-700"}`}>${caldata?.total_profit ? caldata?.total_profit?.toFixed(2).toLocaleString() : "0.00"}</div>
                            </div>
                            } */}

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
              ) : (
                <div className="w-full text-center text-gray-500 font-600 p-5">
                  To be Calculated...
                </div>
              )}
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
      </div>
    );
}

export default memo(FeeCalculationWidget);
