import history from '@history';
import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { darken } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import TablePricingFeatureItem from './TablePricingFeatureItem';
import TablePricingTable from './TablePricingTable';
import { Avatar, Chip, CircularProgress, FormControlLabel, IconButton, ListItem, Radio, RadioGroup, TextField } from '@mui/material';
import { getRecords, selectPayments } from '../../subscription/store/paymentsSlice';
import { useAppDispatch, useAppSelector } from 'app/store';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { PaymentDataType, PaymentPayload } from '../../subscription/types/PaymentMethodType';
// import PaymentsMethodTable from '../widgets/PaymentMethodsTable';
import { getPublicSubscriptionRecords, selectSubscriptions } from '../../subscription/store/subscriptionSlice';
import { getInvoicesRecords, selectInvoices } from '../../subscription/store/InvoiceSlice';
import { Unsubscribe, addRecord, getActiveOrder, getOrdersRecords, selectOrders, updateAutoRenewal, updateBillingCycle } from '../../subscription/store/orderSlice';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useNavigate } from 'react-router';
import { OrderType } from '../../subscription/types/OrderType';
import { SubscriptionType } from '../../subscription/types/SubscriptionType';
import { selectUser } from 'app/store/user/userSlice';
import { useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import ConfirmationDialog from 'app/shared-components/ConfirmationDialog';
import { showMessage } from 'app/store/fuse/messageSlice';
import Dialog from '@mui/material/Dialog';
import Subscription from '../../subscription/Subscription'
import { format } from 'date-fns';
import CancelSubscription from 'app/shared-components/CancelSubscription';
import axios from 'axios';
/**
 * The table pricing page.
 */
function TablePricingPage() {

	const [searchParams, setSearchParams] = useSearchParams()
const user = useAppSelector(selectUser);
	const [period, setPeriod] = useState<'month' | 'year' | 'daily'>('month');
	const [currentPeriod, setCurrentPeriod] = useState<'month' | 'year'| 'daily'>('month');
    const [dialogBoxOpen, setDialogBoxOpen] = useState(false);
    const [screenLoading, setScreenLoading] = useState(false);


	const [order, setOrder] = useState<OrderType>()
	const [nextBillDate, setNextBillDate] = useState(new Date())
	const [plan, setPlan] = useState<SubscriptionType>();
	const [currentIndex, setCurrentIndex] = useState<number>(0);
  
	const [promoText, setPromotext] = useState<string>('');
	const [paymentMethod, setPaymentMethod] = useState<PaymentPayload>()

	const [dialogOpen, setDialogOpen] = useState(false);
	const [loading, setLoading] = useState(false)

	const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
	const [cancelLoading, setCancelLoading] = useState(false)
  const [promoLoading,setPromoLoading]= useState(false);
  const [planError, setPlanError] = useState(null);
  const [promoApplied, setPromoApplied] = useState(false);
	const [plans, setPlans] = useState<[SubscriptionType]>()
	const [planPrice, setPlanPrice] = useState({total_yearly_price:null,monthly_price:null});
	const [discountInfo, setDiscountInfo] = useState(null);
	const [promoError, setPromoError] = useState(null);
  
	const [refresh, setRefresh] = useState(false);
	const [pauseModal, setPauseModal] = useState(false);
	const [keepModal, setKeepModal] = useState(false);

	const dispatch = useAppDispatch();

	const navigate = useNavigate();
  const handlePromoChange=(e:any)=>{
    setPromotext(e.target.value);
    setPromoApplied(false);
  }
  const applyPromoCode= async()=>{
    setPromoLoading(true)
    try {
      const response = await axios.post('/api/discount_codes/verify_discount_code',{discount_code:promoText,yearly: period=="month" ? false : true, })
      const discountData= response.data;
      setPromoError(null);
      if(period=='month'){
        if(discountData.is_percent){
        setDiscountInfo({
          discount_code_id: discountData.discount_code_id,
          discount: planPrice[currentIndex].monthly_price * (discountData.discount / 100),
          duration: discountData?.duration,
        });
      }else{
         setDiscountInfo({
           discount_code_id: discountData.discount_code_id,
           discount: discountData.discount,
           duration: discountData?.duration,
         });
      }
      }
      else{
        if(discountData.is_percent){

        setDiscountInfo({
          discount_code_id: discountData.discount_code_id,
          discount: ((planPrice[currentIndex].total_yearly_price*12) * (discountData.discount / 100)),
          duration: discountData?.duration,
        });
        }
        else{
          setDiscountInfo({
            discount_code_id: discountData.discount_code_id,
            discount: discountData.discount,
            duration: discountData?.duration,
          });
        }

      }
      if(discountData.is_percent){
        setPlan((prevValues) => ({
          ...prevValues,
          monthly_price:
          (planPrice[currentIndex].monthly_price -
            planPrice[currentIndex].monthly_price * (discountData.discount / 100)),
          total_yearly_price:
          (planPrice[currentIndex].total_yearly_price -
            planPrice[currentIndex].total_yearly_price * (discountData.discount / 100)),
        }));
       const newPlans = plans.map((item) => ({
         ...item,
         monthly_price:
           item.monthly_price -
           item.monthly_price * (discountData.discount / 100),
         total_yearly_price:
           item.total_yearly_price - item.total_yearly_price * (discountData.discount / 100),

       }));
       setPlans(newPlans)
        setPromoApplied(true);
      }else{
        if(period=='month'){
          if (discountData.discount > planPrice[currentIndex].monthly_price) {
            setPromoError("Promo code not applicable.");
            setPlanError({
              index: currentIndex,
              error: "Promo not applicable",
            });
            setPromoLoading(false);
          } 
          else {
            setPlan((prevValues) => ({
              ...prevValues,
              monthly_price:
                planPrice[currentIndex].monthly_price - discountData.discount,
            }));
            //add check in here in the map to fix multiple plans issue
            const newPlans = plans.map((item) => ({
              ...item,
              monthly_price: item.monthly_price - discountData.discount,
            }));
            setPlans(newPlans);
            setPromoApplied(true);
          
          }
        }
        if (period == "year") {
          if (discountData.discount > planPrice[currentIndex].total_yearly_price) {
            setPromoError('Promo code not applicable.');
            setPlanError({
              index: currentIndex,
              error: "Promo not applicable",
            });
            setPromoLoading(false);
          } 
          else {
            setPlan((prevValues) => ({
              ...prevValues,
              total_yearly_price:
                (planPrice[currentIndex].total_yearly_price -
                  discountData.discount),
            }));
            const newPlans = plans.map((item) => ({
              ...item,
              total_yearly_price:
                (item.total_yearly_price - discountData.discount),
            }));
            setPlans(newPlans);
            setPromoApplied(true);
          }
        }
        // setPlan((prevValues) => ({
        //   ...prevValues,
        //   monthly_price:
        //     planPrice.monthly_price - (discountData.discount),
        //   total_yearly_price: (planPrice.total_yearly_price*12 ) - (discountData.discount),
        // }));
        // const newPlans = plans.map((item) => ({
        //   ...item,
        //   monthly_price: item.monthly_price - (discountData.discount),
        //   total_yearly_price: (item.total_yearly_price * 12) - (discountData.discount),
        // }));
        // setPlans(newPlans);
      }
      // setPromoApplied(true);
      
    } catch (error) {
      setPromoError(error.response?.data.message);
      console.log(error);
      
    }
    setPromoLoading(false);
  }
  const applyPromoCode2 = async () => {
    setPromoLoading(true);
    try {
      const response = await axios.post(
        "/api/discount_codes/verify_discount_code",
        { discount_code: promoText, yearly: period == "month" ? false : true }
      );
      const discountData = response.data;
      setPromoError(null);
      if (period == "month") {
        if (discountData.is_percent) {
          setDiscountInfo({
            discount_code_id: discountData.discount_code_id,
            discount: planPrice.monthly_price * (discountData.discount / 100),
            duration: discountData?.duration,
          });
        } else {
          setDiscountInfo({
            discount_code_id: discountData.discount_code_id,
            discount: discountData.discount,
            duration: discountData?.duration,
          });
        }
      } else {
        if (discountData.is_percent) {
          setDiscountInfo({
            discount_code_id: discountData.discount_code_id,
            discount: planPrice.total_yearly_price * (discountData.discount / 100),
            duration: discountData?.duration,
          });
        } else {
          setDiscountInfo({
            discount_code_id: discountData.discount_code_id,
            discount: discountData.discount,
            duration: discountData?.duration,
          });
        }
      }
      if (discountData.is_percent) {
        setPlan((prevValues) => ({
          ...prevValues,
          monthly_price:
            planPrice.monthly_price -
            planPrice.monthly_price * (discountData.discount / 100),
          total_yearly_price:
            planPrice.total_yearly_price -
            planPrice.total_yearly_price * (discountData.discount / 100),
        }));
        // const newPlans = plans.map((item) => ({
        //   ...item,
        //   monthly_price:
        //     item.monthly_price -
        //     item.monthly_price * (discountData.discount / 100),
        //   total_yearly_price:
        //     item.total_yearly_price -
        //     item.total_yearly_price * (discountData.discount / 100),
        // }));
        // setPlans(newPlans);
        setPromoApplied(true);
      } else {
        if (period == "month") {
          if (discountData?.discount > planPrice.monthly_price) {
            setPromoError("Promo code not applicable.");
            setPromoLoading(false);
          } else {
            setPlan((prevValues) => ({
              ...prevValues,
              monthly_price: planPrice.monthly_price - discountData.discount,
            }));
            // const newPlans = plans.map((item) => ({
            //   ...item,
            //   monthly_price: item.monthly_price - discountData.discount,
            // }));
            // setPlans(newPlans);
            setPromoApplied(true);
          }
        }
        if (period == "year") {
          if (discountData?.discount > planPrice.total_yearly_price) {
            setPromoError("Promo code not applicable.");
            setPromoLoading(false);
            
          } else {
            setPlan((prevValues) => ({
              ...prevValues,
              total_yearly_price:
                (planPrice.total_yearly_price - discountData.discount),
            }));
            // const newPlans = plans.map((item) => ({
            //   ...item,
            //   total_yearly_price:
            //     (planPrice.total_yearly_price * 12 - discountData.discount) / 12,
            // }));
            // setPlans(newPlans);
      setPromoApplied(true);

          }
        }
        // setPlan((prevValues) => ({
        //   ...prevValues,
        //   monthly_price:
        //     planPrice.monthly_price - (discountData.discount),
        //   total_yearly_price: (planPrice.total_yearly_price*12 ) - (discountData.discount),
        // }));
        // const newPlans = plans.map((item) => ({
        //   ...item,
        //   monthly_price: item.monthly_price - (discountData.discount),
        //   total_yearly_price: (item.total_yearly_price * 12) - (discountData.discount),
        // }));
        // setPlans(newPlans);
      }
    } catch (error) {
      setPromoError(error.response?.data.message);
    }
    setPromoLoading(false);
  };
	const handleGoBack = () => {
		navigate("/profile");
	};

	
    const handleOpen = () => {
        setDialogBoxOpen(true);
      };
    
      const handleClose = () => {
        setDialogBoxOpen(false);

		// reload info
    setPromotext("");
    setDiscountInfo(null);
    setPromoApplied(false);
		setRefresh(!refresh)
      };

	// const paymentData = useAppSelector(selectPayments);
	// const subscriptions = useAppSelector(selectSubscriptions);
	// const Invoices = useAppSelector(selectInvoices);
	// const Orders = useAppSelector(selectOrders);

	// const userData = useSelector(selectUser);
	// const [order_exists, setOrderExists] = useState<OrderType>()

	useEffect(() => {


		dispatch(getActiveOrder()).then((resp) => {
      
			setOrder(resp.payload?.order);
			if (resp.payload?.order) {
				setNextBillDate(new Date(resp.payload?.order?.next_check_time * 1000));
				setPlan(resp.payload?.order);
        setPlanPrice({
          monthly_price: resp.payload?.order?.monthly_price,
          total_yearly_price: resp.payload?.order?.total_yearly_price,
        });
				setPeriod(resp.payload.order?.bill_mode == 'Monthly' ? 'month' :resp.payload.order?.bill_mode == 'Daily'?'daily' : 'year');
				setCurrentPeriod(resp.payload?.order?.bill_mode == 'Monthly' ? 'month' :resp.payload.order?.bill_mode == 'Daily'? 'daily': 'year')
			}
			else {
				loadPlans();
			}
      setScreenLoading(true)
		});

		dispatch(getRecords()).then((resp) => {
			setPaymentMethod(resp.payload.records?.length > 0 ? resp.payload?.records[0]: null);
		});

	}, [dispatch, refresh]);

	function loadPlans() {

		const planId = searchParams.get("subscription")
		const period: any = searchParams.get("period")

		dispatch(getPublicSubscriptionRecords({})).then((resp) => {
      
			setPlans(resp.payload.records);

			if (!order && resp.payload.records.length > 0) {
				if (planId) {
					const plan = resp.payload.records.filter(record => record.id === planId);
				
					if (plan.length > 0) {
						setPlan(plan[0]);
					}
					if (period == 'month' || period == 'year' || period == 'daily') {
						setPeriod(period);
					}
				}
				else {
          
					setPlan(resp.payload.records[0])
          if (resp && resp?.payload?.records?.length>0){
            const newArr = resp?.payload?.records?.map((item, index) => ({
              index:index,
              monthly_price: item?.monthly_price,
              total_yearly_price: item?.total_yearly_price,
            }));
            setPlanPrice(newArr);
          }
				}

			}
		});
	}

	// useEffect(() => {
	// 	setPayments(paymentData)
	// }, [paymentData]);

	// useEffect(() => {
	// 	if (Orders.records){
	// 		setOrderExists(Orders.records.find((item) => item.order_status === "Active" && item.user_id == userData.uuid))
	// 	}
	// }, [Orders])

	// useEffect(() => {
	// 	if(order_exists){
	// 	}
	// },[order_exists])

	// useEffect(()=>{
	// 	if(subscriptions && subscriptions?.records?.length > 0){
	// 		setPlan(subscriptions?.records[0])
	// 	}
	// },[subscriptions])

	const handleCloseDialog = () => {
		setDialogOpen(false);
	};
      const updateRenewalStatus = () => {
        // setChangeLoading(true);
        if (promoApplied) {
          dispatch(
            updateAutoRenewal({
              payload: {
                order_id: order.order_id,
                actual_price:
                  period == "month"
                    ? planPrice.monthly_price
                    : planPrice.total_yearly_price,
                order_price:
                  period == "month"
                    ? plan.monthly_price
                    : plan.total_yearly_price,
               ...discountInfo
              },
            })
          ).then((resp) => {
            setLoading(false);
            setRefresh(!refresh);

           
          });
        }else{
           dispatch(
             updateAutoRenewal({
               payload: {
                 order_id: order.order_id,
                 actual_price:
                   period == "month"
                     ? planPrice.monthly_price
                     : planPrice.total_yearly_price,
                 order_price:
                   period == "month" ? plan.monthly_price : plan.total_yearly_price,
               },
             })
           ).then((resp) => {
             setLoading(false);
             setRefresh(!refresh);
           });
        }
      }


	const handleConfirmDialog =() => {

		setDialogOpen(false);

		if (order) {
			// update billing cycle
			setLoading(true)
      if(currentPeriod===period){
      updateRenewalStatus();
      
      }else{

        
        const payload = promoApplied
          ? {
              period,
              order_id: order?.order_id,
              order_price:
                period == "month" ? plan.monthly_price : plan.total_yearly_price*12,
              actual_price:
                period == "month"
                  ? planPrice.monthly_price
                  : planPrice.total_yearly_price,
              ...discountInfo,
            }
          : {
              period,
              order_id: order?.order_id,
              order_price:
                period == "month" ? plan.monthly_price : plan.total_yearly_price*12,
              actual_price:
                period == "month"
                  ? planPrice.monthly_price
                  : planPrice.total_yearly_price
            };
    dispatch(updateBillingCycle({payload})).then((resp) => {
    	setLoading(false);
  	dispatch(showMessage({ message: 'Success', variant: 'success' }));
	handleGoBack();
});	
}
		}
		else {
			// choose plan
			setLoading(true)
			const formData = promoApplied
        ? {
            subscription_id: plan.subscription_id,
            yearly: period == "month" ? false : true,
            payment_method_id: paymentMethod.method_id,
            order_price:
              period == "month" ? plan.monthly_price : (plan.total_yearly_price*12),
            actual_price:
              period == "month"
                ? planPrice.monthly_price
                : planPrice.total_yearly_price,
            ...discountInfo,
          }
        : {
            subscription_id: plan.subscription_id,
            yearly: period == "month" ? false : true,
            payment_method_id: paymentMethod.method_id,
            order_price:
              period == "month" ? plan.monthly_price : plan.total_yearly_price*12,
            actual_price:
              period == "month"
                ? planPrice.monthly_price
                : planPrice.total_yearly_price,
          }; 
        dispatch(addRecord({ payload: formData })).then((resp: any) => {
            if (resp.error) {
              dispatch(
                showMessage({ message: resp.error.message, variant: "error" })
              );
              setLoading(false);
            } else {
              dispatch(showMessage({ message: "Success", variant: "success" }));
              setLoading(false);
              handleGoBack();
            }
          });

		}
	}
  useEffect(()=>{
    if(order){
            if(!promoApplied && planPrice.monthly_price && planPrice.total_yearly_price){
       setPlan((prevValues) => ({
         ...prevValues,
         monthly_price: planPrice.monthly_price,
         total_yearly_price: planPrice.total_yearly_price,
       }));
       const newPlans = plans?.map((item) => ({
         ...item,
         monthly_price: planPrice.monthly_price,
         total_yearly_price: planPrice.total_yearly_price,
       }))|| [];
       setPlans(newPlans);
    }
  }
    else{
    if(!promoApplied && planPrice?.length>0){
       setPlan((prevValues) => ({
         ...prevValues,
         monthly_price: planPrice[currentIndex].monthly_price,
         total_yearly_price: planPrice[currentIndex].total_yearly_price,
       }));
       const newPlans = plans?.map((item,index) => ({
         ...item,
         monthly_price: planPrice[index].monthly_price,
         total_yearly_price: planPrice[index].total_yearly_price,
       }))|| [];
       setPlans(newPlans);
    }
  }
  },[promoApplied])

	const handleCancelCloseDialog = () => {
		setCancelDialogOpen(false);
	};
  
	const handleCancelConfirmDialog =() => {
		setCancelDialogOpen(false);

		setCancelLoading(true);

		dispatch(Unsubscribe()).then((resp: any) => {
			if (resp.error) {
				dispatch(showMessage({ message: resp.error.message, variant: 'error' }));
				setCancelLoading(false)
			}
			else {
				// dispatch(showMessage({ message: 'Success', variant: 'success' }));
				setCancelLoading(false)
				handleGoBack();
			}
		});
	}

	const content = (
    <>
      <div className="relative grid md:grid-cols-2 min-h-screen min-w-0 flex-auto overflow-hidden">
        <div
          style={{
            background: "linear-gradient(240deg, #45D1EB 45%, #0e505c 100%)",
          }}
          className="relative hidden h-full  flex-auto items-center justify-center overflow-hidden p-64 md:flex lg:px-112 "
        >
          {plan && (
            <div className=" relative z-10 w-full max-w-2xl">
              <Paper className="max-w-sm flex-col bg-white items-center p-32  text-center sm:px-40 sm:py-48 md:max-w-none lg:rounded-2xl ">
                <div className="text-4xl font-extrabold leading-tight text-[#525252] tracking-tight">
                  Amazon Seller Essentials
                </div>

                {order ? (
                  <div className="mt-2 flex items-baseline justify-center whitespace-nowrap">
                    <Typography className="text-6xl text-[#525252] font-semibold leading-tight tracking-tight">
                      $ {period === "month" && plan.monthly_price?.toFixed(2)}
                      {period === "year" && plan.total_yearly_price.toFixed(2)}
                      <div className="text-lg text-[#525252]">
                        {period === "year" &&
                          `($${(plan.total_yearly_price / 12).toFixed(2)}/ month)`}
                      </div>
                    </Typography>
                    <Typography className="ml-8 text-2xl text-[#525252]">
                      {period === "month" && "/ month"}
                      {period === "year" && `/ yearly`}
                    </Typography>
                  </div>
                ) : (
                  <div className="mt-2 flex items-baseline justify-center whitespace-nowrap">
                    <Typography className="text-6xl text-[#525252] font-semibold leading-tight tracking-tight">
                      $ {period === "month" && plan.monthly_price?.toFixed(2)}
                      {period === "year" && plan.total_yearly_price.toFixed(2)}
                      <div className="text-lg text-[#525252]">
                        {period === "year" &&
                          `($${(plan.total_yearly_price / 12)?.toFixed(2)}/ month)`}
                      </div>
                    </Typography>
                    <Typography className="ml-8 text-2xl text-[#525252]">
                      {period === "month" && "/ month"}
                      {period === "year" && `/ yearly`}
                    </Typography>
                  </div>
                )}

                <div className="mt-32 space-y-8">
                  <div className="mt-48 flex flex-col text-[#525252]">
                    <Typography
                      className="text-start ml-2 leading-5 font-semibold text-[#525252]"
                      dangerouslySetInnerHTML={{ __html: plan.feature_line }}
                    />
                    <div className="mt-16 space-y-8">
                      <div className="flex">
                        <FuseSvgIcon className="text-green-600" size={20}>
                          heroicons-solid:check
                        </FuseSvgIcon>
                        <Typography className="ml-2 leading-5">
                          3 mobile app installs
                        </Typography>
                      </div>
                      <div className="flex">
                        <FuseSvgIcon className="text-green-600" size={20}>
                          heroicons-solid:check
                        </FuseSvgIcon>
                        <Typography className="ml-2 leading-5">
                          5 Chrome extension installs
                        </Typography>
                      </div>
                      <div>
                        <div className="flex ">
                          <FuseSvgIcon className="text-green-600" size={20}>
                            heroicons-solid:check
                          </FuseSvgIcon>
                          <Typography className="ml-2 leading-5">
                            Unlimited product analysis
                          </Typography>
                        </div>
                        <div className="text-left ml-24">
                          <li>100% accurate monthly sales data</li>
                          <li>Simplified price, offers, & BSR graphs</li>
                          <li>Quick view of all variations on a listing</li>
                          <li>Storefront stalking to find the best ASINs</li>
                          <li>Red & green flags for all ASINs you view</li>
                        </div>
                      </div>
                      <div className="flex">
                        <FuseSvgIcon className="text-green-600" size={20}>
                          heroicons-solid:check
                        </FuseSvgIcon>
                        <Typography className="ml-2 leading-5">
                          Order management dashboard
                        </Typography>
                      </div>
                      <div className="flex">
                        <FuseSvgIcon className="text-green-600" size={20}>
                          heroicons-solid:check
                        </FuseSvgIcon>
                        <Typography className="ml-2 leading-5">
                          Favorite leads list
                        </Typography>
                      </div>
                      <div className="flex">
                        <FuseSvgIcon className="text-green-600" size={20}>
                          heroicons-solid:check
                        </FuseSvgIcon>
                        <Typography className="ml-2 leading-5">
                          {period === "month"
                            ? " FREE 7-day trial, then billed monthly"
                            : " FREE 7-day trial, then billed annually"}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              </Paper>
            </div>
          )}
        </div>
        <div className="relative overflow-hidden px-24 pb-48 pt-32 sm:px-64 sm:pb-96 sm:pt-80 flex flex-col gap-4">
          <svg
            className="pointer-events-none absolute inset-0 -z-1"
            viewBox="0 0 960 540"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMax slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Box
              component="g"
              sx={{ color: "divider" }}
              className="opacity-20"
              fill="none"
              stroke="currentColor"
              strokeWidth="100"
            >
              <circle r="234" cx="196" cy="23" />
              <circle r="234" cx="790" cy="491" />
            </Box>
          </svg>

          {screenLoading && (
            <div className="flex flex-col -mx-24 ">
              <div
                // initial={{ opacity: 0, y: 40 }}
                // animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
                className="flex justify-between items-start "
              >
                <div className="flex gap-20 w-[70%] items-start">
                  <div>
                    <IconButton
                      aria-label="Open drawer"
                      onClick={() => handleGoBack()}
                      className="flex"
                      size="large"
                    >
                      <FuseSvgIcon>heroicons-outline:arrow-left</FuseSvgIcon>
                    </IconButton>
                  </div>
                  <div>
                    <Typography className="text-3xl font-semibold tracking-tight leading-8">
                      {order
                        ? order?.auto_renewal
                          ? "Change Billing Cycle"
                          : "Renew/Update"
                        : "Choose Plan"}
                    </Typography>
                    <Typography
                      className="font-medium tracking-tight"
                      color="text.secondary"
                    >
                      {order
                        ? "Update will take effect at your next renewal"
                        : "Start your journey by choosing one plan"}
                    </Typography>
                  </div>
                </div>
                {order && (
                  <div className="flex justify-center flex-col gap-3 items-center">
                    <Typography className="md:text-[12px]">
                      {order?.auto_renewal ? "Next bill date" : "Valid Up To"}:
                    </Typography>
                    {/* <Typography>Next bill date</Typography> */}
                    <Typography className="text-white bg-black md:text-[12px] px-10 py-5 rounded-full">
                      {format(nextBillDate, "MMMMMMMM dd, y")}
                    </Typography>
                  </div>
                )}
              </div>
              {!paymentMethod && (
                <div>
                  <Typography className=" mt-28 text-md font-600 text-deep-orange-900">
                    You haven't configured your payment method yet!
                    <Link
                      className="ml-4 cursor-pointer"
                      to="#"
                      onClick={handleOpen}
                    >
                      Please configure
                    </Link>
                  </Typography>
                </div>
              )}

              <div className="flex mt-20">
                <FormControlLabel
                  value="month"
                  control={
                    <Radio
                      checked={period === "month"}
                      onChange={() => {
                        if (period == "year") {
                          setPromotext("");
                          setDiscountInfo(null);
                          setPromoApplied(false);
                          if (plans?.length > 0) {
                            setPlan(plans[0]);
                          }
                        }
                        setPeriod("month");
                      }}
                      value="Monthly billing"
                      name="radio-buttons"
                      className={clsx(
                        "h-40 cursor-pointer items-center rounded-full px-16 font-medium"
                      )}
                      inputProps={{ "aria-label": "Monthly Billing" }}
                    />
                  }
                  label={order ? "Monthly Renewal" : "Monthly Billing"}
                />

                <FormControlLabel
                  value="year"
                  control={
                    <Radio
                      checked={period === "year"}
                      onChange={() => {
                        if (period == "month") {
                          setPromotext("");
                          setDiscountInfo(null);
                          setPromoApplied(false);
                          if (plans?.length > 0) {
                            setPlan(plans[0]);
                          }
                        }
                        setPeriod("year");
                      }}
                      value="Yearly billing"
                      name="radio-buttons"
                      className={clsx(
                        "h-40 cursor-pointer items-center rounded-full px-16 font-medium"
                      )}
                      inputProps={{ "aria-label": "Yearly Billing" }}
                    />
                  }
                  label={order ? "Annual Renewal" : "Annual Billing"}
                />
              </div>

              {/* {order_exists.length == 0 && ( */}

              {/* <TablePricingTable
						period={period}
						data={subscriptions?.records}
						payment_method_id={payments?.records && payments.records[0]?.id}
						order_exists={order_exists ? true : false}
						subscription_id={order_exists ? order_exists?.subscription_id : ""}
					/> */}

              {/* )} */}

              {!order && (
                <>
                  {plans?.map((item, idx) => {
                    return (
                      <Box
                        key={idx}
                        className="flex flex-col rounded-8 p-16 mt-8"
                        sx={{ backgroundColor: "background.paper" }}
                      >
                        <FormControlLabel
                          value={item}
                          control={
                            <div className="flex gap-20 w-full">
                              <div>
                                <Radio
                                  checked={plan?.id === item?.id}
                                  onChange={() => {
                                    setPlan(item);
                                    setCurrentIndex(idx);
                                  }}
                                  value="plan"
                                  name="radio-buttons"
                                  className={clsx(
                                    "h-40 cursor-pointer items-center rounded-full px-16 font-medium"
                                  )}
                                  // inputProps={{ 'aria-label': 'Yearly Billing' }}
                                />
                              </div>

                              <div className="flex gap-20 w-full">
                                <div className="w-full ">
                                  <div className="flex gap-20 items-center">
                                    <Typography className="text-xl font-600">
                                      {item.title} -{" "}
                                      {period == "month" ? "Monthly" : "Yearly"}{" "}
                                    </Typography>
                                    {item.popular && (
                                      <Chip
                                        label="POPULAR"
                                        color="secondary"
                                        className="mx-12  h-24 rounded-full px-4 text-center text-sm font-semibold leading-none tracking-wide md:flex"
                                        size="small"
                                      />
                                    )}
                                    {item.monthly_price == 0 &&
                                      item.total_yearly_price == 0 && (
                                        <Chip
                                          label="Free"
                                          color="primary"
                                          className="mx-12  h-24 rounded-full px-4 text-center text-sm font-semibold leading-none tracking-wide md:flex"
                                          size="small"
                                        />
                                      )}
                                  </div>
                                  <div className="flex justify-between w-full items-center">
                                    <div>
                                      {promoApplied ? (
                                        <>
                                          <Typography
                                            className="text-lg line-through"
                                            color="text.secondary"
                                          >
                                            $
                                            {period === "month" &&
                                              planPrice[idx].monthly_price
                                                .toFixed(2)
                                                .toLocaleString()}
                                            {period === "year" &&
                                              (planPrice[idx].total_yearly_price / 12)
                                                .toFixed(2)
                                                .toLocaleString()}{" "}
                                            x {period === "month" && "1 Month"}
                                            {period === "year" && "12 Months"}
                                          </Typography>
                                          <Typography
                                            className="text-lg"
                                            color="text.secondary"
                                          >
                                            $
                                            {period === "month" &&
                                              item.monthly_price
                                                .toFixed(2)
                                                .toLocaleString()}
                                            {period === "year" &&
                                              (item.total_yearly_price / 12)
                                                .toFixed(2)
                                                .toLocaleString()}{" "}
                                            x {period === "month" && "1 Month"}
                                            {period === "year" && "12 Months"}
                                          </Typography>
                                        </>
                                      ) : (
                                        <Typography
                                          className="text-lg"
                                          color="text.secondary"
                                        >
                                          $
                                          {period === "month" &&
                                            item.monthly_price
                                              ?.toFixed(2)
                                              .toLocaleString()}
                                          {period === "year" &&
                                            (item.total_yearly_price / 12)
                                              ?.toFixed(2)
                                              .toLocaleString()}{" "}
                                          x {period === "month" && "1 Month"}
                                          {period === "year" && "12 Months"}
                                        </Typography>
                                      )}
                                    </div>
                                    <Typography
                                      className="text-lg"
                                      color="text.secondary"
                                    >
                                      $
                                      {period === "month" &&
                                        item.monthly_price
                                          ?.toFixed(2)
                                          .toLocaleString()}
                                      {period === "year" &&
                                        item.total_yearly_price
                                          ?.toFixed(2)
                                          .toLocaleString()}
                                    </Typography>
                                  </div>
                                  {item.trial_days > 0 && (
                                    <Typography className="text-lg text-green-500">
                                      {item.trial_days} days trial
                                    </Typography>
                                  )}
                                </div>
                              </div>
                            </div>
                          }
                          label=""
                          className="w-full"
                        />
                      </Box>
                    );
                  })}

                  <div className=" flex justify-between items-center pt-20 px-10 ">
                    <Typography className="text-lg" color="text.secondary">
                      Billed at renewal
                    </Typography>
                    {plan ? (
                      <>
                        {discountInfo &&
                        discountInfo?.duration === "one time" ? (
                          <Typography
                            className="text-lg"
                            color="text.secondary"
                          >
                            $
                            {period === "month" &&
                              planPrice[currentIndex].monthly_price
                                ?.toFixed(2)
                                .toLocaleString()}
                            {period === "year" &&
                              planPrice[currentIndex].total_yearly_price
                                ?.toFixed(2)
                                .toLocaleString()}
                          </Typography>
                        ) : (
                          <Typography
                            className="text-lg"
                            color="text.secondary"
                          >
                            $
                            {period === "month" &&
                              plan.monthly_price?.toFixed(2).toLocaleString()}
                            {period === "year" &&
                              plan.total_yearly_price?.toFixed(2).toLocaleString()}
                          </Typography>
                        )}
                      </>
                    ) : (
                      <Typography>---</Typography>
                    )}
                  </div>
                  <div className="self-end mt-10 ">
                    {promoApplied ? (
                      <Typography className="mb-5"> Applied</Typography>
                    ) : (
                      <Typography className="mb-5">
                        {" "}
                        Have a promo code? Apply Here!{" "}
                      </Typography>
                    )}
                    <div className="flex gap-5 items-center">
                      <TextField
                        onChange={handlePromoChange}
                        value={promoText}
                        variant="outlined"
                        placeholder="Promo code"
                      />
                      <Button
                        disabled={promoText?.length == 0 || promoApplied}
                        className={` text-white hover:bg-secondary ${
                          promoText?.length == 0 || promoApplied
                            ? "bg-grey-500"
                            : "bg-secondary"
                        } `}
                        onClick={applyPromoCode}
                      >
                        Apply{" "}
                        {promoLoading && (
                          <CircularProgress
                            size={16}
                            style={{ color: "white" }}
                          />
                        )}
                      </Button>
                    </div>
                    {promoError && (
                      <Typography className="text-red ">
                        {promoError}
                      </Typography>
                    )}
                  </div>

                  <Button
                    onClick={() => setDialogOpen(true)}
                    className="my-12 h-32 min-h-32 px-16 py-6 lg:my-24 lg:h-40 lg:min-h-40"
                    variant="contained"
                    color={"secondary"}
                    disabled={!paymentMethod || !plan || loading}
                  >
                    Get Started
                    {loading && (
                      <div className="ml-8 mt-2">
                        <CircularProgress size={16} color="inherit" />
                      </div>
                    )}
                  </Button>
                </>
              )}

              {order && (
                <>
                  <Box
                    className="flex flex-col rounded-8 p-16 mt-8"
                    sx={{ backgroundColor: "background.paper" }}
                  >
                    <div className="flex gap-20 w-full">
                      <div className="w-full ">
                        <div className="flex gap-20 items-center">
                          <Typography className="text-xl font-600">
                            {plan.title} -{" "}
                            {period == "month" ? "Monthly" : "Yearly"}{" "}
                          </Typography>
                          {plan.popular && (
                            <Chip
                              label="POPULAR"
                              color="secondary"
                              className="mx-12  h-24 rounded-full px-4 text-center text-sm font-semibold leading-none tracking-wide md:flex"
                              size="small"
                            />
                          )}
                          {plan.monthly_price == 0 &&
                            plan.total_yearly_price == 0 && (
                              <Chip
                                label="Free"
                                color="primary"
                                className="mx-12  h-24 rounded-full px-4 text-center text-sm font-semibold leading-none tracking-wide md:flex"
                                size="small"
                              />
                            )}
                        </div>
                        <div className="flex justify-between w-full items-center">
                          <div>
                            {promoApplied ? (
                              <>
                                <Typography
                                  className="text-lg line-through"
                                  color="text.secondary"
                                >
                                  $
                                  {period === "month" &&
                                    (currentPeriod === "month" &&
                                    order?.auto_renewal
                                      ? plan?.order_price
                                          .toFixed(2)
                                          .toLocaleString()
                                      : planPrice?.monthly_price
                                          .toFixed(2)
                                          .toLocaleString())}
                                  {period === "year" &&
                                    (currentPeriod === "year" &&
                                    order?.auto_renewal
                                      ? (plan?.order_price / 12)
                                          ?.toFixed(2)
                                          .toLocaleString()
                                      : (planPrice?.total_yearly_price / 12)
                                          ?.toFixed(2)
                                          .toLocaleString())}
                                  x {period === "month" && "1 Month"}
                                  {period === "year" && "12 Months"}
                                </Typography>
                                <Typography
                                  className="text-lg"
                                  color="text.secondary"
                                >
                                  $
                                  {period === "month" &&
                                    (currentPeriod === "month" &&
                                    order?.auto_renewal
                                      ? plan?.order_price
                                          .toFixed(2)
                                          .toLocaleString()
                                      : plan?.monthly_price
                                          .toFixed(2)
                                          .toLocaleString())}
                                  {period === "year" &&
                                    (currentPeriod === "year" &&
                                    order?.auto_renewal
                                      ? (plan?.order_price / 12)
                                          .toFixed(2)
                                          .toLocaleString()
                                      : (plan?.total_yearly_price / 12)
                                          .toFixed(2)
                                          .toLocaleString())}
                                  x {period === "month" && "1 Month"}
                                  {period === "year" && "12 Months"}
                                </Typography>
                              </>
                            ) : (
                              <Typography
                                className="text-lg"
                                color="text.secondary"
                              >
                                $
                                {period === "month" &&
                                  (currentPeriod === "month" &&
                                  order?.auto_renewal
                                    ? plan?.order_price
                                        .toFixed(2)
                                        .toLocaleString()
                                    : plan?.monthly_price
                                        .toFixed(2)
                                        .toLocaleString())}
                                {period === "year" &&
                                  (currentPeriod === "year" &&
                                  order?.auto_renewal
                                    ? (plan?.order_price / 12)
                                        .toFixed(2)
                                        .toLocaleString()
                                    : (plan?.total_yearly_price / 12)
                                        .toFixed(2)
                                        .toLocaleString())}
                                x {period === "month" && "1 Month"}
                                {period === "year" && "12 Months"}
                              </Typography>
                            )}
                          </div>

                          <Typography
                            className="text-lg"
                            color="text.secondary"
                          >
                            $
                            {period === "month" &&
                              (currentPeriod === "month" && order?.auto_renewal
                                ? plan?.order_price.toFixed(2).toLocaleString()
                                : plan?.monthly_price
                                    .toFixed(2)
                                    .toLocaleString())}
                            {period === "year" &&
                              (currentPeriod === "year" && order?.auto_renewal
                                ? (plan?.order_price)
                                    .toFixed(2)
                                    .toLocaleString()
                                : (plan?.total_yearly_price)
                                    .toFixed(2)
                                    .toLocaleString())}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </Box>

                  <div className=" flex justify-between items-center pt-20 px-10 ">
                    <Typography className="text-lg" color="text.secondary">
                      Billed at renewal
                    </Typography>
                    {plan ? (
                      <>
                        {discountInfo &&
                        discountInfo?.duration === "one time" ? (
                          <Typography
                            className="text-lg"
                            color="text.secondary"
                          >
                            $
                            {period === "month" &&
                              (currentPeriod === "month" &&
                              plan?.discount_code?.duration != "one time"
                                ? plan?.order_price.toFixed(2).toLocaleString()
                                : planPrice?.monthly_price
                                    .toFixed(2)
                                    .toLocaleString())}
                            {period === "year" &&
                              (currentPeriod === "year" &&
                              plan?.discount_code?.duration != "one time"
                                ? (plan?.order_price)
                                    .toFixed(2)
                                    .toLocaleString()
                                : (planPrice?.total_yearly_price)
                                    .toFixed(2)
                                    .toLocaleString())}
                          </Typography>
                        ) : (
                          <Typography
                            className="text-lg"
                            color="text.secondary"
                          >
                            $
                            {period === "month" &&
                              (currentPeriod === "month" &&
                              plan?.discount_code?.duration != "one time"
                                ? plan?.order_price.toFixed(2).toLocaleString()
                                : plan?.monthly_price
                                    .toFixed(2)
                                    .toLocaleString())}
                            {period === "year" &&
                              (currentPeriod === "year" &&
                              plan?.discount_code?.duration != "one time"
                                ? (plan?.order_price)
                                    .toFixed(2)
                                    .toLocaleString()
                                : (plan?.total_yearly_price)
                                    .toFixed(2)
                                    .toLocaleString())}
                          </Typography>
                        )}
                      </>
                    ) : (
                      <Typography>---</Typography>
                    )}
                  </div>
                  {(!order.auto_renewal || currentPeriod != period) && (
                    <div className="self-end mt-10 ">
                      {promoApplied ? (
                        <Typography className="mb-5"> Applied</Typography>
                      ) : (
                        <Typography className="mb-5">
                          {" "}
                          Have a promo code? Apply Here!{" "}
                        </Typography>
                      )}
                      <div className="flex gap-5 items-center">
                        <TextField
                          onChange={handlePromoChange}
                          value={promoText}
                          variant="outlined"
                          placeholder="Promo code"
                        />
                        <Button
                          disabled={promoText?.length == 0 || promoApplied}
                          className={` text-white hover:bg-secondary ${
                            promoText?.length == 0 || promoApplied
                              ? "bg-grey-500"
                              : "bg-secondary"
                          } `}
                          onClick={applyPromoCode2}
                        >
                          Apply{" "}
                          {promoLoading && (
                            <CircularProgress
                              size={16}
                              style={{ color: "white" }}
                            />
                          )}
                        </Button>
                      </div>
                      {promoError && (
                        <Typography className="text-red ">
                          {promoError}
                        </Typography>
                      )}
                    </div>
                  )}

                  <Button
                    onClick={() => setDialogOpen(true)}
                    className="my-12 h-32 min-h-32 px-16 py-6 lg:my-24 lg:h-40 lg:min-h-40"
                    variant="contained"
                    color={"secondary"}
                    disabled={
                      (currentPeriod == period && order.auto_renewal) || loading || order?.order_status=="Paused"
                    }
                  >
                    {currentPeriod == period ? "Renew" : "Update"}
                    {loading && (
                      <div className="ml-8 mt-2">
                        <CircularProgress size={16} color="inherit" />
                      </div>
                    )}
                  </Button>
                </>
              )}

              <ConfirmationDialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                onConfirm={handleConfirmDialog}
                title="Confirmation"
                content="Are you sure you want to perform this action?"
              />

              {order && <div className="h-0.5 w-full bg-grey-500 my-40" />}
              <div className=" flex flex-col gap-20">
                {order?.auto_renewal && order?.order_status != "Paused" && (
                  <>
                    <Typography className="text-xl text-black font-600">
                      Cancel Subscription
                    </Typography>
                    <Typography className="text-lg text-black font-400">
                      You are currently on{" "}
                      <span className="font-600">
                        {plan?.title} - {plan?.bill_mode}
                      </span>{" "}
                      plan
                    </Typography>
                  </>
                )}
                {order?.order_status == "Paused" && (
                  <>
                    <Typography className="text-xl text-black font-600">
                      Subscription Paused
                    </Typography>
                    <Typography className="text-lg text-black font-400">
                      You are currently on{" "}
                      <span className="font-600">
                        {plan?.title} - {plan?.bill_mode}
                      </span>{" "}
                      plan which is paused until{" "}
                      {format(order?.paused_until*1000, "MMMMMMMM dd, y")}
                    </Typography>
                  </>
                )}
                <div className=" flex justify-between items-center px-10 ">
                  {order?.auto_renewal && order?.order_status != "Paused" && (
                    <Button
                      onClick={() => setCancelDialogOpen(true)}
                      className="my-12 px-16 py-6 -mx-10"
                      variant="contained"
                      color={"secondary"}
                      disabled={cancelLoading}
                    >
                      Cancel plan
                      {cancelLoading && (
                        <div className="ml-8 mt-2">
                          <CircularProgress size={16} color="inherit" />
                        </div>
                      )}
                    </Button>
                  )}

                  <CancelSubscription
                    open={cancelDialogOpen}
                    onClose={handleCancelCloseDialog}
                    onConfirm={handleCancelConfirmDialog}
                    order={order?.order_id}
                    nextBillDate={nextBillDate}
                    title="Cancel Subscription"
                    content={
                      <>
                        <div className="current-plan">
                          <p>
                            <strong>Amazon Seller Essentials</strong>
                          </p>
                          <p>
                            <span style={{ fontWeight: "bold" }}>
                              Your Plan:{" "}
                            </span>
                            $
                            {order?.bill_mode === "Monthly" &&
                              `${plan?.monthly_price?.toFixed(2)} per month`}
                            {order?.bill_mode === "Annually" &&
                              (plan?.total_yearly_price).toFixed(2)}{" "}
                            <span className="text-sm text-[#525252]">
                              {order?.bill_mode === "Annually" &&
                                `($${plan?.total_yearly_price / 12} per month)`}
                            </span>{" "}
                            {/* <span className="details">(See details)</span> */}
                          </p>
                        </div>
                        <p>
                          Before you go, please note that if you cancel your
                          subscription and let it expire after{" "}
                          {format(nextBillDate, "MMMMMMMM dd, y")}, you'll lose
                          access to any promotional pricing you once had access
                          to. If you change your mind, you can renew your
                          subscription.
                          <br />
                          <br />
                          Alternatively, you can pause your subscription and
                          easily pick up right where you left off again
                          once you're ready!
                        </p>
                        {/* <p>
                          Your plan will be canceled, but is still available
                          until the end of your billing period on .
                        </p>
                        <p>
                          If you change your mind, you can renew your
                          subscription.
                        </p> */}
                      </>
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {dialogBoxOpen && (
        <Dialog open={dialogBoxOpen} onClose={handleClose}>
          <Subscription onClose={handleClose} />
        </Dialog>
      )}
    </>
  );
	return (
		<FusePageSimple
	
			content={content}
		/>
	);
}

export default TablePricingPage;
