import { useEffect, useMemo, useState } from "react";
import _ from "@lodash";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "app/store";
import { useForm, Controller } from 'react-hook-form';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import axios from "axios";
import { addRecord } from "../subscription/store/paymentsSlice";
import { addRecord as addSubscription} from '../subscription/store/orderSlice'
import { dataSlice } from "../setting/store/settingSlice";
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress, InputLabel, Typography } from "@mui/material";
import history from "@history";
import { Link, useSearchParams } from "react-router-dom";
import { cleanDigitSectionValue } from "@mui/x-date-pickers/internals/hooks/useField/useField.utils";
import { selectUser } from "app/store/user/userSlice";
import { SubscriptionType } from "../subscription/types/SubscriptionType";
/*
 * The finance dashboard app.
 */
const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
      border: "1px solid #ced4da", // Add border style here
      borderRadius: "4px",
    },
    invalid: {
      color: "#9e2146",
    },
  },
};
function PaymentForm({subscription, user}: {subscription: SubscriptionType, user: any}) {

  const [searchParams, setSearchParams] = useSearchParams()
	// console.log("serachParams",searchParams)

  const period = searchParams.get("period")
	const subscriptionId = searchParams.get("subscription")

  const dispatch = useDispatch<any>()
  const [loading,setLoading] = useState(false)
  const stripe = useStripe();
  const elements = useElements();
  const { handleSubmit, control, setValue, watch } = useForm();

  const onSubmit = async (data) => {
    // Handle your form submission here, including Stripe logic
    setLoading(true)
    try {
      // Check if stripe and elements are available
      if (!stripe || !elements) {
        console.error('Stripe.js has not loaded yet.');
        setLoading(false)
        return;
      }

      // Create a PaymentMethod using the card element
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          name: data.full_name,
        },
      });

      if (error) {
        console.error('Error creating PaymentMethod:', error);
        dispatch(showMessage({ message: 'Error registring payment method!', variant: 'error' }));
        return;
      }

      const formData = { 
        payment_method_id: paymentMethod.id,
        full_name: data.full_name
      }
      const resp = await dispatch(addRecord({ payload: formData }))
      if (resp.error) {
        dispatch(showMessage({ message: resp.error.message, variant: 'error' }));
        return;
      }


    const formData2 = {subscription_id: subscriptionId, yearly: period=="month" ? false: true, payment_method_id: resp.payload.method_id}
		const resp2 =  await dispatch(addSubscription({ payload: formData2 }))
    if (resp2.error) {
      dispatch(showMessage({ message: resp.error.message, variant: 'error' }));
      return
    }
    dispatch(showMessage({ message: 'Success', variant: 'success' }));
    window.location.reload();
    // history.push('/dashboard')
        
    } catch (error) {
      console.error('Error submitting form:', error);

      // Handle other form submission errors
    }
    finally {
      setLoading(false)
    }

  };


  return (
    <div className="mx-auto w-full max-w-sm sm:mx-0 sm:w-sm">
        <Typography className="mt-32 text-4xl font-extrabold leading-tight tracking-tight">
						Welcome {user && user.displayName},
        </Typography>
        <div className="mt-2 flex flex-col items-baseline font-medium">

        <Typography className="mt-32 text-3xl font-extrabold leading-tight tracking-tight">
          <span className="text-gray-700">Current Plan: </span>{subscription.title} 
        </Typography>
          <div className="text-2xl font-extrabold leading-tight tracking-tight">
							
          </div>

						<div className="mt-32 flex items-baseline justify-center whitespace-nowrap">
							<Typography className="text-6xl font-semibold leading-tight tracking-tight">
								$ {period === 'month' && subscription.monthly_price}
								{period === 'year' && subscription.yearly_price} 
							</Typography>
							<Typography
								className="ml-8 text-2xl"
								color="text.secondary"
							>
								/ {period}
							</Typography>
						</div>

						
        </div>
        <div className="">
          <img className="w-2/3 my-10" src="/assets/images/card.svg"></img>
        </div>
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-20 justify-around w-full">
              <div className="flex flex-col gap-8">
                <InputLabel htmlFor="card_number">Card Number</InputLabel>
                <FormControl fullWidth >
                      <div className="p-16 rounded-6 border">
                        <CardElement options={{
                    hidePostalCode: true,
                  }}/></div>
                </FormControl>
              </div>
              <Controller
                name="full_name"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-8">
                  <InputLabel htmlFor="full_name">Name on Card</InputLabel>
                        <TextField
                          {...field}
                          className="focus:outline-none !outline-none"
                          fullWidth
                          required
                        />
                  </div>
                )}
              />
            

            <Button
              variant="contained"
              color="secondary"
              type="submit"
              disabled={!stripe || loading}
            >
              Proceed
                  {loading && (
                    <div className="ml-8 mt-2">
                        <CircularProgress size={16} color="inherit" />
                      </div>
              )}
            </Button>
            </div>
		    </form>

    </div>
  );
}

export default PaymentForm;
