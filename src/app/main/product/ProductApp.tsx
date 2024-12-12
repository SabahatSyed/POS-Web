import { useEffect, useMemo, useState } from 'react';
import _ from '@lodash';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from 'app/store';
import { getWidgets, selectWidgets } from './store/productsSlice';
import ProductAppHeader from './ProductAppHeader';
import Alerts from './widgets/Alerts';
import ProductInfo from './widgets/ProductInfo';
import ProfitCalculator from './widgets/ProfitCalculator';
import QuickInfo from './widgets/QuickInfo';
import { useParams } from 'react-router';
import { addRecord, getSingleProduct } from '../dashboards/store/productsSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import history from '@history';
import { CircularProgress, Typography } from '@mui/material';
import Ranks from './widgets/Ranks';
import NotesAndTags from './widgets/NotesAndTags';
import LookupDetails from './widgets/LookupDetails';
import SearchAgain from './widgets/searchAgain';
import Export from './widgets/Export';
import Offers from './widgets/Offers';
import Variations from './widgets/Variations';
import BuyBoxDistribution from './widgets/BuyBoxDistribution';
import Charts from './widgets/charts';
import { HistoryType } from './types/ProductTypes';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import FeeCalculation from './widgets/FeeCalculation';
import { getRecords as getSheetsRecords } from '../sheets/store/SheetsSlice';

import { SettingsType } from '../setting/types/setting';
import { getRecords, selectRecords } from '../setting/store/settingSlice';
import HealthOrder from './widgets/HealthOrder';
import { selectSheets } from '../sheets/store/SheetsSlice';
import { getValue } from '@mui/system';


/**
 * The finance dashboard app.
 */
function Product() {
  const dispatch = useAppDispatch();

  let { asin } = useParams();
  const [data, setData] = useState<HistoryType>(null);
  const [caldata, setCalData] = useState<any>({});
  const [quantity, setQuantity] = useState(1);
  const [feeCalData, setFeeCalData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  // const [isFBA, setIsFBA] = useState(true);
  const records = useAppSelector(selectRecords);
  const [panels, setPanels] = useState<any>([]);
  const [selectedFulfillmentOption, setSelectedFulfillmentOption] = useState(true);
  const [graphToggle, setgraphToggle] = useState(true);

  // const [selectedOption, setSelectedOption] = useState('Lowest');
  //    const [customFieldEnabled , setCustomFieldEnabled] = useState(false);

  const [calcLoading, setCalcLoading] = useState(false);
  let dropOption;
  const sheets = useAppSelector(selectSheets);
  useEffect(() => {
    dispatch(getSheetsRecords({ id: null }));
  }, [dispatch]);
  const defaultValues = {
    option: "FBA",
    salePrice: "0.00",
    costPrice: "0.00",
    storage: 1,
    maxCost: "",
    roi: "",
    simple_roi: "",
    totalProfit: "",
    shipping: "FBA",
    referralFee: "",
    fullfillmentFee: "",
    monthsStorage: "",
    inboundShipping: "",
    fixedFee: "",
    variableFee: "",
    totalFee: "",
    // custom: '',
    priceOption: "Lowest",
    miscFee: 0,
    miscFeePerc: 0,
    inbound_placement_split:'minimal_split'
  }

  const { control, formState, watch, getValues, setValue, register, reset } =
    useForm({
      defaultValues,
      mode: "onChange",
      // resolver: yupResolver(schema)
    });
  // const fields = watch(["costPrice", "storage", "priceOption" ]);

  // const { isValid, dirtyFields, errors } = formState;

  console.log("callll", data);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!_.isEmpty(records)) {
          const firstRecord = records.setting_json as SettingsType;
          // console.log("sdcs",firstRecord)
          const panels_json = firstRecord?.panels;
          if (panels_json) {
            setPanels(panels_json);
          }
          dropOption = firstRecord?.price_option;
          // console.log(dropOption);
          // console.log("hye",data )
          // if(firstRecord?.price_option === "Lowest"){
          //      setValue("salePrice",data?.listing_stats?.lowest_price)
          // }
          // else if(firstRecord?.price_option === "FBA"){
          //      setValue("salePrice",data?.listing_stats?.lowest_fba_price)
          // }
          // else if(firstRecord?.price_option === "FBM"){
          //      setValue("salePrice",data?.listing_stats?.lowest_fbm_price)
          // }
          // else if(firstRecord?.price_option === "BuyBox"){
          //      setValue("salePrice",data?.listing_stats?.buy_box_price)
          // }
          // else{
          //     // salePrice=profitCalculatorInputs.sale_price
          //     // setValue("salePrice",salePrice);
          // }

          // setValue("salePrice", SalePrice);
          setValue("priceOption", firstRecord?.price_option);
          setValue("option", firstRecord?.fulfillment_method);
          setValue("miscFee", (firstRecord?.misc_fee).toFixed(2));
          setValue("miscFeePerc", (firstRecord?.misc_fee_perc).toFixed(2));

          // setIsFBA(firstRecord?.fulfillment_method == 'FBA')
          setSelectedFulfillmentOption(
            firstRecord?.fulfillment_method == "FBA"
          );

          // setIsUpdate(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [records]);

  useEffect(() => {
    dispatch(getRecords());
  }, [dispatch]);

  useEffect(() => {
    // console.log('product changed');

    setLoading(true);
    const formData = { asin: asin };
    dispatch(getSingleProduct({asin: asin})).then((resp: any) => {
      // console.log(resp);
      setData(resp.payload);
      setValue("costPrice", resp.payload?.data?.product_data?.cost_of_goods?.toFixed(2));

      if (resp.payload && resp.payload?.data?.listing_stats) {
        // Check if data is not undefined
        if (getValues("priceOption") === "Lowest") {
          setValue(
            "salePrice",
            resp.payload?.data?.listing_stats?.lowest_price
              ? resp.payload?.data?.listing_stats?.lowest_price
              : "0.00"
          );
        } else if (getValues("priceOption") === "FBA") {
          setValue(
            "salePrice",
            resp.payload?.data?.listing_stats?.lowest_fba_price
              ? resp.payload?.data?.listing_stats?.lowest_fba_price
              : "0.00"
          );
        } else if (getValues("priceOption") === "FBM") {
          setValue(
            "salePrice",
            resp.payload?.data?.listing_stats?.lowest_fbm_price
              ? resp.payload?.data?.listing_stats?.lowest_fbm_price
              : "0.00"
          );
        } else if (getValues("priceOption") === "BuyBox") {
          if (resp.payload?.data?.listing_stats?.buy_box_price){
            setValue(
              "salePrice",
              resp.payload?.data?.listing_stats?.buy_box_price
              ? (resp.payload?.data?.listing_stats?.buy_box_price).toFixed(2)
              : "0.00"
            );
          }
          else{
            setValue(
              "salePrice",
              resp.payload?.data?.listing_stats?.lowest_price
                ? resp.payload?.data?.listing_stats?.lowest_price
                : "0.00"
            );
          }
        }
      }
      // console.log(data)
      // if (data && data?.listing_stats) {
      //      // Check if data is not undefined
      //     if (dropOption === "Lowest") {
      //         setValue("salePrice", data?.listing_stats?.lowest_fba_price);
      //     } else if (dropOption === "FBA") {
      //         setValue("salePrice", data?.listing_stats?.amazon_price);
      //     } else if (dropOption === "FBM") {
      //         setValue("salePrice", data?.listing_stats?.lowest_fbm_price);
      //     } else if (dropOption === "BuyBox") {
      //         setValue("salePrice", data?.listing_stats?.buy_box_price);
      //     }
      // }

      // setValue('salePrice', resp.payload?.sale_price?.toFixed(2));
      // setValue('custom', '');
      setValue("storage", 1);

      setFeeCalData(null);
      setCalData(null);

      setLoading(false);
      if (resp.error) {
        dispatch(
          showMessage({ message: resp.error.message, variant: "error" })
        );
      } else {
        // dispatch(showMessage({ message: 'Success', variant: 'success' }));
      }
    });
  }, [asin]);

  useEffect(() => {
    // Call your API when editable fields change
    const fetchData = async () => {
      try {
        // Get the current values of editable fields
        const costPricee = getValues("costPrice") || 0;
        const storagee = getValues("storage");
        const miscFee = getValues("miscFee");
        const miscFeePerc = getValues("miscFeePerc");
        const inboundPlacement = getValues("inbound_placement_split");

        const selectedOption = getValues("priceOption"); // Get the selected option from the dropdown
        // let priceOptionValue = selectedOption; // Set the default value to the selected option
        let priceOptionValue;

        // If the selected option is "Custom" and the custom field is enabled, include its value
        if (selectedOption === "Custom" && getValues("salePrice") !== null) {
          priceOptionValue = getValues("salePrice"); // Get the value from the "Custom" input field
        } else {
          priceOptionValue = selectedOption;
        }

        // const isFBA = getValues("option") === "FBA" || getValues("shipping") === "FBA";
        const payload = {
          product_id: data?.product_id,
          cost_of_goods: +costPricee,
          is_fba: selectedFulfillmentOption,
          storage_months: storagee,
          number_of_units: quantity,
          price_option: priceOptionValue,
          misc_fee: +miscFee,
          misc_fee_perc: +miscFeePerc,
          inbound_placement_split: inboundPlacement,
          calculator_data: data?.calculator_data
        };

        // Make an API call using Axios
        if (payload?.product_id) {
          setCalcLoading(true);
          const response = await axios.post("/api/panels/calculate", payload);

          setFeeCalData(response?.data?.fee_breakdown);
          // console.log(response?.data?.fee_breakdown);
          // Update the readOnly fields with the response from the API

          setCalData(response?.data?.calculator_output);

          // setValue('salePrice', response?.data?.calculator_output?.sale_price?.toFixed(2));

          // setValue(
          //     "maxCost",
          //     new Intl.NumberFormat('en-US', {
          //         notation: 'compact',
          //         compactDisplay: 'short',
          //     }).format(response?.data?.calculator_output?.max_cost?.toFixed(
          //         2
          //     ))

          // );
          // // data.product_data.BSR.toFixed(0).toLocaleString();
          // setValue(
          //     "roi",
          //     (response?.data?.calculator_output?.roi?.toFixed(2)).toLocaleString()
          // );
          // setValue(
          //     "simple_roi",
          //     (response?.data?.calculator_output?.simple_roi?.toFixed(2)).toLocaleString()
          // );
          // setValue(
          //     "totalProfit",
          //     new Intl.NumberFormat('en-US', {
          //         notation: 'compact',
          //         compactDisplay: 'short',
          //     }).format(response?.data?.calculator_output?.total_profit?.toFixed(
          //         2
          //     ))
          // );

          // setValue(
          //     "referralFee",
          //     new Intl.NumberFormat('en-US', {
          //         notation: 'compact',
          //         compactDisplay: 'short',
          //     }).format(response?.data?.fee_breakdown?.referral_fee?.toFixed(2)));
          // setValue(
          //     "fullfillmentFee",
          //     (new Intl.NumberFormat('en-US', {
          //         notation: 'compact',
          //         compactDisplay: 'short',
          //     }).format(response?.data?.fee_breakdown?.fulfillment_fee?.toFixed(2))));

          // setValue(
          //     "monthsStorage",
          //     (response?.data?.fee_breakdown?.months_in_storage).toLocaleString()
          // );
          // setValue(
          //     "inboundShipping",
          //     new Intl.NumberFormat('en-US', {
          //         notation: 'compact',
          //         compactDisplay: 'short',
          //     }).format(response?.data?.fee_breakdown?.inbound_shipping?.toFixed(2))
          // );
          // setValue("fixedFee",  (response?.data?.fee_breakdown?.fixed_fee));

          // setValue("variableFee",  (response?.data?.fee_breakdown?.variable_fee));

          // setValue("totalFee",  (response?.data?.fee_breakdown?.total_fee));

          setCalcLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setCalcLoading(false);
      }
    };
    // if (getValues("priceOption") === "Custom") {
    //     if (getValues("custom") !== null) {
    //         fetchData();
    //     }

    // } else {
    if(data && typeof data==='object'){
      
      if(Object.keys(data).length>0){

        fetchData();
        }
      }
    // }
  }, [
    quantity,
    selectedFulfillmentOption,
    watch("costPrice"),
    watch("priceOption"),
    watch("storage"),
    watch("salePrice"),
    watch("miscFee"),
    watch("miscFeePerc"),
    watch("inbound_placement_split")
  ]);

  const handleFulfillmentOptionChange = (option) => {
    setSelectedFulfillmentOption(option);
  };
  // console.log("data",data)

  const handlegraphToggle = (option) => {
    setgraphToggle(option);
  };

  const exportsheetdata = async (sheet_id) => {
  
      const payload=
      {data:
          {"Product Name":data?.data?.product_data?.item_name,
          Manufacturer:data?.data?.product_data?.manufacturer,
          Asin:data?.data?.product_data.asin,
          Health:data?.data?.product_data?.score_output["Health Score"] * 100 +" %",
          Upc:data?.data?.product_data?.upc,
          Eligible:data?.data?.product_data?.eligible ? "Yes" : "No",
          BSR:data?.data?.product_data?.BSR+` (${data?.data?.listing_stats?.BSR_perc})`,
          Quantity:quantity,
          "Fulfillment Method":selectedFulfillmentOption ? "FBA":"FBM",
          "Price Option": getValues("priceOption"),
          "Sale Price": getValues("salePrice"),
          "Cost Price": getValues("costPrice"),
          Storage: getValues('storage'),
          "Max Cost": caldata?.max_cost?.toFixed(2),
          Roi: caldata?.simple_roi?.toFixed(2),
          "Total_Profit": caldata?.total_profit?.toFixed(2),
          },
          sheet_id}
      setLoadingExport(true)
    
      try {
          const response = await axios.post("/api/google_sheets/write_to_google_sheet", payload);
          if (response.data) {
              dispatch(showMessage({ message: 'Success', variant: 'success' }));
          }
          setLoadingExport(false);
          return true
      } catch (error) {
          dispatch(showMessage({ message: error?.response?.data?.message, variant: 'error' }));
          setLoadingExport(false);
          return false
      } 
  }
    
  // {data && console.log("main data",data)}

  // useEffect(() => {
  //     // Second API call to get data
  //     // Assuming this sets the value into setData state
  //     console.log("hye",data );

  //     if (data) { // Check if data is not undefined
  //         if (dropOption === "Lowest") {
  //             setValue("salePrice", data?.listing_stats?.lowest_fba_price);
  //         } else if (dropOption === "FBA") {
  //             setValue("salePrice", data?.listing_stats?.amazon_price);
  //         } else if (dropOption === "FBM") {
  //             setValue("salePrice", data?.listing_stats?.lowest_fbm_price);
  //         } else if (dropOption === "BuyBox") {
  //             setValue("salePrice", data?.listing_stats?.buy_box_price);
  //         }
  //     }
  // }, [data, dropOption]);

  const componentMapping = [
    {
      id: "2",
      component: data && data?.data?.listing_stats && (
        <Ranks data={data?.data} caldata={data?.data?.listing_stats} />
      ),
    },
    // {
    //     id: "3",
    //     component: (
    //         <FeeCalculation
    //             data={feeCalData}
    //             register={register}
    //             control={control}
    //             setValue={setValue}
    //             selectedFulfillmentOption={selectedFulfillmentOption}
    //             handleFulfillmentOptionChange={handleFulfillmentOptionChange}

    //         />
    //     ),
    // },
    {
      id: "4",
      component: (
        <>
          <div className="relative flex flex-col gap-16 flex-auto rounded-2xl  overflow-hidden ">
            <div className="flex flex-col gap-16  justify-between p-24 bg-[#D5E6E9]">
              <div className="flex justify-between items-center">
                <Typography className="text-xl font-bold tracking-tight leading-6 truncate text-secondary">
                  Charts
                </Typography>
                <div className=" sm:w-[49%] xsm:w-full flex justify-end">
                  <div
                    className="rounded-lg bg-secondary flex p-1 w-88 h-24 self-center"
                    // style={{ marginTop: "12px" }}
                  >
                    <div
                      className={`rounded-lg bg-white flex p-1 w-88 cursor-pointer`}
                      onClick={() => {
                        handlegraphToggle(
                          !graphToggle
                        );
                      }}
                    >
                      <div
                        className={` w-1/2 bg-secondary text-white align-middle text-center p-3 rounded-lg text-xs transition-transform duration-300 ease-in-out ${
                          graphToggle
                            ? "translate-x-0"
                            : "translate-x-full"
                        }`}
                      >
                        {graphToggle ? "Identify" : "Keepa"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {graphToggle === true ? (
                data?.data?.charts ? (
                  <Charts chart={data?.data} breakevenPrice={caldata?.break_even_price} />
                ):<div className='text-center text-gray-500 font-600 p-5 mb-16'>No charts</div>
            ) : (
              data?.data?.charts ? (
                <Charts chart={data?.data} breakevenPrice={caldata?.break_even_price} onStoreFront={false} keepa={true}/>
              ):<div className='text-center text-gray-500 font-600 p-5 mb-16'>No charts</div>
            )}
          </div>
        </>
      ),
    },
    // {
    //     id: "5",
    //     component: <Alerts caldata={data?.alerts} />,
    // },
    {
      id: "7",
      component: (
        <Export
          data={sheets?.records}
          exportsheetdata={exportsheetdata}
          loadingExport={loadingExport}
        />
      ),
    },
    {
      id: "8",
      component: <Offers data={data?.data?.offers_data} />,
    },
    {
      id: "9",
      component: <BuyBoxDistribution data={data?.data?.buy_box_distribution} />,
    },
    {
      id: "10",
      component: <Variations data={data?.data?.variations} />,
    },
  ];

  const componentsById = componentMapping.reduce((acc, cur) => {
    acc[cur.id] = cur.component;
    return acc;
  }, {});
  const healthComponent = [{
    id: "6",
    component: data?.data?.product_data?.score_output && (
      <HealthOrder
        health={data?.data?.product_data?.score_output["Health Score"]}
        data={data?.data?.product_data?.score_output["Health Order"]}
      />
    ),
  }].reduce((acc, cur) => {
    acc[cur.id] = cur.component;
    return acc;
  }, {});

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
          <motion.div
            className="w-full"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <div className="grid grid-cols-1 gap-24 w-full mt-32">
              <div className="grid gap-32 sm:grid-flow-col xl:grid-flow-row">
                <motion.div variants={item} className="flex flex-col flex-auto">
                  {data && (
                    <ProductInfo
                      data={data}
                      onProductDetail={true}
                      quantity={quantity}
                      setQuantity={setQuantity}
                      lowBsr={caldata?.low_bsr}
                      highVolume={caldata?.high_volume}
                    />
                  )}
                </motion.div>
              </div>
              <div className="flex flex-col md:flex-row gap-20">
                <motion.div variants={item} className="flex flex-col w-full md:w-1/2 ">
                  {data && (
                    <ProfitCalculator
                      data={data?.data}
                      feeCalData={feeCalData}
                      caldata={caldata}
                      setCalData={setCalData}
                      setValue={setValue}
                      getValues={getValues}
                      quantity={quantity}
                      setQuantity={setQuantity}
                      register={register}
                      control={control}
                      // setIsFBA={setIsFBA}
                      //   selectedOption={selectedOption}
                      //   setSelectedOption={setSelectedOption}
                      watch={watch}
                      selectedFulfillmentOption={selectedFulfillmentOption}
                      handleFulfillmentOptionChange={
                        handleFulfillmentOptionChange
                      }
                      calcLoading={calcLoading}
                      reset={reset}
                    />
                  )}
                </motion.div>
                {panels.map(
                  ({ id, show }) =>
                    show &&
                    healthComponent[id] && (
                      <motion.div
                        variants={item}
                        className="flex flex-col w-full md:w-1/2 bg-white rounded-2xl"
                      >
                        {healthComponent[id]}
                      </motion.div>
                    )
                )}
              </div>
              <div className="grid gap-20 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
                {/* Render ProfitCalculator component */}

                {/* <motion.div variants={item} className="flex flex-col" >
                                    <FeeCalculation
                                            data={feeCalData}
                                            caldata={caldata}
                                            register={register}
                                            control={control}
                                            setValue={setValue}
                                            selectedFulfillmentOption={selectedFulfillmentOption}
                                            handleFulfillmentOptionChange={handleFulfillmentOptionChange}

                                        />
                                    
                                </motion.div> */}
                {/* Render components from componentMapping array */}

                {panels.map(
                  ({ id, show }) =>
                    show &&
                    componentsById[id] && (
                      <motion.div
                        variants={item}
                        className={`bg-white rounded-2xl shadow ${
                          id == "10" ? "md:col-span-2 lg:col-span-2" : ""
                        } ${id == "7" ? "min-h-fit" : ""}  ${
                          id == "4" ? "md:col-span-2 lg:col-span-3" : ""
                        }
                                ${
                                  id == "6" ? "md:col-span-2 lg:col-span-1" : ""
                                } ${
                                  id == "8" ? "md:col-span-2 lg:col-span-2" : ""
                                }`}
                        key={id}
                      >
                        {componentsById[id]}
                      </motion.div>
                    )
                )}

                {/* <motion.div variants={item} className="bg-white rounded-2xl" >
                                    {data?.charts && <Charts chart={data?.charts?.chart2} />}
                                    {data?.charts && <Charts chart={data?.charts?.chart3} />}
                                    {data?.charts && <Charts chart={data?.charts?.chart4} />}
                                </motion.div>                               */}
              </div>

              {/* <div className="grid gap-20 lg:grid-cols-3 md:grid-cols-2" > */}

              {/* <motion.div variants={item} className="bg-white rounded-2xl" >
                                    {data?.charts && <Charts chart={data?.charts?.chart3} />}
                                </motion.div>

                                <motion.div variants={item} className="bg-white rounded-2xl" >
                                    {data?.charts && <Charts chart={data?.charts?.chart4} />}
                                </motion.div> */}
              {/* </div>   */}
            </div>
          </motion.div>
        );
      }, [
        data,
        caldata,
        quantity,
        feeCalData,
        selectedFulfillmentOption,
        getValues("costPrice"),
        getValues("priceOption"),
        getValues("storage"),
        getValues("salePrice"),
        loadingExport,
        getValues("miscFee"),
        getValues("miscFeePerc"),
        graphToggle
      ])}
    </div>
  );

  return (
    <div className="flex justify-center items-center h-full">
      {loading ? (
        <CircularProgress size={40} color="inherit" />
      ) : (
        <FusePageSimple
          header={
            data && (
              <ProductAppHeader data={data} setData={setData} asin={asin} />
            )
          }
          content={content}
        />
      )}
    </div>
  );
}

export default Product;
