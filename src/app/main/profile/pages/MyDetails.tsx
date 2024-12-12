import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import * as yup from 'yup';
import Avatar from '@mui/material/Avatar';
import PhoneInput from 'react-phone-input-2'
import { yupResolver } from '@hookform/resolvers/yup';
import _ from '@lodash';
import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { DateTimePicker } from '@mui/x-date-pickers';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import InputLabel from '@mui/material/InputLabel';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
// import { addRole } from '../store/dataSlice';
// import { PermissionData } from '../Permissions'
// import { useAuth } from '../../../auth/AuthContext';
import axios from 'axios'
import FusePageSimple from '@fuse/core/FusePageSimple';
import { useAppDispatch, useAppSelector } from 'app/store';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import CircularProgress from '@mui/material/CircularProgress';
import { selectUser, setUser } from 'app/store/user/userSlice';
import { UserType } from 'app/store/user/UserType';
import { showMessage } from 'app/store/fuse/messageSlice';
import { getInvoicesRecords, selectInvoices } from '../../subscription/store/InvoiceSlice';
import { getRecords } from '../../subscription/store/paymentsSlice';
import { InvoicesDataType } from '../../subscription/types/InvoicesType';
import { getActiveOrder, renewSubscription, updateAutoRenewal } from '../../subscription/store/orderSlice';
import { OrderType } from '../../subscription/types/OrderType';
import Dialog from '@mui/material/Dialog';
import Subscription from '../../subscription/Subscription';
import { getSingle } from "../../general-management/store/customerDataSlice";
import { format } from 'date-fns';


/**
 * ProfileFormPage
 */
function ProfilePage({userId, userRole}) {

    /**
     * Form Validation Schema
     */
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [user, setUser] = useState(useAppSelector(selectUser))

	const dispatch = useDispatch<any>()
    // const admin = useAppSelector(selectUser)
    // const data = useAppSelector(selectInvoices) as InvoicesDataType;
    // const paymentData = useAppSelector(selectPayments);

    const [order, setOrder] = useState<OrderType>()
	const [paymentMethod, setPaymentMethod] = useState<any>()
	const [nextBillDate, setNextBillDate] = useState(new Date())

    const [refresh, setRefresh] = useState<boolean>()
    const [changeLoading, setChangeLoading] = useState<boolean>(false)
    const [renewLoading, setRenewLoading] = useState<boolean>()

    const navigate = useNavigate();
    const handleCancel = () => {
        navigate(-1);
    };

    const handleOpen = () => {
        setDialogOpen(true);
    };
    
    const handleClose = () => {
        setDialogOpen(false);

        // reload info
        setRefresh(!refresh);
    };

    useEffect(() => {
		dispatch(getActiveOrder(userId ? userId : undefined)).then((resp) => {
            setLoading(false);
            console.log(resp.payload);
			setOrder(resp.payload.order);
			if (resp.payload.order) {
				setNextBillDate(new Date(resp.payload.order?.next_check_time * 1000));
				// setPlan(resp.payload.order);
				// setPeriod(resp.payload.order?.bill_mode == 'Monthly' ? 'month' : 'year');
				// setCurrentPeriod(resp.payload.order?.bill_mode == 'Monthly' ? 'month' : 'year')
			}
		});

		dispatch(getRecords(userId ? userId : undefined)).then((resp) => {
			setPaymentMethod(resp.payload.records?.length > 0 ? resp.payload?.records[0]: null);
		});

            // let user=null;
            if(userId != null ){
                dispatch(getSingle(userId)).then((resp) => {
                    resp.payload.data = resp.payload;
                    resp.payload.data['displayName'] = resp.payload.name;
                    setUser(resp.payload);
                })
            }
        

        dispatch(getInvoicesRecords({id:null, userId}));

	}, [dispatch, refresh]);

    const updateRenewalStatus = () => {

        setChangeLoading(true);

        dispatch(updateAutoRenewal({payload: {order_id: order.order_id}})).then((resp) => {

            setChangeLoading(false);
            setRefresh(!refresh);

            console.log('done');
		});
    }
    const resumeSubscription = async() => {
      setChangeLoading(true);
      try {
        await axios.post("/api/orders/resume_subscription", { order_id: order.order_id },)
        setRefresh(!refresh);
        dispatch(showMessage({message:'Subscription Resumed', variant:'success'}));
        
      } catch (error) {
        console.log(error);
        
      }
      
        setChangeLoading(false);
    };
    const renewSubscripiton = () => {

        setRenewLoading(true);

        dispatch(renewSubscription({payload: {order_id: order.order_id}})).then((resp) => {

            setRenewLoading(false);
            setRefresh(!refresh);

            if (resp.error) {
                dispatch(showMessage({ message: 'Unabel to process, Please check you payment method', variant: 'error' }));
            }

            console.log('done', resp);
		});
    }
    console.log(order);

    return (
        <div className="w-full px-24 md:px-32 pb-24">
            {useMemo(() => {
                const container = {
                    show: {
                        transition: {
                            staggerChildren: 0.06
                        }
                    }
                };

                const item = {
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                };

                return !loading ? (
                  <motion.div
                    className="w-full"
                    variants={container}
                    initial="hidden"
                    animate="show"
                  >
                    <div className="grid grid-cols-1 gap-32 w-full mt-24">
                      <motion.div
                        variants={item}
                        className="xl:col-span-2 flex flex-col flex-auto"
                      >
                        <div className="flex flex-col gap-20 ">
                          <Typography className="font-semibold tracking-tight leading-8">
                            {" "}
                            Personal Info{" "}
                          </Typography>

                          <div className="grid grid-cols-3 gap-20 md:w-1/2">
                            <Typography>Name</Typography>
                            <Typography className="px-16 py-6 border border-gray-300 rounded-12 col-span-2 min-h-32">
                              {user.data.displayName}
                            </Typography>

                            <Typography>Email</Typography>
                            <Typography className="px-16 py-6 border border-gray-300 rounded-12 col-span-2 min-h-32">
                              {user.data.email}
                            </Typography>

                            <Typography>Phone</Typography>
                            <Typography className="px-16 py-6 border border-gray-300 rounded-12 col-span-2 min-h-32">
                              {user.data.phone}
                            </Typography>
                          </div>
                        </div>
                        {order && (
                          <div className="flex flex-col gap-20 my-6 ">
                            <Typography className="font-semibold tracking-tight leading-8">
                              {" "}
                              Current Subscription{" "}
                            </Typography>
                            <div className="grid grid-cols-3 gap-20 md:w-1/2">
                              <Typography>Subscription</Typography>
                              <Typography className="px-16 py-6 border border-gray-300 rounded-12 col-span-2 min-h-32">
                                {order
                                  ? order?.title + " " + order?.bill_mode
                                  : "You haven't subscribed to a plan"}
                              </Typography>

                              {/* <Typography>Price</Typography>
                                                <Typography className="px-16 py-6 border border-gray-300 rounded-12 col-span-2 min-h-32">{data && data.count > 0 ? "$ "+data.records[0].total_amount : "You havent subscribed to a plan"}</Typography> */}
                              {order?.on_trial && (
                                <>
                                  <Typography>On Trial</Typography>
                                  <Typography className="px-16 py-6 border border-gray-300 rounded-12 col-span-2 min-h-32 text-green-300">
                                    {"Yes"}
                                  </Typography>
                                </>
                              )}

                              {order?.auto_renewal && (
                                <Typography className="flex items-center">
                                  Status
                                </Typography>
                              )}
                              {order?.auto_renewal && (
                                <div className="px-16 py-6 border border-gray-300 rounded-12 col-span-2 min-h-32 grid grid-cols-2 gap-10 ">
                                  <div className="flex items-center">
                                    {order?.order_status}
                                  </div>
                                  {order?.order_status === "Paused" && (
                                    <Button
                                      variant="contained"
                                      color="secondary"
                                      type="submit"
                                      onClick={() => {
                                        resumeSubscription();
                                      }}
                                      // disabled={userId !== null}
                                    >
                                      <div className="flex items-center">
                                        Unpause
                                        {changeLoading && (
                                          <div className="ml-8 mt-2">
                                            <CircularProgress
                                              size={16}
                                              color="inherit"
                                            />
                                          </div>
                                        )}
                                      </div>
                                    </Button>
                                  )}
                                  {order?.order_status == "Waiting Renewal" && (
                                    <Button
                                      variant="contained"
                                      color="secondary"
                                      type="submit"
                                      onClick={() => {
                                        renewSubscripiton();
                                      }}
                                    >
                                      <div className="flex items-center">
                                        Renew
                                        {renewLoading && (
                                          <div className="ml-8 mt-2">
                                            <CircularProgress
                                              size={16}
                                              color="inherit"
                                            />
                                          </div>
                                        )}
                                      </div>
                                    </Button>
                                  )}
                                </div>
                              )}
                              {order?.order_status === "Paused" && (
                                <>
                                  <Typography className='content-center'>Available Until</Typography>
                                  <Typography className="px-16 py-6 border border-gray-300 rounded-12 col-span-2 min-h-32">
                                   { format( order?.next_check_time * 1000,
                                    "MMMMMMMM dd, y" )}
                                  </Typography>
                                </>
                              )}
                              <Typography className=" content-center">
                                {order?.auto_renewal
                                  ? "Renewal Date"
                                  : "Valid Up To"}
                              </Typography>
                              <Typography className="px-16 py-6 border border-gray-300 rounded-12 flex justify-between items-center  col-span-2 min-h-32">
                                {
                                order?.order_status == "Paused"
                                  ? format(
                                      order?.paused_until * 1000,
                                      "MMMMMMMM dd, y"
                                    )
                                  : 
                                  format(nextBillDate, "MMMMMMMM dd, y")}
                                {order?.order_status == "Paused" ? (
                                  // <Button
                                  //   variant="contained"
                                  //   color="secondary"
                                  //   type="submit"
                                  //   onClick={() => {
                                  //     // updateRenewalStatus();
                                  //   }}
                                  //   // disabled={userId !== null}
                                  // >
                                  //   <div className="flex items-center">
                                  //     Resume
                                  //     {changeLoading && (
                                  //       <div className="ml-8 mt-2">
                                  //         <CircularProgress
                                  //           size={16}
                                  //           color="inherit"
                                  //         />
                                  //       </div>
                                  //     )}
                                  //   </div>
                                  // </Button>
                                  <></>
                                ) : !order.auto_renewal ? (
                                  <Button
                                    variant="contained"
                                    color="secondary"
                                    type="submit"
                                    onClick={() => {
                                      updateRenewalStatus();
                                    }}
                                    // disabled={userId !== null}
                                  >
                                    <div className="flex items-center">
                                      Renew
                                      {changeLoading && (
                                        <div className="ml-8 mt-2">
                                          <CircularProgress
                                            size={16}
                                            color="inherit"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </Button>
                                ) : (
                                  <></>
                                )}
                              </Typography>

                              {/* <Typography className='flex items-center'>Auto Renewal</Typography> */}
                              {/* <div className="px-16 py-6 border border-gray-300 rounded-12 col-span-2 min-h-32 grid grid-cols-2 gap-10 "> */}
                              {/* <div className='flex items-center'>
                                                        {order?.auto_renewal ? 'Yes' : 'No'}
                                                    </div> */}
                              {/* {!userId && 
                                                     <Button
                                                     variant="contained"
                                                     color="secondary"
                                                     type="submit"
                                                     onClick={()=>{
                                                         updateRenewalStatus();
                                                     }}
                                                     // disabled={userId !== null}
                                                 >
                                                     <div className="flex items-center">
                                                         Change
                                                         {changeLoading && (
                                                             <div className="ml-8 mt-2">
                                                                 <CircularProgress size={16} color="inherit" />
                                                             </div>
                                                         )}
                                                     </div>
                                                 
                                                 </Button>
                                                    } */}

                              {/* </div> */}

                              <Typography>Payment Method</Typography>
                              <Typography className="px-16 py-6 border border-gray-300 rounded-12 col-span-2 min-h-32">
                                {paymentMethod?.name}
                              </Typography>
                              {order?.discount_code && (
                                <>
                                  <Typography>Discount Code</Typography>
                                  <Typography className="px-16 py-6 border border-gray-300 rounded-12 col-span-2 min-h-32">
                                    {order?.discount_code?.discount_code}
                                  </Typography>
                                  <Typography>Amount Charged</Typography>
                                  <Typography className="px-16 py-6 border border-gray-300 rounded-12 col-span-2 min-h-32">
                                    $ {order?.order_price}
                                  </Typography>
                                </>
                              )}

                              {/* <Typography>Max Extension Installs</Typography>
                                                <Typography className="px-16 py-6 border border-gray-300 rounded-12 col-span-2 min-h-32">-</Typography>

                                                <Typography>Max Mobile Installs</Typography>
                                                <Typography className="px-16 py-6 border border-gray-300 rounded-12 col-span-2 min-h-32">-</Typography>

                                                <Typography>Max Product Searches</Typography>
                                                <Typography className="px-16 py-6 border border-gray-300 rounded-12 col-span-2 min-h-32">-</Typography> */}
                            </div>
                          </div>
                        )}

                        {(userRole != "Prep Center Admin" ||
                          userRole != "Prep Center Admin") &&
                          !paymentMethod && (
                            <div>
                              <Typography className=" mt-28 text-md font-600 text-deep-orange-900">
                                {userId
                                  ? "User hasn't configured their payment method yet"
                                  : "You haven't configured your payment method yet"}
                                !
                              </Typography>
                            </div>
                          )}
                        {!userId && (
                          <>
                            {(userRole != "Prep Center Admin" ||
                              userRole != "Prep Center Admin") && (
                              <div className="my-20 flex gap-20">
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  type="submit"
                                  // onClick={()=>navigate('/paymentMethod')}
                                  onClick={handleOpen}
                                  disabled={userId !== null}
                                >
                                  <div className="flex items-center">
                                    <span>
                                      {paymentMethod
                                        ? "Update Payment Method"
                                        : "Configure Payment Method"}
                                    </span>
                                  </div>
                                </Button>
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  type="submit"
                                  onClick={() => navigate("/subscription")}
                                  // onClick={handleOpen}
                                  disabled={userId !== null}
                                >
                                  <div className="flex items-center">
                                    <span>Manage Subscriptions</span>
                                  </div>
                                </Button>
                              </div>
                            )}
                          </>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="ml-8 mt-10">
                    <CircularProgress size={16} color="inherit" />
                  </div>
                );
            }, [order, paymentMethod, changeLoading])}
            {dialogOpen && 
                <Dialog  open={dialogOpen} onClose={handleClose}>
                    <Subscription onClose={handleClose}/>
                </Dialog>}
        </div>
        
    );

}

export default ProfilePage;


